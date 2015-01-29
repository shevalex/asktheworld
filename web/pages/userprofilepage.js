UserProfilePage = ClassUtils.defineClass(AbstractPage, function UserProfilePage() {
  AbstractPage.call(this, "UserProfilePage");
  
  this._nameElementId;
  this._genderElementId;
  this._ageElementId;
  this._languagesElementId;
  this._newPasswordElementId;
  this._confirmNewPasswordElementId;
  this._currentPasswordElementId;
});

UserProfilePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Update your profile information. <b>We intentionally keep it very basic and generic to insure your privacy</b>.<br>You may only modify the information which you need to correct. Do not type new password if you do not want to change it.");
  
  this._appendProfilePanel(root);
  this._appendControlPanel(root);
}

UserProfilePage.prototype.onShow = function() {
  this._resetParameters();
}


UserProfilePage.prototype._appendProfilePanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ParametersPanel");
  
  this._nameElementId = UIUtils.createId(contentPanel, "Name");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(this._nameElementId, "Your Nickname", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._genderElementId = UIUtils.createId(contentPanel, "Gender");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._genderElementId, "Your Gender", Application.Configuration.GENDERS, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._ageElementId = UIUtils.createId(contentPanel, "AgeCategory");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._ageElementId, "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._languagesElementId = UIUtils.createId(contentPanel, "Languages");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(this._languagesElementId, "Languages that you speak", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._newPasswordElementId = UIUtils.createId(contentPanel, "NewPassword");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._newPasswordElementId, "New Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._confirmNewPasswordElementId = UIUtils.createId(contentPanel, "ConfirmNewPassword");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._confirmNewPasswordElementId, "Confirm New Password", "10px"));

  this._currentPasswordElementId = UIUtils.createId(contentPanel, "CurrentPassword");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._currentPasswordElementId, "Your Current Password", "10px"));

  UIUtils.get$(this._newPasswordElementId).on("input", function() {
    UIUtils.get$(this._confirmNewPasswordElementId).val("");
  }.bind(this));
}

UserProfilePage.prototype._appendControlPanel = function(root) {  
  var controlPanel = UIUtils.appendBlock(root, "ControlPanel");

  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  
  var updateButtonId = UIUtils.createId(controlPanel, "UpdateButton");
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(updateButtonId , "Update Profile"));
  
  var resetButtonId = UIUtils.createId(controlPanel, "ResetButton");
  controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(resetButtonId, "Reset"));
  
  UIUtils.setClickListener(resetButtonId, this._resetParameters.bind(this));
  
  UIUtils.setClickListener(updateButtonId, function() {
    var currentPassword = UIUtils.get$(this._currentPasswordElementId).val();
    if (currentPassword == "") {
      UIUtils.indicateInvalidInput(this._currentPasswordElementId);
      Application.showMessage("You must enter current password to update your profile");
      return;
    }
    
    
    var name = UIUtils.get$(this._nameElementId).val();
    if (name == "") {
      UIUtils.indicateInvalidInput(this._nameElementId);
      Application.showMessage("Name should be set");
      return;
    }
    
    var languages = UIUtils.get$(this._languagesElementId).val();
    if (languages == "") {
      UIUtils.indicateInvalidInput(this._languagesElementId);
      Application.showMessage("Languages should be set");
    }

    var newPassword = UIUtils.get$(this._newPasswordElementId).val();
    var confirmNewPassword = UIUtils.get$(this._confirmNewPasswordElementId).val();
    
    if (newPassword.length > 0) {
      if (newPassword != confirmNewPassword) {
        Application.showMessage("New password does not match. Please retype.");
      } else if (newPassword.length < 5) {
        Application.showMessage("Password should be at least 5 symbols long");
      }

      if (newPassword != confirmNewPassword || newPassword.length < 5) {
        UIUtils.indicateInvalidInput(this._newPasswordElementId);
        UIUtils.indicateInvalidInput(this._confirmNewPasswordElementId);
        return;
      }
    }
    
    var callback = {
      success: function(requestId) {
        callback._onCompletion();
        Application.showMessage("Your profile was successfully updated");

        UIUtils.get$(this._newPasswordElementId).val("");
        UIUtils.get$(this._confirmNewPasswordElementId).val("");
      }.bind(this),
      failure: function() {
        this._onCompletion();
        Application.showMessage("Cannot update user profile.<br>Please make sure your current password is correct.");
      },
      error: function() {
        this._onCompletion();
        Application.showMessage("Server communication error");
      },

      _onCompletion: function() {
        UIUtils.setEnabled(updateButtonId, true);
        UIUtils.get$(this._currentPasswordElementId).val("");
        Application.hideSpinningWheel();
      }.bind(this)
    }

    UIUtils.setEnabled(updateButtonId, false);
    Application.showSpinningWheel();
    this._updateUserProfile(callback);
  }.bind(this));
}


UserProfilePage.prototype._resetParameters = function() {
  UIUtils.get$(this._nameElementId).val(Backend.getUserProfile().name);
  UIUtils.get$(this._genderElementId).val(Backend.getUserProfile().gender);
  UIUtils.get$(this._ageElementId).val(Backend.getUserProfile().age);
  UIUtils.get$(this._languagesElementId).val(Backend.getUserProfile().languages);
  
  UIUtils.get$(this._newPasswordElementId).val("");
  UIUtils.get$(this._confirmNewPasswordElementId).val("");
  UIUtils.get$(this._currentPasswordElementId).val("");
}

UserProfilePage.prototype._updateUserProfile = function(callback) {
  var userProfile = {
    name: UIUtils.get$(this._nameElementId).val(),
    gender: UIUtils.get$(this._genderElementId).val(),
    languages: [UIUtils.get$(this._languagesElementId).val()],
    age: UIUtils.get$(this._ageElementId).val(),
  };

  var newPassword = UIUtils.get$(this._newPasswordElementId).val();
  if (newPassword.length > 0) {
    userProfile.password = newPassword;
  }
  
  var currentPassword = UIUtils.get$(this._currentPasswordElementId).val();
  
  Backend.updateUser(userProfile, currentPassword, callback);
}
