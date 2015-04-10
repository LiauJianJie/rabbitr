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

Router.route('/:username', function () {
  var item = Meteor.users.findOne({username: this.params.username});
  // this.wait(Meteor.subscribe('users', this.params.username));
  // if (this.ready()) {
    this.render('profile', {data: item});
  // }
});
