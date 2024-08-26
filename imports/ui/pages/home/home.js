// imports/ui/pages/home.js

import { Template } from 'meteor/templating';
import { Games } from '../../../collections/games.js';
import { Genres } from '../../../collections/genres.js';
import { subscribeToGames } from '/client/subscriptions/gamesSubscriptions.js';
import { subscribeToGenres } from '/client/subscriptions/genresSubscriptions.js';

Template.home.onCreated(function () {
  this.subscribeToGames = subscribeToGames();
  this.subscribeToGenres = subscribeToGenres();
});

Template.home.helpers({
  gamesCount() {
    return Games.find().count(); // Koleksiyondaki toplam oyun sayısını döndür
  },

  games() {
    return Games.find({}, { sort: { createdAt: -1 } }); // Oyunları createdAt'e göre sıralayın
  },

  formattedCreatedAt() {
    return this.createdAt.toLocaleString(); // createdAt tarihini formatla
  },

  formattedGenres() {
    const genreIds = this.genres || [];
    const genres = Genres.find({ _id: { $in: genreIds } }).fetch();
    return genres.map(genre => genre.name).join(', '); // Genre isimlerini virgülle ayırarak döndür
  },

  currentUser() {
    return Meteor.user(); // Giriş yapmış kullanıcıyı döndür
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
      // Kullanıcı çıkış yapıyor
      Meteor.logout((error) => {
        if (error) {
          alert('Çıkış yapılamadı: ' + error.reason);
        } else {
          window.location.reload();
        }
      });
    } else {
      // Kullanıcı giriş/kayıt panelini açıyor
      document.getElementById('auth-panel').style.display = 'block';
    }
  },

  'submit #login-form'(event) {
    event.preventDefault();
    const target = event.target;
    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        alert('Giriş başarısız: ' + error.reason);
      } else {
        window.location.reload(); // Giriş başarılı, ana sayfayı yeniden yükleyin
      }
    });
  },

  'submit #register-form'(event) {
    event.preventDefault();
    const target = event.target;
    const username = target['username'].value;
    const email = target['email'].value;
    const password = target['password'].value;

    Accounts.createUser({ username, email, password }, (error) => {
      if (error) {
        alert('Kayıt başarısız: ' + error.reason);
      } else {
        window.location.reload(); // Kayıt başarılı, ana sayfayı yeniden yükleyin
      }
    });
  },

  'click #show-register'(event) {
    event.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
  },

  'click #show-login'(event) {
    event.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
  },

  'click #close-auth-panel'(event) {
    event.preventDefault();
    document.getElementById('auth-panel').style.display = 'none'; // Paneli gizler
  },
});