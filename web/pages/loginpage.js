LoginPage = ClassUtils.defineClass(AbstractPage, function LoginPage() {
  AbstractPage.call(this, LoginPage.name);
  
  this._loginElement;
  this._passwordElement;
  this._rememberCheckbox;
  
  this._signing = false;
});


LoginPage.prototype.definePageContent = function(root) {
  var leftDescription = UIUtils.appendBlock(root, "Description-Left");
  leftDescription.innerHTML = this.getLocale().ProjectDescriptionHtml;

  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var labelPanel = UIUtils.appendBlock(contentPanel, "LabelPanel");
  UIUtils.appendLabel(labelPanel, "EmailLabel", this.getLocale().EmailLoginLabel);
  UIUtils.appendLabel(labelPanel, "PasswordLabel", this.getLocale().PasswordLabel);
  
  var controlPanel = UIUtils.appendBlock(contentPanel, "ControlPanel");
  this._loginElement = UIUtils.appendTextInput(controlPanel, "Login");
  
  this._rememberCheckbox = UIUtils.appendCheckbox(controlPanel, "RememberLoginCheck", this.getLocale().RememberLoginLabel);
  UIUtils.get$(this._rememberCheckbox).change(function() {
    window.localStorage.remember = this._rememberCheckbox.getValue() ? "yes" : "no";
  }.bind(this));
  
  this._passwordElement = UIUtils.appendPasswordInput(controlPanel, "Password");
  
  var forgotPasswordLink = UIUtils.appendLink(controlPanel, "ForgotPasswordLink", this.getLocale().ForgotPassowrdLink);
  UIUtils.setClickListener(forgotPasswordLink, this._restorePassword.bind(this));
  
  var buttonsPanel = UIUtils.appendBlock(controlPanel, "ButtonsPanel");
  var signInButton = UIUtils.appendButton(buttonsPanel, "SignInButton", this.getLocale().SignInButton);
  UIUtils.setClickListener(signInButton, function() {
    this._signIn();
  }.bind(this));

  
  var signUpLink = UIUtils.appendLink(buttonsPanel, "SignUpLink", this.getLocale().RegisterLink);
  UIUtils.setClickListener(signUpLink, function() {
    Application.showPage(RegisterPage.name);
  });
  
  
  var downloadsPanel = UIUtils.appendBlock(controlPanel, "DownloadsPanel");
  UIUtils.appendLabel(downloadsPanel, "DownloadAppsLabel", this.getLocale().DownloadAppsLabel);
  
  var downloadButtonsPanel = UIUtils.appendBlock(downloadsPanel, "DownloadButtonsPanel");
  var androidButton = UIUtils.appendButton(downloadButtonsPanel, "DownloadAndroidButton", "");
  UIUtils.setClickListener(androidButton, function() {
    window.open("https://play.google.com/store", "_blank");
  });
  
  var iOSButton = UIUtils.appendButton(downloadButtonsPanel, "DownloadiOSButton", "");
  UIUtils.setClickListener(iOSButton, function() {
    window.open("http://store.apple.com/us", "_blank");
  });
}


LoginPage.prototype.onShow = function(root, paramBundle) {
  Application.logOut();

  var autoSignAllowed = paramBundle != null && paramBundle[Application.AUTO_LOGIN_PARAM] == "true";
  
  var remember = window.localStorage.remember == "yes";
  
  if (autoSignAllowed && remember && window.localStorage.login != null) {
    this._loginElement.setValue(window.localStorage.login);
  } else {
    this._loginElement.setValue("");
  }
  
  if (autoSignAllowed && remember && window.localStorage.password != null) {
    this._passwordElement.setValue(window.localStorage.password);
  } else {
    this._passwordElement.setValue("");
  }
  
  this._rememberCheckbox.setValue(autoSignAllowed && remember);
  window.localStorage.remember = this._rememberCheckbox.getValue() ? "yes" : "no";  
  
  this._signing = false;
  
  if (autoSignAllowed && remember && this._loginElement.getValue() != "" && this._passwordElement.getValue() != "") {
    this._signIn();
  }
}

LoginPage.prototype.onHide = function() {
}

LoginPage.prototype.hasHistory = function() {
  return true;
}


LoginPage.prototype._restorePassword = function() {
  var login = this._loginElement.getValue();

  if (ValidationUtils.isValidEmail(login)) {
    callback = {
      success: function() {
        Application.hideSpinningWheel();
        Application.showMessage(this.getLocale().PasswordResetRequestMessage, Application.MESSAGE_TIMEOUT_SLOW);
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
    Application.showMessage(this.getLocale().IncorrectEmailMessage);
  }
}

LoginPage.prototype._signIn = function() {
  if (this._signing) {
    return;
  }

  var login = this._loginElement.getValue();
  var isEmailValid = ValidationUtils.isValidEmail(login);
  if (!isEmailValid) {
    UIUtils.indicateInvalidInput(this._loginElement);
  } else if (this._rememberCheckbox.getValue()) {
    window.localStorage.login = login;
  } else {
    window.localStorage.login = null;
  }
  var password = this._passwordElement.getValue();
  if (password == "") {
    UIUtils.indicateInvalidInput(this._passwordElement);
  } else if (this._rememberCheckbox.getValue()) {
    window.localStorage.password = password;
  } else {
    window.localStorage.password = null;
  }

  var page = this;
  if (isEmailValid && password != "") {
    var backendCallback = {
      success: function() {
        this._onCompletion();
        Application.setupUserMenuChooser();
        Application.showMenuPage(HomePage.name);
      },
      failure: function() {
        this._onCompletion();
        Application.showMessage(page.getLocale().InvalidCredentialsMessage);
      },
      error: function() {
        this._onCompletion();
        Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      },

      _onCompletion: function() {
        this._signing = false;
        Application.hideSpinningWheel();
      }.bind(this)
    }

    this._signing = true;
    Application.showSpinningWheel();

    Backend.logIn(login, password, backendCallback);
  } else if (!isEmailValid) {
    Application.showMessage(this.getLocale().InvalidLoginMessage);
  } else {
    Application.showMessage(this.getLocale().ProvideLoginPasswordMessage);
  }
}
