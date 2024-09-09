// imports/ui/pages/deleteGame.js
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Games } from '../../../collections/games.js'; // Games koleksiyonunu import edin
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.editGames.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
  this.selectedGame = new ReactiveVar(null);
  this.autorun(() => {
    this.subscribe('games'); // Oyun verilerini abone edin
  });
});

Template.editGames.helpers({
  games() {
    return Games.find().fetch(); // Tüm oyunları döndür
  },
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
  successMessage() {
    return Template.instance().successMessage.get();
  }
});

Template.editGames.events({
  'click .update-game'(event) {
    const gameId = event.currentTarget.getAttribute('data-id');
    FlowRouter.go(`/admin/games/edit-games/update-game/${gameId}`);
  },

  'click .delete-game'(event) {
    const gameId = event.currentTarget.getAttribute('data-id');

    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Template.instance().errorMessage.set(error.reason);
      } else {
        Template.instance().successMessage.set('Game deleted successfully');
      }
    });
  }
});
