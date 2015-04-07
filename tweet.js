Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {

  Meteor.subscribe("tweets");

  Template.body.helpers({
    tweets: function () {
      return Tweets.find({});
    }
  });

  Template.body.events({
    "submit .new-tweet": function (event) {
      console.log(event.target.text.value);
      var text = event.target.text.value;
      Meteor.call("addTweet", text);
      event.target.text.value = "";
      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTweet: function (text) {
    // Make sure the user is logged in before inserting a tweet
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tweets.insert({
      owner: Meteor.userId(),
      username: Meteor.user().username,
      text: text,
      createdAt: new Date()
    });
  },
  deleteTweet: function (tweetId) {
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
  Meteor.publish("tweets", function () {
    return Tweets.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}
