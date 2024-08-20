import { Meteor } from 'meteor/meteor';
import { Games } from '/imports/collections/games';

Meteor.publish('games', () => {
    return Games.find();
  });
