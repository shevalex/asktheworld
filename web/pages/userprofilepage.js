UserProfilePage = ClassUtils.defineClass(AbstractPage, function UserProfilePage() {
  AbstractPage.call(this, UserProfilePage.name);
  
  this._nameElement;
  this._genderElement;
  this._ageElement;
  this._languagesElement;
  this._newPasswordElement;
  this._confirmNewPasswordElement;
  this._currentPasswordElement;
  
  this._updateButton;
});

UserProfilePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  generalPanel.innerHTML = this.getLocale().UpdateProfileText;
  
  this._appendProfilePanel(root);
  this._appendControlPanel(root);
}

UserProfilePage.prototype.onShow = function() {
  this._resetParameters();
}

UserProfilePage.prototype.onHide = function() {
  UIUtils.setEnabled(this._updateButton, true);
}


UserProfilePage.prototype._appendProfilePanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ParametersPanel");
  
  this._nameElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Name"), I18n.getLocale().literals.YourNicknameLabel, "10px")).getInputElement();
  
  this._genderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Gender"), I18n.getLocale().literals.YourGenderLabel, Application.Configuration.GENDERS, "10px")).getInputElement();
  
  this._ageElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "AgeCategory"), I18n.getLocale().literals.YourAgeCategoryLabel, Application.Configuration.AGE_CATEGORIES, "10px")).getInputElement();
  
  this._languagesElement = contentPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(contentPanel, "Languages"), I18n.getLocale().literals.YourLanguagesLabel, Application.Configuration.LANGUAGES, "10px")).getInputElement();
  
  this._newPasswordElement =contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "NewPassword"), this.getLocale().NewPasswordLabel, "10px")).getInputElement();
  
  this._confirmNewPasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "ConfirmNewPassword"), this.getLocale().ConfirmPasswordLabel, "10px")).getInputElement();

  this._currentPasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "CurrentPassword"), this.getLocale().CurrentPasswordLabel, "10px")).getInputElement();

  UIUtils.get$(this._newPasswordElement).on("input", function() {
    this._confirmNewPasswordElement.setValue("");
  }.bind(this));
}

UserProfilePage.prototype._appendControlPanel = function(root) {  
  var controlPanel = UIUtils.appendBlock(root, "ControlPanel");

  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  
  this._updateButton = controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "UpdateButton"), this.getLocale().UpdateButton));
  
  var resetButton = controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "ResetButton"), this.getLocale().ResetButton));
  
  UIUtils.setClickListener(resetButton, this._resetParameters.bind(this));
  
  UIUtils.setClickListener(this._updateButton, function() {
    var currentPassword = this._currentPasswordElement.getValue();
    if (currentPassword == "") {
      UIUtils.indicateInvalidInput(this._currentPasswordElement);
      Application.showMessage(this.getLocale().EnterPasswordMessage);
      return;
    }
    
    
    var name = this._nameElement.getValue();
    if (name == "") {
      UIUtils.indicateInvalidInput(this._nameElement);
      Application.showMessage(this.getLocale().NameNotSetMessage);
      return;
    }
    
    var languages = this._languagesElement.getSelectedChoices();
    if (languages == "") {
      this._languagesElement.indicateInvalidInput();
      Application.showMessage(this.getLocale().LanguageNotSetMessage);
      return;
    }

    var newPassword = this._newPasswordElement.getValue();
    var confirmNewPassword = this._confirmNewPasswordElement.getValue();
    
    if (newPassword.length > 0) {
      if (newPassword != confirmNewPassword) {
        Application.showMessage(this.getLocale().PasswordsDoNotMatchMessage);
      } else if (newPassword.length < 5) {
        Application.showMessage(this.getLocale().ProvideCorrectPasswordMessage);
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
        Application.showMessage(this.getLocale().ProfileUpdatedMessage);

        this._newPasswordElement.setValue("");
        this._confirmNewPasswordElement.setValue("");
      }.bind(this),
      failure: function() {
        callback._onCompletion();
        Application.showMessage(this.getLocale().UpdateFailedMessage);
      }.bind(this),
      error: function() {
        callback._onCompletion();
        Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      },

      _onCompletion: function() {
        UIUtils.setEnabled(this._updateButton, true);
        this._currentPasswordElement.setValue("");
        Application.hideSpinningWheel();
      }.bind(this)
    }

    UIUtils.setEnabled(this._updateButton, false);
    Application.showSpinningWheel();
    this._updateUserProfile(callback);
  }.bind(this));
}


UserProfilePage.prototype._resetParameters = function() {
  this._nameElement.setValue(Backend.getUserProfile().name);
  this._genderElement.selectData(Backend.getUserProfile().gender);
  this._ageElement.selectData(Backend.getUserProfile().age);
  this._languagesElement.selectChoices(Backend.getUserProfile().languages);
  
  this._newPasswordElement.setValue("");
  this._confirmNewPasswordElement.setValue("");
  this._currentPasswordElement.setValue("");
}

UserProfilePage.prototype._updateUserProfile = function(callback) {
  var userProfile = {
    name: this._nameElement.getValue(),
    gender: this._genderElement.getSelectedData(),
    languages: this._languagesElement.getSelectedData(),
    age: this._ageElement.getSelectedData()
  };

  var newPassword = this._newPasswordElement.getValue();
  if (newPassword.length > 0) {
    userProfile.password = newPassword;
  }
  
  var currentPassword = this._currentPasswordElement.getValue();
  
  Backend.updateUser(userProfile, currentPassword, callback);
}
