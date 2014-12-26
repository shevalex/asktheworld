
var Application = {
  rootContainer: null,
  currentPage: null,
  loginPage: null
};

Application.start = function() {
  this.rootContainer = document.getElementById("RootContainer");
  
  this.showLoginPage();
  //this.showMenuPage();
}

Application.showLoginPage = function(observer) {
  if (this.loginPage == null) {
    this.loginPage = new LoginPage();
  }
  
  Application._showPage(this.loginPage, observer);
}

Application.showRegisterPage = function(observer) {
  if (this.registerPage == null) {
    this.registerPage = new RegisterPage();
  }
  
  Application._showPage(this.registerPage, observer);
}

Application.showMenuPage = function(observer) {
  if (this.menuPage == null) {
    this.menuPage = new MenuPage();
  }
  
  Application._showPage(this.menuPage, observer);
}




Application._showPage = function(page, observer) {
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


