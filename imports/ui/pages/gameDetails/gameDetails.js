import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.gameDetails.onCreated(function () {
    this.game = new ReactiveVar(null);
    const gameId = FlowRouter.getParam('id');

    const instance = this;

    Meteor.call('games.getGameById', {gameId}, (error, result) => {
        if (error) {
            console.error('Oyun detayını getirirken hata oluştu:', error);
        } else {
            instance.game.set(result);
            console.log(instance.game)
        }
    });
});

Template.gameDetails.helpers({
    game() {
        return Template.instance().game.get();
    },

    formattedCreatedAt() {
        const game = Template.instance().game.get();
        return game ? game.createdAt.toLocaleString() : '';
    },

    formattedGenres() {
        const game = Template.instance().game.get();
        const genreDetails = game ? game.genreDetails : [];
        return genreDetails.map(genre => genre.name).join(', ');
    },
});
