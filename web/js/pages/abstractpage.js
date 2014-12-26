AbstractPage = ClassUtils.defineClass(Object, function AbstractPage(pageId) {
  if (pageId == null) {
    throw "Page Id must be specified";
  }
  this.pageId = pageId;
  
  this.pageElement = document.createElement("div");
  this.pageElement.setAttribute("id", pageId);
  
  this.isDefined = false;
});

AbstractPage.prototype.show = function(container) {
  this.pageElement.style.display = "block";
  container.appendChild(this.pageElement);
  this.definePageContent(this.pageElement);
}

AbstractPage.prototype.showAnimated = function(container, completionObserver) {
  this.pageElement.style.display = "none";
  container.appendChild(this.pageElement);
  
  if (!this.isDefined) {
    this.definePageContent(this.pageElement);
    this.isDefined = true;
  }
  $("#" + this.pageId).slideDown("slow", completionObserver);
}

AbstractPage.prototype.hide = function() {
  if (this.pageElement.parentElement != null) {
    this.pageElement.parentElement.removeChild(this.pageElement);
  }
}

AbstractPage.prototype.hideAnimated = function(completionObserver) {
  $("#" + this.pageId).slideUp("fast", function() {
    this.pageElement.parentElement.removeChild(this.pageElement);
    if (completionObserver != null) {
      completionObserver();
    }
  }.bind(this));
}


AbstractPage.prototype.isShown = function() {
  return this.pageElement.parentElement != null;
}

AbstractPage.prototype.definePageContent = function(root) {
}
