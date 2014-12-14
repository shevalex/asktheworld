
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

  $("#TopLevelToolbar-Profile").click(function(event) { 
    if (!($("#ModifyUserProfilePanel").is(":visible"))) {
      var userProfile = Backend.getUserProfile();
      $("#ModifyUserProfilePanel-Password").val(userProfile.password);
      $("#ModifyUserProfilePanel-RetypePassword").val(userProfile.password);
      $("#ModifyUserProfilePanel-Name").val(userProfile.name);
      $("#ModifyUserProfilePanel-Gender").val(userProfile.gender);
      $("#ModifyUserProfilePanel-AgeCategory").val(userProfile.age);
    }
    $("#ModifyUserProfilePanel").slideToggle("slow");
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

  $("#ModifyUserProfilePanel-Update").click(function(event) { 
    Application.updateProfile();
  });

  var hideListener = function(panelName, event) {
    var isEventTarget = function(container, event) {
      return container.is(event.target) || container.has(event.target).length > 0;
    }

    if (isEventTarget($("#TopLevelToolbar-Login"), event) || isEventTarget($("#TopLevelToolbar-Profile"), event)) {
      return;
    }

    var container = $(panelName);
    if (container.is(":visible")) {
      if (!isEventTarget(container, event)) {
        container.slideUp("fast");
      }
    }
  };

  $(document).mouseup(hideListener.bind(this, "#LoginPanel"));
  $(document).mouseup(hideListener.bind(this, "#RegisterUserPanel"));
  $(document).mouseup(hideListener.bind(this, "#ModifyUserProfilePanel"));
}


Application.signIn = function() {
  var email = $("#LoginPanel-Email").val();
  var password = $("#LoginPanel-Password").val();

  if (Backend.verifyUserIdentity(email, password)) {
    $("#TopLevelToolbar-UserName").text("Welcome, " + email);
    $("#LoginPanel").slideUp("fast");
    $("#TopLevelToolbar-Login").hide();
    $("#TopLevelToolbar-Profile").show();
  } else {
    //highlight incorect password
  }
}

Application.register = function() {
  var email = $("#RegisterUserPanel-Email").val();
  var password = $("#RegisterUserPanel-Password").val();
  var name = $("#RegisterUserPanel-Name").val();
  var gender = $("#RegisterUserPanel-Gender").val();
  var age = $("#RegisterUserPanel-AgeCategory").val();

  if (Backend.registerUser({"email": email, "password": password, "gender": gender, "age": age, "name": name})) {
    $("#RegisterUserPanel").slideUp("fast");
  } else {
    //indicate what is incorrect
  }
}

Application.updateProfile = function() {
  var password = $("#RegisterUserPanel-Password").val();
  var name = $("#RegisterUserPanel-Name").val();
  var gender = $("#RegisterUserPanel-Gender").val();
  var age = $("#RegisterUserPanel-AgeCategory").val();

  if (Backend.updateUser({"password": password, "gender": gender, "age": age, "name": name})) {
    $("#ModifyUserProfilePanel").slideUp("fast");
  } else {
    //indicate what is incorrect
  }
}
