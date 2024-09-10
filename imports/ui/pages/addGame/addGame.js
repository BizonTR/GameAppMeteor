import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Genres } from '../../../collections/genres.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.addGame.onCreated(function () {
  this.genres = new ReactiveVar([]);
  this.selectedGenres = new ReactiveVar([]);

  this.autorun(() => {
    this.subscribe('genres', () => {
      this.genres.set(Genres.find().fetch()); // Genres koleksiyonundan türleri yükleyin
    });
  });
});

Template.addGame.helpers({
  genres() {
    return Template.instance().genres.get(); // Dropdown için genre verilerini döndürün
  },

  selectedGenres() {
    return Template.instance().selectedGenres.get(); // Seçili genre'leri döndürün
  },

  isSelected(genreId) {
    const selectedGenres = Template.instance().selectedGenres.get();
    return selectedGenres.includes(genreId) ? '(Selected)' : '';
  }
});

Template.addGame.events({
  'click .dropdown-item'(event) {
    event.preventDefault();
    const genreId = event.currentTarget.getAttribute('data-id');

    let selectedGenres = Template.instance().selectedGenres.get();
    
    if (selectedGenres.includes(genreId)) {
      selectedGenres = selectedGenres.filter(id => id !== genreId); // Seçilen genre'yi kaldır
    } else {
      selectedGenres.push(genreId); // Seçilen genre'yi ekle
    }
    
    Template.instance().selectedGenres.set(selectedGenres);
    
    // Seçilen genre'leri hidden input alanına ekleyin
    const selectedGenresInput = document.getElementById('selected-genres');
    selectedGenresInput.value = selectedGenres.join(',');
  },

  'submit #add-game-form'(event) {
    event.preventDefault();

    // Form verilerini al
    const target = event.target;
    const name = target.name.value;
    const description = target.description.value;
    const price = parseFloat(target.price.value)
    const selectedGenres = Template.instance().selectedGenres.get(); // Seçilen genre'leri al

    // Yeni oyun ekleme metodu çağırma
    Meteor.call('games.insert', {name, description, createdAt: new Date(), price, genres:selectedGenres}, (error) => {
      console.log({name, description, price, genres:selectedGenres, createdAt: new Date()})
      if (error) {
        alert('An error occurred: ' + error.reason);
        console.error(error);
      } else {
        alert('Game added successfully');
        // Formu temizleyin
        target.name.value = '';
        target.description.value = '';
        target.price.value = '';
        const selectedGenresInput = document.getElementById('selected-genres');
        selectedGenresInput.value = '';
        FlowRouter.go('/admin/games/add-game');
      }
    });
    Template.instance().selectedGenres.set([]);
  }
});
