import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

Meteor.methods({
    //   'games.update'(gameId, newName, newDescription) {
    //     check(gameId, String);
    //     check(newName, String);
    //     check(newDescription, String);

    //     Games.update(gameId, {
    //       $set: {
    //         name: newName,
    //         description: newDescription,
    //         updatedAt: new Date(),
    //       },
    //     });
    //   },
    'games.update'(gameId, updates) {
        check(gameId, String);
        check(updates, {
            name: String,
            description: String
        });

        Games.update(gameId, { $set: updates });
    }
});
