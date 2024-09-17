import { Meteor } from 'meteor/meteor';
import { PegiDatas } from '../../imports/collections/pegiDatas.js';

Meteor.publish('pegiDatas', () => {
    return PegiDatas.find();
  });
