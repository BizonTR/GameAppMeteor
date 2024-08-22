import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/layouts/mainLayout.html'

// Sayfa şablonları
import '../imports/ui/pages/addGame/addGame.html';
import '../imports/ui/pages/home/home.html';
import '../imports/ui/pages/editGame/editGame.html';
import '../imports/ui/pages/updateGame/updateGame.html';
import '../imports/ui/pages/addGenre/addGenre.html';
import '../imports/ui/pages/genres/genres.html';
import '../imports/ui/pages/updateGenre/updateGenre.html';


import '../imports/ui/pages/addGame/addGame.js';
import '../imports/ui/pages/home/home.js';
import '../imports/ui/pages/editGame/editGame.js';
import '../imports/ui/pages/updateGame/updateGame.js';
import '../imports/ui/pages/addGenre/addGenre.js';
import '../imports/ui/pages/genres/genres.js';
import '../imports/ui/pages/updateGenre/updateGenre.js';

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('mainLayout', { main: 'home' });
  }
});

FlowRouter.route('/games/add-game', {
  action() {
    BlazeLayout.render('mainLayout', { main: 'addGame' });
  }
});

FlowRouter.route('/games/edit-games', {
  action() {
    BlazeLayout.render('mainLayout', { main: 'editGames' });
  }
});

FlowRouter.route('/games/edit-games/update-game/:gameId', {
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'updateGame' });
  }
});


FlowRouter.route('/genres/add-genre', {
  name: 'addGenre',
  action() {
    BlazeLayout.render('mainLayout', { main: 'addGenre' });
  }
});

FlowRouter.route('/genres', {
  name: 'genres',
  action() {
    BlazeLayout.render('mainLayout', { main: 'genres' });
  },
});

FlowRouter.route('/genres/update-genre/:genreId', {
  name: 'UpdateGenre',
  action(params) {
    BlazeLayout.render('mainLayout', { main: 'updateGenre', genreId: params.genreId });
  },
});
