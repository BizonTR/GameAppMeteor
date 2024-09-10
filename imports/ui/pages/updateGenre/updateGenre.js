// imports/ui/pages/updateGenre.js
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Genres } from '../../../collections/genres.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.updateGenre.onCreated(function () {
    this.errorMessage = new ReactiveVar('');
    this.successMessage = new ReactiveVar('');
    const genreId = FlowRouter.getParam('genreId');
    this.selectedGenre = new ReactiveVar(null);

    this.autorun(() => {
        this.subscribe('genres');
        if (genreId) {
            this.selectedGenre.set(Genres.findOne(genreId));
        }
    });
});

Template.updateGenre.helpers({
    selectedGenre() {
        return Template.instance().selectedGenre.get();
    },
    errorMessage() {
        return Template.instance().errorMessage.get();
    },
    successMessage() {
        return Template.instance().successMessage.get();
    }
});

Template.updateGenre.events({
'submit #update-genre-form'(event) {
    event.preventDefault();

    const target = event.target;
    const genreId = FlowRouter.getParam('genreId');
    const name = target.name.value;

    Meteor.call('genres.update', { genreId, name }, (error) => {
        if (error) {
            alert('An error occurred: ' + error.reason);
        } else {
            alert('Genre updated successfully');
            FlowRouter.go('/admin/genres');
        }
    });
}

});
