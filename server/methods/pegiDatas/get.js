import { Meteor } from 'meteor/meteor';
import { PegiDatas } from '../../../imports/collections/pegiDatas.js';

Meteor.methods({
    'pegiDatas.getAll'() {
        return PegiDatas.find().fetch();
    }
});
