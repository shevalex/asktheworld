
PisoftToolbar = ClassUtils.defineClass(PisoftComponent, function PisoftToolbar(uniqueId, margin) {
  PisoftComponent.call(this, uniqueId, "pisoft-toolbar pisoft-rounded-border");
  this.leftComponents = [];
  this.rightComponents = [];
  this.componentMargin = margin != null ? margin : "0px";
});

PisoftToolbar.prototype.getInnerHtml = function() {
  var result = "";

  for (var index in this.leftComponents) {
    result += this._getComponentHtmlWithMargins(this.leftComponents[index]);
  }

  if (this.rightComponents.length > 0) {
    result += "<div style='float: right; text-align: right;'>"
    for (var index in this.rightComponents) {
      result += this._getComponentHtmlWithMargins(this.rightComponents[index]);
    }
    result += "</div>"
  }

  return result;
}

PisoftToolbar.prototype.addPisoftComponent = function(pisoftComponent) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.addChildPisoftComponent(pisoftComponent);
    this.leftComponents.push(pisoftComponent);
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Component";
  }
}

PisoftToolbar.prototype.addSidePisoftComponent = function(pisoftComponent) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.addChildPisoftComponent(pisoftComponent);
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
    var result = "<div style='display: inline-block; margin-left: " + this.componentMargin + "; margin-right: " + this.componentMargin + "'>"
    result += pisoftComponent.getHtml();
    result += "</div>"
    return result;
  } else {
    return pisoftComponent.getHtml();
  }
}
