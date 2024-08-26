import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.login.events({
    'submit #login-form'(event) {
        event.preventDefault();
        const target = event.target;
        const username = target.username.value;
        const password = target.password.value;

        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                alert('Giriş başarısız: ' + error.reason);
            } else {
                alert('Giriş başarılı!');
                FlowRouter.go('/'); // Başarılı giriş sonrası ana sayfaya yönlendirme
            }
        });
    }
});
