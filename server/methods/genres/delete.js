// imports/api/genres/methods/delete.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
  'genres.remove'(genreId) {
    check(genreId, String);
    
    Genres.remove(genreId);
  }
});
