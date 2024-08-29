import { ReactiveVar } from 'meteor/reactive-var';

Template.adminPanel.onCreated(function () {
    const self = this;

    self.showAuthPanel = new ReactiveVar(false);

    self.autorun(() => {
        const rolesSubscription = self.subscribe('currentUserRoles');

        if (rolesSubscription.ready()) {
            const userId = Meteor.userId();
            if (userId) {
                const user = Meteor.users.findOne(userId);
                if (user) {
                    const userRoles = Roles.getRolesForUser(userId);

                    if (Roles.userIsInRole(userId, 'admin')) {
                        // Admin ise uyarı panelini gösterme
                        self.showAuthPanel.set(false);
                    } else {
                        // Admin değilse uyarı panelini göster
                        self.showAuthPanel.set(true);
                    }
                } else {
                    // Kullanıcı bulunamadıysa
                    self.showAuthPanel.set(true);
                }
            } else {
                // Giriş yapılmamışsa
                self.showAuthPanel.set(true);
            }
        }
    });
});

Template.adminPanel.events({
    'click #close-auth-panel'(event, instance) {
        // Paneli kapat
        instance.showAuthPanel.set(false);
        // Yönlendir
        FlowRouter.go('/');
    },

    'click #go-to-add-game'(event) {
        FlowRouter.go('/admin/games/add-game');
    },

    'click #go-to-edit-games'(event) {
        FlowRouter.go('/admin/games/edit-games');
    },

    'click #go-to-genres'(event) {
        FlowRouter.go('/admin/genres');
    }
});

Template.adminPanel.helpers({
    showAuthPanel() {
        return Template.instance().showAuthPanel.get();
    }
});


// Meteor.subscribe('roles', obj, {
//     onReady: function () {
//         // TODO
//       },
//       onError: function () {
//         // TODO
//       },
//     })
