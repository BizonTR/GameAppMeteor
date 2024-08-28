import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'meteor/aldeed:collection2/static';

import '../client/routes.js'
import './main.html';

// client/main.js
if (Meteor.isClient) {
    let inactivityTimer;

    const handleInactivity = () => {
        if (Meteor.userId()) {
            console.log('Kullanıcı etkileşimde bulunmuyor. Oturum kapatılıyor...');
            Meteor.logout(); // Oturum kapatılıyor
        }
    };

    const resetTimer = () => {
        if (Meteor.userId()) { // Oturum açık mı kontrolü
            console.log('Kullanıcı etkileşimde bulundu. Timer sıfırlandı.');
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(handleInactivity, 20000); // 20 saniye
        }
    };

    // Sayfa üzerinde etkileşim tespit etme
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    // İlk başta timer'ı başlat
    resetTimer();
}