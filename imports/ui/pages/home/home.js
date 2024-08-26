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

  'click #go-to-login'(event) {
    FlowRouter.go('/login');
  },

  'click #logout'(event) {
    event.preventDefault();
    Meteor.logout((error) => {
      if (error) {
        alert('Çıkış yapılamadı: ' + error.reason);
      } else {
        FlowRouter.go('/'); // Çıkış yapıldığında ana sayfaya yönlendirme
        // Sayfayı yeniden yüklemenin garantili yolu:
        window.location.reload();
      }
    });
  }
});
