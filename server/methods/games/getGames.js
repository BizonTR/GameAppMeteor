// imports/api/gamesMethods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';

Meteor.methods({
    'games.getGames'(page, limit, searchTerm = '') {
        console.log("0")
        check(page, Number);
        check(limit, Number);
        check(searchTerm, String);

        if (page <= 0 || isNaN(page)) {
            return [];
        }

        const regex = searchTerm ? new RegExp(searchTerm, 'i') : null;

        const skip = (page - 1) * limit;

        if (regex) {
            const totalCount = Games.find({ name: { $regex: regex } }).count();
            if (skip >= totalCount) {
                console.log("1")
                return Games.find({ name: { $regex: regex } }, {
                    limit: 10,
                    sort: { createdAt: -1 }
                }).fetch();
            }

            console.log("2")
            return Games.find({ name: { $regex: regex } }, {
                skip: skip,
                limit: limit,
                sort: { createdAt: -1 }
            }).fetch();
        } else {
            console.log("3")
            return Games.find({}, {
                skip: skip,
                limit: limit,
                sort: { createdAt: -1 }
            }).fetch();
        }
    },




    'games.getGamesMainPage'(page, limit) {
        check(page, Number);
        check(limit, Number);

        if (page <= 0 || isNaN(page)) {
            return [];
        }

        const skip = (page - 1) * limit;

        const totalCount = Games.find({}).count();
        if (skip >= totalCount) {
            return Games.find({}, {
                limit: 10,
                sort: { createdAt: -1 }
            }).fetch();
        }

        return Games.find({}, {
            skip: skip,
            limit: limit,
            sort: { createdAt: -1 }
        }).fetch();
    }



});

