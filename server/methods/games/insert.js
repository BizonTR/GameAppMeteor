import { Meteor } from 'meteor/meteor';
import { Games,gameSchema } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

  new ValidatedMethod({
    name: 'games.insert',
    validate: gameSchema.validator(),
    run(data) {
      Games.insert(data);
    }
  });