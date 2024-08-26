import { Migrations } from 'meteor/percolate:migrations';
import { Games } from '../../imports/collections/games.js'; // Games koleksiyonunu import edin

Migrations.add({
  version: 1,
  name: 'Add price field to all existing games',
  up() {
    Games.find({ price: { $exists: false } }).forEach((game) => {
      Games.update(game._id, {
        $set: { price: 0 } // Varsayılan olarak 0 değerini atıyoruz
      });
    });
  },
  down() {
    // İhtiyaç halinde bu migration'u geri alabiliriz
    Games.update({}, {
      $unset: { price: "" }
    }, { multi: true });
  }
});
