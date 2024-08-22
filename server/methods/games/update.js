import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

Meteor.methods({
    'games.update'(gameId, updates) {
        check(gameId, String);
        check(updates, {
            name: String,
            description: String,
            genres: [String] // genres array of strings
        });

        Games.update(gameId, { $set: { ...updates, updatedAt: new Date() } });
    }
});
