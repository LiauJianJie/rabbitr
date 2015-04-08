if (Meteor.isClient) {
  Meteor.subscribe("usernames");
}

if (Meteor.isServer) {
  Meteor.publish("usernames", function() {
    return Meteor.users.find({});
  });
}
