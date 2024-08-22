import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games,gameSchema } from '../../../imports/collections/games.js'; // Games koleksiyonunu import edin

// Meteor.methods({
//     'games.insert'(name, description, genres) {
//       console.log("insert method")
//       check(name, String);
//       check(description, String);
//       check(genres, [String]);
  
//       Games.insert({
//         name,
//         description,
//         genres, // genres dizisini ekleyin
//         createdAt: new Date(),
//       });
//     },
//   });


  //VALIDATE METHODS

  // new ValidatedMethod({
  //   name: 'business.references.timezones.list',
  //   mixins: [ActivityLogMixin],
  //   validate: function () {},
  //   run: async function () {
  //     return {
  //       timezones: await Timezones.find({}, { sort: { offset: 1, text: 1 } }).fetchAsync(),
  //     }
  //   },
  // })
  new ValidatedMethod({
    name: 'games.insert',
    validate: gameSchema.omit("createdAt").validator(),
    run(data) {
      Games.insert({...data,createdAt: new Date()});
    }
  });