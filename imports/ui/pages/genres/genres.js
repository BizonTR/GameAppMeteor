// imports/ui/pages/genres.js
import { Template } from 'meteor/templating';
import { Genres } from '../../../collections/genres.js';
import { subscribeToGenres } from '../../../../client/subscriptions/genresSubscriptions.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.genres.onCreated(function () {
    this.autorun(() => {
        this.subscribeToGenres = subscribeToGenres();
    });
});

Template.genres.helpers({
    genres() {
        return Genres.find({}, { sort: { createdAt: -1 } });
    },
    formatDate(date) {
        return date ? date.toISOString().split('T')[0] : '';
    }
});

Template.genres.events({
    'click #go-to-add-genre'(event) {
        FlowRouter.go('/admin/genres/add-genre');
    },

    'click .delete-genre'(event) {
        event.preventDefault();
        const genreId = event.currentTarget.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this genre?')) {
            Meteor.call('genres.remove', {genreId}, (error) => {
                if (error) {
                    alert('An error occurred: ' + error.reason);
                } else {
                    alert('Genre deleted successfully');
                }
            });
        }
    },

    'click .update-genre'(event) {
        const genreId = event.currentTarget.getAttribute('data-id');
        FlowRouter.go(`/admin/genres/update-genre/${genreId}`);
    }
});
