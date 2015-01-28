UserProfilePage = ClassUtils.defineClass(AbstractPage, function UserProfilePage() {
  AbstractPage.call(this, "UserProfilePage");
  
  this._nameElementId;
  this._genderElementId;
  this._ageElementId;
  this._languagesElementId;
  this._passwordElementId;
  this._retypePasswordElementId;
});

UserProfilePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Update your profile information. <b>We intentionally keep it very basic and generic to insure your privacy</b>.<br>You may only modify the information which you need to correct. Do not change anything (inlcuding password) that does not require correction.");
  
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
  
  this._passwordElementId = UIUtils.createId(contentPanel, "Password");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._passwordElementId, "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._retypePasswordElementId = UIUtils.createId(contentPanel, "RetypePassword");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._retypePasswordElementId, "Re-type Password", "10px"));

  UIUtils.get$(this._passwordElementId).on("input", function() {
    UIUtils.get$(this._retypePasswordElementId).val("");
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
    var name = UIUtils.get$(this._nameElementId).val();
    if (name == "") {
      UIUtils.indicateInvalidInput(this._nameElementId);
    }
    
    var languages = UIUtils.get$(this._languagesElementId).val();
    if (languages == "") {
      UIUtils.indicateInvalidInput(this._languagesElementId);
    }

    var password = UIUtils.get$(this._passwordElementId).val();
    if (password == "") {
      UIUtils.indicateInvalidInput(this._passwordElementId);
    }
    
    var retypePassword = UIUtils.get$(this._retypePasswordElementId).val();
    
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput(this._retypePasswordElementId);
    }

    if (name != "" && languages != "" && password != "" && password == retypePassword) {
      var callback = {
        success: function(requestId) {
          this._onCompletion();
          Application.showMessage("Your profile was successfully updated");
        },
        failure: function() {
          this._onCompletion();
          Application.showMessage("Cannot update user profile on the server");
        },
        error: function() {
          this._onCompletion();
          Application.showMessage("Server communication error");
        },

        _onCompletion: function() {
          UIUtils.setEnabled(updateButtonId, true);
          Application.hideSpinningWheel();
        }
      }

      UIUtils.setEnabled(updateButtonId, false);
      Application.showSpinningWheel();
      this._updateUserProfile(callback);
    } else if (password == retypePassword) {
      Application.showMessage("All fields are required.<br>Please fill them down.");
    } else {
      Application.showMessage("Passwords do not match. Please retype.");
    }
  }.bind(this));
}


UserProfilePage.prototype._resetParameters = function() {
  UIUtils.get$(this._nameElementId).val(Backend.getUserProfile().name);
  UIUtils.get$(this._genderElementId).val(Backend.getUserProfile().gender);
  UIUtils.get$(this._ageElementId).val(Backend.getUserProfile().age);
  UIUtils.get$(this._languagesElementId).val(Backend.getUserProfile().languages);
  UIUtils.get$(this._passwordElementId).val(Backend.getUserProfile().password);
  UIUtils.get$(this._retypePasswordElementId).val(Backend.getUserProfile().password);
}

UserProfilePage.prototype._updateUserProfile = function(callback) {
  var userProfile = {
    password: UIUtils.get$(this._passwordElementId).val(),
    name: UIUtils.get$(this._nameElementId).val(),
    gender: UIUtils.get$(this._genderElementId).val(),
    languages: [UIUtils.get$(this._languagesElementId).val()],
    age: UIUtils.get$(this._ageElementId).val(),
  };
  
  Backend.updateUser(userProfile, callback);
}
