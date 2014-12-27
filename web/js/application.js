
var Application = {
  _rootContainer: null,
  _currentPage: null,
  
  _loginPage: null,
  _registerPage: null,
  _menuPage: null
};

Application.start = function() {
  this._rootContainer = document.getElementById("RootContainer");
  
  this.showLoginPage();
  //this.showMenuPage();
}

Application.showLoginPage = function(observer) {
  if (this._loginPage == null) {
    this._loginPage = new LoginPage();
  }
  
  Application._showPage(this._loginPage, observer);
}

Application.showRegisterPage = function(observer) {
  if (this._registerPage == null) {
    this._registerPage = new RegisterPage();
  }
  
  Application._showPage(this._registerPage, observer);
}

Application.showMenuPage = function(observer) {
  if (this._menuPage == null) {
    this._menuPage = new MenuPage();
  }
  
  Application._showPage(this._menuPage, observer);
}

Application.getMenuPage = function() {
  return this._menuPage;
}


Application._showPage = function(page, observer) {
  if (this._currentPage != null) {
    this._currentPage.hideAnimated(function() {
      this._currentPage = page;
      this._currentPage.showAnimated(this._rootContainer, observer);
    }.bind(this));
  } else {
    this._currentPage = page;
    this._currentPage.showAnimated(this._rootContainer, observer);
  }
}


