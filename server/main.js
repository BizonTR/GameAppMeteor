import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/collections/games.js';
import { Genres } from '../imports/collections/genres.js';
import './games/' //games içindeki index.jsyi direkt import eder
import './genres/'

Meteor.startup(() => {
  console.log("server startup");

  try {
    // Veritabanında varsayılan veri olup olmadığını kontrol edin
    if (Games.find().count() <= 1) {
      console.log("veri yok");
      // Koleksiyona varsayılan veriyi ekleyin
      Games.insert({
        name: 'bonk.io',
        description: 'multiplayer physics game',
        createdAt: new Date()
      });
    } else {
      console.log(Games.find().count())
      console.log("veri zaten mevcut");
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  }

  try {
    // Veritabanında varsayılan veri olup olmadığını kontrol edin
    if (Genres.find().count() <= 2) {
      console.log("veri yok");
      // Koleksiyona varsayılan veriyi ekleyin
      Genres.insert({
        name: 'Open World',
        createdAt: new Date()
      });
    } else {
      console.log(Genres.find().count())
      console.log("veri zaten mevcut");
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
});
