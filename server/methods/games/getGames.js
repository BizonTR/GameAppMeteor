// imports/api/gamesMethods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
    'games.getGames'(page, limit, searchTerm) {
        check(page, Number);
        check(limit, Number);
        check(searchTerm, String);
    
        const skip = (page - 1) * limit;
    
        const query = searchTerm
          ? { name: { $regex: searchTerm, $options: 'i' } }
          : {};
    
        const totalGames = Games.find(query).count();
    
        let games;
        if (skip >= totalGames) {
          games = Games.find(query, { sort: { createdAt: 1 }, limit: limit }).fetch();
        } else {
          games = Games.find(query, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
        }
    
        // Genre bilgilerini oyunlara ekleme
        games.forEach(game => {
          const genreIds = game.genres || []; // `genres` alanını kullan
          const genres = Genres.find({ _id: { $in: genreIds } }).fetch();
          game.genreDetails = genres; // Tür detaylarını ekle
        });
    
        return games;
      },


      'games.getGamesMainPage'(page, limit) {
        check(page, Number);
        check(limit, Number);
    
        const skip = (page - 1) * limit;
        const totalGames = Games.find().count();
    
        let games;
        if (skip >= totalGames) {
          games = Games.find({}, { sort: { createdAt: 1 }, limit: limit }).fetch();
        } else {
          games = Games.find({}, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
        }
    
        // Genre bilgilerini oyunlara ekleme
        games.forEach(game => {
          const genreIds = game.genres || []; // `genres` alanını kullan
          const genres = Genres.find({ _id: { $in: genreIds } }).fetch();
          game.genreDetails = genres; // Tür detaylarını ekle
        });
    
        return games;
      }

});

