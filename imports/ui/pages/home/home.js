// imports/ui/pages/home.js

import { Template } from 'meteor/templating';
import { Games } from '../../../collections/games.js';
import { subscribeToGames } from '/client/subscriptions/gamesSubscriptions.js';

Template.home.onCreated(function() {
  this.subscribeToGames = subscribeToGames(); // 'home' şablonu oluşturulduğunda games aboneliğini başlat
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
  }
});

Template.home.events({
  'click #go-to-add-game'(event) {
    FlowRouter.go('/add-game');
  }
});
