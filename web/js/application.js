
var Application = {
  Configuration: {
    LANGUAGES: [{data: "rus", display: I18n.getLocale().literals.LanguageRussian}, {data: "eng", display: I18n.getLocale().literals.LanguageEnglish}, {data: "ger", display: I18n.getLocale().literals.LanguageGerman}, {data: "esp", display: I18n.getLocale().literals.LanguageSpanish}, {data: "fra", display: I18n.getLocale().literals.LanguageFrench}, {data: "por", display: I18n.getLocale().literals.LanguagePortugeese}, {data: "grc", display: I18n.getLocale().literals.LanguageGreece}, {data: "gon", display: I18n.getLocale().literals.LanguageGondurasee}],
    
    AGE_CATEGORIES: [{data: "child", display: I18n.getLocale().literals.AgeChild}, {data: "teenager", display: I18n.getLocale().literals.AgeTeenager}, {data: "young", display: I18n.getLocale().literals.AgeYoung}, {data: "adult", display: I18n.getLocale().literals.AgeAdult}, {data: "senior", display: I18n.getLocale().literals.AgeSenior}],
    RESPONSE_WAIT_TIME: [{data: 148, display: I18n.getLocale().literals.WaitTimeWeek}, {data: 24, display: I18n.getLocale().literals.WaitTimeDay}, {data: 12, display: I18n.getLocale().literals.WaitTimeHalfDay}, {data: 1, display: I18n.getLocale().literals.WaitTimeHour}],
    RESPONSE_QUANTITY: [{data: -1, display: I18n.getLocale().literals.QuantityAll}, {data: 5, display: I18n.getLocale().literals.QuantityFive}, {data: 10, display: I18n.getLocale().literals.QuantityTen}, {data: 3, display: I18n.getLocale().literals.QuantityThree}, {data: 1, display: I18n.getLocale().literals.QuantityOne}],
    GENDERS: [{data: "male", display: I18n.getLocale().literals.GenderMale}, {data: "female", display: I18n.getLocale().literals.GenderFemale}],
    AGE_CATEGORY_PREFERENCE: [{data: "all", display: I18n.getLocale().literals.AgePreferenceAll}, {data: "children", display: I18n.getLocale().literals.AgePreferenceChildren}, {data: "teenagers", display: I18n.getLocale().literals.AgePreferenceTeenagers}, {data: "young", display: I18n.getLocale().literals.AgePreferenceYoungs}, {data: "adults", display: I18n.getLocale().literals.AgePreferenceAdults}, {data: "seniors", display: I18n.getLocale().literals.AgePreferenceSeniors}],
    GENDER_PREFERENCE: [{data: "any", display: I18n.getLocale().literals.GenderPreferenceAny}, {data: "male", display: I18n.getLocale().literals.GenderPreferenceMale}, {data: "female", display: I18n.getLocale().literals.GenderPreferenceFemale}],
    INQUIRY_LIMIT_PREFERENCE: [{data: -1, display: I18n.getLocale().literals.IncomingLimitPreferenceAll}, {data: 10, display: I18n.getLocale().literals.IncomingLimitPreferenceTen}, {data: 5, display: I18n.getLocale().literals.IncomingLimitPreferenceFive}, {data: 0, display: I18n.getLocale().literals.IncomingLimitPreferenceNone}],
    
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
    }
  },
  
  _rootContainer: null,
  _currentPage: null,

  _pages: [],
  
  _messageTimer: null
};

Application.MESSAGE_TIMEOUT_FAST = 1;
Application.MESSAGE_TIMEOUT_NORMAL = 5;
Application.MESSAGE_TIMEOUT_SLOW = 10;


