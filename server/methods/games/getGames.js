// imports/api/gamesMethods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
    'games.getGames'(limit, searchTerm = '') {
        check(limit, Number);
        check(searchTerm, String);

        try {
            // Arama terimini içeren oyunları getir
            const regex = new RegExp(searchTerm, 'i'); // Case-insensitive regex
            const games = Games.find({ name: { $regex: regex } }, { limit: limit, sort: { createdAt: -1 } }).fetch();

            // Tüm oyunlardan genre ID'lerini topla
            const genreIds = [...new Set(games.flatMap(game => game.genres || []))];

            // Genre verilerini ID'lere göre getir
            const genres = Genres.find({ _id: { $in: genreIds } }).fetch();

            // Oyunlara bağlı genre verilerini ekle
            return games.map(game => ({
                ...game,
                genreDetails: (game.genres || []).map(genreId =>
                    genres.find(genre => genre._id === genreId)
                ).filter(genre => genre) // Filtreleme işlemi, undefined değerleri temizler
            }));
        } catch (error) {
            throw new Meteor.Error('500', `Sunucu hatası: ${error.message}`);
        }
    },

    'games.getGamesMainPage'(limit) {
        check(limit, Number);

        try {
            // Oyunları getir
            const games = Games.find({}, { limit: limit, sort: { createdAt: -1 } }).fetch();

            // Tüm oyunlardan genre ID'lerini topla
            const genreIds = [...new Set(games.flatMap(game => game.genres || []))];

            // Genre verilerini ID'lere göre getir
            const genres = Genres.find({ _id: { $in: genreIds } }).fetch();

            // Oyunlara bağlı genre verilerini ekle
            return games.map(game => ({
                ...game,
                genreDetails: (game.genres || []).map(genreId =>
                    genres.find(genre => genre._id === genreId)
                ).filter(genre => genre) // Filtreleme işlemi, undefined değerleri temizler
            }));
        } catch (error) {
            throw new Meteor.Error('500', `Sunucu hatası: ${error.message}`);
        }
    }
});

