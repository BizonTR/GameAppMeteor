import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { PegiDatas } from '../../../collections/pegiDatas.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.updatePegi.onCreated(function () {
    this.errorMessage = new ReactiveVar('');
    this.successMessage = new ReactiveVar('');
    const pegiId = FlowRouter.getParam('pegiId');
    this.selectedPegi = new ReactiveVar(null);

    this.autorun(() => {
        this.subscribe('pegiDatas');
        if (pegiId) {
            this.selectedPegi.set(PegiDatas.findOne(pegiId));
        }
    });
});

Template.updatePegi.helpers({
    selectedPegi() {
        return Template.instance().selectedPegi.get();
    },
    errorMessage() {
        return Template.instance().errorMessage.get();
    },
    successMessage() {
        return Template.instance().successMessage.get();
    }
});

Template.updatePegi.events({
'submit #update-pegi-form'(event) {
    event.preventDefault();

    const target = event.target;
    const pegiId = FlowRouter.getParam('pegiId');
    const name = target.name.value;
    const imageUrl = target.imageUrl.value;
    const description = target.description.value;

    Meteor.call('pegiDatas.update', { pegiId, name, imageUrl, description }, (error) => {
        if (error) {
            alert('An error occurred: ' + error.reason);
        } else {
            alert('Pegi updated successfully');
            FlowRouter.go('/admin/pegis');
        }
    });
}

});
