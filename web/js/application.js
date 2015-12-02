
Application = {
  Configuration: {
    LANGUAGES: [ {data: "eng", display: I18n.getLocale().literals.LanguageEnglish}, {data: "rus", display: I18n.getLocale().literals.LanguageRussian}, {data: "ger", display: I18n.getLocale().literals.LanguageGerman}, {data: "esp", display: I18n.getLocale().literals.LanguageSpanish}, {data: "fra", display: I18n.getLocale().literals.LanguageFrench}, {data: "por", display: I18n.getLocale().literals.LanguagePortugeese}, {data: "grc", display: I18n.getLocale().literals.LanguageGreece}, {data: "gon", display: I18n.getLocale().literals.LanguageGondurasee}],
    
    AGE_CATEGORIES: [{data: "young", display: I18n.getLocale().literals.AgeYoung}, {data: "adult", display: I18n.getLocale().literals.AgeAdult}, {data: "senior", display: I18n.getLocale().literals.AgeSenior}],
    RESPONSE_WAIT_TIME: [{data: 168, display: I18n.getLocale().literals.WaitTimeWeek}, {data: 24, display: I18n.getLocale().literals.WaitTimeDay}, {data: 12, display: I18n.getLocale().literals.WaitTimeHalfDay}, {data: 1, display: I18n.getLocale().literals.WaitTimeHour}],
    RESPONSE_QUANTITY: [{data: -1, display: I18n.getLocale().literals.QuantityAll}, {data: 10, display: I18n.getLocale().literals.QuantityTen}, {data: 5, display: I18n.getLocale().literals.QuantityFive}, {data: 3, display: I18n.getLocale().literals.QuantityThree}, {data: 1, display: I18n.getLocale().literals.QuantityOne}],
    GENDERS: [{data: "male", display: I18n.getLocale().literals.GenderMale}, {data: "female", display: I18n.getLocale().literals.GenderFemale}],
    AGE_CATEGORY_PREFERENCE: [{data: "all", display: I18n.getLocale().literals.AgePreferenceAll}, {data: "youngs", display: I18n.getLocale().literals.AgePreferenceYoungs}, {data: "adults", display: I18n.getLocale().literals.AgePreferenceAdults}, {data: "seniors", display: I18n.getLocale().literals.AgePreferenceSeniors}],
    GENDER_PREFERENCE: [{data: "all", display: I18n.getLocale().literals.GenderPreferenceAny}, {data: "male", display: I18n.getLocale().literals.GenderPreferenceMale}, {data: "female", display: I18n.getLocale().literals.GenderPreferenceFemale}],
    INQUIRY_LIMIT_PREFERENCE: [{data: -1, display: I18n.getLocale().literals.IncomingLimitPreferenceAll}, {data: 10, display: I18n.getLocale().literals.IncomingLimitPreferenceTen}, {data: 5, display: I18n.getLocale().literals.IncomingLimitPreferenceFive}, {data: 0, display: I18n.getLocale().literals.IncomingLimitPreferenceNone}],
    
    GENERAL_EXPERTISE_CATEGORY: "general",
    
    PAID_FEATURE_POLICY_FREE: "free",
    PAID_FEATURE_POLICY_PAY: "pay",
    
    
    toTargetGroupString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORY_PREFERENCE[0].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAll;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllWomen;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[1].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungs;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungWomen;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[2].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllAdults;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllAdultMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllAdultWomen;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[3].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllSeniors;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllSeniorMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllSeniorWomen;
        }
      }
      
      throw "Incorrect input parameters";
    },
    
    toUserIdentityString: function (ageCategory, gender) {
      if (ageCategory == this.AGE_CATEGORIES[0].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentityYoungMan;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityYoungWoman;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[1].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentityAdultMan;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityAdultWoman;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[2].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentitySeniorMan;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentitySeniorWoman;
        }
      }
      
      throw "Incorrect input parameters";
    },
    
    dataToString: function(configurationItem, data) {
      var item = this.findConfigurationItem(configurationItem, data);
      return item != null ? item.display : null;
    },
    
    findConfigurationItem: function(configurationItem, data) {
      for (var i in configurationItem) {
        if (configurationItem[i].data == data) {
          return configurationItem[i];
        }
      }
      
      return null;
    }
  },
  
  
  _pageManager: null,
};


Application.AutoLogin = "true";


Application.start = function() {
  this._pageManager = new PageManagement(document.getElementById("RootContainer"), [LoginPage, RestorePasswordPage]);
  
//  window.onbeforeunload = function() {
//    return I18n.getLocale().literals.LeaveApplicationMessage;
//  }
  window.onunload = function() {
    Backend.logOut();
  }
  
  $("#Title-Caption").text(I18n.getLocale().literals.AppTitle);
  
  $("#Footer-ContactUs").text(I18n.getLocale().literals.ContactUs);
  $("#Footer-ContactUs").click(function() {
    UIUtils.showDialog("", "We will need to find a way to open this page");
  });

  
  var showDefaultPage = function() {
    if (Backend.isLogged()) {
      Application.showMenuPage(HomePage.name);
    } else {
      Application.showPage(LoginPage.name);
    }
  }
  
  $("#Title-Caption").click(function() {
    showDefaultPage();
  });
  $("#Title-Logo").click(function() {
    showDefaultPage();
  });
  
  Application._setupLanguageChooser();

}

