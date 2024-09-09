// imports/api/gamesMethods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
  'games.getGames'({page, limit, term, selectedGenres = []}) {
    check(page, Number);
    check(limit, Number);
    check(term, String);
    check(selectedGenres, [String]); // selectedGenres'yi array olarak kontrol et
    
    const skip = (page - 1) * limit;
    
    // Arama ve genre filtresi için sorgu
    const query = {
    //   ...term && { name: { $regex: term, $options: 'i' } },
    //   ...selectedGenres.length > 0 && { genres: { $all: selectedGenres } }
    };

    if (selectedGenres.length > 0) {
        query.genres = { $all: selectedGenres } 
    }

    if (term) {
     query.name = { $regex: term, $options: 'i' }
    }

    console.log(query)
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

  // 'games.getGamesMainPage'(page, limit) {
  //   check(page, Number);
  //   check(limit, Number);
    
  //   const skip = (page - 1) * limit;
  //   const totalGames = Games.find().count();
    
  //   let games;
  //   if (skip >= totalGames) {
  //     games = Games.find({}, { sort: { createdAt: 1 }, limit: limit }).fetch();
  //   } else {
  //     games = Games.find({}, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
  //   }
    
  //   // Genre bilgilerini oyunlara ekleme
  //   games.forEach(game => {
  //     const selectedGenres = game.genres || [];
  //     const genres = Genres.find({ _id: { $in: selectedGenres } }).fetch();
  //     game.genreDetails = genres;
  //   });
    
  //   return games;
  // }
});


//tür id ve term ifadesi optional olmalı.