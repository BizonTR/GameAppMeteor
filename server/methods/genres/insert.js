// imports/api/genres/insert.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres, genreSchema } from '../../../imports/collections/genres.js';

new ValidatedMethod({
  name: 'genres.insert',
  validate: genreSchema.omit("createdAt").validator(),
  run(data) {
    Genres.insert({...data,createdAt: new Date()});
  }
});
