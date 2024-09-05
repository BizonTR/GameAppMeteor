import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.home.onCreated(function () {
  this.subscribe('currentUserRoles');

  // Oyunları ve genre'leri saklamak için reaktif değişkenler
  this.games = new ReactiveVar([]);
  this.genres = new ReactiveVar([]);
  this.gamesCount = new ReactiveVar(0);
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
    const term = instance.searchTerm.get();
    let page = parseInt(instance.page.get(), 10);
    const selectedGenres = instance.selectedGenres.get();

    if (page <= 0 || isNaN(page)) {
      page = 1;
      instance.page.set(page);
      FlowRouter.setQueryParams({ page: page });
    }

    if (term && !/^[\w\s]*$/.test(term)) {
      instance.noResults.set(true);
      instance.games.set([]);
      instance.loading.set(false);
      return;
    }

    const fetchMethod = term ? 'games.getGames' : 'games.getGamesMainPage';

    Meteor.call(fetchMethod, page, 10, term, selectedGenres, (error, result) => {
      if (error) {
        console.error('Oyunları getirirken hata oluştu:', error);
        instance.noResults.set(true);
      } else {
        if (result.length === 0) {
          instance.noResults.set(true);
          instance.games.set([]);
        } else {
          instance.games.set(result);
          instance.gamesCount.set(result.length);
          instance.noResults.set(false);
        }
      }
      instance.loading.set(false);
    });
  };

  // URL'deki arama terimini, sayfa numarasını ve seçilen genre'leri kontrol et
  const term = FlowRouter.getQueryParam('term');
  const selectedGenres = FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : [];
  let page = parseInt(FlowRouter.getQueryParam('page'), 10) || 1;

  if (page <= 0) {
    page = 1;
  }

  instance.searchTerm.set(term || '');
  instance.page.set(page);
  instance.selectedGenres.set(selectedGenres);

  fetchGames();

  this.autorun(() => {
    const searchTerm = instance.searchTerm.get();
    const page = instance.page.get();
    const selectedGenres = instance.selectedGenres.get();
    
    if (searchTerm !== FlowRouter.getQueryParam('term') || page !== parseInt(FlowRouter.getQueryParam('page'), 10) || !arraysEqual(selectedGenres, (FlowRouter.getQueryParam('genres') ? FlowRouter.getQueryParam('genres').split(',') : []))) {
      FlowRouter.setQueryParams({ term: searchTerm, page: page, genres: selectedGenres.join(',') });
      fetchGames();
    }
  });
});

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

Template.home.helpers({
  gamesCount() {
    return Template.instance().gamesCount.get();
  },

  games() {
    return Template.instance().games.get();
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

  currentUser() {
    return Meteor.user();
  },

  currentUserRole() {
    const user = Meteor.user();
    if (user) {
      const roles = Roles.getRolesForUser(user._id);
      return roles.length ? roles.join(', ') : 'No roles assigned';
    }
    return 'No user logged in';
  },

  showAuthPanel() {
    return Template.instance().showAuthPanel.get();
  },

  showLogin() {
    return Template.instance().showLogin.get();
  },

  loading() {
    return Template.instance().loading.get();
  },

  genres() {
    return Template.instance().genres.get();
  },

  isSelected(genreId) {
    return Template.instance().selectedGenres.get().includes(genreId);
  }
});

Template.home.events({
  'click #go-to-add-game'(event) {
    FlowRouter.go('/games/add-game');
  },

  'click #go-to-edit-games'(event) {
    FlowRouter.go('/games/edit-games');
  },

  'click #go-to-genres'(event) {
    FlowRouter.go('/genres');
  },

  'click #auth-button'(event) {
    event.preventDefault();
    if (Meteor.user()) {
      Meteor.logout((error) => {
        if (error) {
          alert('Çıkış yapılamadı: ' + error.reason);
        } else {
          window.location.reload();
        }
      });
    } else {
      Template.instance().showAuthPanel.set(!Template.instance().showAuthPanel.get());
    }
  },

  'click #close-auth-panel'(event) {
    event.preventDefault();
    Template.instance().showAuthPanel.set(false);
  },

  'click #show-register-form'(event) {
    event.preventDefault();
    Template.instance().showLogin.set(false);
  },

  'click #show-login-form'(event) {
    event.preventDefault();
    Template.instance().showLogin.set(true);
  },

  'click #search-button'(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value.trim();
    Template.instance().searchTerm.set(searchTerm);
    Template.instance().page.set(1);
    Template.instance().loading.set(true);
    FlowRouter.setQueryParams({ term: searchTerm, page: 1 });
  },

  'click .dropdown-item'(event, instance) {
    event.preventDefault();
    const genreId = $(event.currentTarget).data('id');
    let selectedGenres = instance.selectedGenres.get();

    if (selectedGenres.includes(genreId)) {
      // Genre zaten seçili, kaldır
      selectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      // Genre seçili değil, ekle
      selectedGenres.push(genreId);
    }

    instance.selectedGenres.set(selectedGenres);
    FlowRouter.setQueryParams({ genres: selectedGenres.join(',') }); // URL'yi güncelle

    // Oyunları yeniden yükle
    instance.page.set(1); // Sayfayı 1 olarak ayarla
    instance.searchTerm.set(FlowRouter.getQueryParam('term') || '');
    instance.autorun();
  }
});