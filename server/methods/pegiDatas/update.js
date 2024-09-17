import { Meteor } from 'meteor/meteor';
import { PegiDatas } from '../../../imports/collections/pegiDatas.js';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Şema doğrulaması
new ValidatedMethod({
  name: 'pegiDatas.update',
  validate: new SimpleSchema({
    pegiId: {
      type: String,
    },
    name: {
      type: String,
      min: 1,
    },
    imageUrl: {
        type: String,
        min: 1,
      },
      description: {
        type: String,
        min: 1,
      },
  }).validator(),
  
  run({ pegiId, name, imageUrl, description }) {
    PegiDatas.update(pegiId, {
      $set: {
        name: name,
        imageUrl: imageUrl,
        description: description
      },
    });
  },
});

