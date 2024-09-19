import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Genres } from '../../../collections/genres.js';
import { PegiDatas } from '../../../collections/pegiDatas.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.addGame.onCreated(function () {
  this.genres = new ReactiveVar([]);
  this.selectedGenres = new ReactiveVar([]);
  this.pegis = new ReactiveVar([]);
  this.selectedPegis = new ReactiveVar([]);

  this.autorun(() => {
    this.subscribe('genres', () => {
      this.genres.set(Genres.find().fetch()); // Genres koleksiyonundan türleri yükleyin
    });

    this.subscribe('pegiDatas', () => {
      this.pegis.set(PegiDatas.find().fetch()); // Genres koleksiyonundan türleri yükleyin
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

  isSelectedGenre(genreId) {
    const selectedGenres = Template.instance().selectedGenres.get();
    return selectedGenres.includes(genreId) ? '(Selected)' : '';
  },

  pegis() {
    return Template.instance().pegis.get(); // Dropdown için genre verilerini döndürün
  },

  selectedPegis() {
    return Template.instance().selectedPegis.get(); // Seçili genre'leri döndürün
  },

  isSelectedPegi(pegiId) {
    const selectedPegis = Template.instance().selectedPegis.get();
    return selectedPegis.includes(pegiId) ? '(Selected)' : '';
  }

});

Template.addGame.events({
  'click .dropdown-item-genre'(event) {
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

  'click .dropdown-item-pegi'(event) {
    event.preventDefault();
    const pegiId = event.currentTarget.getAttribute('data-id');

    let selectedPegis = Template.instance().selectedPegis.get();
    
    if (selectedPegis.includes(pegiId)) {
      selectedPegis = selectedPegis.filter(id => id !== pegiId);
    } else {
      selectedPegis.push(pegiId);
    }
    
    Template.instance().selectedPegis.set(selectedPegis);
    
    const selectedPegisInput = document.getElementById('selected-pegis');
    selectedPegisInput.value = selectedPegis.join(',');
  },

  'submit #add-game-form'(event) {
    event.preventDefault();

    // Form verilerini al
    const target = event.target;
    const name = target.name.value;
    const description = target.description.value;
    const price = parseFloat(target.price.value)
    const selectedGenres = Template.instance().selectedGenres.get(); // Seçilen genre'leri al
    const coverImageUrl = target.coverImageUrl.value;
    const selectedPegis = Template.instance().selectedPegis.get();

    // Yeni oyun ekleme metodu çağırma
    Meteor.call('games.insert', {name, description, createdAt: new Date(), price, genres:selectedGenres, coverImageUrl, pegis:selectedPegis}, (error) => {
      if (error) {
        alert('An error occurred: ' + error.reason);
        console.error(error);
      } else {
        alert('Game added successfully');
        // Formu temizleyin
        target.name.value = '';
        target.description.value = '';
        target.price.value = '';
        target.coverImageUrl.value = '';
        const selectedGenresInput = document.getElementById('selected-genres');
        selectedGenresInput.value = '';
        
        const selectedPegisInput = document.getElementById('selected-pegis');
        selectedPegisInput.value = '';
        FlowRouter.go('/admin/games/add-game');
      }
    });
    Template.instance().selectedGenres.set([]);
    Template.instance().selectedPegis.set([]);
  }
});
