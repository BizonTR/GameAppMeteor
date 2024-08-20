import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Koleksiyonu tanımlayın
export const Games = new Mongo.Collection('games');

// //Koleksiyon şeması
// Games.schema = new SimpleSchema({
//   name: String,
//   description: String,
//   createdAt: Date
// });

// Games.attachSchema(Games.schema);