import { Meteor } from 'meteor/meteor';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
    'genres.getAll'() {
        return Genres.find().fetch();
    }
});
