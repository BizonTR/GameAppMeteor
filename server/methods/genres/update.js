import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Genres } from '../../../imports/collections/genres.js';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Şema doğrulaması
new ValidatedMethod({
  name: 'genres.update',
  validate: new SimpleSchema({
    genreId: {
      type: String,
    },
    name: {
      type: String,
      min: 1, // Yeni isim boş olamaz
    },
  }).validator(),
  
  run({ genreId, name }) {
    Genres.update(genreId, {
      $set: {
        name: name,
      },
    });
  },
});

