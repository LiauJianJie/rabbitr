if (Meteor.isClient) {
  Template.home.helpers({
    tweetsForUsername: function(username) {
      return Tweets.find({username:username}, {sort: {createdAt: -1}, limit:Session.get("tweetsLimit")});
    }
  });
}
