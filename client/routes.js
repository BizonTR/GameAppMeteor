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
import '../imports/ui/pages/register/register.html';
import '../imports/ui/pages/login/login.html';
import '../imports/ui/pages/adminPanel/adminPanel.html';


import '../imports/ui/pages/addGame/addGame.js';
import '../imports/ui/pages/home/home.js';
import '../imports/ui/pages/editGame/editGame.js';
import '../imports/ui/pages/updateGame/updateGame.js';
import '../imports/ui/pages/addGenre/addGenre.js';
import '../imports/ui/pages/genres/genres.js';
import '../imports/ui/pages/updateGenre/updateGenre.js';
import '../imports/ui/pages/register/register.js';
import '../imports/ui/pages/login/login.js';
import '../imports/ui/pages/adminPanel/adminPanel.js';

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

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('mainLayout', { main: 'login' });
  }
});

FlowRouter.route('/register', {
  name: 'register',
  action() {
    BlazeLayout.render('mainLayout', { main: 'register' });
  }
});

FlowRouter.route('/admin', {
  name: 'adminPanel',
  action() {

    BlazeLayout.render('mainLayout', { main: 'adminPanel' });
  }
});


// FlowRouter.route('/home', {
//   // calls just before the action
//   triggersEnter: [trackRouteEntry],
//   action: function() {
//     // do something you like
//   },
//   // calls when we decide to move to another route
//   // but calls before the next route started
//   triggersExit: [trackRouteClose]
// });

// function trackRouteEntry(context) {
//   // context is the output of `FlowRouter.current()`
//   Mixpanel.track("visit-to-home", context.queryParams);
// }

// function trackRouteClose(context) {
//   Mixpanel.track("move-from-home", context.queryParams);
// }



// const MustSignIn = function (context, redirect, stop) {
//   if (!Meteor.userId()) {
//     redirect(`/signin`)
//     stop()
//   }
// }

// const MustSignOut = function (context, redirect, stop) {
//   if (Meteor.userId()) {
//     redirect('/')
//     stop()
//   }
// }

// export { MustSignIn, MustSignOut }
//FLOWROUTER TIRGGER ENTER USAGE


// const routes = FlowRouter.group({
//   prefix: '/auth',
//   name: 'auth',
// })

// routes.route('/signin', {
//   triggersEnter: [MustSignOut],
//   action: function (params, queryParams) {
//     BlazeLayout.render('layout', { page: 'accountSignin'})
//   },
// })

// routes.route('/signup', {
//   triggersEnter: [MustSignOut],
//   action: function (params, queryParams) {
//     BlazeLayout.render('layout', { page: 'accountSignup'})
//   },
// })

//FLOWROUTER GROUP USAGE