
PisoftToolbar = ClassUtils.defineClass(PisoftComponent, function PisoftToolbar(uniqueId, margin) {
  PisoftComponent.call(this, uniqueId);
  this.leftComponents = [];
  this.rightComponents = [];
  this.componentMargin = margin != null ? margin : 0;
});

PisoftToolbar.prototype.CSS_CLASS = "pisoft-toolbar pisoft-rounded-border";


PisoftToolbar.prototype.getHtml = function() {
  var result = "<div id='" + this.uniqueId + "' class='" + PisoftToolbar.prototype.CSS_CLASS + "'>"

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

  result += "</div>";

  return result;
}

PisoftToolbar.prototype.addComponent = function(pisoftComponent) {
  if (pisoftComponent != null) {
    this.leftComponents.push(pisoftComponent);
  }
  this.update();
}

PisoftToolbar.prototype.addSideComponent = function(pisoftComponent) {
  if (pisoftComponent != null) {
    this.rightComponents.push(pisoftComponent);
  }
  this.update();
}

PisoftToolbar.prototype.setComponentMargin = function(margin) {
  this.componentMargin = margin;
  this.update();
}


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
