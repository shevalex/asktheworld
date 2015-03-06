RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, RegisterPage.name);
  
  this._passwordElement;
  this._retypePasswordElement;
  this._acceptCheckbox;
  this._registerButton;
});

RegisterPage.prototype.definePageContent = function(root) {
  var leftSideDescriptionElement = UIUtils.appendBlock(root, "Description-Left");
  leftSideDescriptionElement.innerHTML = this.getLocale().ProjectDescriptionHtml;

  var rightSideDescriptionElement = UIUtils.appendBlock(root, "Description-Right");
  var signInLinkId = UIUtils.createId(rightSideDescriptionElement, "SignInLink");
  rightSideDescriptionElement.innerHTML = this.getLocale().SignInProvider(signInLinkId);
  UIUtils.setClickListener(signInLinkId, function() {
    Application.showPage(LoginPage.name);
  })
  
  this._appendContentPanel(root);
}

RegisterPage.prototype.onShow = function() {
  this._passwordElement.setValue("");
  this._retypePasswordElement.setValue("");
  this._acceptCheckbox.setValue(false);
}

RegisterPage.prototype.onHide = function() {
  UIUtils.setEnabled(this._registerButton, true);
}


RegisterPage.prototype._appendContentPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  var emailElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Email"), I18n.getLocale().literals.YourEmailLabel, "10px")).getInputElement();
  
  var nameElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Name"), I18n.getLocale().literals.YourNicknameLabel, "10px")).getInputElement();

  var genderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Gender"), I18n.getLocale().literals.YourGenderLabel, Application.Configuration.GENDERS, "10px")).getInputElement();
  
  var ageElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "AgeCategory"), I18n.getLocale().literals.YourAgeCategoryLabel, Application.Configuration.AGE_CATEGORIES, "10px")).getInputElement();
  
  var languagesElement = contentPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(contentPanel, "Languages"), I18n.getLocale().literals.YourLanguagesLabel, Application.Configuration.LANGUAGES, "10px")).getInputElement();
  
  this._passwordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "Password"), this.getLocale().PasswordLabel, "10px")).getInputElement();
  
  this._retypePasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "RetypePassword"), this.getLocale().RetypePasswordLabel, "10px")).getInputElement();
  
  var licenseLinkId = UIUtils.createId(contentPanel, "TermsAndConds-Link");
  this._acceptCheckbox = UIUtils.appendCheckbox(contentPanel, "TermsAndConds", this.getLocale().AcceptTermsProvider(licenseLinkId));
  UIUtils.setClickListener(licenseLinkId, function() {
    this._showLicenseAgreement();
    setTimeout(this._acceptCheckbox.setValue.bind(this, false), 0);
  }.bind(this));
  
  this._registerButton = UIUtils.appendButton(contentPanel, "RegisterButton", this.getLocale().RegisterButton);
  
  UIUtils.get$(this._passwordElement).on("input", function() {
    this._retypePasswordElement.setValue("");
  }.bind(this));
  
  UIUtils.setClickListener(this._registerButton, function() {
    var email = emailElement.getValue();
    var isValidEmail = ValidationUtils.isValidEmail(email);
    if (!isValidEmail) {
      UIUtils.indicateInvalidInput(emailElement);
      Application.showMessage(this.getLocale().ProvideLoginMessage);
      return;
    }
    
    var name = nameElement.getValue();
    if (name == "") {
      UIUtils.indicateInvalidInput(nameElement);
      Application.showMessage(this.getLocale().ProvideNicknameMessage);
      return;
    }
    
    var languages = languagesElement.getSelectedChoices();
    if (languages.length == 0) {
      languagesElement.indicateInvalidInput();
      Application.showMessage(this.getLocale().ProvideLanguageMessage);
      return;
    }

    var password = this._passwordElement.getValue();
    if (password == "" || password.length < 5) {
      UIUtils.indicateInvalidInput(this._passwordElement);
      Application.showMessage(this.getLocale().ProvideCorrectPasswordMessage);
      return;
    }
    
    var retypePassword = this._retypePasswordElement.getValue();
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput(this._retypePasswordElement);
      Application.showMessage(this.getLocale().PasswordsDoNotMatchMessage);
      return;
    }

    if (!this._acceptCheckbox.getValue()) {
      var popupTermsLink = UIUtils.createId(root, "TermsLink");
      Application.showMessage(this.getLocale().MustAcceptTermsMessageProvider(popupTermsLink));
      UIUtils.setClickListener(popupTermsLink, function() {
        this._showLicenseAgreement();
      }.bind(this));
      
      return;
    }


    var backendCallback = {
      success: function() {
        backendCallback._onCompletion();

        emailElement.setValue("");
        nameElement.setValue("");
        genderElement.clearChoices();
        ageElement.clearChoices();
        languagesElement.clearChoices();
        this._passwordElement.setValue("");
        this._retypePasswordElement.setValue("");
        
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
        UIUtils.setEnabled(this._registerButton, true);
        Application.hideSpinningWheel();
      }.bind(this)
    }

    var userProfile = {
      login: email,
      password: password,
      name: name,
      gender: genderElement.getSelectedData(),
      languages: languagesElement.getSelectedData(),
      age: ageElement.getSelectedData(),
    };

    UIUtils.setEnabled(this._registerButton, false);
    Application.showSpinningWheel();

    Backend.registerUser(userProfile, backendCallback);
  }.bind(this));
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