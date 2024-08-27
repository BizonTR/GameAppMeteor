import { Meteor } from 'meteor/meteor';
import 'meteor/aldeed:collection2/static';
import { Games } from '../imports/collections/games.js';
import { Genres } from '../imports/collections/genres.js';
import './games/'; // games içindeki index.js'yi direkt import eder
import './genres/';
import './user/';
import { Migrations } from 'meteor/percolate:migrations';
import './migrations/'; // Migration dosyanızı buraya ekleyin
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  console.log("server startup");
  Migrations.migrateTo('latest');

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
      console.log(Games.find().count());
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
      console.log(Genres.find().count());
      console.log("veri zaten mevcut");
    }
  } catch (error) {
    console.error("Hata oluştu:", error);
  }

  // Roller oluşturuluyor
  const roles = ['admin', 'user'];

  roles.forEach(role => {
    const roleExists = Roles.getAllRoles().fetch().some(r => r._id === role);
    if (!roleExists) {
      try {
        Roles.createRole(role);
        console.log(`'${role}' rolü oluşturuldu.`);
      } catch (error) {
        console.error(`'${role}' rolü oluşturulurken hata oluştu:`, error);
      }
    }
  });

  console.log('Sunucu başlatıldı ve roller kontrol edildi.');

  // Kullanıcılara 'user' rolü atanıyor
  try {
    const users = Meteor.users.find().fetch(); // Tüm kullanıcıları al
    users.forEach(user => {
      // Kullanıcının herhangi bir rolü olup olmadığını kontrol et
      if (!Roles.getRolesForUser(user._id).length) {
        // Kullanıcıya 'user' rolü atanıyor
        Roles.addUsersToRoles(user._id, 'user');
        console.log(`'${user.username || user._id}' kullanıcısına 'user' rolü eklendi.`);
      }
    });
  } catch (error) {
    console.error("Kullanıcılara rol atanırken hata oluştu:", error);
  }

  // Admin rolüne sahip hiç kullanıcı yoksa, varsayılan bir admin kullanıcısı oluştur
  try {
    console.log("Admin oluşturma işlemi başlıyor");

    // Admin rolü var mı kontrol et
    const adminRoleExists = Roles.getAllRoles().fetch().some(r => r._id === 'admin');

    // Admin rolüne sahip kullanıcı var mı kontrol et
    const adminUserExists = Meteor.users.find({ 'roles': 'admin' }).count() > 0;

    console.log(`Admin rolü var mı: ${adminRoleExists}`);
    console.log(`Admin kullanıcı mevcut mu: ${adminUserExists}`);

    if (adminRoleExists && !adminUserExists) {
      // Varsayılan admin kullanıcı oluşturuluyor
      const defaultAdminUsername = 'admin';
      const defaultAdminPassword = 'admin123';
      const defaultAdminEmail = 'admin@example.com';

      const userId = Accounts.createUser({
        username: defaultAdminUsername,
        email: defaultAdminEmail,
        password: defaultAdminPassword,
      });

      // Oluşturulan kullanıcıya 'admin' rolü atanıyor
      Roles.addUsersToRoles(userId, 'admin');
      console.log(`Varsayılan admin kullanıcısı '${defaultAdminUsername}' oluşturuldu ve 'admin' rolü eklendi.`);
    }
  } catch (error) {
    console.error("Admin kullanıcısı oluşturulurken hata oluştu:", error);
  }
});
