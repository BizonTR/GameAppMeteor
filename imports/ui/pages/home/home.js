import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Games } from '../../../collections/games.js';
import { Roles } from 'meteor/alanning:roles';

Template.home.onCreated(function () {
  this.subscribe('currentUserRoles');

  // Oyunları saklamak için reaktif değişkenler
  this.games = new ReactiveVar([]);
  this.gamesCount = new ReactiveVar(0);
  this.noResults = new ReactiveVar(false); // Oyun bulunamadı durumu
  this.loading = new ReactiveVar(true); // Yükleniyor durumu

  // Reactive variables to control the display of auth panel
  this.showAuthPanel = new ReactiveVar(false);
  this.showLogin = new ReactiveVar(true);
  this.searchTerm = new ReactiveVar('');

  const instance = this;

  const fetchGames = () => {
    const term = instance.searchTerm.get();
    if (term) {
      Meteor.call('games.getGames', 10, term, (error, result) => {
        if (error) {
          console.error('Oyunları getirirken hata oluştu:', error);
        } else {
          instance.games.set(result);
          instance.gamesCount.set(result.length);
          instance.noResults.set(result.length === 0); // Oyun bulunamadı durumunu güncelle
          instance.loading.set(false); // Veriler başarıyla yüklendi
        }
      });
    } else {
      Meteor.call('games.getGamesMainPage', 10, (error, result) => {
        if (error) {
          console.error('Oyunları getirirken hata oluştu:', error);
        } else {
          instance.games.set(result);
          instance.gamesCount.set(result.length);
          instance.noResults.set(result.length === 0); // Oyun bulunamadı durumunu güncelle
          instance.loading.set(false); // Veriler başarıyla yüklendi
        }
      });
    }
  };

  // URL'deki arama terimini kontrol et ve reaktif değişkeni güncelle
  const term = FlowRouter.getQueryParam('term');
  instance.searchTerm.set(term || '');

  // Oyunları yükle
  fetchGames();

  if (term) {
    instance.searchTerm.set(term);
    fetchGames(); // Arama terimi varsa, oyunları arama terimine göre getir
  } else {
    fetchGames(); // Arama terimi yoksa, ana sayfadaki oyunları getir
  }

  // Search term değiştiğinde oyunu yeniden yükle
  this.autorun(() => {
    const searchTerm = instance.searchTerm.get();
    fetchGames();
  });
});

Template.home.onRendered(function () {
  const instance = this;
  Tracker.autorun(() => {
    const currentPath = FlowRouter.getRouteName();
    if (currentPath === 'home') {
      instance.searchTerm.set(''); // Arama terimini temizle
      FlowRouter.setQueryParams({ term: '' }); // URL'den term parametresini kaldır
      // Ana sayfa yüklendiğinde oyunları tekrar getir
      Meteor.call('games.getGamesMainPage', 10, (error, result) => {
        if (error) {
          console.error('Oyunları getirirken hata oluştu:', error);
        } else {
          instance.games.set(result);
          instance.gamesCount.set(result.length);
          instance.noResults.set(result.length === 0); // Oyun bulunamadı durumunu güncelle
          instance.loading.set(false); // Veriler başarıyla yüklendi
        }
      });
    }
  });
});

Template.home.helpers({
  gamesCount() {
    return Template.instance().gamesCount.get();
  },

  games() {
    return Template.instance().games.get();
  },

  noResults() {
    return Template.instance().noResults.get(); // Oyun bulunamadı durumu
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
    return Template.instance().loading.get(); // Yükleniyor durumu
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
      // Toggle the auth panel
      Template.instance().showAuthPanel.set(!Template.instance().showAuthPanel.get());
    }
  },

  'click #close-auth-panel'(event) {
    event.preventDefault();
    Template.instance().showAuthPanel.set(false); // Hide the auth panel
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
    const searchTerm = document.getElementById('search-input').value;
    // URL'de arama terimini güncelle
    FlowRouter.go(`/search?term=${encodeURIComponent(searchTerm)}`);
    Template.instance().searchTerm.set(searchTerm); // searchTerm reaktif değişkenini güncelle
    Template.instance().loading.set(true); // Arama yaparken yükleniyor mesajı
  }
});
