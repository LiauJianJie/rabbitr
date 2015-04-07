if (Meteor.isClient) {
  $("#tweet-field").focus( function(){
    $("#tweet-field").attr("rows","3");
  });
  $("#tweet-field").blur( function(){
    if ($("#tweet-field").val().length)
      $("#tweet-field").attr("rows","1");
  });
}
