UserProfilePage = ClassUtils.defineClass(AbstractPage, function UserProfilePage() {
  AbstractPage.call(this, "UserProfilePage");
  
  this._nameElement;
  this._genderElement;
  this._ageElement;
  this._languagesElement;
  this._newPasswordElement;
  this._confirmNewPasswordElement;
  this._currentPasswordElement;
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
  
  this._nameElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Name"), "Your Nickname", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._genderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Gender"), "Your Gender", Application.Configuration.GENDERS, "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._ageElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "AgeCategory"), "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._languagesElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Languages"), "Languages that you speak", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._newPasswordElement =contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "NewPassword"), "New Password", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._confirmNewPasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "ConfirmNewPassword"), "Confirm New Password", "10px")).getInputElement();

  this._currentPasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "CurrentPassword"), "Your Current Password", "10px"));

  UIUtils.get$(this._newPasswordElement).on("input", function() {
    UIUtils.get$(this._confirmNewPasswordElement).val("");
  }.bind(this));
}

UserProfilePage.prototype._appendControlPanel = function(root) {  
  var controlPanel = UIUtils.appendBlock(root, "ControlPanel");

  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  
  var updateButton = controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "UpdateButton"), "Update Profile"));
  
  var resetButton = controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "ResetButton"), "Reset"));
  
  UIUtils.setClickListener(resetButton, this._resetParameters.bind(this));
  
  UIUtils.setClickListener(updateButton, function() {
    var currentPassword = UIUtils.get$(this._currentPasswordElement).val();
    if (currentPassword == "") {
      UIUtils.indicateInvalidInput(this._currentPasswordElement);
      Application.showMessage("You must enter current password to update your profile");
      return;
    }
    
    
    var name = UIUtils.get$(this._nameElement).val();
    if (name == "") {
      UIUtils.indicateInvalidInput(this._nameElement);
      Application.showMessage("Name should be set");
      return;
    }
    
    var languages = UIUtils.get$(this._languagesElement).val();
    if (languages == "") {
      UIUtils.indicateInvalidInput(this._languagesElement);
      Application.showMessage("Languages should be set");
    }

    var newPassword = UIUtils.get$(this._newPasswordElement).val();
    var confirmNewPassword = UIUtils.get$(this._confirmNewPasswordElement).val();
    
    if (newPassword.length > 0) {
      if (newPassword != confirmNewPassword) {
        Application.showMessage("New password does not match. Please retype.");
      } else if (newPassword.length < 5) {
        Application.showMessage("Password should be at least 5 symbols long");
      }

      if (newPassword != confirmNewPassword || newPassword.length < 5) {
        UIUtils.indicateInvalidInput(this._newPasswordElement);
        UIUtils.indicateInvalidInput(this._confirmNewPasswordElement);
        return;
      }
    }
    
    var callback = {
      success: function(requestId) {
        callback._onCompletion();
        Application.showMessage("Your profile was successfully updated");

        UIUtils.get$(this._newPasswordElement).val("");
        UIUtils.get$(this._confirmNewPasswordElement).val("");
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
        UIUtils.setEnabled(updateButton, true);
        UIUtils.get$(this._currentPasswordElement).val("");
        Application.hideSpinningWheel();
      }.bind(this)
    }

    UIUtils.setEnabled(updateButton, false);
    Application.showSpinningWheel();
    this._updateUserProfile(callback);
  }.bind(this));
}


UserProfilePage.prototype._resetParameters = function() {
  UIUtils.get$(this._nameElement).val(Backend.getUserProfile().name);
  this._genderElement.selectData(Backend.getUserProfile().gender);
  this._ageElement.selectData(Backend.getUserProfile().age);
  UIUtils.get$(this._languagesElement).val(Backend.getUserProfile().languages);
  
  UIUtils.get$(this._newPasswordElement).val("");
  UIUtils.get$(this._confirmNewPasswordElement).val("");
  UIUtils.get$(this._currentPasswordElement).val("");
}

UserProfilePage.prototype._updateUserProfile = function(callback) {
  var userProfile = {
    name: UIUtils.get$(this._nameElement).val(),
    gender: this._genderElement.getSelectedData(),
    languages: [UIUtils.get$(this._languagesElement).val()],
    age: this._ageElement.getSelectedData()
  };

  var newPassword = UIUtils.get$(this._newPasswordElement).val();
  if (newPassword.length > 0) {
    userProfile.password = newPassword;
  }
  
  var currentPassword = UIUtils.get$(this._currentPasswordElement).val();
  
  Backend.updateUser(userProfile, currentPassword, callback);
}
