
var Application = {};

Application.start = function() {
  this.initializeToolbar();
}


Application.initializeToolbar = function() {
  $(".topleveltoolbar-button").button();
  $(".panel-button").button();

  $("#TopLevelToolbar-Login").click(function(event) { 
    $("#RegisterUserPanel").slideUp("fast", function() {
      $("#LoginPanel").slideToggle("slow");
    });
  });

  $("#LoginPanel-Register").click(function(event) { 
    $("#LoginPanel").slideUp("fast", function() {
      $("#RegisterUserPanel").slideDown("slow");
    });
  });

  $("#LoginPanel-Login").click(function(event) { 
    Application.signIn();
  });

  $("#RegisterUserPanel-Create").click(function(event) { 
    Application.register();
  });

  var hideListener = function(panelName, event) {
    var container = $("#" + panelName);
    if (container.is(":visible")) {
      if (!container.is(event.target) && container.has(event.target).length === 0) {
        container.slideUp("fast");
      }
    }
  };

  $(document).mouseup(hideListener.bind(this, "LoginPanel"));
  $(document).mouseup(hideListener.bind(this, "RegisterUserPanel"));
}


Application.signIn = function() {
  var email = $("#LoginPanel-Email").val();
  var password = $("#LoginPanel-Password").val();

  if (Backend.verifyUserIdentity(email, password)) {
    $("#LoginPanel").slideUp("fast");
  } else {
    //highlight incorect password
  }
}

Application.register = function() {
  var email = $("#RegisterUserPanel-Email").val();
  var password = $("#RegisterUserPanel-Password").val();
  var gender = $("#RegisterUserPanel-Gender").val();

  if (Backend.verifyUserIdentity(email, password, gender)) {
    $("#RegisterUserPanel").slideUp("fast");
  } else {
    //indicate what is incorrect
  }
}
