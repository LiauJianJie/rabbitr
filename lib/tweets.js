Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
  Meteor.subscribe("tweets");
  Meteor.subscribe("tweetCounter");

  Template.registerHelper("relativeTimeForDate", function(date) {
    return moment(date).fromNow();
  });
  Template.registerHelper("usernameForUserId", function(userId) {
    return Meteor.users.findOne({_id:userId});
  });
}

Meteor.methods({
  addTweet: function(text) {
    // Make sure the user is logged in before inserting a tweet
    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    if (text.length > 140)
      throw new Meteor.Error("tweet-too-long");

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
    return Tweets.find({});
  });
  Meteor.publish("tweetCounter", function() {
    Counts.publish(this, "tweetCounter", Tweets.find());
  });
}
