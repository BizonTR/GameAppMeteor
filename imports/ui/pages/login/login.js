import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.login.events({
    'submit #login-form'(event) {
        event.preventDefault();
        const target = event.target;
        const username = target['login-username'].value; // Get username
        const password = target['login-password'].value; // Get password

        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                alert('Giriş başarısız: ' + error.reason);
            } else {
                alert('Giriş başarılı:');
                window.location.reload();
            }
        });
    }
});

//loginden sonra refrsh yerine paneli kapatalım.