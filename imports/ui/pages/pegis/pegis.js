import { Template } from 'meteor/templating';
import { PegiDatas } from '../../../collections/pegiDatas.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { subscribeToPegiDatas } from '../../../../client/subscriptions/pegiDatasSubscriptions.js';

Template.pegis.onCreated(function () {
    this.autorun(() => {
        this.subscribeToPegiDatas = subscribeToPegiDatas();
    });
});

Template.pegis.helpers({
    pegis() {
        return PegiDatas.find({}, { sort: { createdAt: -1 } });
    },
    formatDate(date) {
        return date ? date.toISOString().split('T')[0] : '';
    }
});

Template.pegis.events({
    'click #go-to-add-pegi'(event) {
        FlowRouter.go('/admin/pegis/add-pegi');
    },

    'click .delete-pegi'(event) {
        event.preventDefault();
        const pegiId = event.currentTarget.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this pegi?')) {
            Meteor.call('pegiDatas.remove', {pegiId}, (error) => {
                if (error) {
                    alert('An error occurred: ' + error.reason);
                } else {
                    alert('PEGI deleted successfully');
                }
            });
        }
    },

    'click .update-pegi'(event) {
        const pegiId = event.currentTarget.getAttribute('data-id');
        FlowRouter.go(`/admin/pegis/update-pegi/${pegiId}`);
    }
});
