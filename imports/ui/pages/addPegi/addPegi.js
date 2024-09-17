import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

Template.addPegi.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
});

Template.addPegi.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
  successMessage() {
    return Template.instance().successMessage.get();
  }
});

Template.addPegi.events({
  'submit #add-pegi-form'(event, template) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value.trim();
    const imageUrl = target.imageUrl.value;
    const description = target.description.value;

    if (!name) {
      template.errorMessage.set('PEGI name cannot be empty');
      return;
    }

    Meteor.call('pegiDatas.insert', {name, imageUrl, description, createdAt: new Date()}, (error) => {
      if (error) {
        template.errorMessage.set(error.reason);
      } else {
        template.successMessage.set('PEGI added successfully');
        target.name.value = '';
      }
    });
  }
});
