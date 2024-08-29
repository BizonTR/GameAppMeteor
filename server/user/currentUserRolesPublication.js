import { Meteor } from 'meteor/meteor';

// Meteor.publish('currentUserRoles', function () {
//     return Meteor.roleAssignment.find({'user._id': this.userId});
// });

Meteor.publish(null, function () {
    if (!this.userId) {
      return this.ready()
    }
    return Meteor.roleAssignment.find({ 'user._id': this.userId, }, { readPreference: 'secondaryPreferred' })
  })