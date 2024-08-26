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
        const confirmPassword = target['confirm-password'].value;

        // Şifrelerin eşleşip eşleşmediğini kontrol et
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor. Lütfen tekrar deneyin.');
            return; // İşlemi sonlandır
        }

        // Şifreler eşleşiyorsa kullanıcıyı oluştur
        Accounts.createUser({ username, email, password }, (error) => {
            if (error) {
                alert('Kayıt başarısız: ' + error.reason);
            } else {
                alert('Kayıt başarılı!');
                FlowRouter.go('/login'); // Başarılı kayıt sonrası giriş sayfasına yönlendirme
            }
        });
    }
});
