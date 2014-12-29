RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, "RegisterPage");
});

RegisterPage.prototype.definePageContent = function(root) {
  root.appendChild(this._createRegisterPanel());
  
  root.appendChild(UIUtils.createBlock("RegisterPage-Description-Left"));
  $("#RegisterPage-Description-Left").html("By registering you will get an instant access to the secret technology that we provide");

  root.appendChild(UIUtils.createBlock("RegisterPage-Description-Right"));
  $("#RegisterPage-Description-Right").html("Already have an account?<br>Click <a href='#' id='RegisterPage-Description-Right-SignInLink'>Sign In</a>.");
  $("#RegisterPage-Description-Right-SignInLink").click(function() {
    Application.showLoginPage();
  })
  

  root.appendChild(UIUtils.createBlock("RegisterPage-StatusPanel"));
  

  $("#RegisterPage-Password").on("input", function() {
    $("#RegisterPage-RetypePassword").val("");
  });
  
  
  $("#RegisterPage-RegisterButton").click(function() {
    $("#RegisterPage-StatusPanel").text("");
    
    var email = $("#RegisterPage-Email").val();
    if (email == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Email");
    }
    
    var name = $("#RegisterPage-Name").val();
    if (name == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Name");
    }
    
    var languages = $("#RegisterPage-Languages").val();
    if (languages == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Languages");
    }

    var password = $("#RegisterPage-Password").val();
    if (password == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Password");
    }
    
    var retypePassword = $("#RegisterPage-RetypePassword").val();
    if (retypePassword == "" || retypePassword != password) {
      UIUtils.indicateInvalidInput("RegisterPage-RetypePassword");
    }

    if (email != "" && name != "" && languages != "" && password != "" && password == retypePassword) {
      var backendCallback = {
        _buttonSelector: $(this),
        
        success: function() {
          this._onCompletion();
          Application.showMenuPage();
        },
        failure: function() {
          this._onCompletion();
          $("#RegisterPage-StatusPanel").text("Failed to create an account");
        },
        conflict : function() {
          this._onCompletion();
          $("#RegisterPage-StatusPanel").text("This login is already used");
        },
        error: function() {
          this._onCompletion();
          $("#RegisterPage-StatusPanel").text("Server communication error");
        },
        
        _onCompletion: function() {
          this._buttonSelector.prop("disabled", false);
          Application.hideSpinningWheel();
        }
      }
      
      var userProfile = {
        login: email,
        password: password,
        name: name,
        gender: $("#RegisterPage-Gender").val(),
        languages: [$("#RegisterPage-Languages").val()],
        age: $("#RegisterPage-AgeCategory").val(),
      };
      
      $(this).prop("disabled", true);
      Application.showSpinningWheel();

      Backend.registerUser(userProfile, backendCallback);
    } else if (password == retypePassword) {
      $("#RegisterPage-StatusPanel").text("Some of the fields are not provided. All of them are mandatory.");
    } else {
      $("#RegisterPage-StatusPanel").text("Passwords do not match. Please retype.");
    }
  });
}


RegisterPage.prototype._createRegisterPanel = function() {
  var contentPanel = UIUtils.createBlock("RegisterPage-Panel");
  
  contentPanel.appendChild(UIUtils.createLabeledTextInput("RegisterPage-Email", "Your Email", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledTextInput("RegisterPage-Name", "Your Nick Name", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("RegisterPage-Gender", "Your Gender", Application.Configuration.GENDERS, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("RegisterPage-AgeCategory", "Your Age Category", Application.Configuration.AGE_CATEGORIES, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledTextInput("RegisterPage-Languages", "Languages that you speak", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("RegisterPage-Password", "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("RegisterPage-RetypePassword", "Re-type Password", "10px"));
  
  contentPanel.appendChild(UIUtils.createLineBreak());  
  contentPanel.appendChild(UIUtils.createButton("RegisterPage-RegisterButton", "Register"));
  
  return contentPanel;
}