// imports/api/genres/insert.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
  'genres.insert'(name) {
    check(name, String);

    console.log("genre insert")

    if (!name) {
      throw new Meteor.Error('Genre name is required');
    }

    // Insert the new genre
    Genres.insert({
      name,
      createdAt: new Date(),
    });
  }
});
