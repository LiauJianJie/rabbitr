if (Meteor.isClient) {

  // Template.profile.onRendered(function() {
  //   var ITEMS_INCREMENT = 25;
  //   Session.setDefault("tweetsLimit", ITEMS_INCREMENT);
  //   Deps.autorun(function() {
  //     console.log("SUBSCRIBE username: " + username + ", limit: " + Session.get("tweetsLimit"));
  //     Meteor.subscribe("tweetsForUsername",username,Session.get("tweetsLimit"));
  //   });
  // });

  Template.profile.helpers({
    isUserForUsername: function(username) {
      if (Meteor.user().username === username)
        return true;
      return false;
    },
    tweetsbyCurrentUser: function(username) {
      return Tweets.find({username:username}, {sort: {createdAt: -1}, limit:Session.get("tweetsLimit")});
    },
    moreResultsForUsername: function(username) {
      console.log(Tweets.find({username:username}).count() + " vs " + Session.get("tweetsLimit"));
      return (Tweets.find({username:username}).count() >= Session.get("tweetsLimit"));
    }
  });

  var loadTweet = function() {
    var ITEMS_INCREMENT = 25;
    Session.set("tweetsLimit",
      Session.get("tweetsLimit") + ITEMS_INCREMENT);
  };

  Template.profile.events({
    "click #loadpost-button": loadTweet
  });
}
