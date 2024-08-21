import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/layouts/mainLayout.html'

// Sayfa şablonları
import '../imports/ui/pages/addGame/addGame.html';
import '../imports/ui/pages/home/home.html';
import '../imports/ui/pages/editGame/editGame.html';
import '../imports/ui/pages/updateGame/updateGame.html';


import '../imports/ui/pages/addGame/addGame.js';
import '../imports/ui/pages/home/home.js';
import '../imports/ui/pages/editGame/editGame.js';
import '../imports/ui/pages/updateGame/updateGame.js';

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
