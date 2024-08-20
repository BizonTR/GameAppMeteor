import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/layouts/mainLayout.html'

// Sayfa şablonları
import '../imports/ui/pages/addGame/addGame.html';
import '../imports/ui/pages/home/home.html';


import '../imports/ui/pages/addGame/addGame.js';
import '../imports/ui/pages/home/home.js';

FlowRouter.route('/', {
    action() {
      BlazeLayout.render('mainLayout', { main: 'home' });
    }
  });
  
  FlowRouter.route('/add-game', {
    action() {
      BlazeLayout.render('mainLayout', { main: 'addGame' });
    }
  });
