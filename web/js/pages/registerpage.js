RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, "RegisterPage");
});

RegisterPage.prototype.definePageContent = function(root) {
  root.appendChild(this._createRegisterPanel());
  
  root.appendChild(UIUtils.createBlock("RegisterPage-StatusPanel"));
  
  root.appendChild(UIUtils.createBlock("RegisterPage-Description-Left"));
  root.appendChild(UIUtils.createBlock("RegisterPage-Description-Right"));
  $("#RegisterPage-Description-Left").html("By registering you will get an instant access to the secret technology that we provide");
  $("#RegisterPage-Description-Right").html("Please complete all the fields");

  
  $("#RegisterPage-RegisterButton").click(function() {
    $("#RegisterPage-StatusPanel").text("");
    
    var email = $("#RegisterPage-Email").val();
    if (email == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Email");
    }
    
    var name = $("#RegisterPage-Name").val();
    if (name == "") {
      UIUtils.indicateInvalidInput("RegisterPage-Email");
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
        success: function() {
          Application.showMenuPage();
        },
        failure: function() {
          $("#RegisterPage-StatusPanel").text("Failed to create an account");
        },
        conflict : function() {
          $("#RegisterPage-StatusPanel").text("This login is already used");
        },
        error: function() {
          $("#RegisterPage-StatusPanel").text("Server communication error");
        }
      }
      
      var userProfile = {
        login: email,
        password: password,
        name: name,
        gender: $("#RegisterPage-Gender").val(),
        languages: $("#RegisterPage-Languages").val(),
        age: $("#RegisterPage-AgeCategory").val(),
      };
      
      Backend.registerUser(userProfile, backendCallback);
    } else if (password == retypePassword) {
      $("#RegisterPage-StatusPanel").text("Some of the fields are not provided. All of them are mandatory");
    } else {
      $("#RegisterPage-StatusPanel").text("Passwords do not match. Please retype");
    }
  });
}


RegisterPage.prototype._createRegisterPanel = function() {
  var contentPanel = UIUtils.createBlock("RegisterPage-Panel");
  
  contentPanel.appendChild(UIUtils.createLabeledTextInput("RegisterPage-Email", "Your Email", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledTextInput("RegisterPage-Name", "Your Nick Name", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("RegisterPage-Gender", "Your Gender", ["Male", "Female"], "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("RegisterPage-AgeCategory", "Your Age Category", ["Child", "Teenager", "Young", "Adult", "Senior"], "10px"));
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