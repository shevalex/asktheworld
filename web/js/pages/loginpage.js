LoginPage = ClassUtils.defineClass(AbstractPage, function LoginPage() {
  AbstractPage.call(this, "LoginPage");
});

LoginPage.prototype.definePageContent = function(root) {
  root.appendChild(this._createLoginPanel());
    
  root.appendChild(UIUtils.createBlock("LoginPage-StatusPanel"));
  
  root.appendChild(UIUtils.createBlock("LoginPage-Description"));
  $("#LoginPage-Description").html("Here is where we will place our logo as well as the text which will describe what this project is");
  
  $("#LoginPage-SignInButton").click(function() {
    $("#LoginPage-StatusPanel").text("");
    
    var login = $("#LoginPage-Login").val();
    if (login == "") {
      UIUtils.indicateInvalidInput("LoginPage-Login");
    }
    var password = $("#LoginPage-Password").val();
    if (password == "") {
      UIUtils.indicateInvalidInput("LoginPage-Password");
    }
    
    if (login != "" && password != "") {
      var backendCallback = {
        success: function() {
          Application.showMenuPage();
        },
        failure: function() {
          $("#LoginPage-StatusPanel").text("Failed to login");
        },
        error: function() {
          $("#LoginPage-StatusPanel").text("Server communication error");
        }
      }
      Backend.logIn(login, password, backendCallback);
    } else {
      $("#LoginPage-StatusPanel").text("Please provide login and password");
    }
  });
  
  $("#LoginPage-SignUpLink").click(function() {
    Application.showRegisterPage();
  });

  $("#LoginPage-ForgotPasswordLink").click(function() {
    alert("This is not that smart of you to forget your password. What do you want me to do? It is all your fault!");
  });
}


LoginPage.prototype._createLoginPanel = function() {
  var contentPanel = UIUtils.createBlock("LoginPage-Panel");
  
  contentPanel.appendChild(UIUtils.createLabeledTextInput("LoginPage-Login", "Email (login)", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("LoginPage-Password", "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createButton("LoginPage-SignInButton", "Sign In"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLink("LoginPage-ForgotPasswordLink", "Forgot your password?"));
  contentPanel.appendChild(UIUtils.createLink("LoginPage-SignUpLink", "Register!"));
  
  return contentPanel;
}