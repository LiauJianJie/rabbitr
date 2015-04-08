Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
  Meteor.subscribe("tweets");

  Template.registerHelper("relativeTimeForDate", function(date) {
    return moment(date).fromNow();
  });
  Template.registerHelper("usernameForUserId", function(userId) {
    return Meteor.users.findOne({_id:userId});
  });

  Template.home.helpers({
    tweets: function() {
      // var retrievedTweets = Tweets.find({}, {sort: {createdAt: -1}});
      // console.log(retrievedTweets);
      return Tweets.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.home.events({
    "submit .new-tweet": function(event) {
      var text = event.target.text.value;
      if (text.length > 0)
      {
        Meteor.call("addTweet", text);
        event.target.text.value = "";
        $("#tweet-compose-field").autosize();
      }
      return false;
    }
  });
}

Meteor.methods({
  addTweet: function(text) {
    // Make sure the user is logged in before inserting a tweet
    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    var tweetId = Tweets.insert({
      owner:     Meteor.userId(),
      username:  Meteor.user().username,
      text:      text,
      createdAt: new Date()
    });
    Meteor.call("addNotificationForTweet",tweetId);
  },
  deleteTweet: function(tweetId) {
    var tweet = Tweets.findOne(tweetId);
    if (tweet.owner !== Meteor.userId()) {
      // If the tweet is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tweets.remove(tweetId);
  }

});

if (Meteor.isServer) {
  // Only publish tweets that are public or belong to the current user
  Meteor.publish("tweets", function() {
    return Tweets.find({
      $or: [
        { owner: this.userId }
      ]
    });
  });
}
