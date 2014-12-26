RegisterPage = ClassUtils.defineClass(AbstractPage, function RegisterPage() {
  AbstractPage.call(this, "RegisterPage");
});

RegisterPage.prototype.definePageContent = function(root) {
  var contentPanel = root.appendChild(UIUtils.createBlock("RegisterPage-Panel"));
  
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
}

