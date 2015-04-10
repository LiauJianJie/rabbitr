if (Meteor.isClient) {
  Template.profile.helpers({
    isUserForUsername: function(username) {
      // console.log(Meteor.user().username + " vs " + username);
      if (Meteor.user().username === username)
        return true;
      return false;
    },
    tweetsbyCurrentUser: function(username) {
      return Tweets.find({username:username}, {sort: {createdAt: -1}, limit:Session.get("tweetsLimit")});
    }
  });

  var loadTweet = function() {
    var ITEMS_INCREMENT = 25;
    Session.set("tweetsLimit",
      Session.get("tweetsLimit") + ITEMS_INCREMENT);
  };

  Template.profile.events({
    "click #loadpost-button": loadTweet
  })
}
