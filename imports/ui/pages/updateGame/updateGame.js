// imports/ui/pages/updateGame.js
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Games } from '../../../collections/games.js';
import { Genres } from '../../../collections/genres.js'; // Genres koleksiyonunu import edin
import { PegiDatas } from '../../../collections/pegiDatas.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.updateGame.onCreated(function () {
  this.errorMessage = new ReactiveVar('');
  this.successMessage = new ReactiveVar('');
  this.selectedGenres = new ReactiveVar([]);
  this.selectedPegis = new ReactiveVar([]);
  
  const gameId = FlowRouter.getParam('gameId');
  this.selectedGame = new ReactiveVar(null);

  console.log("Game ID:", gameId);  // Konsolda bu satırı kontrol edin.

  this.autorun(() => {
    console.log("auto")
    this.subscribe('games');
    this.subscribe('genres', () => {
      const game = Games.findOne(gameId);
      if (game) {
        this.selectedGame.set(game);
        this.selectedGenres.set(game.genres || []); // Güncellenmiş genre'leri set edin
      }
    });

    this.subscribe('pegiDatas', () => {
      const game = Games.findOne(gameId);
      if (game) {
        this.selectedGame.set(game);
        this.selectedPegis.set(game.pegis || []);
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

  isSelectedGenre(genreId) {
    const selectedGenres = Template.instance().selectedGenres.get();
    return selectedGenres.includes(genreId);
  },

  pegis() {
    return PegiDatas.find().fetch(); // Dropdown için genre verilerini döndürün
  },

  isSelectedPegi(pegiId) {
    const selectedPegis = Template.instance().selectedPegis.get();
    return selectedPegis.includes(pegiId);
  },

  formatDate(date) {
    return date ? date.toISOString().split('T')[0] : '';
  }
});

Template.updateGame.events({
  'click .dropdown-item-genre'(event) {
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

  'click .dropdown-item-pegi'(event) {
    event.preventDefault();
    const pegiId = event.currentTarget.getAttribute('data-id');
    let selectedPegis = Template.instance().selectedPegis.get();

    if (selectedPegis.includes(pegiId)) {
      selectedPegis = selectedPegis.filter(id => id !== pegiId); // Seçili genre'yi kaldır
    } else {
      selectedPegis.push(pegiId); // Seçili genre'yi ekle
    }

    Template.instance().selectedPegis.set(selectedPegis);

    const selectedPegisInput = document.getElementById('selected-pegis');
    selectedPegisInput.value = selectedPegis.join(',');
  },

  'submit #update-game-form'(event) {
    event.preventDefault();

    const target = event.target;
    const gameId = FlowRouter.getParam('gameId');
    const name = target.name.value;
    const description = target.description.value;
    const coverImageUrl = target.coverImageUrl.value;
    const price = parseFloat(target.price.value);
    const genres = Template.instance().selectedGenres.get();
    const pegis = Template.instance().selectedPegis.get();

    // Güncelleme işlemi
    Meteor.call('games.update', {_id: gameId, game:{ name, description, price, genres, coverImageUrl, pegis} }, (error) => {
      if (error) {
        alert('An error occurred: ' + error.reason);
      } else {
        alert('Game updated successfully');
        FlowRouter.go('/admin/games/edit-games'); // Güncelleme sonrası ana sayfaya yönlendir
      }
    });
  }
});
