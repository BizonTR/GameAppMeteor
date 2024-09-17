import { Games } from '../../imports/collections/games.js';
import { Migrations } from 'meteor/percolate:migrations';

Migrations.add({
    version: 2,
    name: 'default cover image',
    up() {
        const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfTe7hvs0pd4zSRZtz0Xhvy04W_3a-zyPOJZ91LEs37c6KiM5qUNajw5X27Og57ZsDPf8&usqp=CAU';

        Games.find({ coverImageUrl: { $exists: false } }).forEach((game) => {
            Games.update(game._id, {
                $set: { coverImageUrl: defaultImageUrl } // Varsayılan olarak 0 değerini atıyoruz
            });
        });
    },
    down() {
        // İhtiyaç halinde bu migration'u geri alabiliriz
        Games.update({}, {
            $unset: { coverImageUrl: "" }
        }, { multi: true });
    }
});
