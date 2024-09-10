// imports/api/gamesMethods.js
import { Meteor } from 'meteor/meteor';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';
import SimpleSchema from 'meteor/aldeed:simple-schema'

// Şema doğrulaması
new ValidatedMethod({
  name: 'games.getGames',
  validate: new SimpleSchema({
    page: {
      type: SimpleSchema.Integer,
      min: 1, // Sayfa numarası en az 1 olmalı
    },
    limit: {
      type: SimpleSchema.Integer,
      min: 1, // Limit en az 1 olmalı
    },
    term: {
      type: String,
      optional: true, // Term boş olabilir
    },
    selectedGenres: {
      type: Array,
      optional: true, // Genre listesi boş olabilir
    },
    'selectedGenres.$': {
      type: String, // Her bir genre string olmalı
    },
  }).validator(),
  
  run({ page, limit, term = '', selectedGenres = [] }) {
    const skip = (page - 1) * limit;

    // Arama ve genre filtresi için sorgu
    const query = {};

    if (selectedGenres.length > 0) {
      query.genres = { $all: selectedGenres };
    }

    if (term) {
      query.name = { $regex: term, $options: 'i' };
    }

    console.log(query);

    const totalGames = Games.find(query).count();

    let games;
    if (skip >= totalGames) {
      games = Games.find(query, { sort: { createdAt: 1 }, limit: limit }).fetch();
    } else {
      games = Games.find(query, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
    }

    // Genre bilgilerini oyunlara ekleme
    games.forEach(game => {
      const selectedGenres = game.genres || [];
      const genres = Genres.find({ _id: { $in: selectedGenres } }).fetch();
      game.genreDetails = genres;
    });

    return games;
  },
});
