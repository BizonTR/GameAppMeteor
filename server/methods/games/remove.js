import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

Meteor.methods({
    'games.remove'(gameId) {
        check(gameId, String);

        Games.remove(gameId);
    }
});