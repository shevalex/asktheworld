UserProfilePage = ClassUtils.defineClass(AbstractPage, function UserProfilePage() {
  AbstractPage.call(this, "UserProfilePage");
});

UserProfilePage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("UserProfilePage-GeneralPanel"));
  $("#UserProfilePage-GeneralPanel").html("Update your profile information. <b>We intentionally keep it very basic and generic to insure your privacy</b>.<br>You may only modify the information which you need to correct. Do not change anything (inlcuding password) that does not require correction.");
  
  root.appendChild(this._createProfilePanel());
  
  root.appendChild(this._createControlPanel());

  root.appendChild(UIUtils.createBlock("UserProfilePage-StatusPanel"));
  
  $("#UserProfilePage-Password").on("input", function() {
    $("#UserProfilePage-RetypePassword").val("");
  });
  
  $("#UserProfilePage-ControlPanel-ResetButton").click(this._resetParameters.bind(this));

  $("#UserProfilePage-ControlPanel-UpdateButton").click(function() {
    $("#UserProfilePage-StatusPanel").text("");
    
    var name = $("#UserProfilePage-Name").val();
    if (name == "") {
      UIUtils.indicateInvalidInput("UserProfilePage-Name");
    }
    
    var languages = $("#UserProfilePage-Languages").val();
    if (languages == "") {
      UIUtils.indicateInvalidInput("UserProfilePage-Languages");
    }

    var password = $("#UserProfilePage-Password").val();
    if (password == "") {
      UIUtils.indicateInvalidInput("UserProfilePage-Password");
    }
    
    var retypePassword = $("#UserProfilePage-RetypePassword").val();
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput("UserProfilePage-RetypePassword");
    }

    if (name != "" && languages != "" && password != "" && password == retypePassword) {
      this._updateUserProfile();
    } else if (password == retypePassword) {
      $("#UserProfilePage-StatusPanel").text("You cannot have empty fields.");
    } else {
      $("#UserProfilePage-StatusPanel").text("Passwords do not match. Please retype.");
    }
  }.bind(this));
  
}

UserProfilePage.prototype.onShow = function() {
  this._resetParameters();
}



UserProfilePage.prototype._createProfilePanel = function() {
  var contentPanel = UIUtils.createBlock("UserProfilePage-ParametersPanel");
  
  contentPanel.appendChild(UIUtils.createLabeledTextInput("UserProfilePage-Name", "Your Nick Name", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserProfilePage-Gender", "Your Gender", Application.Configuration.GENDERS, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserProfilePage-AgeCategory", "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledTextInput("UserProfilePage-Languages", "Languages that you speak", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("UserProfilePage-Password", "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("UserProfilePage-RetypePassword", "Re-type Password", "10px"));

  return contentPanel;
}

UserProfilePage.prototype._createControlPanel = function() {
  var controlPanel = UIUtils.createBlock("UserProfilePage-ControlPanel");
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton("UserProfilePage-ControlPanel-UpdateButton", "Update Profile"));
  controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createLink("UserProfilePage-ControlPanel-ResetButton", "Reset"));
  
  return controlPanel;
}

UserProfilePage.prototype._resetParameters = function() {
  $("#UserProfilePage-Name").val(Backend.getUserProfile().name);
  $("#UserProfilePage-Gender").val(Backend.getUserProfile().gender);
  $("#UserProfilePage-AgeCategory").val(Backend.getUserProfile().age);
  $("#UserProfilePage-Languages").val(Backend.getUserProfile().languages);
  $("#UserProfilePage-Password").val(Backend.getUserProfile().password);
  $("#UserProfilePage-RetypePassword").val(Backend.getUserProfile().password);
}


UserProfilePage.prototype._updateUserProfile = function() {
  var buttonSelector = $("#UserProfilePage-ControlPanel-UpdateButton");
  
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      $("#UserProfilePage-StatusPanel").text("");
    },
    failure: function() {
      this._onCompletion();
      $("#UserProfilePage-StatusPanel").text("Cannot update user profile on the server");
    },
    error: function() {
      this._onCompletion();
      $("#UserProfilePage-StatusPanel").text("Server communication error");
    },
    
    _onCompletion: function() {
      buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  
  buttonSelector.prop("disabled", true);
  Application.showSpinningWheel();

  var userProfile = {
    password: $("#UserProfilePage-Password").val(),
    name: $("#UserProfilePage-Name").val(),
    gender: $("#UserProfilePage-Gender").val(),
    languages: [$("#UserProfilePage-Languages").val()],
    age: $("#UserProfilePage-AgeCategory").val(),
  };
  
  Backend.updateUser(userProfile, callback);
}
