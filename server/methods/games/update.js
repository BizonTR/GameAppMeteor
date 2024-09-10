import { Meteor } from 'meteor/meteor';
import { Games,gameSchema } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin
import SimpleSchema from 'meteor/aldeed:simple-schema'


new ValidatedMethod({
    name: 'games.update',
    validate: new SimpleSchema({
      gameId: { type: String }, // gameId'yi sadece burada tanımlıyoruz
      ...gameSchema.omit("createdAt")._schema // Diğer alanlar gameSchema'dan alınıyor
    }).validator(),
    run({ gameId, ...updates }) {
      Games.update(gameId, {
        $set: {
          ...updates,
          updatedAt: new Date(), // updatedAt'i güncelliyoruz
        },
      });
    },
  });
