AbstractPage = ClassUtils.defineClass(Object, function AbstractPage(pageId) {
  if (pageId == null) {
    throw "Page Id must be specified";
  }
  this._pageId = pageId;
  
  this._pageElement = document.createElement("div");
  this._pageElement.setAttribute("id", pageId);
  this._pageElement.setAttribute("class", "application-page");
  
  this._parentPage = null;
  
  this._isDefined = false;
  
  AbstractPage._addHistoryListener(function() {
    var hash = window.location.hash.substr(1);
    
    if (this.isPageHistory(hash)) {
      this.restoreFromHistory(hash);
    }
  }.bind(this));
});


AbstractPage._historyListeners = [];
AbstractPage._addHistoryListener = function(listener) {

  if (AbstractPage._historyListeners.length == 0) {
    //perform one-time registration
    window.onhashchange = function() {
      for (var index in AbstractPage._historyListeners) {
        AbstractPage._historyListeners[index]();
      }
    }
  }

  AbstractPage._historyListeners.push(listener);
}

AbstractPage.prototype.show = function(container, paramBundle) {
  if (container instanceof AbstractPage) {
    container.getContentPanel().appendChild(this._pageElement);
    this._parentPage = container;
  } else {
    container.appendChild(this._pageElement);
  }
  
  if (!this._isDefined) {
    this.definePageContent(this._pageElement);
    this._isDefined = true;
  }
  this.onShow(this._pageElement, paramBundle);
  this.putHistory();
}

AbstractPage.prototype.showAnimated = function(container, paramBundle, completionObserver) {
  this.show(container, paramBundle)
  
  this._pageElement.style.display = "none";
  $("#" + this._pageId).slideDown("slow", completionObserver);
}

AbstractPage.prototype.hide = function() {
  this.onHide();
  if (this._pageElement.parentElement != null) {
    this._pageElement.parentElement.removeChild(this._pageElement);
  }
}

AbstractPage.prototype.hideAnimated = function(completionObserver) {
  this.onHide();
  $("#" + this._pageId).slideUp("fast", function() {
    this._pageElement.parentElement.removeChild(this._pageElement);
    if (completionObserver != null) {
      completionObserver();
    }
  }.bind(this));
}

AbstractPage.prototype.getContentPanel = function() {
  return this._pageElement;
}

AbstractPage.prototype.isShown = function() {
  return this._pageElement.parentElement != null;
}

AbstractPage.prototype.definePageContent = function(root) {
}

AbstractPage.prototype.onShow = function(root) {
}

AbstractPage.prototype.onHide = function() {
}

AbstractPage.prototype.putHistory = function() {
  window.location.hash = this.getHistoryPrefix();
}

AbstractPage.prototype.restoreFromHistory = function(hash) {
  if (hash.indexOf("[parent]") == 0) {
    var pageIdStartIndex = hash.indexOf("-[page]-");
    var parentPageId = hash.substring(9, pageIdStartIndex);
    
    var indexOfSuffix = hash.indexOf("-", pageIdStartIndex + 9);
    if (indexOfSuffix == -1) {
      var childPageId = hash.substring(pageIdStartIndex + 8);
      Application.showChildPage(parentPageId, childPageId);
    } else {
      var childPageId = hash.substring(pageIdStartIndex + 8, indexOfSuffix);
      Application.showChildPage(parentPageId, childPageId, {history: hash.substring(indexOfSuffix + 1)});
    }
  } else if (hash.indexOf("[page]") == 0) {
    var indexOfSuffix = hash.indexOf("-", 7);
    if (indexOfSuffix == -1) {
      var pageId = hash.substring(7);
      Application.showPage(pageId);
    } else {
      var pageId = hash.substring(7, indexOfSuffix);
      Application.showPage(pageId, {history: hash.substring(indexOfSuffix + 1)});
    }
  } else {
    console.error("Incorrect hash: " + hash);
  }
}

AbstractPage.prototype.isPageHistory = function(hash) {
  return hash.indexOf(this.getHistoryPrefix()) == 0;
}

AbstractPage.prototype.getHistoryPrefix = function() {
  if (this._parentPage != null) {
    return "[parent]-" + this._parentPage._pageId + "-[page]-" + this._pageId;
  } else {
    return "[page]-" + this._pageId;
  }
}

AbstractPage.prototype.getLocale = function(lang) {
  return I18n.getPageLocale(this._pageId, lang);
}


