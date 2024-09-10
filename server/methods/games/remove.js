import { Meteor } from 'meteor/meteor';
import { Games } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin
import SimpleSchema from 'meteor/aldeed:simple-schema'

const gameIdSchema = new SimpleSchema({
    gameId: {
      type: String,
    },
  });

new ValidatedMethod({
    name: 'games.remove',
    validate: gameIdSchema.validator(),
    run({ gameId }) {
      Games.remove(gameId);
    },
  });