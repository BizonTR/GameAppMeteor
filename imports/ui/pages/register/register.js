import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.register.events({
    'submit #register-form'(event) {
        event.preventDefault();
        const target = event.target;
        const username = target['register-username'].value;
        const email = target['register-email'].value;
        const password = target['register-password'].value;
        const confirmPassword = target['register-confirm-password'].value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor. Lütfen tekrar deneyin.');
            return; // Stop the registration process
        }

        // Create user if passwords match
        Accounts.createUser({ username, email, password }, (error) => {
            if (error) {
                alert('Kayıt başarısız: ' + error.reason);
            } else {
                window.location.reload();
            }
        });
    }
});
