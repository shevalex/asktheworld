LoginPage = ClassUtils.defineClass(AbstractPage, function LoginPage() {
  AbstractPage.call(this, "LoginPage");
  
  this._loginElementId;
  this._passwordElementId;
});

LoginPage.prototype.definePageContent = function(root) {
  var leftDescription = UIUtils.appendBlock(root, "Description-Left");
  UIUtils.get$(leftDescription).html("Here is where we will place our logo as well as the text which will describe what this project is");

  var rightDescription = UIUtils.appendBlock(root, "Description-Right");
  UIUtils.get$(rightDescription).html("Download the mobile app and stay connected whenever you are!<p><center><a href='https://play.google.com/store' target='_blank'>AskTheWorld for Android</a><p><a href='http://store.apple.com/us' target='_blank'>AskTheWorld for iOS</a><center>");
  
  this._appendLoginPanel(root);
}

LoginPage.prototype.onShow = function() {
  //Eventually we may need to read the login info from local storage and initialize the fileds
  var remember = window.localStorage.remember == "yes";
  
  if (remember && window.localStorage.login != null) {
    UIUtils.get$(this._loginElementId).val(window.localStorage.login);
  } else {
    UIUtils.get$(this._loginElementId).val("");
  }
  
  if (remember && window.localStorage.password != null) {
    UIUtils.get$(this._passwordElementId).val(window.localStorage.password);
  } else {
    UIUtils.get$(this._passwordElementId).val("");
  }
}


LoginPage.prototype._appendLoginPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._loginElementId = UIUtils.createId(contentPanel, "Login");
  contentPanel.appendChild(UIUtils.createLabeledTextInput(this._loginElementId, "Email (login)", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._passwordElementId = UIUtils.createId(contentPanel, "Password");
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput(this._passwordElementId, "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  var rememberCheckbox = UIUtils.appendCheckbox(contentPanel, "RememberLogin", "Remember You?");
  rememberCheckbox.checked = window.localStorage.remember == "yes";
  UIUtils.get$(rememberCheckbox).change(function() {
    window.localStorage.remember = rememberCheckbox.checked ? "yes" : "no";
  });
  
  var signInButton = UIUtils.appendButton(contentPanel, "SignInButton", "Sign In");
  contentPanel.appendChild(UIUtils.createLineBreak());

  var forgotPasswordLink = UIUtils.appendLink(contentPanel, "ForgotPasswordLink", "Forgot your password?");
  UIUtils.setClickListener(forgotPasswordLink, this._restorePassword.bind(this));
  
  var signUpLink = UIUtils.appendLink(contentPanel, "SignUpLink", "Register!");
  UIUtils.setClickListener(signUpLink, function() {
    Application.showRegisterPage();
  });

  UIUtils.setClickListener(signInButton, function() {
    var login = UIUtils.get$(this._loginElementId).val();
    var isEmailValid = ValidationUtils.isValidEmail(login);
    if (!isEmailValid) {
      UIUtils.indicateInvalidInput(this._loginElementId);
    } else if (rememberCheckbox.checked) {
      window.localStorage.login = login;
    } else {
      window.localStorage.login = null;
    }
    var password = UIUtils.get$(this._passwordElementId).val();
    if (password == "") {
      UIUtils.indicateInvalidInput(this._passwordElementId);
    } else if (rememberCheckbox.checked) {
      window.localStorage.password = password;
    } else {
      window.localStorage.password = null;
    }
    
    if (isEmailValid && password != "") {
      var backendCallback = {
        success: function() {
          this._onCompletion();
          Application.showMenuPage();
        },
        failure: function() {
          this._onCompletion();
          Application.showMessage("Invalid login/password combination");
        },
        error: function() {
          this._onCompletion();
          Application.showMessage("Server communication error");
        },
        
        _onCompletion: function() {
          UIUtils.setEnabled(signInButton, true);
          Application.hideSpinningWheel();
        }
      }
      
      UIUtils.setEnabled(signInButton, false);
      Application.showSpinningWheel();
      
      Backend.logIn(login, password, backendCallback);
    } else if (!isEmailValid) {
      Application.showMessage("Please provide a valid email for your login");
    } else {
      Application.showMessage("Please provide login and password");
    }
  }.bind(this));
}

LoginPage.prototype._restorePassword = function() {
  var login = UIUtils.get$(this._loginElementId).val();
  
  if (ValidationUtils.isValidEmail(login)) {
    callback = {
      success: function() {
        Application.hideSpinningWheel();
        Application.showMessage("You will receive an email shortly with a link to reset the password. You may ignore the email if you do not need to reset your password.", Application.MESSAGE_TIMEOUT_SLOW);
      },
      error: function() {
        Application.hideSpinningWheel();
        Application.showMessage("Server communication error");
      }
    }
    
    Application.showMessage("The request is being sent...");
    Application.showSpinningWheel();
    Backend.resetUserPassword(login, callback);
  } else {
    Application.showMessage("Your login does not look like a valid email");
  }
}