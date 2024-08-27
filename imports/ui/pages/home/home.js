import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Games } from '../../../collections/games.js';
import { Genres } from '../../../collections/genres.js';
import { subscribeToGames } from '/client/subscriptions/gamesSubscriptions.js';
import { subscribeToGenres } from '/client/subscriptions/genresSubscriptions.js';
import { Roles } from 'meteor/alanning:roles'; // Meteor Roles paketini dahil edin

Template.home.onCreated(function () {
  this.subscribe('currentUserRoles');
  this.subscribeToGames = subscribeToGames();
  this.subscribeToGenres = subscribeToGenres();

  // Reactive variables to control the display of auth panel
  this.showAuthPanel = new ReactiveVar(false);
  this.showLogin = new ReactiveVar(true);
});

Template.home.helpers({
  gamesCount() {
    return Games.find().count();
  },

  games() {
    return Games.find({}, { sort: { createdAt: -1 } });
  },

  formattedCreatedAt() {
    return this.createdAt.toLocaleString();
  },

  formattedGenres() {
    const genreIds = this.genres || [];
    const genres = Genres.find({ _id: { $in: genreIds } }).fetch();
    return genres.map(genre => genre.name).join(', ');
  },

  currentUser() {
    return Meteor.user();
  },

  currentUserRole() {
    const user = Meteor.user();
    if (user) {
      // Roller verilerini doğrudan 'user' nesnesinden alın
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
  }
});
