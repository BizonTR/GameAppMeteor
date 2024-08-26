import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games,gameSchema } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

  new ValidatedMethod({
    name: 'games.insert',
    validate: gameSchema.omit("createdAt").validator(),
    run(data) {
      Games.insert({...data,createdAt: new Date()});
    }
  });