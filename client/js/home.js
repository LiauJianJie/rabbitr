if (Meteor.isClient) {
  Template.home.events({
    "submit .new-tweet": function(event) {
      var text = event.target.text.value;
      if (text.length > 0)
      {
        Meteor.call("addTweet", text);
        event.target.text.value = "";
        $("#tweet-compose-field").autosize();
        // Template.home.call("keyup #tweet-compose-field")
      }
      return false;
    },
    "keyup #tweet-compose-field, \
     keydown #tweet-compose-field, \
     keypress #tweet-compose-field": function (event) {
      console.log(event);
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
    }
  });
}
