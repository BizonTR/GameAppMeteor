import { Meteor } from 'meteor/meteor';

export const subscribeToPegiDatas = () => {
    return Meteor.subscribe('pegiDatas');
};
