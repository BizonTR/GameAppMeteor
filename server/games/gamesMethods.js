// imports/api/games/methods.js

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../imports/collections/games.js'; // Games koleksiyonunu import edin

// Meteor.methods({
//   'games.insert'(name, description) {
//     console.log("insert method")
//     check(name, String);
//     check(description, String);

//     Games.insert({
//       name,
//       description,
//       createdAt: new Date(),
//     });
//   },
  
//   'games.update'(gameId, newName, newDescription) {
//     check(gameId, String);
//     check(newName, String);
//     check(newDescription, String);

//     Games.update(gameId, {
//       $set: {
//         name: newName,
//         description: newDescription,
//         updatedAt: new Date(),
//       },
//     });
//   },
  
//   'games.remove'(gameId) {
//     check(gameId, String);

//     Games.remove(gameId);
//   },
// });
