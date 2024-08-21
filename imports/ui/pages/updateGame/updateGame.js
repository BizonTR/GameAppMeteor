// imports/ui/pages/updateGame.js
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Games } from '../../..//collections/games.js'; // Koleksiyon importu

Template.updateGame.onCreated(function () {
    this.errorMessage = new ReactiveVar('');
    this.successMessage = new ReactiveVar('');
    const gameId = FlowRouter.getParam('gameId');
    this.selectedGame = new ReactiveVar(null);

    this.autorun(() => {
        this.subscribe('games'); // Oyun verilerini abone edin
        if (gameId) {
            this.selectedGame.set(Games.findOne(gameId));
        }
    });
});

Template.updateGame.helpers({
    selectedGame() {
        return Template.instance().selectedGame.get(); // Seçilen oyunun detayları
    },
    errorMessage() {
        return Template.instance().errorMessage.get();
    },
    successMessage() {
        return Template.instance().successMessage.get();
    },
    formatDate(date) {
        return date ? date.toISOString().split('T')[0] : '';
    }
});

Template.updateGame.events({
    'submit #update-game-form'(event) {
        event.preventDefault();

        const target = event.target;
        const gameId = FlowRouter.getParam('gameId');
        const name = target.name.value;
        const description = target.description.value;

        // Güncelleme işlemi
        Meteor.call('games.update', gameId, { name, description }, (error) => {
            if (error) {
                alert(error.error);
            } else {
                alert('Game updated successfully');
                FlowRouter.go('/games/edit-games'); // Güncelleme sonrası ana sayfaya yönlendir
            }
        });
    }
});
