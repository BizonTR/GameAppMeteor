// imports/ui/pages/addGame.js

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.addGame.events({
  'submit #add-game-form'(event) {
    event.preventDefault();

    // Form verilerini al
    const target = event.target;
    const name = target.name.value;
    const description = target.description.value;

    // Yeni oyun ekleme metodu çağırma
    Meteor.call('games.insert', name, description, (error) => {
      console.log(name)
      console.log(description)
      if (error) {
        alert(error.error);
      } else {
        alert('Game added successfully');
        // Formu temizleyin
        target.name.value = '';
        target.description.value = '';
        // Oyun eklendikten sonra ana sayfaya yönlendirin
        FlowRouter.go('/');
      }
    });
  }
});
