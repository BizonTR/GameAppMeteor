// imports/ui/pages/deleteGame.js
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../../components/pagination/pagination.js'
import { showToast } from '../../components/toastMessages/errorToast.js';


Template.editGames.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
  this.dataInfo = new ReactiveVar({});
  this.loading = new ReactiveVar(true);
  this.noResults = new ReactiveVar(false);
  this.page = new ReactiveVar(1); // Varsayılan olarak 1
  this.games = new ReactiveVar([]);
  this.searchTerm = new ReactiveVar('');
  this.selectedGenres = new ReactiveVar([]);
  this.genres = new ReactiveVar([]);

  const instance = this;

  // fetchGames fonksiyonunu tanımla
  const fetchGames = () => {
    console.log("fetchGames");
    const page = instance.page.get();
    const term = instance.searchTerm.get();
    const selectedGenres = instance.selectedGenres.get();

    const obj = {
      limit: 10,
      term,
      selectedGenres,
    };

    if (page !== null) {
      obj.page = page;
    }

    console.log(obj)

    Meteor.call("games.getGames", obj, (error, result) => {
      if (error) {
        const errorMessage = error.reason || error.message || "Bilinmeyen bir hata oluştu.";

        // Hata mesajını göstermek için showToast fonksiyonunu çağırın
        showToast(instance,errorMessage);

        instance.noResults.set(true);

      } else {
        if (result.games.length === 0) {
          instance.noResults.set(true);
          instance.games.set([]);
        } else {
          instance.games.set(result.games);
          instance.noResults.set(false);
        }
        instance.dataInfo.set(result);
      }

      instance.loading.set(false);
    });
  };

  // Genres'i al
  Meteor.call('genres.getAll', (error, result) => {
    if (error) {
      console.error('Genre\'leri getirirken hata oluştu:', error);
    } else {
      instance.genres.set(result);
    }
  });

  // autorun içinde reaktif değişkenlere bağlı olarak fetchGames fonksiyonunu çağır
  this.autorun(() => {
    const term = FlowRouter.getQueryParam('term');
    const selectedGenres = FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : [];
    const pageParam = FlowRouter.getQueryParam('page')

    let page = pageParam ? parseInt(pageParam) : null

    //let page = parseInt(FlowRouter.getQueryParam('page'), 10) || 1;

    // page = (isNaN(page) || page < 1) ? 1 : page;
    // FlowRouter.setQueryParams({ page });

    // Reaktif değişkenleri güncelle
    instance.searchTerm.set(term || '');
    instance.page.set(page);
    instance.selectedGenres.set(selectedGenres);

    // Verileri getir
    fetchGames();
  });
});

Template.editGames.helpers({
  games() {
    const data = Template.instance().games.get();
    // Eğer data bir nesne ise, diziye dönüştürün
    return Array.isArray(data) ? data : data || [];
  },
  gamesCount() {
    const dataInfo = Template.instance().dataInfo.get();
    return dataInfo.totalGames || 0; // Eğer totalGames yoksa 0 döndür
  },
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
  successMessage() {
    return Template.instance().successMessage.get();
  },

  genres() {
    return Template.instance().genres.get();
  },

  isSelected(genreId) {
    return Template.instance().selectedGenres.get().includes(genreId);
  },

  formattedGenres() {
    const genreDetails = this.genreDetails || [];
    return genreDetails.map(genre => genre.name).join(', ');
  },

  formattedCreatedAt() {
    return this.createdAt.toLocaleString();
  },

  currentPage() {
    const dataInfo = Template.instance().dataInfo.get(); // dataInfo'yu al
    return dataInfo.currentPage || 1; // Eğer currentPage yoksa varsayılan 1 olarak ayarla
  },

  totalPages() {
    const dataInfo = Template.instance().dataInfo.get(); // dataInfo'yu al
    return dataInfo.totalPages || 1; // Eğer currentPage yoksa varsayılan 1 olarak ayarla
  },

  noResults() {
    return Template.instance().noResults.get();
  },
});

Template.editGames.events({
  'click .update-game'(event) {
    const gameId = event.currentTarget.getAttribute('data-id');
    FlowRouter.go(`/admin/games/edit-games/update-game/${gameId}`);
  },

  'click .delete-game'(event, instance) {
    const gameId = event.currentTarget.getAttribute('data-id');

    if (confirm('Are you sure you want to delete this game?')) {
      Meteor.call('games.remove', { gameId }, (error) => {
        if (error) {
          alert('An error occurred: ' + error.reason);
        } else {
          alert('Game deleted successfully');

          let currentGames = instance.games.get() || [];

          if (!Array.isArray(currentGames)) {
            currentGames = [];
          }

          const updatedGames = currentGames.filter(game => game._id !== gameId);

          instance.games.set(updatedGames);
        }
      });
    }
  },

  'click #search-button'(event, templateInstance) {
    event.preventDefault();

    const searchTerm = templateInstance.find("#search-input").value.trim();
    // templateInstance.searchTerm.set(searchTerm);
    // templateInstance.page.set(1);

    FlowRouter.setQueryParams({ term: searchTerm, page: 1 });
  },

  'click .dropdown-item'(event, instance) {
    event.preventDefault();
    const genreId = this._id;
    let selectedGenres = instance.selectedGenres.get();

    if (selectedGenres.includes(genreId)) {
      selectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      selectedGenres.push(genreId);
    }

    // instance.selectedGenres.set(selectedGenres);

    // instance.page.set(1);
    FlowRouter.setQueryParams({ genres: selectedGenres.join(','), page: 1 });
  }
});