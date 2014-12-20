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


  $("body").mouseup(function(event) {
    var isTargettedToContainer = function(container, event) {
      return container.is(event.target) || container.has(event.target).length > 0;
    }
    if (isTargettedToContainer($("#TopLevelToolbar-LoginButton"), event)
        || isTargettedToContainer($("#LoginPanel"), event)
        || isTargettedToContainer($("#RegisterPanel"), event)
        || isTargettedToContainer($("#UpdateProfilePanel"), event)) {
      return;
    }

    this.hidePanels();
  }.bind(this));
}

Toolbar.createLoginPanel = function() {
  var loginPanel = new PisoftInputPanel("LoginPanel");
  loginPanel.addPisoftInputComponent(new PisoftInputField("LoginPanel-Login"), "Login");
  loginPanel.addPisoftInputComponent(new PisoftInputPassword("LoginPanel-Password"), "Password");
  loginPanel.addPisoftComponent(new PisoftLabel("LoginPanel-StatusLabel"));
  var registerButton = new PisoftLinkButton("LoginPanel-RegisterButton", "Register");
  loginPanel.addLeftPisoftButton(registerButton);
  var performLoginButton = new PisoftButton("LoginPanel-LoginButton", "Sign In");
  loginPanel.addRightPisoftButton(performLoginButton);

  registerButton.setClickListener(function() {
    this.showPanel(this.registerPanel);
  }.bind(this));

  performLoginButton.setClickListener(this.signInUser.bind(this));

  return loginPanel;
}

Toolbar.createRegisterPanel = function() {
  var registerPanel = new PisoftInputPanel("RegisterPanel");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Login"), "Email (will be used to login)");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Name"), "Nick Name");
  registerPanel.addPisoftInputComponent(new PisoftDropList("RegisterPanel-Gender", ["Male", "Female"]), "Gender");
  registerPanel.addPisoftInputComponent(new PisoftDropList("RegisterPanel-AgeCategory", ["Child", "Teenager", "Young", "Adult", "Senior"]), "Age Category");
  registerPanel.addPisoftInputComponent(new PisoftInputField("RegisterPanel-Languages"), "Languages");
  registerPanel.addPisoftInputComponent(new PisoftInputPassword("RegisterPanel-Password"), "Password");
  registerPanel.addPisoftInputComponent(new PisoftInputPassword("RegisterPanel-RetypePassword"), "Retype Password");
  var performRegistrationButton = new PisoftButton("RegisterPanel-RegisterButton", "Register");
  registerPanel.addPisoftComponent(new PisoftLabel("RegisterPanel-StatusLabel"));
  registerPanel.addRightPisoftButton(performRegistrationButton);

  performRegistrationButton.setClickListener(this.registerUser.bind(this));

  return registerPanel;
}

Toolbar.createUpdateProfilePanel = function() {
  var updateProfilePanel = new PisoftInputPanel("UpdateProfilePanel");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-Name"), "Nick Name");
  updateProfilePanel.addPisoftInputComponent(new PisoftDropList("UpdateProfilePanel-Gender", ["Male", "Female"]), "Gender");
  updateProfilePanel.addPisoftInputComponent(new PisoftDropList("UpdateProfilePanel-AgeCategory", ["Child", "Teenager", "Young", "Adult", "Senior"]), "Age Category");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputField("UpdateProfilePanel-Languages"), "Languages");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputPassword("UpdateProfilePanel-Password"), "Password");
  updateProfilePanel.addPisoftInputComponent(new PisoftInputPassword("UpdateProfilePanel-RetypePassword"), "Retype Password");
  updateProfilePanel.addPisoftComponent(new PisoftLabel("UpdateProfilePanel-StatusLabel"));

  var performUpdateButton = new PisoftButton("UpdateProfilePanel-UpdateButton", "Update");
  updateProfilePanel.addRightPisoftButton(performUpdateButton);

  performUpdateButton.setClickListener(this.updateUser.bind(this));

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



Toolbar.signInUser = function() {
  var login = $("#LoginPanel-Login").val();
  var password = $("#LoginPanel-Password").val();

  var callback = {
    success: function() {
      this.hidePanels();
      this.toolbarLoginButton.setText("Profile");
      this.toolbarLoggedUserLabel.setText("Welcome, " + Backend.getUserProfile().name);
      $("#LoginPanel-StatusLabel").text("");

      this.toolbarLoginButton.setClickListener(function() {
        this.showPanel(this.updateProfilePanel);
      }.bind(this));
    }.bind(this),
    failure: function() {
      $("#LoginPanel-StatusLabel").text("Invalid user name / password");
    }.bind(this),
    error: function() {
      $("#LoginPanel-StatusLabel").text("Server communication error");
    }.bind(this)
  };

  Backend.logIn(login, password, callback);
}

Toolbar.registerUser = function() {
  var login = $("#RegisterPanel-Login").val();
  var password = $("#RegisterPanel-Password").val();
  var name = $("#RegisterPanel-Name").val();
  var gender = $("#RegisterPanel-Gender").val();
  var age = $("#RegisterPanel-AgeCategory").val();

  var callback = {
    success: function() {
      $("#RegisterPanel-StatusLabel").text("Account created! Login now");
      setTimeout(Toolbar.hidePanels.bind(Toolbar), 1000);
    },
    conflict: function() {
      $("#RegisterPanel-StatusLabel").text("User with such name already exists");
    },
    error: function() {
      $("#RegisterPanel-StatusLabel").text("Account cannot be created");
    }
  };

  Backend.registerUser({"login": login, "password": password, "gender": gender, "age": age, "name": name}, callback);
}

Toolbar.updateUser = function() {
  var password = $("#UpdateProfilePanel-Password").val();
  var name = $("#UpdateProfilePanel-Name").val();
  var gender = $("#UpdateProfilePanel-Gender").val();
  var age = $("#UpdateProfilePanel-AgeCategory").val();

  var callback = {
    success: function() {
      $("#UpdateProfilePanel-StatusLabel").text("Successfully updated");
      setTimeout(Toolbar.hidePanels.bind(Toolbar), 1000);
    },
    failure: function() {
      $("#UpdateProfilePanel-StatusLabel").text("Incorrect user settings");
    },
    error: function() {
      $("#UpdateProfilePanel-StatusLabel").text("Account cannot be updated");
    }
  };

  Backend.updateUser({"password": password, "gender": gender, "age": age, "name": name}, callback);
}

