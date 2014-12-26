LoginPage = ClassUtils.defineClass(AbstractPage, function LoginPage() {
  AbstractPage.call(this, "LoginPage");
});

LoginPage.prototype.definePageContent = function(root) {
  var contentPanel = root.appendChild(UIUtils.createBlock("LoginPage-Panel"));
  
  contentPanel.appendChild(UIUtils.createLabeledTextInput("LoginPage-Login", "Email (login)", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledPasswordInput("LoginPage-Password", "Password", "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createButton("LoginPage-SignInButton", "Sign In"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLink("LoginPage-ForgotPasswordLink", "Forgot your password?"));
  contentPanel.appendChild(UIUtils.createLink("LoginPage-SignUpLink", "Register!"));
  
  $("#LoginPage-SignUpLink").click(function() {
    Application.showRegisterPage();
  });
  
  var descriptionPanel = root.appendChild(UIUtils.createBlock("LoginPage-Description"));
  descriptionPanel.innerHTML = "Here is where we will place our logo as well as the text which will describe what this project is";
}
