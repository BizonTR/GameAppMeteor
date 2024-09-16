import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';
import SimpleSchema from 'meteor/aldeed:simple-schema';

new ValidatedMethod({
    name: 'games.getGameById',
    validate: new SimpleSchema({
      gameId: { type: String },  // gameId'nin String olması bekleniyor
    }).validator(),
    
    run({ gameId }) {
      // Oyun ID'sine göre oyunu bul
      const game = Games.findOne({ _id: gameId });
      
      if (!game) {
        throw new Meteor.Error('game.notFound', 'Oyun bulunamadı');
      }
  
      // Oyunun genres alanında bulunan genre'leri bul
      const selectedGenres = game.genres || [];
      const genres = Genres.find({ _id: { $in: selectedGenres } }).fetch();
      
      // Genre bilgilerini oyuna ekle
      game.genreDetails = genres;
  
      return game; // Şablona dönülecek oyun verisi
    }
  });