Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/i/notifications', function () {
  this.render('notifications');
});

Router.route('/i/messages', function () {
  this.render('messages');
});

Router.route('/i/settings', function () {
  this.render('settings');
});
