WelcomePage = ClassUtils.defineClass(AbstractPage, function WelcomePage() {
  AbstractPage.call(this, "WelcomePage");
});

WelcomePage.prototype.definePageContent = function(root) {
  var descriptionPanel = UIUtils.appendBlock(root, "Description");
  descriptionPanel.innerHTML = "Welcome, " + Backend.getUserProfile().name + "<p> We are gald to see you in here. This super site gives you access to an absolutely unique abilities and experiences. Here is how you should use it";
  
  var goBackPanel = UIUtils.appendBlock(root, "GoHome");
  var linkId = UIUtils.createId(goBackPanel, "HomePageLink");
  goBackPanel.innerHTML = "Click <a href='#' id='" + linkId + "'>Home</a> to start!";
  
  UIUtils.setClickListener(linkId, function() {
    Application.showMenuPage();
  });
}
