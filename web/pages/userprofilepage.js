UserProfilePage = ClassUtils.defineClass(AbstractDataPage, function UserProfilePage() {
  AbstractDataPage.call(this, UserProfilePage.name);
  
  
  this._nameElement;
  this._genderElement;
  this._ageElement;
  this._languagesElement;
  this._newPasswordElement;
  this._confirmNewPasswordElement;
  this._currentPasswordElement;
  
  this._updating = false;
});

UserProfilePage.prototype.definePageContent = function(root) {
  var profilePanel = UIUtils.appendBlock(root, "ProfilePanel");
  UIUtils.appendLabel(profilePanel, "ProfileLabel", this.getLocale().ProfileLabel);
  
  this._nameElement = profilePanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(profilePanel, "Nickname"), I18n.getLocale().literals.NicknameLabel)).getInputElement();
  
  var genderAgeLanguagePanel = UIUtils.appendBlock(profilePanel, "GenderAgeLanguagePanel");
  this._genderElement = profilePanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(genderAgeLanguagePanel, "Gender"), I18n.getLocale().literals.GenderLabel, Application.Configuration.GENDERS)).getInputElement();
  this._ageElement = profilePanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(genderAgeLanguagePanel, "Age"), I18n.getLocale().literals.AgeLabel, Application.Configuration.AGE_CATEGORIES)).getInputElement();
  this._languagesElement = profilePanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(genderAgeLanguagePanel, "Language"), I18n.getLocale().literals.LanguageLabel, Application.Configuration.LANGUAGES)).getInputElement();
  
  this._newPasswordElement = profilePanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(profilePanel, "NewPassword"), this.getLocale().NewPasswordLabel)).getInputElement();
  this._confirmNewPasswordElement = profilePanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(profilePanel, "ConfirmNewPassword"), this.getLocale().ConfirmNewPasswordLabel)).getInputElement();
  UIUtils.get$(this._newPasswordElement).on("input", function() {
    this._confirmNewPasswordElement.setValue("");
  }.bind(this));

  this._currentPasswordElement = profilePanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(profilePanel, "CurrentPassword"), this.getLocale().CurrentPasswordLabel)).getInputElement();
  
  var buttonsPanel = UIUtils.appendBlock(profilePanel, "ButtonsPanel");
  var updateButton = UIUtils.appendButton(buttonsPanel, "UpdateButton", this.getLocale().UpdateButton);
  UIUtils.setClickListener(updateButton, function() {
    this._updateUserProfile();
  }.bind(this));

  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    Application.goBack();
  }.bind(this));
  
  
  var leftClarificationPanel = UIUtils.appendBlock(profilePanel, "LeftClarificationPanel");
  UIUtils.appendExplanationPad(leftClarificationPanel, "PasswordClarification", this.getLocale().NewPasswordLabel, this.getLocale().PasswordClarificationText);

  var rightClarificationPanel = UIUtils.appendBlock(profilePanel, "RightClarificationPanel");
  UIUtils.appendExplanationPad(rightClarificationPanel, "LanguageClarification", I18n.getLocale().literals.LanguageLabel, this.getLocale().LanguageClarificationText);
}

UserProfilePage.prototype.onShow = function() {
  this._resetParameters();
  
  this._updating = false;
}

UserProfilePage.prototype.onHide = function() {
}


UserProfilePage.prototype._resetParameters = function() {
  this._nameElement.setValue(Backend.getUserProfile().name);
  this._genderElement.selectData(Backend.getUserProfile().gender);
  this._ageElement.selectData(Backend.getUserProfile().age_category);
  this._languagesElement.selectChoices(Backend.getUserProfile().languages);
  
  this._newPasswordElement.setValue("");
  this._confirmNewPasswordElement.setValue("");
  this._currentPasswordElement.setValue("");
}

UserProfilePage.prototype._updateUserProfile = function(callback) {
  if (this._updating) {
    return;
  }
  
  var languages = this._languagesElement.getSelectedChoices();
  if (languages == "") {
    this._languagesElement.indicateInvalidInput();
    UIUtils.showMessage(this.getLocale().LanguageNotSetMessage);
    return;
  }

  var newPassword = this._newPasswordElement.getValue();
  var confirmNewPassword = this._confirmNewPasswordElement.getValue();
    
  if (newPassword.length > 0) {
    var passwordIncorrect = false;
    if (newPassword != confirmNewPassword) {
      UIUtils.showMessage(this.getLocale().PasswordsDoNotMatchMessage);
      passwordIncorrect = true;
    } else if (!ValidationUtils.isValidPassword(newPassword)) {
      UIUtils.showMessage(this.getLocale().ProvideCorrectPasswordMessage);
      passwordIncorrect = true;
    }

    if (passwordIncorrect) {
      UIUtils.indicateInvalidInput(this._newPasswordElement);
      UIUtils.indicateInvalidInput(this._confirmNewPasswordElement);
      return;
    }
  }
  
  var currentPassword = this._currentPasswordElement.getValue();
  if (currentPassword == "") {
    UIUtils.indicateInvalidInput(this._currentPasswordElement);
    UIUtils.showMessage(this.getLocale().EnterPasswordMessage);
    return;
  }
    

  var callback = {
    success: function(requestId) {
      callback._onCompletion();
      UIUtils.showMessage(this.getLocale().ProfileUpdatedMessage);
      Application.setupUserMenuChooser();
      Application.goBack();
    }.bind(this),
    failure: function() {
      callback._onCompletion();
      UIUtils.showMessage(this.getLocale().UpdateFailedMessage);
    }.bind(this),
    error: function() {
      callback._onCompletion();
      UIUtils.showMessage(I18n.getLocale().literals.ServerErrorMessage);
    },

    _onCompletion: function() {
      this._updating = false;
      this._currentPasswordElement.setValue("");
      UIUtils.hideSpinningWheel();
    }.bind(this)
  }

  this._updating = true;
  UIUtils.showSpinningWheel();
  
  var userProfile = {
    name: this._nameElement.getValue(),
    gender: this._genderElement.getSelectedData(),
    languages: this._languagesElement.getSelectedData(),
    age_category: this._ageElement.getSelectedData()
  };

  if (newPassword.length > 0) {
    userProfile.password = newPassword;
  }
  
  var currentPassword = this._currentPasswordElement.getValue();
  
  Backend.updateUserProfile(userProfile, currentPassword, callback);
}
