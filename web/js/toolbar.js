var Toolbar = {
  loginPanel: null,
  registerPanel: null,
  updateProfilePanel: null,
  toolbarLoginButton: null,
  toolbarLoggedUserLabel: null
};

Toolbar.initialize = function() {
  var psToolbar = new PisoftToolbar("TopLevelToolbar", "10px");

  var requestsButton = new PisoftButton("TopLevelToolbar-RequestsButton", "My Requests");
  psToolbar.addPisoftComponent(requestsButton);

  var inquiriesButton = new PisoftButton("TopLevelToolbar-InquiriesButton", "World's Inquiries");
  psToolbar.addPisoftComponent(inquiriesButton);

  var contactUsButton = new PisoftButton("TopLevelToolbar-ContactUsButton", "Contact Us");
  psToolbar.addPisoftComponent(contactUsButton);

  this.toolbarLoggedUserLabel = new PisoftLabel("TopLevelToolbar-LoggedUserLabel", "Not Signed");
  psToolbar.addSidePisoftComponent(this.toolbarLoggedUserLabel);

  this.toolbarLoginButton = new PisoftButton("TopLevelToolbar-LoginButton", "Login");
  psToolbar.addSidePisoftComponent(this.toolbarLoginButton);


  this.loginPanel = this.createLoginPanel();
  this.registerPanel = this.createRegisterPanel();
  this.updateProfilePanel = this.createUpdateProfilePanel();

  psToolbar.attachToContainer("ToolbarArea");


  // Listeners

  this.toolbarLoginButton.setClickListener(function() {
    this.showPanel(this.loginPanel);
  }.bind(this));


  $("body").mouseup(function() {
    var isEventTarget = function(container, event) {
      return container.is(event.target) || container.has(event.target).length > 0;
    }

    if (isEventTarget($("#TopLevelToolbar-LoginButton"), event)) {
      return;
    }

    this.hidePanels();
  }.bind(this));
}

Toolbar.createLoginPanel = function() {
  var loginPanel = new PisoftInputPanel("LoginPanel");
  loginPanel.addPisoftInputComponent(new PisoftInputField("LoginPanel-Login"), "Login");
  loginPanel.addPisoftInputComponent(new PisoftInputPassword("LoginPanel-Password"), "Password");
  var registerButton = new PisoftLinkButton("LoginPanel-RegisterButton", "Register");
  loginPanel.addLeftPisoftButton(registerButton);
  var performLoginButton = new PisoftButton("LoginPanel-LoginButton", "Sign In");
  loginPanel.addRightPisoftButton(performLoginButton);

  registerButton.setClickListener(function() {
    this.showPanel(this.registerPanel);
  }.bind(this));

  performLoginButton.setClickListener(function() {
    this.hidePanels();
    this.toolbarLoginButton.setText("Profile");
    this.toolbarLoggedUserLabel.setText("Welcome, user");

    this.toolbarLoginButton.setClickListener(function() {
      this.showPanel(this.updateProfilePanel);
    }.bind(this));
  }.bind(this));

  return loginPanel;
}

Toolbar.createRegisterPanel = function() {
  var registerPanel = new PisoftInputPanel("RegisterPanel");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Login"), "Email (will be used to login)");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Name"), "Nick Name");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Gender"), "Gender");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-AgeCategory"), "Age Category");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Languages"), "Languages");
  registerPanel.addPisoftInputComponent(new PisoftInputPassword("RegisterPanel-Password"), "Password");
  registerPanel.addPisoftInputComponent(new PisoftInputPassword("RegisterPanel-RetypePassword"), "Retype Password");
  var performRegistrationButton = new PisoftButton("RegisterPanel-RegisterButton", "Register");
  registerPanel.addRightPisoftButton(performRegistrationButton);

  performRegistrationButton.setClickListener(function() {
    this.hidePanels();
  }.bind(this));

  return registerPanel;
}

Toolbar.createUpdateProfilePanel = function() {
  var updateProfilePanel = new PisoftInputPanel("UpdateProfilePanel");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-Name"), "Nick Name");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-Gender"), "Gender");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-AgeCategory"), "Age Category");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-Languages"), "Languages");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputPassword("UpdateProfilePanel-Password"), "Password");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputPassword("UpdateProfilePanel-RetypePassword"), "Retype Password");
  var performUpdateButton = new PisoftButton("UpdateProfilePanel-UpdateButton", "Update");
  updateProfilePanel.addRightPisoftButton(performUpdateButton);

  performUpdateButton.setClickListener(function() {
    this.hidePanels();
  }.bind(this));

  return updateProfilePanel;
}


Toolbar.showPanel = function(pisoftPanel, callback) {
  var panelToRemove = null;
  if (this.loginPanel.isAttached()) {
    panelToRemove = this.loginPanel;
  } else if (this.registerPanel.isAttached()) {
    panelToRemove = this.registerPanel;
  } else if (this.updateProfilePanel.isAttached()) {
    panelToRemove = this.updateProfilePanel;
  }

  if (panelToRemove == pisoftPanel) {
    if (callback != null) {
      callback();
    }
    return;
  }

  var showPanel = function() {
    if (pisoftPanel != null) {
      pisoftPanel.attachToContainer("ToolbarArea");
      $("#" + pisoftPanel.getId()).slideDown("slow", callback);
    }
  }

  if (panelToRemove != null) {
    $("#" + panelToRemove.getId()).slideUp("fast", function() {
      panelToRemove.detachFromContainer();
      showPanel();
    });
  } else {
    showPanel();
  }
}

Toolbar.hidePanels = function() {
  this.showPanel(null);
}


/*

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
*/
