
var Application = {
  Configuration: {
    AGE_CATEGORIES: [{data: "child", display: "Child"}, {data: "teenager", display: "Teenager"}, {data: "young", display: "Young Adult"}, {data: "adult", display: "Adult"}, {data: "senior", display: "Senior"}],
    RESPONSE_WAIT_TIME: [{data: 148, display: "1 week"}, {data: 24, display: "1 day"}, {data: 12, display: "half-day"}, {data: 1, display: "1 hour"}],
    RESPONSE_QUANTITY: [{data: -1, display: "As many as arrive"}, {data: 10, display: "Ten"}, {data: 3, display: "Three"}, {data: 1, display: "Just the first one"}],
    GENDERS: [{data: "male", display: "Male"}, {data: "female", display: "Female"}],
    AGE_CATEGORY_PREFERENCE: [{data: "all", display: "All"}, {data: "children", display: "Children"}, {data: "teenagers", display: "Teenagers"}, {data: "young", display: "Youngs"}, {data: "adults", display: "Adults"}, {data: "seniors", display: "Seniors"}],
    GENDER_PREFERENCE: [{data: "any", display: "Any"}, {data: "male", display: "Male"}, {data: "female", display: "Female"}],
    INQUIRY_LIMIT_PREFERENCE: [{data: -1, display: "As many as possible"}, {data: 10, display: "No more than ten"}, {data: 5, display: "No more than five"}, {data: 0, display: "I don't want to get any inquiries"}],
    
    toTargetGroupString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORY_PREFERENCE[0].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all people";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all men";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[1].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all children";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all boys";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all girls";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[2].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all teenagers";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all teen guys";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all teen girls";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[3].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all young people";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all young men";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all young women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[4].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all adult people";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all adult men";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all adult women";
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[5].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return "all senior people";
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return "all senior men";
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return "all senior women";
        }
      }
      
      throw "Incorrect input parameters";
    },
    
    toUserIdentityString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORIES[0].data) {
        if (gender == this.GENDERS[0].data) {
          return "boy";
        } else if (gender == this.GENDERS[1].data) {
          return "girl";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[1].data) {
        if (gender == this.GENDERS[0].data) {
          return "teen boy";
        } else if (gender == this.GENDERS[1].data) {
          return "teen girl";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[2].data) {
        if (gender == this.GENDERS[0].data) {
          return "young man";
        } else if (gender == this.GENDERS[1].data) {
          return "young woman";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[3].data) {
        if (gender == this.GENDERS[0].data) {
          return "man";
        } else if (gender == this.GENDERS[1].data) {
          return "woman";
        }
      } else if (ageCategory == this.AGE_CATEGORIES[4].data) {
        if (gender == this.GENDERS[0].data) {
          return "senior man";
        } else if (gender == this.GENDERS[1].data) {
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

  $("#Footer-ContactUs").click(function() {
    Application.showDialog("About Us", "We will need to find a way to open this page");
  });
}

Application.reset = function() {
  this._loginPage = null;
  this._registerPage = null;
  this._menuPage = null;
  
  this.hideMessage();
  this.hideSpinningWheel();
  this.hideDialog();
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
  
  Application._showPage(this.getMenuPage(), null, observer);
}

Application.getMenuPage = function() {
  if (this._menuPage == null) {
    this._menuPage = new MenuPage();
  }

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
  Application.hideMessage();

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


Application.showDialog = function(title, contentHtml) {
  Application.hideDialog();
  
  $("body").append("<div class='modal-dialog' id='ModalDialog'><div class='modal-dialog-content'>" + contentHtml + "</div><hr><div class='modal-dialog-controlpanel'><button class='modal-dialog-okbutton'>OK</button><div></div>");
  $(".modal-dialog-okbutton").click(function() {
    $(".modal-dialog").fadeOut("slow", function() {
      $(this).remove();
    });
  });
  
  $(document).mouseup(function(event) {
    var container = $(".modal-dialog");

    if (!container.is(event.target) && container.has(event.target).length == 0) {
      container.fadeOut("slow", function() {
        container.remove();
      });
      $(document).unbind("mouseup");
    }
  });
}

Application.hideDialog = function() {
  $(".modal-dialog").remove();
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



