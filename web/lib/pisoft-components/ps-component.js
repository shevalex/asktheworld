
PisoftComponent = ClassUtils.defineClass(Object, function PisoftComponent(uniqueId, cssClasses, text) {
  if (uniqueId == null) {
    throw "Unique id must be set";
  }
  if (cssClasses == null) {
    throw "CSS class(s) must be set";
  }

  this.uniqueId = uniqueId;
  this.displayText = text ? text : "";
  this.cssClasses = cssClasses;
  this.parent = null;
});

PisoftComponent.prototype.getHtml = function() {
  return "<div id='" + this.uniqueId + "' class='" + this.cssClasses + "'>" + this.getInnerHtml() + "</div>";
}

PisoftComponent.prototype.getInnerHtml = function() {
  return this.displayText;
}

PisoftComponent.prototype.getHtmlElement = function() {
  return document.getElementById(this.uniqueId);
}

PisoftComponent.prototype.getId = function() {
  return this.uniqueId;
}

PisoftComponent.prototype.getHtmlElement = function() {
  return document.getElementById(this.uniqueId);
}


PisoftComponent.prototype.addToContainer = function(containerId) {
  var container = document.getElementById(containerId);
  if (container != null) {
    this.addToParent(container);
  } else {
    console.error(ClassUtils.formatMessage("Parent with id=" + containerId + " is not found"));
  }
}

PisoftComponent.prototype.addToParent = function(parent) {
  if (parent != null) {
    if (this.parent != null) {
      this.removeFromParent();
    }

    this.parent = parent;
    this.parent.insertAdjacentHTML("beforeend", this.getHtml());
  } else {
    console.error(ClassUtils.formatMessage("Parent container is not provided"));
  }
}

PisoftComponent.prototype.removeFromParent = function() {
  if (this.parent != null) {
    this.parent.removeChild(this.getHtmlElement());
    this.parent = null;
  } else {
    console.error(ClassUtils.formatMessage("Not attached to the parent"));
  }
}

PisoftComponent.prototype.update = function() {
  if (this.parent != null) {
    this.addToParent(this.parent);
  }
}



PisoftComponent.prototype.setCssClasses = function(cssClasses) {
  this.cssClasses = cssClasses;
  this.update();
}

PisoftComponent.prototype.addCssClass = function(cssClass) {
  this.cssClasses += cssClass;
  this.update();
}

PisoftComponent.prototype.removeCssClass = function(cssClass) {
  this.cssClasses = this.cssClasses.replace(cssClass, "");
  this.update();
}


PisoftComponent.prototype.setText = function(text) {
  this.displayText = text;
  this.update();
}
