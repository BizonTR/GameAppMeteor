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

        // Büyük sayfa numarası için kontrol
        if (skip >= totalGames) {
            // Eğer toplam oyun sayısından büyükse, son 10 oyunu getir
            return Games.find(query, { sort: { createdAt: 1 }, limit: limit }).fetch();
        } else {
            // Normal sayfa numaraları için
            return Games.find(query, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
        }
    },


    'games.getGamesMainPage'(page, limit) {
        check(page, Number);
        check(limit, Number);

        const skip = (page - 1) * limit;
        const totalGames = Games.find().count();

        // Büyük sayfa numarası için kontrol
        if (skip >= totalGames) {
            // Eğer toplam oyun sayısından büyükse, son 10 oyunu getir
            return Games.find({}, { sort: { createdAt: 1 }, limit: limit }).fetch();
        } else {
            // Normal sayfa numaraları için
            return Games.find({}, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();
        }
    },

});

