import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.home.onCreated(function () {
  const self = this
  this.subscribe('currentUserRoles');
  // this.loading = new ReactiveVar(true);

  // Authentication paneli kontrol değişkenleri
  this.showAuthPanel = new ReactiveVar(false);
  this.showLogin = new ReactiveVar(true);
});

Template.home.helpers({
  currentUser() {
    return Meteor.user();
  },

  currentUserRole() {
    const user = Meteor.user();
    if (user) {
      const roles = Roles.getRolesForUser(user._id);
      return roles.length ? roles.join(', ') : 'No roles assigned';
    }
    return 'No user logged in';
  },

  showAuthPanel() {
    return Template.instance().showAuthPanel.get();
  },

  showLogin() {
    return Template.instance().showLogin.get();
  },

  // loading() {
  //   return Template.instance().loading.get();
  // },
});

Template.home.events({
  'click #auth-button'(event) {
    event.preventDefault();
    if (Meteor.user()) {
      Meteor.logout((error) => {
        if (error) {
          alert('Çıkış yapılamadı: ' + error.reason);
        } else {
          window.location.reload();
        }
      });
    } else {
      Template.instance().showAuthPanel.set(!Template.instance().showAuthPanel.get());
    }
  },

  'click #close-auth-panel'(event) {
    event.preventDefault();
    Template.instance().showAuthPanel.set(false);
  },

  'click #show-register-form'(event) {
    event.preventDefault();
    Template.instance().showLogin.set(false);
  },

  'click #show-login-form'(event) {
    event.preventDefault();
    Template.instance().showLogin.set(true);
  },

  'click #admin-panel-button'(event) {
    event.preventDefault();
    FlowRouter.go('/admin');
  },

  'click #games-button'(event) {
    event.preventDefault();
    FlowRouter.go('/games');
  },
});