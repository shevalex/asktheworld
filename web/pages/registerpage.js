RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, RegisterPage.name);
  
  this._emailElement;
  this._nameElement;
  this._genderElement;
  this._ageElement;
  this._languagesElement;
  this._passwordElement;
  this._retypePasswordElement;
  this._termsAndCondsCheckbox;
  this._appropriateAgeCheckbox;
  
  this._signing = false;
});

RegisterPage.prototype.definePageContent = function(root) {
  var signUpPanel = UIUtils.appendBlock(root, "SignUpPanel");
  UIUtils.appendLabel(signUpPanel, "SignUpLabel", this.getLocale().SignUpLabel);
  
  this._emailElement = signUpPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(signUpPanel, "Email"), this.getLocale().EmailLoginLabel)).getInputElement();
  this._nameElement = signUpPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(signUpPanel, "Nickname"), this.getLocale().NicknameLabel)).getInputElement();
  
  var genderAgeLanguagePanel = UIUtils.appendBlock(signUpPanel, "GenderAgeLanguagePanel");
  this._genderElement = signUpPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(genderAgeLanguagePanel, "Gender"), this.getLocale().GenderLabel, Application.Configuration.GENDERS)).getInputElement();
  this._ageElement = signUpPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(genderAgeLanguagePanel, "Age"), this.getLocale().AgeLabel, Application.Configuration.AGE_CATEGORIES)).getInputElement();
  this._languagesElement = signUpPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(genderAgeLanguagePanel, "Language"), this.getLocale().LanguageLabel, Application.Configuration.LANGUAGES)).getInputElement();
  
  this._passwordElement = signUpPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(signUpPanel, "Password"), this.getLocale().PasswordLabel)).getInputElement();
  this._retypePasswordElement = signUpPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(signUpPanel, "RetypePassword"), this.getLocale().RetypePasswordLabel)).getInputElement();
  UIUtils.get$(this._passwordElement).on("input", function() {
    this._retypePasswordElement.setValue("");
  }.bind(this));

  this._appropriateAgeCheckbox = UIUtils.appendCheckbox(signUpPanel, "AppropriateAgeCheckbox", this.getLocale().AppropriateAgeCheckbox);
  
  var licenseLinkId = UIUtils.createId(signUpPanel, "TermsAndCondsLink");
  this._termsAndCondsCheckbox = UIUtils.appendCheckbox(signUpPanel, "TermsAndCondsCheckbox", this.getLocale().AcceptTermsProvider(licenseLinkId));
  UIUtils.setClickListener(licenseLinkId, function() {
    this._showLicenseAgreement();
    setTimeout(this._termsAndCondsCheckbox.setValue.bind(this, false), 0);
  }.bind(this));

  var buttonsPanel = UIUtils.appendBlock(signUpPanel, "ButtonsPanel");
  var signUpButton = UIUtils.appendButton(buttonsPanel, "SignUpButton", "");
  UIUtils.setClickListener(signUpButton, function() {
    this._signUp();
  }.bind(this));
  
  
  var leftClarificationPanel = UIUtils.appendBlock(signUpPanel, "LeftClarificationPanel");
  UIUtils.appendExplanationPad(leftClarificationPanel, "NicknameClarificationPanel", this.getLocale().NicknameLabel, this.getLocale().NicknameClarificationText);

  var rightClarificationPanel = UIUtils.appendBlock(signUpPanel, "RightClarificationPanel");
  UIUtils.appendExplanationPad(rightClarificationPanel, "LanguageClarificationPanel", this.getLocale().LanguageLabel, this.getLocale().LanguageClarificationText);
}

RegisterPage.prototype.onShow = function() {
  this._passwordElement.setValue("");
  this._retypePasswordElement.setValue("");
  this._termsAndCondsCheckbox.setValue(false);
  this._appropriateAgeCheckbox.setValue(false);
  
  this._signing = false;
}

RegisterPage.prototype.onHide = function() {
}


