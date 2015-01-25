
var Application = {
  Configuration: {
    AGE_CATEGORIES: ["Child", "Teenager", "Young", "Adult", "Senior"],
    RESPONSE_WAIT_TIME: ["1 week", "1 day", "half-day", "1 hours", "30 mins"],
    RESPONSE_QUANTITY: ["As many as arrive", "Ten", "Three", "Just the first one"],
    GENDERS: ["Male", "Female"],
    AGE_CATEGORY_PREFERENCE: ["All", "Children", "Teenagers", "Youngs", "Adults", "Seniors"],
    GENDER_PREFERENCE: ["Any", "Male", "Female"],
    INQUIRY_LIMIT_PREFERENCE: ["As many as possible", "No more than ten", "No more than five", "I don't want to get any inquiries"],
    
    toTargetGroupString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORY_PREFERENCE[0]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all people";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all men";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[1]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all children";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all boys";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all girls";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[2]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all teenagers";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all teen guys";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all teen girls";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[3]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all young people";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all young men";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all young women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[4]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all adult people";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all adult men";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all adult women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[5]) {
        if (gender == this.GENDER_PREFERENCE[0]) {
          return "all senior people";
        } else if (gender == this.GENDER_PREFERENCE[1]) {
          return "all senior men";
        } else if (gender == this.GENDER_PREFERENCE[2]) {
          return "all senior women";
        }
      }
      
      throw "Incorrect input parameters";
    },
    
    toUserIdentityString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORIES[0]) {
        if (gender == this.GENDERS[0]) {
          return "boy";
        } else if (gender == this.GENDERS[1]) {
          return "girl";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[1]) {
        if (gender == this.GENDERS[0]) {
          return "teen boy";
        } else if (gender == this.GENDERS[1]) {
          return "teen girl";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[2]) {
        if (gender == this.GENDERS[0]) {
          return "young man";
        } else if (gender == this.GENDERS[1]) {
          return "young woman";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[3]) {
        if (gender == this.GENDERS[0]) {
          return "man";
        } else if (gender == this.GENDERS[1]) {
          return "woman";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[4]) {
        if (gender == this.GENDERS[0]) {
          return "senior man";
        } else if (gender == this.GENDERS[1]) {
          return "senior woman";
        }
      }
      
      throw "Incorrect input parameters";
    }
  },
  
  _rootContainer: null,
  _currentPage: null,
  
  _loginPage: null,
  _registerPage: null,
  _menuPage: null,
  
  _messageTimer: null
};

Application.MESSAGE_TIMEOUT_FAST = 1;
Application.MESSAGE_TIMEOUT_NORMAL = 5;
Application.MESSAGE_TIMEOUT_SLOW = 10;


Application.start = function() {
  this._rootContainer = document.getElementById("RootContainer");
  
  this.showLoginPage();
}

Application.showLoginPage = function(observer) {
  if (this._loginPage == null) {
    this._loginPage = new LoginPage();
  }
  
  Application._showPage(this._loginPage, null, observer);
}

Application.showRegisterPage = function(observer) {
  if (this._registerPage == null) {
    this._registerPage = new RegisterPage();
  }
  
  Application._showPage(this._registerPage, null, observer);
}

Application.showMenuPage = function(observer) {
  if (this._menuPage == null) {
    this._menuPage = new MenuPage();
  }
  
  Application._showPage(this._menuPage, null, observer);
}

Application.getMenuPage = function() {
  return this._menuPage;
}

Application.showSpinningWheel = function() {
  if ($(".spinning-wheel").length == 0) {
    $("body").append("<img src='imgs/ajax-loader.gif' class='spinning-wheel'></img>");
  }
}

Application.hideSpinningWheel = function() {
  $(".spinning-wheel").remove();
}

Application.showMessage = function(msg, timeout) {
  if ($(".popup-message").length > 0) {
    Application.hideMessage();
  }
  $("body").append("<div class='popup-message'>" + msg + "</div>");
  $(".popup-message").fadeIn("slow");
  
  if (this._messageTimer != null) {
    clearTimeout(this._messageTimer);
  }
  
  var timeToShow = Application.MESSAGE_TIMEOUT_NORMAL;
  if (timeout == "slow") {
    timeToShow = Application.MESSAGE_TIMEOUT_SLOW;
  } else if (timeout == "fast") {
    timeToShow = Application.MESSAGE_TIMEOUT_FAST;
  } else if (typeof timeout == "number") {
    timeToShow = timeout;
  }
  this._messageTimer = setTimeout(function() {
    Application.hideMessage();
  }, timeToShow * 1000);
}

Application.hideMessage = function() {
  $(".popup-message").fadeOut("slow", function() {
    $(this).remove();
  });
}


Application._showPage = function(page, paramBundle, observer) {
  if (this._currentPage != null) {
    this._currentPage.hideAnimated(function() {
      this._currentPage = page;
      this._currentPage.showAnimated(this._rootContainer, paramBundle, observer);
    }.bind(this));
  } else {
    this._currentPage = page;
    this._currentPage.showAnimated(this._rootContainer, paramBundle, observer);
  }
}



