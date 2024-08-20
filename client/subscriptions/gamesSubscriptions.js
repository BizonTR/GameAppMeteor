// client/subscriptions/gamesSubscriptions.js

import { Meteor } from 'meteor/meteor';

export const subscribeToGames = () => {
    console.log("gamesSubscriptions.js");
    return Meteor.subscribe('games');
};
