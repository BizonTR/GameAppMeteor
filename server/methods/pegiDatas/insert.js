import { Meteor } from 'meteor/meteor';
import { PegiDatas, pegiSchema } from '../../../imports/collections/pegiDatas.js';

  new ValidatedMethod({
    name: 'pegiDatas.insert',
    validate: pegiSchema.validator(),
    run(data) {
      PegiDatas.insert(data);
    }
  });