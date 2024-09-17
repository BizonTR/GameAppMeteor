import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Koleksiyonu tanımlayın
export const PegiDatas = new Mongo.Collection('pegiDatas');

//Koleksiyon şeması
export const pegiSchema = new SimpleSchema({
  name: String,
  imageUrl: String,
  description: String,
  createdAt: Date,
});

PegiDatas.attachSchema(pegiSchema);