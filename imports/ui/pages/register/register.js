import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.register.events({
    'submit #register-form'(event) {
        event.preventDefault();
        const target = event.target;
        const username = target.username.value;
        const email = target.email.value;
        const password = target.password.value;

        Accounts.createUser({
            username,
            email,
            password,
            profile: {} // Boş bir profil nesnesi ile kullanıcıyı oluşturun
        }, (error) => {
            if (error) {
                alert('Kayıt başarısız: ' + error.reason);
            } else {
                alert('Kayıt başarılı!');
                FlowRouter.go('/login'); // Başarılı kayıt sonrası giriş sayfasına yönlendirme
            }
        });
    }
});
