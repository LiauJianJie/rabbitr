if (Meteor.isClient) {
  
  var ITEMS_INCREMENT = 25;
  Session.setDefault("tweetsLimit", ITEMS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe("tweets", Session.get("tweetsLimit"));
  });

  var checkAndUpdatePost = function() {
    var removeLinebreaksAndAutosize = function() {
      var composeText = $("#tweet-compose-field").val();
      composeText = composeText.replace(/(\r\n|\n|\r)/gm," ");
      $("#tweet-compose-field").val(composeText);
      $("#tweet-compose-field").autosize();
    };

    removeLinebreaksAndAutosize();
    var charactersRemaining = 140-event.target.value.length;
    if (charactersRemaining > 1 || charactersRemaining === 0)
      $("#tweet-compose-charcount").html(charactersRemaining +
                                         " characters remaining...");
    else if (charactersRemaining === 1)
      $("#tweet-compose-charcount").html("1 character remaining...");
    else if (charactersRemaining < -1)
      $("#tweet-compose-charcount").html(-charactersRemaining +
                                         " characters too many...");
    else
      $("#tweet-compose-charcount").html("1 character too many...");

    if (charactersRemaining < 0)
    {
      $("#tweet-compose-fieldgroup").addClass("has-error");
      $("#tweet-compose-charcount").addClass("text-danger");
      $("#tweet-compose-charcount").removeClass("text-muted");
      $("#tweet-compose-submit").attr("disabled","disabled");
    }
    else if (charactersRemaining === 140)
      $("#tweet-compose-submit").attr("disabled","disabled");
    else
    {
      $("#tweet-compose-fieldgroup").removeClass("has-error");
      $("#tweet-compose-charcount").removeClass("text-danger");
      $("#tweet-compose-charcount").addClass("text-muted");
      $("#tweet-compose-submit").removeAttr("disabled","disabled");
    }
  };

  Template.home.helpers({
    tweets: function() {
      return Tweets.find({}, {sort: {createdAt: -1}, limit:Session.get("tweetsLimit")});
    },
    tweetCount: function() {
      return Counts.get("tweetCounter");
    },
    notificationCount: function() {
      return Counts.get("notificationCounter");
    },
    userCount: function() {
      return Counts.get("accountCounter");
    },
    moreResults: function() {
      console.log(Tweets.find().count() + " vs " + Session.get("tweetsLimit"));
      return (Tweets.find().count() >= Session.get("tweetsLimit"));
    }
  });

  var loadTweet = function() {
    var ITEMS_INCREMENT = 25;
    Session.set("tweetsLimit",
      Session.get("tweetsLimit") + ITEMS_INCREMENT);
  };

  Template.home.events({
    "submit .new-tweet": function(event) {
      var text = event.target.text.value;
      if (text.length > 0)
      {
        Meteor.call("addTweet", text);
        event.target.text.value = "";
        $("#tweet-compose-charcount").html("140 characters remaining...");
        $("#tweet-compose-fieldgroup").removeClass("has-error");
        $("#tweet-compose-charcount").removeClass("text-danger");
        $("#tweet-compose-charcount").addClass("text-muted");
        $("#tweet-compose-submit").attr("disabled","disabled");
      }
      return false;
    },
    "keyup #tweet-compose-field, \
     keydown #tweet-compose-field, \
     keypress #tweet-compose-field": function (event) {
       if(event.which == '13') {
         $("#tweet-compose-submit").click();
         return false;
       }
      checkAndUpdatePost();
    },
    "click #loadpost-button": loadTweet
  });
}