Application.logOut = function() {
  this._pageManager.destroy();
  
  UIUtils.hideMessage();
  UIUtils.hideSpinningWheel();
  UIUtils.hideDialog();

  Backend.logOut({
    success: function() {
      $("#Title-Options-Separator").css("display", "none");
      $("#Title-Options-User").css("display", "none");

      window.localStorage.remember = "no";
    }
  });
}

Application.reload = function() {
  this._pageManager.reload();

  UIUtils.hideMessage();
  UIUtils.hideSpinningWheel();
  UIUtils.hideDialog();
  
  $("#Footer-ContactUs").text(I18n.getLocale().literals.ContactUs);
}


Application.showPage = function(pageId, paramBundle) {
  this._pageManager.showPage(pageId, paramBundle);
}

Application.showMenuPage = function(childPageId, paramBundle, observer) {
  this._pageManager.showChildPage(MenuPage.name, childPageId, paramBundle, observer);
}

Application.goBack = function(pageId, paramBundle) {
  this._pageManager.goBack();
}



Application.showMenuMarker = function(pageId) {
  this._pageManager.getPage(MenuPage.name).addMenuItemMarker(pageId);
}

Application.clearMenuMarker = function(pageId) {
  this._pageManager.getPage(MenuPage.name).removeMenuItemMarker(pageId);
}



Application.setupUserMenuChooser = function() {
  $("#Title-Options-User-Button").click(function() {
    if ($(".user-menu-popup").length > 0) {
      return;
    }
    
    var popup = UIUtils.appendBlock($("#Title-Options-User").get(0), "Title-User-Popup");
    UIUtils.addClass(popup, "user-menu-popup");
    
    
    var popupCloser = function() {
      var container = UIUtils.get$(popup);
      container.fadeOut("fast", function() {
        container.remove();
      });
    };
    
    var item = UIUtils.appendLink(popup, "ProfileItem", I18n.getLocale().literals.ProfileItem);
    UIUtils.addClass(item, "user-menu-item");
    UIUtils.setClickListener(item, function(lr) {
      popupCloser();
      Application.showPage(UserProfilePage.name);
    });
    
    var item = UIUtils.appendLink(popup, "PreferencesItem", I18n.getLocale().literals.PreferencesItem);
    UIUtils.addClass(item, "user-menu-item");
    UIUtils.setClickListener(item, function(lr) {
      popupCloser();
      Application.showPage(UserPreferencesPage.name);
    });
    
    popup.appendChild(UIUtils.createSeparator());
    
    var item = UIUtils.appendLink(popup, "LogOutItem", I18n.getLocale().literals.LogOutItem);
    UIUtils.addClass(item, "user-menu-item");
    UIUtils.setClickListener(item, function(lr) {
      popupCloser();
      
      Application.logOut();
      Application.showPage(LoginPage.name);
      
      return false;
    });
    
    Application._setPopupCloser("user-menu-popup");
  }.bind(this));
  
  $("#Title-Options-Separator").css("display", "inline-block");
  $("#Title-Options-User").css("display", "inline-block");
  $("#Title-Options-User-Button").text(Backend.getUserProfile().name);
}



Application._setupLanguageChooser = function() {
  $("#Title-Options-Language-Button").click(function() {
    if ($(".language-selection-popup").length > 0) {
      return;
    }
    
    var popup = UIUtils.appendBlock($("#Title-Options-Language").get(0), "Title-Language-Popup");
    UIUtils.addClass(popup, "language-selection-popup");
    
    for (var index in Application.Configuration.LANGUAGES) {
      var languageRecord = Application.Configuration.LANGUAGES[index];
      
      var item = UIUtils.appendLink(popup, languageRecord.data, languageRecord.display);
      UIUtils.addClass(item, "language-selection-item");

      UIUtils.setClickListener(item, function(lr) {
        UIUtils.get$(popup).remove();
        
        $("#Title-Options-Language-Button").text(lr.display);
        I18n.setCurrentLanguage(lr.data);
        window.localStorage.menuLanguage = lr.data;

        Application.reload();
        
        return false;
      }.bind(this, languageRecord));
    }
    
    Application._setPopupCloser("language-selection-popup");
  }.bind(this));
  
  var currentLanguage = window.localStorage.menuLanguage || Application.Configuration.LANGUAGES[0].data;
  var displayLanguage = Application.Configuration.LANGUAGES[0].display;
  for (var index in Application.Configuration.LANGUAGES) {
    if (Application.Configuration.LANGUAGES[index].data == currentLanguage) {
      displayLanguage = Application.Configuration.LANGUAGES[index].display;
      break;
    }
  }
  $("#Title-Options-Language-Button").text(displayLanguage);
}


Application._setPopupCloser = function(popupClass) {
  var popupSelector = "." + popupClass;
  UIUtils.listenOutsideClicks(popupSelector, function() {
      var container = UIUtils.get$(popupSelector);
      container.fadeOut("slow", function() {
        container.remove();
      });
  });
}


