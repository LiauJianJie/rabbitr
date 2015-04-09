if (Meteor.isClient) {
  Meteor.subscribe("usernames");
  Meteor.subscribe("accountCounter");

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.publish("usernames", function() {
    return Meteor.users.find({});
  });
  Meteor.publish("accountCounter", function() {
    Counts.publish(this, "accountCounter", Meteor.users.find());
  });

  Accounts.validateNewUser(function (user) {
    if (!user.username || user.username.length < 3)
      throw new Meteor.Error(403, "Username must have at least 3 characters");
    if (!user.username || user.username.length > 16)
      throw new Meteor.Error(403, "Username can only contain a maximum of 16 characters");
    else if (!user.username.match(/^([A-Za-z]|[0-9]|_)+$/))
      throw new Meteor.Error(403, "Username can only contain alphanumeric \
                                   characters and underscores.");
    return true;
  });
}
