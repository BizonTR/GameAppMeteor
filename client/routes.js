import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
import '../imports/ui/pages/games/games.html';
import '../imports/ui/pages/gameDetails/gameDetails.html';
import '../imports/ui/pages/addPegi/addPegi.html';
import '../imports/ui/pages/pegis/pegis.html';
import '../imports/ui/pages/updatePegi/updatePegi.html';


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
import '../imports/ui/pages/games/games.js';
import '../imports/ui/pages/gameDetails/gameDetails.js';
import '../imports/ui/pages/addPegi/addPegi.js';
import '../imports/ui/pages/pegis/pegis.js';
import '../imports/ui/pages/updatePegi/updatePegi.js';

FlowRouter.route('/', {
  name: 'home',
  action() {
    this.render('mainLayout', { main: 'home' });
  }
});

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [function(context, redirect) {
    const userId = Meteor.userId();
    
    if (!userId) {
      // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
      redirect('/');
      return; // Fonksiyonu sonlandır
    }
    
    const isAdmin = Roles.userIsInRole(userId, ['admin']);
    
    if (!isAdmin) {
      // Eğer kullanıcı admin değilse, ana sayfaya yönlendir
      redirect('/');
      return; // Fonksiyonu sonlandır
    }
  }],
  action() {
    // Eğer kullanıcı admin ise, adminLayout şablonunu render et
    this.render('mainLayout', { main: 'adminPanel' });
  }
});




adminRoutes.route('/', {
  name: 'adminPanel',
  action() {
    this.render('mainLayout', { main: 'adminPanel' });
  }
});

adminRoutes.route('/games/add-game', {
  action() {
    this.render('mainLayout', { main: 'addGame' });
  }
});

adminRoutes.route('/games/edit-games', {
  action() {
    this.render('mainLayout', { main: 'editGames' });
  }
});

adminRoutes.route('/games/edit-games/update-game/:gameId', {
  action(params) {
    this.render('mainLayout', { main: 'updateGame' });
  }
});

adminRoutes.route('/genres/add-genre', {
  action() {
    this.render('mainLayout', { main: 'addGenre' });
  }
});

adminRoutes.route('/genres', {
  action() {
    this.render('mainLayout', { main: 'genres' });
  }
});

adminRoutes.route('/pegis/add-pegi', {
  action() {
    this.render('mainLayout', { main: 'addPegi' });
  }
});

adminRoutes.route('/pegis', {
  action() {
    this.render('mainLayout', { main: 'pegis' });
  }
});

adminRoutes.route('/genres/update-genre/:genreId', {
  action(params) {
    this.render('mainLayout', { main: 'updateGenre' });
  }
});

adminRoutes.route('/pegis/update-pegi/:pegiId', {
  action(params) {
    this.render('mainLayout', { main: 'updatePegi' });
  }
});

FlowRouter.route('/search', {
  name: 'search',
  action(params) {
    this.render('mainLayout', { main: 'home' });
  }
});

FlowRouter.route('/games', {
  name: 'games',
  action(params) {
    this.render('mainLayout', { main: 'games' });
  }
});

FlowRouter.route('/games/:id', {
  name: 'gameDetails',
  action(params) {
    this.render('mainLayout', { main: 'gameDetails' });  // mainLayout içinde main bölgesine gameDetails yüklenecek
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
//     this.render('layout', { page: 'accountSignin'})
//   },
// })

// routes.route('/signup', {
//   triggersEnter: [MustSignOut],
//   action: function (params, queryParams) {
//     this.render('layout', { page: 'accountSignup'})
//   },
// })

//FLOWROUTER GROUP USAGE