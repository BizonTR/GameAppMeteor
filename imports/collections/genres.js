import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Koleksiyonu tanımlayın
export const Genres = new Mongo.Collection('genres');

//Koleksiyon şeması
export const genreSchema = new SimpleSchema({
  name: String,
  createdAt: Date,
});

Genres.attachSchema(genreSchema);