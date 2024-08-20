import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/collections/games.js';
import './games/' //games içindeki index.jsyi direkt import eder

Meteor.startup(() => {

  Meteor.publish('games', function () {
    return Games.find();
  });

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
});
