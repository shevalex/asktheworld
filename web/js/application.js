
var Application = {
  rootContainer: null
};

Application.start = function() {
  this.rootContainer = document.getElementById("RootContainer");
  
  this.showLoginPage();
}

/*
Application.createWebSite = function() {
  //Toolbar.initialize();
  //ContentArea.initialize();
}
*/

Application.showLoginPage = function() {
  var loginPage = new LoginPage();
  
  loginPage.showAnimated(this.rootContainer);
}



