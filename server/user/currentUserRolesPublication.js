import { Meteor } from 'meteor/meteor';

Meteor.publish('currentUserRoles', function () {
    return Meteor.roleAssignment.find({'user._id': this.userId});
});

