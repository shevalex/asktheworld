
 Application = {
  Configuration: {
    LANGUAGES: [ {data: "eng", display: I18n.getLocale().literals.LanguageEnglish}, {data: "rus", display: I18n.getLocale().literals.LanguageRussian}, {data: "ger", display: I18n.getLocale().literals.LanguageGerman}, {data: "esp", display: I18n.getLocale().literals.LanguageSpanish}, {data: "fra", display: I18n.getLocale().literals.LanguageFrench}, {data: "por", display: I18n.getLocale().literals.LanguagePortugeese}, {data: "grc", display: I18n.getLocale().literals.LanguageGreece}, {data: "gon", display: I18n.getLocale().literals.LanguageGondurasee}],
    
    AGE_CATEGORIES: [{data: "child", display: I18n.getLocale().literals.AgeChild}, {data: "teenager", display: I18n.getLocale().literals.AgeTeenager}, {data: "young", display: I18n.getLocale().literals.AgeYoung}, {data: "adult", display: I18n.getLocale().literals.AgeAdult}, {data: "senior", display: I18n.getLocale().literals.AgeSenior}],
    RESPONSE_WAIT_TIME: [{data: 168, display: I18n.getLocale().literals.WaitTimeWeek}, {data: 24, display: I18n.getLocale().literals.WaitTimeDay}, {data: 12, display: I18n.getLocale().literals.WaitTimeHalfDay}, {data: 1, display: I18n.getLocale().literals.WaitTimeHour}],
    RESPONSE_QUANTITY: [{data: -1, display: I18n.getLocale().literals.QuantityAll}, {data: 10, display: I18n.getLocale().literals.QuantityTen}, {data: 5, display: I18n.getLocale().literals.QuantityFive}, {data: 3, display: I18n.getLocale().literals.QuantityThree}, {data: 1, display: I18n.getLocale().literals.QuantityOne}],
    GENDERS: [{data: "male", display: I18n.getLocale().literals.GenderMale}, {data: "female", display: I18n.getLocale().literals.GenderFemale}],
    AGE_CATEGORY_PREFERENCE: [{data: "all", display: I18n.getLocale().literals.AgePreferenceAll}, {data: "children", display: I18n.getLocale().literals.AgePreferenceChildren}, {data: "teenagers", display: I18n.getLocale().literals.AgePreferenceTeenagers}, {data: "youngs", display: I18n.getLocale().literals.AgePreferenceYoungs}, {data: "adults", display: I18n.getLocale().literals.AgePreferenceAdults}, {data: "seniors", display: I18n.getLocale().literals.AgePreferenceSeniors}],
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
          return I18n.getLocale().literals.TargetGroupAllChildren;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllBoys;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllGirls;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[2].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllTeenagers;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllTeenBoys;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllTeenGirls;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[3].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungs;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllYoungWomen;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[4].data) {
        if (gender == this.GENDER_PREFERENCE[0].data) {
          return I18n.getLocale().literals.TargetGroupAllAdults;
        } else if (gender == this.GENDER_PREFERENCE[1].data) {
          return I18n.getLocale().literals.TargetGroupAllAdultMen;
        } else if (gender == this.GENDER_PREFERENCE[2].data) {
          return I18n.getLocale().literals.TargetGroupAllAdultWomen;
        }
      } else if (ageCategory == this.AGE_CATEGORY_PREFERENCE[5].data) {
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
          return I18n.getLocale().literals.UserIdentityBoy;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityGirl;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[1].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentityTeenBoy;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityTeenGirl;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[2].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentityYoungMan;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityYoungWoman;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[3].data) {
        if (gender == this.GENDERS[0].data) {
          return I18n.getLocale().literals.UserIdentityAdultMan;
        } else if (gender == this.GENDERS[1].data) {
          return I18n.getLocale().literals.UserIdentityAdultWoman;
        }
      } else if (ageCategory == this.AGE_CATEGORIES[4].data) {
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
  
  _rootContainer: null,
  _currentPage: null,

  _pages: [],
  
  _messageTimer: null,
   
  _spinnerTimer: null,
  _spinnerCancellationTimer: null
};


Application.MESSAGE_TIMEOUT_FAST = 1;
Application.MESSAGE_TIMEOUT_NORMAL = 5;
Application.MESSAGE_TIMEOUT_SLOW = 10;

Application.AutoLogin = "true";


Application.start = function() {
  this._rootContainer = document.getElementById("RootContainer");
  
//  window.onbeforeunload = function() {
//    return I18n.getLocale().literals.LeaveApplicationMessage;
//  }
  window.onunload = function() {
    Backend.logOut();
  }
  
  $("#Footer-ContactUs").text(I18n.getLocale().literals.ContactUs);
  $("#Footer-ContactUs").click(function() {
    Application.showDialog("", "We will need to find a way to open this page");
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


  var restoreFromHash = function() {
    var hash = window.location.hash.substring(1);
    Application._restoreFromHistory(hash);
  }
  
  window.onhashchange = function() {
    restoreFromHash();
  }

  // check if it is a password recovery request
  if (window.location.hash.length > 1) {
    var hashBundle = Application._deserialize(window.location.hash.substring(1));
    if (hashBundle.page == RestorePasswordPage.name) {
      restoreFromHash();
    } else {
      window.location.hash = "";
      Application.showPage(LoginPage.name);
    }
  } else {
    Application.showPage(LoginPage.name);
  }
}

Application.logOut = function() {
  for (var index in this._pages) {
    this._pages[index].destroy();
  }
  this._pages = [];
  
  this.hideMessage();
  this.hideSpinningWheel();
  this.hideDialog();

  Backend.logOut({
    success: function() {
      $("#Title-Options-Separator").css("display", "none");
      $("#Title-Options-User").css("display", "none");

      window.localStorage.remember = "no";
    }
  });
}

Application.reload = function() {
  for (var index in this._pages) {
    this._pages[index].reload();
  }

  this.hideMessage();
  this.hideSpinningWheel();
  this.hideDialog();
  
  $("#Footer-ContactUs").text(I18n.getLocale().literals.ContactUs);
}


// PAGE MANAGEMENT

Application.showPage = function(pageId, paramBundle) {
  var page = this._getPage(pageId);
  if (page == null)  {
    throw "Page does not exist " + pageId;
    return;
  }
  
  if (paramBundle == null) {
    paramBundle = {};
  }
  if (paramBundle.page == null) {
    paramBundle.page = pageId;
  }

  this._showPage(page, paramBundle);
}

Application.showChildPage = function(parentPageId, childPageId, paramBundle) {
  var page = this._getPage(parentPageId);
  if (page == null)  {
    throw "Page does not exist " + parentPageId;
    return;
  }
  var page = this._getPage(childPageId);
  if (page == null)  {
    throw "Page does not exist " + childPageId;
    return;
  }

  if (paramBundle == null) {
    paramBundle = {};
  }
  paramBundle.parent = parentPageId;
  paramBundle.page = childPageId;

  this._showPage(page, paramBundle);
}

Application.showMenuPage = function(childPageId, paramBundle, observer) {
  Application.showChildPage(MenuPage.name, childPageId, paramBundle, observer);
}

// END OF PAGE MANAGEMEMT


Application.showMenuMarker = function(pageId) {
  this._getPage(MenuPage.name).addMenuItemMarker(pageId);
}

Application.clearMenuMarker = function(pageId) {
  this._getPage(MenuPage.name).removeMenuItemMarker(pageId);
}


Application.showSpinningWheel = function() {
  if (this._spinnerTimer != null) {
    return;
  }
  if (this._spinnerCancellationTimer != null) {
    clearTimeout(this._spinnerCancellationTimer);
    this._spinnerCancellationTimer = null;
  }
  
  if ($(".spinning-wheel").length == 0) {
    this._spinnerTimer = setTimeout(function() {
      $("body").append("<img src='imgs/ajax-loader.gif' class='spinning-wheel'></img>");
    }, 2000);
  }
}

Application.hideSpinningWheel = function() {
  if (this._spinnerCancellationTimer != null) {
    return;
  }
  
  this._spinnerCancellationTimer = setTimeout(function() {
    $(".spinning-wheel").remove();
    
    if (this._spinnerTimer != null) {
      clearTimeout(this._spinnerTimer);
      this._spinnerTimer = null;
    }
    this._spinnerCancellationTimer = null;
  }.bind(this), 1000);
}

Application.showMessage = function(msg, timeout, title) {
  $(".popup-message").remove();

  var bodyElement = $("body").get(0);
  var popup = UIUtils.appendBlock(bodyElement, "PopupMessage");
  UIUtils.addClass(popup, "popup-message");
  
  if (title != null && title != "") {
    var titleLabel = UIUtils.appendBlock(popup, "Title");
    UIUtils.addClass(titleLabel, "popup-message-title");
    titleLabel.innerHTML = title;
  }
  
  var messageText = UIUtils.appendLabel(popup, "Text");
  UIUtils.addClass(messageText, "popup-message-text");
  messageText.innerHTML = msg;
  
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
  
  $("body").append("<div class='modal-dialog' id='ModalDialog'><div class='modal-dialog-content'>" + contentHtml + "</div><hr><div class='modal-dialog-controlpanel'><button class='modal-dialog-okbutton'>" + I18n.getLocale().literals.OkButton + "</button><div></div>");
  $(".modal-dialog-okbutton").click(function() {
    $(".modal-dialog").fadeOut("slow", function() {
      $(this).remove();
    });
  });
  
  Application._setPopupCloser("modal-dialog");
}

Application.hideDialog = function() {
  $(".modal-dialog").remove();
}


Application._getPage = function(pageId) {
  var page = this._pages[pageId];
  if (page == null) {
    if (window[pageId] == null) {
      console.warn("requested unsupported page: " + pageId);
      pageId = PageNotFoundPage.name;
    }
    
    page = new window[pageId]();
    this._pages[pageId] = page;
  }
  
  return page;
}

Application._showPage = function(page, paramBundle) {
  if (page.hasHistory()) {
    this._placeHistory(page, paramBundle);
  } else {
    page.showAnimated(this._rootContainer, paramBundle);
  }
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


Application.isEqualBundle = function(bundle1, bundle2) {
  if (bundle1 == null && bundle2 == null) {
    return true;
  }
  
  
  var processedBundle1 = {};
  if (bundle1 != null) {
    for (var key in bundle1) {
      if (key[0] != '^') {
        processedBundle1[key] = bundle1[key];
      }
    }
  }

  var processedBundle2 = {};
  if (bundle2 != null) {
    for (var key in bundle2) {
      if (key[0] != '^') {
        processedBundle2[key] = bundle2[key];
      }
    }
  }
  
  if (processedBundle1.page == null && processedBundle2.page != null) {
    processedBundle1.page = processedBundle2.page;
  }
  if (processedBundle1.page != null && processedBundle2.page == null) {
    processedBundle2.page = processedBundle1.page;
  }

  if (processedBundle1.parent == null && processedBundle2.parent != null) {
    processedBundle1.parent = processedBundle2.parent;
  }
  if (processedBundle1.parent != null && processedBundle2.parent == null) {
    processedBundle2.parent = processedBundle1.parent;
  }
  
  return GeneralUtils.isEqual(processedBundle1, processedBundle2);
}

// HISTORY MANAGEMENT

Application._restoreFromHistory = function(hash) {
  var historyBundle = Application._deserialize(hash);
  Application._restorePage(historyBundle);
}

Application._restorePage = function(paramBundle) {
  var pageId = paramBundle.parent != null ? paramBundle.parent : paramBundle.page;
  var page = this._getPage(pageId);
  
  if (this._currentPage != null && this._currentPage != page) {
    this._currentPage.hide();
  }

  this._currentPage = page;
  this._currentPage.showAnimated(this._rootContainer, paramBundle);
}


Application.goBack = function() {
  window.history.back();
}

Application._placeHistory = function(page, paramBundle) {
  if (page.hasHistory()) {
    var newHash = Application._serialize(paramBundle);
    if (newHash != window.location.hash) {
      window.location.hash = newHash;
    }
  }
}


Application._serialize = function(parcel) {
  var ser = "";
  
  for (var key in parcel) {
    //Skipping 'hidden' keys
    if (key[0] == '^') {
      continue;
    }
    
    if (ser.length > 0) {
      ser += ":";
    }
    ser += "[" + key + "-" + parcel[key] + "]";
  }
  
  return ser;
}

Application._deserialize = function(ser) {
  var parcel = {};
  
  if (ser == null || ser == "") {
    return parcel;
  }
  
  var tags = ser.split(":");
  for (var index in tags) {
    var tag = tags[index];
    if (tag.charAt(0) != "[" || tag.charAt(tag.length - 1) != "]") {
      console.error("Deserialization integrity issue for tag " + tag);
      continue;
    }
    
    var pair = tag.substring(1, tag.length - 1).split("-");
    if (pair.length != 2) {
      console.error("Deserialization integrity issue for tag " + tag);
      continue;
    }
    
    parcel[pair[0]] = pair[1];
  }
  
  return parcel;
}

// END OF HISTORY MANAGEMENT


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
  $(document).mouseup(function(event) {
    var container = $("." + popupClass);

    if (!container.is(event.target) && container.has(event.target).length == 0) {
      container.fadeOut("slow", function() {
        container.remove();
      });
      $(document).unbind("mouseup");
    }
  });
}
