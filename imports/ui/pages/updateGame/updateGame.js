// imports/ui/pages/updateGame.js
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Games } from '../../../collections/games.js';
import { Genres } from '../../../collections/genres.js'; // Genres koleksiyonunu import edin

Template.updateGame.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
  this.selectedGenres = new ReactiveVar([]);
  
  const gameId = FlowRouter.getParam('gameId');
  this.selectedGame = new ReactiveVar(null);

  this.autorun(() => {
    this.subscribe('games');
    this.subscribe('genres', () => {
      const game = Games.findOne(gameId);
      if (game) {
        this.selectedGame.set(game);
        this.selectedGenres.set(game.genres || []); // Güncellenmiş genre'leri set edin
      }
    });
  });
});

Template.updateGame.helpers({
  selectedGame() {
    return Template.instance().selectedGame.get();
  },
  genres() {
    return Genres.find().fetch(); // Dropdown için genre verilerini döndürün
  },
  isSelected(genreId) {
    const selectedGenres = Template.instance().selectedGenres.get();
    return selectedGenres.includes(genreId);
  },
  formatDate(date) {
    return date ? date.toISOString().split('T')[0] : '';
  }
});

Template.updateGame.events({
  'click .dropdown-item'(event) {
    event.preventDefault();
    const genreId = event.currentTarget.getAttribute('data-id');
    let selectedGenres = Template.instance().selectedGenres.get();

    if (selectedGenres.includes(genreId)) {
      selectedGenres = selectedGenres.filter(id => id !== genreId); // Seçili genre'yi kaldır
    } else {
      selectedGenres.push(genreId); // Seçili genre'yi ekle
    }

    Template.instance().selectedGenres.set(selectedGenres);

    // Seçilen genre'leri hidden input alanına ekleyin
    const selectedGenresInput = document.getElementById('selected-genres');
    selectedGenresInput.value = selectedGenres.join(',');
  },

  'submit #update-game-form'(event) {
    event.preventDefault();

    const target = event.target;
    const gameId = FlowRouter.getParam('gameId');
    const name = target.name.value;
    const description = target.description.value;
    const price = parseFloat(target.price.value);
    const genres = Template.instance().selectedGenres.get();

    // Güncelleme işlemi
    Meteor.call('games.update', gameId, { name, description, price, genres }, (error) => {
      if (error) {
        alert('An error occurred: ' + error.reason);
      } else {
        alert('Game updated successfully');
        FlowRouter.go('/games/edit-games'); // Güncelleme sonrası ana sayfaya yönlendir
      }
    });
  }
});