Application.start = function() {
  this._rootContainer = document.getElementById("RootContainer");
  
  window.onhashchange = function() {
    var hash = window.location.hash.substr(1); 
    Application.restoreFromHistory(hash);
  }
  
  window.onbeforeunload = function() {
    return I18n.getLocale().literals.LeaveApplicationMessage;
  }
  
  
  this.showPage(LoginPage.name);

  $("#Footer-ContactUs").click(function() {
    Application.showDialog("About Us", "We will need to find a way to open this page");
  });
}

Application.reset = function() {
  for (var index in this._pages) {
    this._pages[index].destroy();
  }
  this._pages = [];
  
  this.hideMessage();
  this.hideSpinningWheel();
  this.hideDialog();
  
  Application.showPage(LoginPage.name);
}


// PAGE MANAGEMENT

Application.showPage = function(pageId, paramBundle, observer) {
  var page = this._getPage(pageId);
  if (page == null)  {
    throw "Page does not exist " + pageId;
    return;
  }
  
  if (this._currentPage == page) {
    if (observer != null) {
      observer();
    }
    return;
  }
  
  var showNewPage = function() {
    this._currentPage = page;
    this._currentPage.showAnimated(this._rootContainer, paramBundle, observer);
  }.bind(this);
  
  if (this._currentPage != null) {
    this._currentPage.hideAnimated(function() {
      showNewPage();
    }.bind(this));
  } else {
    showNewPage();
  }
}

Application.showChildPage = function(parentPageId, childPageId, paramBundle, observer) {
  Application.showPage(parentPageId, null, function() {
    this._getPage(parentPageId).showChildPage(childPageId, paramBundle, observer);
  }.bind(this));
}

Application.showMenuPage = function(childPageId, paramBundle, observer) {
  Application.showChildPage(MenuPage.name, childPageId, paramBundle, observer);
}


// END OF PAGE MANAGEMEMT



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
  
  $("body").append("<div class='modal-dialog' id='ModalDialog'><div class='modal-dialog-content'>" + contentHtml + "</div><hr><div class='modal-dialog-controlpanel'><button class='modal-dialog-okbutton'>" + I18n.getLocale().literals.OkButton + "</button><div></div>");
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


Application._getPage = function(pageId) {
  var page = this._pages[pageId];
  if (page == null) {
    if (window[pageId] == null) {
      return null;
    }
    
    page = new window[pageId]();
    this._pages[pageId] = page;
  }
  
  return page;
}



// HISTORY MANAGEMENT

Application.restoreFromHistory = function(hash) {
  var parentPageId = Application.getHistoryTagValue("parent");
  
  if (parentPageId != null) {
    var childPageId = Application.getHistoryTagValue("page");
    if (childPageId != null) {
      Application.showChildPage(parentPageId, childPageId, {history: hash});
    } else {
      console.error("Icorrect hash - parent without child: " + hash);
    }
  } else {
    var pageId = Application.getHistoryTagValue("page");
    if (pageId != null) {
      Application.showPage(pageId, {history: hash});
    } else {
      console.error("Incorrect hash - no page:" + hash);
    }
  }
}

Application.getHistoryTagValue = function(tagName) {
  var hash = window.location.hash;
  
  var tagStartIndex = hash.indexOf("[" + tagName);
  if (tagStartIndex == -1) {
    return null;
  }
  
  var tagClosingIndex = hash.indexOf("]", tagStartIndex);
  if (tagClosingIndex == -1) {
    return null;
  }
  
  return hash.substring(tagStartIndex + tagName.length + 2, tagClosingIndex);
}

Application.makeHistoryTag = function(tagName, value) {
  return "[" + tagName + "-" + value + "]";
}

Application.makeHistory = function(tagValueArray) {
  var hash = "";
  
  for (var index in tagValueArray) {
    if (hash.length > 0) {
      hash += "-";
    }
    
    if (typeof tagValueArray[index] == "string") {
      hash += tagValueArray[index];
    } else {
      hash += Application.makeHistoryTag(tagValueArray[index][0], tagValueArray[index][1]);
    }
  }
  
  return hash;
}

// END OF HISTORY MANAGEMENT


