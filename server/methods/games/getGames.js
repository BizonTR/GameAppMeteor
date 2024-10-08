import { getPagingData } from '../../../imports/api/utils/paging.js';
import { Games } from '../../../imports/collections/games.js';
import { Genres } from '../../../imports/collections/genres.js';
import SimpleSchema from 'meteor/aldeed:simple-schema';

new ValidatedMethod({
  name: 'games.getGames',
  validate: new SimpleSchema({
    page: {
      type: SimpleSchema.Integer,
      min: 1,
      optional: true
    },
    limit: {
      type: SimpleSchema.Integer,
      min: 1,
    },
    term: {
      type: String,
      optional: true,
    },
    selectedGenres: {
      type: Array,
      optional: true,
    },
    'selectedGenres.$': {
      type: String,
    },
  }).validator({ clean: true }),
  
  run({ page = 1, limit, term = '', selectedGenres = [] }) {
    const query = {};

    // Genre filtresi ekle
    if (selectedGenres.length > 0) {
      query.genres = { $all: selectedGenres };
    }

    // İsim filtresi ekle
    if (term) {
      query.name = { $regex: term, $options: 'i' };
    }

    // Toplam oyun sayısını al
    const totalGames = Games.find(query).count();

    // Paging verilerini al
    const { totalPages, currentPage, skip } = getPagingData({
      page,
      limit,
      totalCount: totalGames,
    });

    // Oyunları getir
    const games = Games.find(query, { sort: { createdAt: -1 }, skip: skip, limit: limit }).fetch();

    // Genre bilgilerini oyunlara ekle
    games.forEach(game => {
      const selectedGenres = game.genres || [];
      const genres = Genres.find({ _id: { $in: selectedGenres } }).fetch();
      game.genreDetails = genres;
    });

    // Şablona dönülecek veriler
    return {
      games,
      totalPages,
      currentPage,
      totalGames, // Toplam oyun sayısını şablona gönderiyoruz
    };
  },
});
