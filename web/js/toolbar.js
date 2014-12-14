var Toolbar = {};

Toolbar.initialize = function() {
  $("body").html(this.getToolbarHtml());

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

  $("#LoginPanel-SignIn").click(function(event) { 
    Toolbar.signIn();
  });

  $("#RegisterUserPanel-Register").click(function(event) { 
    Toolbar.register();
  });

  $("#ModifyUserProfilePanel-Update").click(function(event) { 
    Toolbar.updateProfile();
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



Toolbar.signIn = function() {
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

Toolbar.register = function() {
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

Toolbar.updateProfile = function() {
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



Toolbar.getToolbarHtml = function() {
  return "<div id='TopLevelToolbar'>"
         + "<div id='TopLevelToolbar-Left'>"
         +   this.getToolbarButtonHtml("Button1")
         +   this.getToolbarButtonHtml("Button2")
         +   this.getToolbarButtonHtml("Button3")
         + "</div> \
           <div id='TopLevelToolbar-Right'>"
         +   this.getLoggedUserHtml()
         +   this.getToolbarButtonHtml("Login")
         +   this.getToolbarButtonHtml("Profile", false)
         + "</div>"
         +  this.getLoginPanelHtml()
         +  this.getRegisterUserPanelHtml()
         +  this.getModifyUserProfilePanelHtml()
         + "</div>";
}

Toolbar.getToolbarButtonHtml = function(buttonName, visible, displayText) {
  return "<button id='TopLevelToolbar-" + buttonName + "' class='topleveltoolbar-button' "
         + "style='display:" + (visible != null && visible == false ? "none" : "inline") + ";'>" + (displayText ? displayText : buttonName) + "</button>";
};

Toolbar.getLoggedUserHtml = function() {
  return "<label id='TopLevelToolbar-UserName'>Not Signed</label>";
};

Toolbar.getPanelButtonHtml = function(panelName, buttonName, displayText) {
  return "<button id='" + panelName + "-" + buttonName + "' class='panel-button'>" + (displayText ? displayText : buttonName) + "</button>";
}

Toolbar.getLoginPanelHtml = function() {
  return "<div id='LoginPanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("LoginPanel", "Email")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("LoginPanel", "Password")
         +   "<div class='panel-left'> \
                <a href='#' id='LoginPanel-Register'>Register</a> \
              </div> \
              <div class='panel-right'>"
              +   this.getPanelButtonHtml("LoginPanel", "SignIn", "Sign In")
              + "</div> \
             </div>";
}

Toolbar.getPanelLabbeledInputHtml = function(panelName, labelName) {
  return "<label>" + labelName + "</label> \
          <input type='text' id='" + panelName + "-" + labelName + "' class='text panel-input ui-widget-content ui-corner-all'>";
}

Toolbar.getPanelLabbeledDropListHtml = function(panelName, labelName, options) {
  var result = "<label>" + labelName + "</label> \
                <select id='" + panelName + "-" + labelName + "' class='panel-input ui-corner-all'>";

  for (var index in options) {
    result += "<option>" + options[index] + "</option>";
  }

  result += "</select>";

  return result;
}

Toolbar.getRegisterUserPanelHtml = function() {
  return "<div id='RegisterUserPanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Email")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Name")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Gender")
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("RegisterUserPanel", "Gender", ["Male", "Female"])
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("RegisterUserPanel", "AgeCategory", ["Teenager", "Young", "Adult", "Senior"])
         +   "<p> \
             <br> \
             <p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Password")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "RetypePassword")
         +   "<p>"
         +   "<div class='panel-right'>"
         +     this.getPanelButtonHtml("RegisterUserPanel", "Register")
         +   "</div> \
           </div>";
}

Toolbar.getModifyUserProfilePanelHtml = function() {
  return "<div id='ModifyUserProfilePanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Name")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Gender")
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("ModifyUserProfilePanel", "Gender", ["Male", "Female"])
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("ModifyUserProfilePanel", "AgeCategory", ["Teenager", "Young", "Adult", "Senior"])
         +   "<p> \
             <br> \
             <p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Password")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "RetypePassword")
         +   "<p>"
         +   "<div class='panel-right'>"
         +     this.getPanelButtonHtml("ModifyUserProfilePanel", "Update")
         +   "</div> \
           </div>";
}