RegisterPage.prototype._signUp = function() {
  if (this._signing) {
    return;
  }
  
  var email = this._emailElement.getValue();
  var isValidEmail = ValidationUtils.isValidEmail(email);
  if (!isValidEmail) {
    UIUtils.indicateInvalidInput(this._emailElement);
    Application.showMessage(this.getLocale().ProvideLoginMessage);
    return;
  }

  var name = this._nameElement.getValue();
  if (name == "") {
    UIUtils.indicateInvalidInput(this._nameElement);
    Application.showMessage(this.getLocale().ProvideNicknameMessage);
    return;
  }

  var languages = this._languagesElement.getSelectedChoices();
  if (languages.length == 0) {
    this._languagesElement.indicateInvalidInput();
    Application.showMessage(this.getLocale().ProvideLanguageMessage);
    return;
  }

  var password = this._passwordElement.getValue();
  if (!ValidationUtils.isValidPassword(password)) {
    UIUtils.indicateInvalidInput(this._passwordElement);
    Application.showMessage(this.getLocale().ProvideCorrectPasswordMessage);
    return;
  }

  var retypePassword = this._retypePasswordElement.getValue();
  if (retypePassword != password) {
    UIUtils.indicateInvalidInput(this._retypePasswordElement);
    Application.showMessage(this.getLocale().PasswordsDoNotMatchMessage);
    return;
  }

  if (!this._appropriateAgeCheckbox.getValue()) {
    Application.showMessage(this.getLocale().MustBeOver18Message);
    return;
  }

  if (!this._termsAndCondsCheckbox.getValue()) {
    var licenseLinkId = UIUtils.createId(this._termsAndCondsCheckbox.parentElement, "TermsLink");
    Application.showMessage(this.getLocale().MustAcceptTermsMessageProvider(licenseLinkId));
    UIUtils.setClickListener(licenseLinkId, function() {
      Application.hideMessage();
      this._showLicenseAgreement();
    }.bind(this));

    return;
  }


  var backendCallback = {
    success: function() {
      backendCallback._onCompletion();

      this._emailElement.setValue("");
      this._nameElement.setValue("");
      this._genderElement.clearChoices();
      this._ageElement.clearChoices();
      this._languagesElement.clearChoices();
      this._passwordElement.setValue("");
      this._retypePasswordElement.setValue("");

      Application.setupUserMenuChooser();
      Application.showPage(WelcomePage.name);
    }.bind(this),
    failure: function() {
      backendCallback._onCompletion();
      Application.showMessage(this.getLocale().AccountCreationFailedMessage);
    }.bind(this),
    conflict: function() {
      backendCallback._onCompletion();
      Application.showMessage(this.getLocale().AccountAlreadyExistsMessage);
    }.bind(this),
    error: function() {
      backendCallback._onCompletion();
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
    },

    _onCompletion: function() {
      this._signing = false;
      Application.hideSpinningWheel();
    }.bind(this)
  }

  var userProfile = {
    login: email,
    password: password,
    name: name,
    gender: this._genderElement.getSelectedData(),
    languages: this._languagesElement.getSelectedData(),
    age: this._ageElement.getSelectedData(),
  };

  this._signing = true;
  Application.showSpinningWheel();

  Backend.registerUser(userProfile, backendCallback);
}

RegisterPage.prototype._showLicenseAgreement = function() {
//  var callback = {
//    success: function(data) {
//      Application.showDialog("Terms And Conditions", data);
//    },
//    error: function() {
//      Application.showMessage("Failed to retrieve the Terms And Conditions");
//    }
//  };
//  
//  ResourceUtils.loadResource("terms_and_conditions.html", false, callback);
  
  var terms = "<center><h1><b>This Is Terms And Conditions</b></h1></center>";
  for (var i = 0; i < 100; i++) {
    terms += "<br>Some bullshit follows";
  }
  
  Application.showDialog("Terms And Conditions", terms);
}