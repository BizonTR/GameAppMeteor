import { Meteor } from 'meteor/meteor';
import { Genres } from '../../imports/collections/genres.js';

Meteor.publish('genres', () => {
    return Genres.find();
  });
