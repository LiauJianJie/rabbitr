Notifications = new Mongo.Collection("notifications");

if (Meteor.isClient) {
  Meteor.subscribe("notifications");
  Meteor.subscribe("notificationCounter");

  Template.registerHelper("notifications", function() {
    return Notifications.find({receipient:Meteor.userId()}, {sort: {createdAt: -1}});
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
    relativeDateForTweetId: function(createdAt){
      return moment(createdAt).fromNow();
    }
  });

  Template.table_notifications_mention.created = function() {
    Meteor.call("readAllNotifications");
  };
}

Meteor.methods({
  addNotificationForTweet: function(tweetId) {
    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    var tweet = Tweets.findOne({_id:tweetId});
    if (!tweet)
      throw new Meteor.Error("tweet-not-found");

    var splitTweet = tweet.text.split(" ");
    var sentList = [];
    _.each(splitTweet, function(string){
      if (string.charAt(0) === "@" && string.length > 1 &&
          sentList.indexOf(string) === -1 &&
          "@" + Meteor.user().username !== string)
        Meteor.call("addNotificationForTweetAndReceipient",{
          tweetId:      tweetId,
          receipientId: Meteor.users.findOne({username:string.substring(1)})._id
        });
        sentList.push(string);
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
    Notifications.update({receipient:Meteor.userId(),read:false},
                         {$set: {read:true}},
                         {multi: true});
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
    return Notifications.find({});
  });
  Meteor.publish("notificationCounter", function() {
    Counts.publish(this, "notificationCounter", Notifications.find());
  });
}
