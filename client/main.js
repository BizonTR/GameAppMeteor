import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'meteor/aldeed:collection2/static';

import '../client/routes.js'

import './main.html';

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

FlowRouter.wait()
Meteor.startup(() => {
  Tracker.autorun(function () {
    const userId = Meteor.userId()
    const userRole = Meteor.roleAssignment.findOne({"user._id" : userId})
    if ((!userId || userRole) && !FlowRouter._initialized) {
      FlowRouter.initialize()
    }
  })
})