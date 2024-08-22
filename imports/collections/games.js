import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Koleksiyonu tanımlayın
export const Games = new Mongo.Collection('games');

//Koleksiyon şeması
export const gameSchema = new SimpleSchema({
  name: String,
  description: String,
  createdAt: Date,
  genres: Array,
  "genres.$":String
});

Games.attachSchema(gameSchema);