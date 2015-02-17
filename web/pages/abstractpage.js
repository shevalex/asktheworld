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
});



AbstractPage.prototype.destroy = function() {
  this.hide();
  this.onDestroy();
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
  this.placeHistory();
}

AbstractPage.prototype.showAnimated = function(container, paramBundle, completionObserver) {
  this.show(container, paramBundle)
  
  this._pageElement.style.display = "none";
  $("#" + this._pageId).slideDown("slow", completionObserver);
}

AbstractPage.prototype.hide = function() {
  if (this.isShown()) {
    this.onHide();
    this._pageElement.parentElement.removeChild(this._pageElement);
  }
}

AbstractPage.prototype.hideAnimated = function(completionObserver) {
  if (this.isShown()) {
    this.onHide();
    $("#" + this._pageId).slideUp("fast", function() {
      this._pageElement.parentElement.removeChild(this._pageElement);
      if (completionObserver != null) {
        completionObserver();
      }
    }.bind(this));
  } else if (completionObserver != null) {
    completionObserver();
  }
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

AbstractPage.prototype.onDestroy = function() {
}

AbstractPage.prototype.provideHistory = function() {
  return this.getHistoryPrefix();
}

AbstractPage.prototype.getHistoryPrefix = function() {
  if (this._parentPage != null) {
    return Application.makeHistory([["parent", this._parentPage._pageId], ["page", this._pageId]]);
  } else {
    return Application.makeHistoryTag("page", this._pageId);
  }
}

AbstractPage.prototype.placeHistory = function() {
  var history = this.provideHistory();
  if (history != null) {
    window.location.hash = history;
  }
}

AbstractPage.prototype.getLocale = function(lang) {
  return I18n.getPageLocale(this._pageId, lang);
}


