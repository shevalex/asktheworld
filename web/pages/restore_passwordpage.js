RestorePasswordPage = ClassUtils.defineClass(AbstractPage, function RestorePasswordPage() {
  AbstractPage.call(this, RestorePasswordPage.name);
  
  this._loginElement;
  this._passwordElement;
  this._rememberCheckbox;
  
  this._recoveryToken;
  
  this._changing = false;
});

RestorePasswordPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var labelPanel = UIUtils.appendBlock(contentPanel, "LabelPanel");
  UIUtils.appendLabel(labelPanel, "EmailLabel", I18n.getLocale().literals.EmailLoginLabel);
  UIUtils.appendLabel(labelPanel, "PasswordLabel", I18n.getLocale().literals.PasswordLabel);
  UIUtils.appendLabel(labelPanel, "RetypePasswordLabel", I18n.getLocale().literals.RetypePasswordLabel);
  
  var controlPanel = UIUtils.appendBlock(contentPanel, "ControlPanel");
  this._loginElement = UIUtils.appendTextInput(controlPanel, "Login");
  this._passwordElement = UIUtils.appendPasswordInput(controlPanel, "Password");
  this._retypePasswordElement = UIUtils.appendPasswordInput(controlPanel, "RetypePassword");
  UIUtils.get$(this._passwordElement).on("input", function() {
    this._retypePasswordElement.setValue("");
  }.bind(this));
  
  var buttonsPanel = UIUtils.appendBlock(controlPanel, "ButtonsPanel");
  var signInButton = UIUtils.appendButton(buttonsPanel, "ChangeButton", this.getLocale().ChangePasswordButton);
  UIUtils.setClickListener(signInButton, function() {
    this._changePassword();
  }.bind(this));
}


RestorePasswordPage.prototype.onShow = function(root, paramBundle) {
  this._loginElement.setValue("");
  this._passwordElement.setValue("");
  this._retypePasswordElement.setValue("");
  
  this._recoveryToken = paramBundle.recoveryToken;
}

RestorePasswordPage.prototype.onHide = function() {
}


RestorePasswordPage.prototype._changePassword = function() {
  if (this._changing) {
    return;
  }

  var login = this._loginElement.getValue();
  var isEmailValid = ValidationUtils.isValidEmail(login);
  if (!isEmailValid) {
    UIUtils.indicateInvalidInput(this._loginElement);
    Application.showMessage(this.getLocale().ProvideLoginMessage);
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

  var page = this;
  var backendCallback = {
    success: function() {
      this._onCompletion();
      Application.showMessage(page.getLocale().PasswordChangedMessage);
      Application.showPage(LoginPage.name);
    },
    failure: function() {
      this._onCompletion();
      Application.showMessage(page.getLocale().UnknownLoginOrTokenMessage);
    },
    error: function() {
      this._onCompletion();
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
    },

    _onCompletion: function() {
      this._changing = false;
      Application.hideSpinningWheel();
    }.bind(this)
  }

  this._changing = true;
  Application.showSpinningWheel();

  Backend.setUserPassword(login, password, this._recoveryToken, backendCallback);
}
