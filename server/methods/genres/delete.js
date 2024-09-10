// imports/api/genres/methods/delete.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres } from '../../../imports/collections/genres.js';
import SimpleSchema from 'meteor/aldeed:simple-schema'

const genreIdSchema = new SimpleSchema({
  genreId: {
    type: String,
  },
});

new ValidatedMethod({
  name: 'genres.remove',
  validate: genreIdSchema.validator(),
  run({ genreId }) {
    Genres.remove(genreId);
  },
});
