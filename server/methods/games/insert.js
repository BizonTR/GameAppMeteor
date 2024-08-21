import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

Meteor.methods({
    'games.insert'(name, description, genres) {
      console.log("insert method")
      check(name, String);
      check(description, String);
      check(genres, [String]);
  
      Games.insert({
        name,
        description,
        genres, // genres dizisini ekleyin
        createdAt: new Date(),
      });
    },
  });