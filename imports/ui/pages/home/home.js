import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
  this.page = new ReactiveVar(1); // Initialize pagination

  const instance = this;

  const fetchGames = () => {
    const term = instance.searchTerm.get();
    const page = parseInt(instance.page.get(), 10);

    // Sayfa numarası geçerli değilse veya NaN ise
    if (page <= 0 || isNaN(page)) {
        instance.noResults.set(true);
        instance.games.set([]);
        instance.loading.set(false);
        return;
    }

    // Arama terimi geçerli değilse
    if (term && !/^[\w\s]*$/.test(term)) { // Sadece alfanümerik karakterler ve boşluk kabul edilir
        instance.noResults.set(true);
        instance.games.set([]);
        instance.loading.set(false);
        return;
    }

    const fetchMethod = term ? 'games.getGames' : 'games.getGamesMainPage';

    Meteor.call(fetchMethod, page, 10, term, (error, result) => {
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
                instance.noResults.set(false); // Oyun bulundu, noResults false
            }
        }
        instance.loading.set(false); // Veriler başarıyla yüklendi
    });
  };

  // URL'deki arama terimini ve sayfa numarasını kontrol et ve reaktif değişkenleri güncelle
  const term = FlowRouter.getQueryParam('term');
  const page = parseInt(FlowRouter.getQueryParam('page'), 10) || 1;
  instance.searchTerm.set(term || '');
  instance.page.set(page);

  // Oyunları yükle
  fetchGames();

  // Arama terimi veya sayfa numarası değiştiğinde oyunu yeniden yükle
  this.autorun(() => {
    const searchTerm = instance.searchTerm.get();
    const page = instance.page.get();
    if (searchTerm !== FlowRouter.getQueryParam('term') || page !== parseInt(FlowRouter.getQueryParam('page'), 10)) {
      FlowRouter.setQueryParams({ term: searchTerm, page: page });
      fetchGames();
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
    const searchTerm = document.getElementById('search-input').value.trim();
    Template.instance().searchTerm.set(searchTerm);
    Template.instance().page.set(1); // Reset to first page on new search
    Template.instance().loading.set(true);
    FlowRouter.setQueryParams({ term: searchTerm, page: 1 });
  },
});
