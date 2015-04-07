Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('home');
  SEO.set({ title: 'Rabbitr - ' + Meteor.App.NAME });
});
