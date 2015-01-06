AbstractPage = ClassUtils.defineClass(Object, function AbstractPage(pageId) {
  if (pageId == null) {
    throw "Page Id must be specified";
  }
  this._pageId = pageId;
  
  this._pageElement = document.createElement("div");
  this._pageElement.setAttribute("id", pageId);
  this._pageElement.setAttribute("class", "application-page");
  
  this._isDefined = false;
});

AbstractPage.prototype.show = function(container, paramBundle) {
  this._pageElement.style.display = "block";
  container.appendChild(this._pageElement);
  if (!this._isDefined) {
    this.definePageContent(this._pageElement);
    this._isDefined = true;
  }
  this.onShow(this._pageElement, paramBundle);
}

AbstractPage.prototype.showAnimated = function(container, paramBundle, completionObserver) {
  this._pageElement.style.display = "none";
  container.appendChild(this._pageElement);
  
  if (!this._isDefined) {
    this.definePageContent(this._pageElement);
    this._isDefined = true;
  }
  this.onShow(this._pageElement, paramBundle);
  
  $("#" + this._pageId).slideDown("slow", completionObserver);
}

AbstractPage.prototype.hide = function() {
  if (this._pageElement.parentElement != null) {
    this._pageElement.parentElement.removeChild(this._pageElement);
  }
}

AbstractPage.prototype.hideAnimated = function(completionObserver) {
  $("#" + this._pageId).slideUp("fast", function() {
    this._pageElement.parentElement.removeChild(this._pageElement);
    if (completionObserver != null) {
      completionObserver();
    }
  }.bind(this));
}


AbstractPage.prototype.isShown = function() {
  return this._pageElement.parentElement != null;
}

AbstractPage.prototype.definePageContent = function(root) {
}

AbstractPage.prototype.onShow = function(root) {
}
