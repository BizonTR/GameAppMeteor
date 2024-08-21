// client/subscriptions/gamesSubscriptions.js

import { Meteor } from 'meteor/meteor';

export const subscribeToGenres = () => {
    console.log("genresSubscriptions.js");
    return Meteor.subscribe('genres');
};
