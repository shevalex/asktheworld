LoginPage = ClassUtils.defineClass(AbstractPage, function LoginPage() {
  AbstractPage.call(this, LoginPage.name);
  
  this._loginElement;
  this._passwordElement;
  this._signInButton;
});

LoginPage.prototype.definePageContent = function(root) {
  var leftDescription = UIUtils.appendBlock(root, "Description-Left");
  leftDescription.innerHTML = this.getLocale().ProjectDescriptionHtml;

  var rightDescription = UIUtils.appendBlock(root, "Description-Right");
  rightDescription.innerHTML = this.getLocale().DownloadMobileAppsHtml;
  
  this._appendLoginPanel(root);
}

LoginPage.prototype.onShow = function() {
  //Eventually we may need to read the login info from local storage and initialize the fileds
  var remember = window.localStorage.remember == "yes";
  
  if (remember && window.localStorage.login != null) {
    this._loginElement.setValue(window.localStorage.login);
  } else {
    this._loginElement.setValue("");
  }
  
  if (remember && window.localStorage.password != null) {
    this._passwordElement.setValue(window.localStorage.password);
  } else {
    this._passwordElement.setValue("");
  }
}

LoginPage.prototype.onHide = function() {
    UIUtils.setEnabled(this._signInButton, true);
}

LoginPage.prototype._appendLoginPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._loginElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Login"), this.getLocale().EmailLoginLabel, "10px")).getInputElement();
  
  this._passwordElement = contentPanel.appendChild(UIUtils.createLabeledPasswordInput(UIUtils.createId(contentPanel, "Password"), this.getLocale().PasswordLabel, "10px")).getInputElement();
  
  var rememberCheckbox = UIUtils.appendCheckbox(contentPanel, "RememberLogin", this.getLocale().RememberLoginLabel);
  rememberCheckbox.setValue(window.localStorage.remember == "yes");
  UIUtils.get$(rememberCheckbox).change(function() {
    window.localStorage.remember = rememberCheckbox.getValue() ? "yes" : "no";
  });
  
  this._signInButton = UIUtils.appendButton(contentPanel, "SignInButton", this.getLocale().SignInButton);

  var forgotPasswordLink = UIUtils.appendLink(contentPanel, "ForgotPasswordLink", this.getLocale().ForgotPassowrdLink);
  UIUtils.setClickListener(forgotPasswordLink, this._restorePassword.bind(this));
  
  var signUpLink = UIUtils.appendLink(contentPanel, "SignUpLink", this.getLocale().RegisterLink);
  UIUtils.setClickListener(signUpLink, function() {
    Application.showPage(RegisterPage.name);
  });

  UIUtils.setClickListener(this._signInButton, function() {
    var login = this._loginElement.getValue();
    var isEmailValid = ValidationUtils.isValidEmail(login);
    if (!isEmailValid) {
      UIUtils.indicateInvalidInput(this._loginElement);
    } else if (rememberCheckbox.getValue()) {
      window.localStorage.login = login;
    } else {
      window.localStorage.login = null;
    }
    var password = this._passwordElement.getValue();
    if (password == "") {
      UIUtils.indicateInvalidInput(this._passwordElement);
    } else if (rememberCheckbox.getValue()) {
      window.localStorage.password = password;
    } else {
      window.localStorage.password = null;
    }
    
    if (isEmailValid && password != "") {
      var backendCallback = {
        success: function() {
          this._onCompletion();
          Application.showMenuPage(HomePage.name);
        },
        failure: function() {
          this._onCompletion();
          Application.showMessage(this.getLocale().InvalidCredentialsMessage);
        },
        error: function() {
          this._onCompletion();
          Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
        },
        
        _onCompletion: function() {
          UIUtils.setEnabled(this._signInButton, true);
          Application.hideSpinningWheel();
        }.bind(this)
      }
      
      UIUtils.setEnabled(this._signInButton, false);
      Application.showSpinningWheel();
      
      Backend.logIn(login, password, backendCallback);
    } else if (!isEmailValid) {
      Application.showMessage(this.getLocale().InvalidLoginMessage);
    } else {
      Application.showMessage(this.getLocale().ProvideLoginPasswordMessage);
    }
  }.bind(this));
}

LoginPage.prototype._restorePassword = function() {
  var login = this._loginElement.getValue();
  
  if (ValidationUtils.isValidEmail(login)) {
    callback = {
      success: function() {
        Application.hideSpinningWheel();
        Application.showMessage(this.getLocale().PasswordResetMessage, Application.MESSAGE_TIMEOUT_SLOW);
      }.bind(this),
      error: function() {
        Application.hideSpinningWheel();
        Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      }
    }
    
    Application.showMessage(this.getLocale().PasswordResetRequestMessage);
    Application.showSpinningWheel();
    Backend.resetUserPassword(login, callback);
  } else {
    Application.showMessage(this.getLocale().IncorectEmailMessage);
  }
}