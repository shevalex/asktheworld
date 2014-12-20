
PisoftToolbar = ClassUtils.defineClass(PisoftComponent, function PisoftToolbar(uniqueId, margin) {
  PisoftComponent.call(this, uniqueId, "pisoft-toolbar pisoft-rounded-border pisoft-non-selectable");
  this.leftComponents = [];
  this.rightComponents = [];
  this.componentMargin = margin != null ? margin : "0px";
});


PisoftToolbar.prototype.buildComponentStructure = function() {
  for (var index in this.leftComponents) {
    this.getHtmlElement().appendChild(this._getComponentHtmlWithMargins(this.leftComponents[index]));
  }

  if (this.rightComponents.length > 0) {
    var rightPanel = document.createElement("div");
    rightPanel.style.cssFloat = "right";
    rightPanel.style.textAlign = "right";
    rightPanel.style.display = "inline-block";

    for (var index in this.rightComponents) {
      rightPanel.appendChild(this._getComponentHtmlWithMargins(this.rightComponents[index]));
    }

    this.getHtmlElement().appendChild(rightPanel);
  }
}


PisoftToolbar.prototype.addPisoftComponent = function(pisoftComponent) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.leftComponents.push(pisoftComponent);
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Component";
  }
}

PisoftToolbar.prototype.addSidePisoftComponent = function(pisoftComponent) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.rightComponents.push(pisoftComponent);
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Component";
  }
}

PisoftToolbar.prototype.setItemMargin = function(margin) {
  this.componentMargin = margin;
  this.update();
}


// Private implementation

PisoftToolbar.prototype._getComponentHtmlWithMargins = function(pisoftComponent) {
  if (this.componentMargin != null) {
    var compound = document.createElement("div");
    compound.style.display = "inline-block";
    compound.style.marginLeft = this.componentMargin;
    compound.style.marginRight = this.componentMargin;
    pisoftComponent.attachToContainer(compound);

    return compound;
  } else {
    return pisoftComponent.getHtmlElement();
  }
}
