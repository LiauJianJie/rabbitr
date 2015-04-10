if (Meteor.isClient) {
  Template.profile.helpers({
    isUserForUsername: function(username) {
      // console.log(Meteor.user().username + " vs " + username);
      if (Meteor.user().username === username)
        return true;
      return false;
    },
    tweetsForUsername: function(username) {
      return Tweets.find({username:username}, {sort: {createdAt: -1}, limit:Session.get("tweetsLimit")});
    }
  });
}
