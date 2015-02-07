RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, "RegisterPage");
  
  this._passwordElement;
  this._retypePasswordElement;
  this._acceptCheckbox;
});

RegisterPage.prototype.definePageContent = function(root) {
  var leftSideDescriptionElement = UIUtils.appendBlock(root, "Description-Left");
  UIUtils.get$(leftSideDescriptionElement).html("By registering you will get an instant access to the secret technology that we provide");

  var rightSideDescriptionElement = UIUtils.appendBlock(root, "Description-Right");
  var signInLinkId = UIUtils.createId(rightSideDescriptionElement, "SignInLink");
  UIUtils.get$(rightSideDescriptionElement).html("Already have an account?<br>Click <a href='#' id='" + signInLinkId + "'>Sign In</a>.");
  UIUtils.setClickListener(signInLinkId, function() {
    Application.showLoginPage();
  })
  
  this._appendContentPanel(root);
}

RegisterPage.prototype.onShow = function(root) {
  this._passwordElement.setValue("");
  this._retypePasswordElement.setValue("");
  this._acceptCheckbox.setValue(false);
}


RegisterPage.prototype._appendContentPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  var emailElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Email"), "Your Email", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var nameElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Name"), "Your Nickname", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());

  var genderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Gender"), "Your Gender", Application.Configuration.GENDERS, "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var ageElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "AgeCategory"), "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var languagesElement = contentPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(contentPanel, "Languages"), "Languages that you speak", Application.Configuration.LANGUAGES, "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._passwordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "Password"), "Password", "10px")).getInputElement();
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._retypePasswordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "RetypePassword"), "Re-type Password", "10px")).getInputElement();
  
  contentPanel.appendChild(UIUtils.createLineBreak());
  var licenseLinkId = UIUtils.createId(contentPanel, "TermsAndConds-Link");
  this._acceptCheckbox = UIUtils.appendCheckbox(contentPanel, "TermsAndConds", "Please accept <a href='#' id='" + licenseLinkId + "'>Terms And Conditions</a>");
  UIUtils.setClickListener(licenseLinkId, function() {
    this._showLicenseAgreement();
    setTimeout(this._acceptCheckbox.setValue.bind(this, false), 0);
  }.bind(this));
  
  contentPanel.appendChild(UIUtils.createLineBreak());
  var registerButton = UIUtils.appendButton(contentPanel, "RegisterButton", "Register");
  
  UIUtils.get$(this._passwordElement).on("input", function() {
    this._retypePasswordElement.setValue("");
  }.bind(this));
  
  UIUtils.setClickListener(registerButton, function() {
    var email = emailElement.getValue();
    var isValidEmail = ValidationUtils.isValidEmail(email);
    if (!isValidEmail) {
      UIUtils.indicateInvalidInput(emailElement);
      Application.showMessage("The email is not provided or does not look like a valid email address");
      return;
    }
    
    var name = nameElement.getValue();
    if (name == "") {
      UIUtils.indicateInvalidInput(nameElement);
      Application.showMessage("You must provide a nickname");
      return;
    }
    
    var languages = languagesElement.getSelectedChoices();
    if (languages.length == 0) {
      languagesElement.indicateInvalidInput();
      Application.showMessage("One or more languages must be set");
      return;
    }

    var password = this._passwordElement.getValue();
    if (password == "" || password.length < 5) {
      UIUtils.indicateInvalidInput(this._passwordElement);
      Application.showMessage("Password should be at least 5 symbols long");
      return;
    }
    
    var retypePassword = this._retypePasswordElement.getValue();
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput(this._retypePasswordElement);
      Application.showMessage("Passwords do not match. Please retype.");
      return;
    }

    if (!this._acceptCheckbox.getValue()) {
      var popupTermsLink = UIUtils.createId(root, "TermsLink");
      Application.showMessage("You must accept<p><a href='#' id='" + popupTermsLink + "'><b>Terms And Conditions<b></a>");
      UIUtils.setClickListener(popupTermsLink, function() {
        this._showLicenseAgreement();
      }.bind(this));
      
      return;
    }

    var page = this;
    var backendCallback = {
      success: function() {
        this._onCompletion();

        emailElement.setValue("");
        nameElement.setValue("");
        genderElement.clearChoices();
        ageElement.clearChoices();
        languagesElement.clearChoices();
        page._passwordElement.setValue("");
        page._retypePasswordElement.setValue("");
        
        Application.showMenuPage();
      },
      failure: function() {
        this._onCompletion();
        Application.showMessage("Failed to create an account");
      },
      conflict : function() {
        this._onCompletion();
        Application.showMessage("This login (email) was already used");
      },
      error: function() {
        this._onCompletion();
        Application.showMessage("Server communication error");
      },

      _onCompletion: function() {
        UIUtils.setEnabled(registerButton, true);
        Application.hideSpinningWheel();
      }
    }

    var userProfile = {
      login: email,
      password: password,
      name: name,
      gender: genderElement.getSelectedData(),
      languages: languagesElement.getSelectedData(),
      age: ageElement.getSelectedData(),
    };

    UIUtils.setEnabled(registerButton, false);
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