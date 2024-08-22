import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
    'genres.update'(genreId, newName) {
        check(genreId, String);
        check(newName, String);

        Genres.update(genreId, {
            $set: {
                name: newName,
            },
        });
    }
});
