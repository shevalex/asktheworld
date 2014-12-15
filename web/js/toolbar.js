var Toolbar = {};

Toolbar.initialize = function() {
  $("#TopLevelToolbar").addClass("ui-widget-header").addClass("ui-corner-all");
  $("#TopLevelToolbar").html(this.getToolbarHtml());
  $(".panel-button").button();

  this.setupLoginAndRegistrationListeners();
  this.setupToolbarButtonListeners();
}

Toolbar.setupToolbarButtonListeners = function() {
  $("#TopLevelToolbar-Home").click(function(event) {
    HomePanel.show();    
  });
}

Toolbar.setupLoginAndRegistrationListeners = function() {
  $("#TopLevelToolbar-Login").click(function(event) {
    $("#RegisterUserPanel").slideUp("fast", function() {
      $("#LoginPanel-Status").text("");
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
      $("#RegisterUserPanel-Status").text("");
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

  $("body").mouseup(hideListener.bind(this, "#LoginPanel"));
  $("body").mouseup(hideListener.bind(this, "#RegisterUserPanel"));
  $("body").mouseup(hideListener.bind(this, "#ModifyUserProfilePanel"));
}


Toolbar.signIn = function() {
  var email = $("#LoginPanel-Email").val();
  var password = $("#LoginPanel-Password").val();

  var callback = {
    success: function() {
      $("#TopLevelToolbar-UserName").text("Welcome, " + email);
      $("#LoginPanel").slideUp("fast");
      $("#TopLevelToolbar-Login").hide();
      $("#TopLevelToolbar-Profile").show();
    },
    failure: function() {
      $("#LoginPanel-Password").addClass("input-error");
    },
    error: function() {
      $("#LoginPanel-Status").text("Server communication error");
    }
  };

  Backend.verifyUserIdentity(email, password, callback);
}

Toolbar.register = function() {
  var email = $("#RegisterUserPanel-Email").val();
  var password = $("#RegisterUserPanel-Password").val();
  var name = $("#RegisterUserPanel-Name").val();
  var gender = $("#RegisterUserPanel-Gender").val();
  var age = $("#RegisterUserPanel-AgeCategory").val();

  var callback = {
    success: function() {
      $("#RegisterUserPanel").slideUp("fast");
    },
    conflict: function() {
      $("#RegisterUserPanel-Status").text("User with such name already exists");
    },
    error: function() {
      $("#RegisterUserPanel-Status").text("Server communication error");
    }
  };

  Backend.registerUser({"email": email, "password": password, "gender": gender, "age": age, "name": name}, callback);
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
  return   "<div id='TopLevelToolbar-Left'>"
         +   this.getToolbarButtonHtml("Home")
         +   this.getToolbarButtonHtml("Huy", true, "Huy Znaet Chto")
         +   this.getToolbarButtonHtml("ContactUs", true, "Contact Us")
         + "</div> \
           <div id='TopLevelToolbar-Right'>"
         +   this.getLoggedUserHtml()
         +   this.getToolbarButtonHtml("Login")
         +   this.getToolbarButtonHtml("Profile", false)
         + "</div>"
         +  this.getLoginPanelHtml()
         +  this.getRegisterUserPanelHtml()
         +  this.getModifyUserProfilePanelHtml(); 
}

Toolbar.getToolbarButtonHtml = function(buttonName, visible, displayText) {
/*
  return "<button id='TopLevelToolbar-" + buttonName + "' class='topleveltoolbar-button' "
         + "style='display:" + (visible != null && visible == false ? "none" : "inline") + ";'>" + (displayText ? displayText : buttonName) + "</button>";
*/
  return "<label id='TopLevelToolbar-" + buttonName + "' class='topleveltoolbar-button' "
         + "style='display:" + (visible != null && visible == false ? "none" : "inline") + ";'>" + (displayText ? displayText : buttonName) + "</label>";

};

Toolbar.getLoggedUserHtml = function() {
  return "<label id='TopLevelToolbar-UserName'>Not Signed</label>";
};

Toolbar.getPanelButtonHtml = function(panelName, buttonName, displayText) {
  return "<button id='" + panelName + "-" + buttonName + "' class='panel-button'>" + (displayText ? displayText : buttonName) + "</button>";
}

Toolbar.getPanelLabbeledInputHtml = function(panelName, labelName, displayName) {
  return "<label>" + (displayName ? displayName : labelName) + "</label> \
          <input type='text' id='" + panelName + "-" + labelName + "' class='text panel-input ui-widget-content ui-corner-all'>";
}

Toolbar.getPanelLabbeledDropListHtml = function(panelName, labelName, options, displayName) {
  var result = "<label>" + (displayName ? displayName : labelName) + "</label> \
                <select id='" + panelName + "-" + labelName + "' class='panel-input ui-corner-all'>";

  for (var index in options) {
    result += "<option>" + options[index] + "</option>";
  }

  result += "</select>";

  return result;
}


Toolbar.getLoginPanelHtml = function() {
  return "<div id='LoginPanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("LoginPanel", "Email")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("LoginPanel", "Password")
         +   "<p> \
             <label id='LoginPanel-Status' class='input-error panel-input'></label> \
             <div class='panel-left'> \
               <a href='#' id='LoginPanel-Register'>Register</a> \
             </div> \
             <div class='panel-right'>"
             +   this.getPanelButtonHtml("LoginPanel", "SignIn", "Sign In")
           + "</div> \
          </div>";
}

Toolbar.getRegisterUserPanelHtml = function() {
  return "<div id='RegisterUserPanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Email", "Email (Login)")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Name", "Nick Name")
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("RegisterUserPanel", "Gender", ["Male", "Female"])
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("RegisterUserPanel", "AgeCategory", ["Teenager", "Young", "Adult", "Senior"], "Age Category")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Languages")
         +   "<p> \
             <br> \
             <p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "Password")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("RegisterUserPanel", "RetypePassword", "Retype Password")
         +   "<p>"
         +   "<div class='panel-left'> \
               <label id='RegisterUserPanel-Status' class='input-error'></label> \
              </div> \
              <div class='panel-right'>"
         +     this.getPanelButtonHtml("RegisterUserPanel", "Register")
         +   "</div> \
           </div>";
}

Toolbar.getModifyUserProfilePanelHtml = function() {
  return "<div id='ModifyUserProfilePanel' class='ui-widget-content ui-corner-all'>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Name")
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("ModifyUserProfilePanel", "Gender", ["Male", "Female"])
         +   "<p>"
         +   this.getPanelLabbeledDropListHtml("ModifyUserProfilePanel", "AgeCategory", ["Teenager", "Young", "Adult", "Senior"], "Age Category")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Languages")
         +   "<p> \
             <br> \
             <p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "Password")
         +   "<p>"
         +   this.getPanelLabbeledInputHtml("ModifyUserProfilePanel", "RetypePassword", "Retype Password")
         +   "<p>"
         +   "<div class='panel-right'>"
         +     this.getPanelButtonHtml("ModifyUserProfilePanel", "Update")
         +   "</div> \
           </div>";
}

