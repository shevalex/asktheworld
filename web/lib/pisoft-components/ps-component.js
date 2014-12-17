
PisoftComponent = ClassUtils.defineClass(Object, function PisoftComponent(uniqueId, cssClasses, text, tagType) {
  if (uniqueId == null) {
    throw "Unique id must be set";
  }
  if (cssClasses == null) {
    throw "CSS class(s) must be set";
  }

  this.uniqueId = uniqueId;
  this.displayText = text ? text : "";
  this.cssClasses = cssClasses;
  this.extraStyles = {};
  this.widthStyle = null;
  this.tagType = tagType ? tagType : "div";
  this.clickListener = null;

  this.parentElement = null;

  this.childComponents = [];
});

PisoftComponent.prototype.getHtml = function() {
  var result = "<" + this.tagType + " id='" + this.uniqueId + "' class='" + this.cssClasses + "'";

  if (Object.keys(this.extraStyles).length > 0 || this.widthStyle != null) {
    result += " style='";
    for (var style in this.extraStyles) {
      result += style + ": " + this.extraStyles[style] + "; ";
    }
 
    if (this.widthStyle != null) {
      result += "width: " + this.widthStyle + ";"
    }
    result += "'";
  }

  result += ">" + this.getInnerHtml() + "</" + this.tagType + ">";

  return result;
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


PisoftComponent.prototype.attachToContainer = function(containerId) {
  var container = document.getElementById(containerId);
  if (container != null) {
    this._attachToParent(container);
  } else {
    console.error(ClassUtils.formatMessage("Parent with id=" + containerId + " is not found"));
  }
}

PisoftComponent.prototype.detachFromContainer = function() {
  this._detachFromParent();
}

PisoftComponent.prototype.update = function() {
  if (this.parentElement != null) {
    this._attachToParent(this.parentElement);
  }
}

PisoftComponent.prototype.addChildPisoftComponent = function(pisoftComponent) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.childComponents.push(pisoftComponent);
  } else {
    throw "Passed component is not a pisoft component";
  }
}

PisoftComponent.prototype.removeChildPisoftComponent = function(pisoftComponent) {
  throw "Not implemented";
}



PisoftComponent.prototype.setCssClasses = function(cssClasses) {
  this.cssClasses = cssClasses;
  this.update();
}

PisoftComponent.prototype.addCssClass = function(cssClass) {
  this.cssClasses += " " + cssClass;
  this.update();
}

PisoftComponent.prototype.removeCssClass = function(cssClass) {
  this.cssClasses = this.cssClasses.replace(cssClass, "");
  this.update();
}

PisoftComponent.prototype.setExtraStyles = function(extraStyles) {
  this.extraStyles = extraStyles;
  this.update();
}

PisoftComponent.prototype.setTagType = function(tagType) {
  this.tagType = tagType;
  this.update();
}

PisoftComponent.prototype.setText = function(text) {
  this.displayText = text;
  this.update();
}

PisoftComponent.prototype.setWidth = function(widthSpecifier) {
  this.widthStyle = widthSpecifier;
  this.update();
}

PisoftComponent.prototype.setClickListener = function(clickListener) {
  this.clickListener = clickListener;

  if (this.parentElement != null) {
    this.getHtmlElement().onclick = this.clickListener;
  }
}




// Private implementation

PisoftComponent.prototype._attachToParent = function(parentElement) {
  if (parentElement != null) {
    if (this.parentElement != null) {
      this._detachFromParent();
    }

    this.parentElement = parentElement;
    this.parentElement.insertAdjacentHTML("beforeend", this.getHtml());

    this._notifyAttached();
  } else {
    console.error(ClassUtils.formatMessage("Parent container is not provided"));
  }
}

PisoftComponent.prototype._detachFromParent = function() {
  if (this.parentElement != null) {
    this.parentElement.removeChild(this.getHtmlElement());
    this.parentElement = null;
    this._notifyDetached();
  } else {
    console.error(ClassUtils.formatMessage("Not attached to the parent"));
  }
}

PisoftComponent.prototype._notifyAttached = function() {
  this._onAttached();
  for (var index in this.childComponents) {
    this.childComponents[index]._notifyAttached();
  }
}

PisoftComponent.prototype._notifyDetached = function() {
  this._onDetached();
  for (var index in this.childComponents) {
    this.childComponents[index]._notifyDetached();
  }
}


PisoftComponent.prototype._onAttached = function() {
  this.getHtmlElement().onclick = this.clickListener;
}

PisoftComponent.prototype._onDetached = function() {
}
