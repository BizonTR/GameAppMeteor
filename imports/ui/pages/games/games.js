import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { getPaginationButtons } from '../../../api/utils/paging';
import '../../components/pagination/pagination.js'

Template.games.onCreated(function () {
  this.subscribe('currentUserRoles');

  // Oyunları ve genre'leri saklamak için reaktif değişkenler
  this.games = new ReactiveVar([]);
  this.genres = new ReactiveVar([]);
  this.dataInfo = new ReactiveVar({});
  this.noResults = new ReactiveVar(false);
  this.loading = new ReactiveVar(true);

  // Authentication paneli kontrol değişkenleri
  this.showAuthPanel = new ReactiveVar(false);
  this.showLogin = new ReactiveVar(true);
  this.searchTerm = new ReactiveVar('');
  this.page = new ReactiveVar(1);
  this.selectedGenres = new ReactiveVar([]);

  const instance = this;

  // Genre'leri al
  Meteor.call('genres.getAll', (error, result) => {
    if (error) {
      console.error('Genre\'leri getirirken hata oluştu:', error);
    } else {
      instance.genres.set(result);
    }
  });

  const fetchGames = () => {
    console.log("fetchgames")
    // URL'deki arama terimini, sayfa numarasını ve seçilen genre'leri kontrol et
    const term = FlowRouter.getQueryParam('term');
    const selectedGenres = FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : [];
    let page = parseInt(FlowRouter.getQueryParam('page'), 10) || 1;

    // FlowRouter'daki sayfa numarası zaten doğru ise güncelleme yapma
    //FlowRouter.setQueryParams({ page: page });

    console.log(page)
    if (page <= 0) {
      console.log("1e ayarlandı")
      page = 1;
    }



    instance.searchTerm.set(term || '');
    instance.page.set(page);
    instance.selectedGenres.set(selectedGenres);

    const obj = {
      page,
      limit: 10,
      term,
      selectedGenres,
    }

    instance.loading.set(true);
    Meteor.call("games.getGames", obj, (error, result) => {
      if (error) {
        console.error('Oyunları getirirken hata oluştu:', error);
        instance.noResults.set(true);
      } else {
        if (result.length === 0) {
          instance.noResults.set(true);
          instance.games.set([]);
        } else {
          instance.games.set(result);
          console.log(result)
          instance.dataInfo.set(result);

          // Eğer sayfa numarası geçerli değilse, mevcut sayfayı güncelle
          if (page > result.totalPages) {
            page = result.totalPages; // Sayfa numarası totalPages'i geçerse son sayfaya ayarla
            FlowRouter.setQueryParams({ page: page });
            //instance.page.set(page);
          } else {
            //FlowRouter.setQueryParams({ page: result.currentPage });
            //instance.page.set(result.currentPage);
          }

          instance.noResults.set(false);
        }
      }
      instance.loading.set(false);
    });
  };

  fetchGames();
});

Template.games.helpers({
  gamesCount() {
    const dataInfo = Template.instance().dataInfo.get();
    return dataInfo.totalGames || 0; // Eğer totalGames yoksa 0 döndür
  },

  games() {
    const data = Template.instance().games.get();
    // Eğer data bir nesne ise, diziye dönüştürün
    return Array.isArray(data) ? data : data.games || [];
  },

  noResults() {
    return Template.instance().noResults.get();
  },

  formattedCreatedAt() {
    return this.createdAt.toLocaleString();
  },

  formattedGenres() {
    const genreDetails = this.genreDetails || [];
    return genreDetails.map(genre => genre.name).join(', ');
  },

  loading() {
    return Template.instance().loading.get();
  },

  genres() {
    return Template.instance().genres.get();
  },

  isSelected(genreId) {
    return Template.instance().selectedGenres.get().includes(genreId);
  },

  currentPage() {
    const dataInfo = Template.instance().dataInfo.get(); // dataInfo'yu al
    return dataInfo.currentPage || 1; // Eğer currentPage yoksa varsayılan 1 olarak ayarla
  },

  totalPages() {
    const dataInfo = Template.instance().dataInfo.get(); // dataInfo'yu al
    return dataInfo.totalPages || 1; // Eğer currentPage yoksa varsayılan 1 olarak ayarla
  }
});

Template.games.events({
  'click #search-button'(event, templateInstance) {
    event.preventDefault();

    const searchTerm = templateInstance.find("#search-input").value.trim();
    templateInstance.searchTerm.set(searchTerm);
    templateInstance.page.set(1);

    FlowRouter.setQueryParams({ term: searchTerm, page: templateInstance.page.get()});
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

    instance.selectedGenres.set(selectedGenres);

    instance.page.set(1);
    FlowRouter.setQueryParams({ genres: selectedGenres.join(','), page: instance.page.get() });
  }
});