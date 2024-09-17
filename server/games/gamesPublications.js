import { Meteor } from 'meteor/meteor';
import { Games } from '../../imports/collections/games.js';

Meteor.publish('games', () => {
    return Games.find();
  });
