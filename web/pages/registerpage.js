RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, "RegisterPage");
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
  
  this._appendContetPanel(root);
}


RegisterPage.prototype._appendContetPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  var emailElementId = UIUtils.createId(contentPanel, "Email");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(emailElementId, "Your Email", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var nameElementId = UIUtils.createId(contentPanel, "Name");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(nameElementId, "Your Nickname", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());

  var genderElementId = UIUtils.createId(contentPanel, "Gender");
  contentPanel.appendChild(UIUtils.createLabeledDropList(genderElementId, "Your Gender", Application.Configuration.GENDERS, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var ageElementId = UIUtils.createId(contentPanel, "AgeCategory");
  contentPanel.appendChild(UIUtils.createLabeledDropList(ageElementId, "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var languagesElementId = UIUtils.createId(contentPanel, "Languages");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(languagesElementId, "Languages that you speak", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());

  var passwordElementId = UIUtils.createId(contentPanel, "Password");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(passwordElementId, "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var retypePasswordElementId = UIUtils.createId(contentPanel, "RetypePassword");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(retypePasswordElementId, "Re-type Password", "10px"));
  
  contentPanel.appendChild(UIUtils.createLineBreak());
  var termsAndCondsPanel = UIUtils.appendBlock(contentPanel, "TermsAndConds");
  var acceptCheckbox = UIUtils.appendCheckbox(termsAndCondsPanel, "AcceptTerms");
  var licenseAgreementRef = UIUtils.appendLabel(termsAndCondsPanel, "LinkLabel");
  var licenseLinkId = UIUtils.createId(termsAndCondsPanel, "Link");
  UIUtils.get$(licenseAgreementRef).html("Please accept <a href='#' id='" + licenseLinkId + "'>Terms And Conditions</a>");
  UIUtils.setClickListener(licenseLinkId, function() {
    this._showLicenseAgreement();
  }.bind(this));

  contentPanel.appendChild(UIUtils.createLineBreak());
  var registerButton = UIUtils.appendButton(contentPanel, "RegisterButton", "Register");
  
  UIUtils.get$(passwordElementId).on("input", function() {
    UIUtils.get$(retypePasswordElementId).val("");
  });
  
  UIUtils.setClickListener(registerButton, function() {
    var email = UIUtils.get$(emailElementId).val();
    var isValidEmail = ValidationUtils.isValidEmail(email);
    if (!isValidEmail) {
      UIUtils.indicateInvalidInput(emailElementId);
    }
    
    var name = UIUtils.get$(nameElementId).val();
    if (name == "") {
      UIUtils.indicateInvalidInput(nameElementId);
    }
    
    var languages = UIUtils.get$(languagesElementId).val();
    if (languages == "") {
      UIUtils.indicateInvalidInput(languagesElementId);
    }

    var password = UIUtils.get$(passwordElementId).val();
    if (password == "" || password.length < 5) {
      UIUtils.indicateInvalidInput(passwordElementId);
    }
    
    var retypePassword = UIUtils.get$(retypePasswordElementId).val();
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput(retypePasswordElementId);
    }


    if (acceptCheckbox.checked && isValidEmail && name != "" && languages != "" && password != "" && password == retypePassword) {
      var backendCallback = {
        success: function() {
          this._onCompletion();
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
        gender: UIUtils.get$(genderElementId).val(),
        languages: [UIUtils.get$(languagesElementId).val()],
        age: UIUtils.get$(ageElementId).val(),
      };
      
      UIUtils.setEnabled(registerButton, false);
      Application.showSpinningWheel();

      Backend.registerUser(userProfile, backendCallback);
    } else if (!isValidEmail) {
      Application.showMessage("The email you entered does not look like a valid email address");
    } else if (password != retypePassword) {
      Application.showMessage("Passwords do not match. Please retype.");
    } else if (password.length < 5) {
      Application.showMessage("Password should be at least 5 symbols long");
    } else if (!acceptCheckbox.checked) {
      var popupTermsLink = UIUtils.createId(root, "TermsLink"); 
      Application.showMessage("You must accept<p><a href='#' id='" + popupTermsLink + "'><b>Terms And Conditions<b></a>");
      UIUtils.setClickListener(popupTermsLink, function() {
        this._showLicenseAgreement();
      }.bind(this));
    } else {
      Application.showMessage("Some of the fields are not provided.<br>All fields are required.");
    }
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