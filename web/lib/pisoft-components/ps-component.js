
PisoftComponent = ClassUtils.defineClass(Object, function PisoftComponent(uniqueId, cssClasses, text, tagType) {
  if (uniqueId == null) {
    console.warn("A pisoft object is created without a unique id provided");
  }
  if (cssClasses == null) {
    throw "CSS class(s) must be set";
  }

  this.element = document.createElement(tagType ? tagType : "div");
  this.setText(text);

  this.setCssClasses(cssClasses);
  if (uniqueId != null) {
    this.element.setAttribute("id", uniqueId);
  }
});

PisoftComponent.prototype.getHtmlElement = function() {
  return this.element;
}

PisoftComponent.prototype.getId = function() {
  return this.element.getAttribute("id");
}


PisoftComponent.prototype.attachToContainer = function(containerId) {
  var container = document.getElementById(containerId);
  if (container != null) {
    this.detachFromContainer();
    container.appendChild(this.element);
    this._onAttachToParent();
  } else {
    console.error(ClassUtils.formatMessage("Parent with id=" + containerId + " is not found"));
  }
}

PisoftComponent.prototype.detachFromContainer = function() {
  var parent = this.element.parentNode;
  if (parent != null) {
    parent.removeChild(this.element);
  }
}

PisoftComponent.prototype.update = function() {
  if (this.element.parentNode != null) {
    this._rebuildComponentStructure();
  }
}


PisoftComponent.prototype.setCssClasses = function(cssClasses) {
  this.element.setAttribute("class", cssClasses);
}

PisoftComponent.prototype.addCssClass = function(cssClass) {
  this.element.setAttribute("class", this.element.getAttribute("class") + " " + cssClass);
}

PisoftComponent.prototype.removeCssClass = function(cssClass) {
  var cssClasses = this.element.getAttribute("class");
  cssClasses = this.cssClasses.replace(cssClass, "");
  this.element.setAttribute("class", cssClasses);
}

PisoftComponent.prototype.setExtraStyles = function(extraStyles) {
  var styles = this.element.getAttribute("style") || "";
  for (var style in extraStyles) {
    styles += " " + style + ": " + extraStyles[style] + ";"
  }
  this.element.setAttribute("style", styles);
}

PisoftComponent.prototype.setText = function(text) {
  this.element.innerHTML = text;
}

PisoftComponent.prototype.setWidth = function(widthSpecifier) {
  this.setExtraStyles({"width": widthSpecifier});
}

PisoftComponent.prototype.setClickListener = function(clickListener) {
  this.element.onclick = clickListener;
}


PisoftComponent.prototype.buildComponentStructure = function() {
  // the default implementation does nothing.
}



// Private implementation

PisoftComponent.prototype._onAttachToParent = function() {
  this._rebuildComponentStructure();
}

PisoftComponent.prototype._rebuildComponentStructure = function() {
  while (this.element.firstChild) {
    this.element.removeChild(this.element.firstChild);
  }

  this.buildComponentStructure();
}


