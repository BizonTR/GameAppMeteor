// imports/ui/pages/addGenre.js
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

Template.addGenre.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
});

Template.addGenre.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
  successMessage() {
    return Template.instance().successMessage.get();
  }
});

Template.addGenre.events({
  'submit #add-genre-form'(event, template) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value.trim();

    if (!name) {
      template.errorMessage.set('Genre name cannot be empty');
      return;
    }

    Meteor.call('genres.insert', {name, createdAt: new Date()}, (error) => {
      if (error) {
        template.errorMessage.set(error.reason);
      } else {
        template.successMessage.set('Genre added successfully');
        target.name.value = '';
      }
    });
  }
});
