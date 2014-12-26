
var Application = {
  rootContainer: null,
  currentPage: null,
  loginPage: null
};

Application.start = function() {
  this.rootContainer = document.getElementById("RootContainer");
  
  this.showLoginPage();
}

Application.showLoginPage = function(observer) {
  if (this.loginPage == null) {
    this.loginPage = new LoginPage();
  }
  
  Application.showPage(this.loginPage);
}

Application.showRegisterPage = function(observer) {
  if (this.registerPage == null) {
    this.registerPage = new RegisterPage();
  }
  
  Application.showPage(this.registerPage);
}

Application.showPage = function(page, observer) {
  if (this.currentPage != null) {
    this.currentPage.hideAnimated(function() {
      this.currentPage = page;
      this.currentPage.showAnimated(this.rootContainer, observer);
    }.bind(this));
  } else {
    this.currentPage = page;
    this.currentPage.showAnimated(this.rootContainer, observer);
  }
}


