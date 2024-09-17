import { Meteor } from 'meteor/meteor';
import 'meteor/aldeed:collection2/static';
import { Games } from '../imports/collections/games.js';
import { Genres } from '../imports/collections/genres.js';
import { PegiDatas } from '../imports/collections/pegiDatas.js';
import './games/'; // games içindeki index.js'yi direkt import eder
import './genres/';
import './pegiDatas/';
import './user/';
import { Migrations } from 'meteor/percolate:migrations';
import './migrations/'; // Migration dosyanızı buraya ekleyin
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  console.log("server startup");
  //Migrations.migrateTo('latest');
});
