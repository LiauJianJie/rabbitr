Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
  // Meteor.subscribe("tweets");
  Meteor.subscribe("tweetCounter");

  var ITEMS_INCREMENT = 25;
  Session.setDefault("tweetsLimit", ITEMS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe("tweets", Session.get("tweetsLimit"));
  });

  Template.registerHelper("relativeTimeForDate", function(date) {
    return moment(date).fromNow();
  });
  Template.registerHelper("usernameForUserId", function(userId) {
    return Meteor.users.findOne({_id:userId});
  });
  Template.registerHelper("formattedTweetText", function(text) {
    text = text.replace(/@(\w+)/g, "<a href='/$1' target='_blank'>$&</a>");
    text = text.replace(/#(\w+)/g, "<span class='text-info'>$&</span>");
    return text;
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
  Meteor.publish("tweets", function(limit) {
    return Tweets.find({}, { sort:{createdAt:-1}, limit:limit });
  });
  Meteor.publish("tweetCounter", function() {
    Counts.publish(this, "tweetCounter", Tweets.find());
  });
}
