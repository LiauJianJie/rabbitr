Notifications = new Mongo.Collection("notifications");

if (Meteor.isClient) {
  Meteor.subscribe("notifications");
  Meteor.subscribe("notifications-count");

  Template.registerHelper("notifications", function() {
    return Notifications.find({}, {sort: {createdAt: -1}});
  });
  Template.registerHelper("notificationsUnreadCount", function() {
    return Notifications.find({receipient:Meteor.userId(),read:false}).count();
  });

  Template.table_notifications_mention.helpers({
    usernameForUserId: function(userId){
      return Meteor.users.findOne({_id:userId}).username;
    },
    tweetTextForTweetId: function(tweetId){
      return Tweets.findOne({_id:tweetId}).text;
    },
    relativeDateForTweetId: function(tweetId){
      return moment(Tweets.findOne({_id:tweetId}).date).fromNow();
    }
  });

  Template.home.events({
  });

  // Meteor.call("readAllNotifications");
}

Meteor.methods({
  addNotificationForTweet: function(tweetId) {
    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    var tweet = Tweets.findOne({_id:tweetId});
    if (!tweet)
      throw new Meteor.Error("tweet-not-found");

    var splitTweet = tweet.text.split(" ");
    _.each(splitTweet, function(string){
      if (string.charAt(0) === "@" && string.length > 1)
        Meteor.call("addNotificationForTweetAndReceipient",{
          tweetId:      tweetId,
          receipientId: Meteor.users.findOne({username:string.substring(1)})._id
        });
    });
  },
  addNotificationForTweetAndReceipient: function(notificationData) {
    var tweetId =      notificationData.tweetId;
    var receipientId = notificationData.receipientId;

    if (!Meteor.users.findOne({_id:receipientId}))
      throw new Meteor.Error("user-not-found");

    var notification = Notifications.insert({
      sender:     Meteor.userId(),
      receipient: receipientId,
      type:       "mention",
      tweet:      tweetId,
      read:       false,
      createdAt:  new Date()
    });
  },
  readAllNotifications: function() {
    Notifications.update({read:false}, {$set: {read:true}});
  },
  readNotification: function(notificationId) {
    var notification = Notifications.findOne(notificationId);
    if (tweet.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized");

    Notifications.update(notificationId, {$set: {read:true}});
  }
});

if (Meteor.isServer) {
  // Only publish tweets that are public or belong to the current user
  Meteor.publish("notifications", function() {
    return Notifications.find({$or: [{ receipient: this.userId }]});
  });
}
