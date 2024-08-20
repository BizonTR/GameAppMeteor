// imports/ui/pages/home.js
import { Template } from 'meteor/templating';
import { Games } from '../../../collections/games.js'; // Koleksiyonun doğru yolu
import { subscribeToGames } from '../../../../client/subscriptions/gamesSubscriptions.js';

Template.home.onCreated(function() {
    this.subscribeToGames = subscribeToGames();
  });

Template.home.helpers({
  gamesCount() {
    return Games.find().count();
  }
});

Template.home.events({
  'click #go-to-add-game'(event) {
    FlowRouter.go('/add-game');
  }
});
