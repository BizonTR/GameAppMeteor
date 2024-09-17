import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Koleksiyonu tanımlayın
export const Games = new Mongo.Collection('games');

//Koleksiyon şeması
export const gameSchema = new SimpleSchema({
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: {
    type: Date,
    optional: true
  },
  price: {
    type: Number,
    min: 0 // Price alanı negatif olamaz
  },
  genres: Array,
  "genres.$": String,
  coverImageUrl: String,
});

Games.attachSchema(gameSchema);