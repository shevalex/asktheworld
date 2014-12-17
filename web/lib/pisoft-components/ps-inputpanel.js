
PisoftInputPanel = ClassUtils.defineClass(PisoftComponent, function PisoftInputPanel(uniqueId, margin) {
  PisoftComponent.call(this, uniqueId, "pisoft-inputpanel pisoft-rounded-border");
  this.inputComponents = [];
  this.rightButton = null;
  this.leftButton = null;
  this.componentMargin = margin != null ? margin : "5px";
  this.buttonPaneMargin = "20px";
});

PisoftInputPanel.prototype.getInnerHtml = function() {
  var result = "";

  for (var index in this.inputComponents) {
    result += this._getLabelledComponentHtml(this.inputComponents[index]);
  }

  if (this.leftButton != null) {
    result += "<div style='float: left; text-align: left; margin-top: " + this.buttonPaneMargin + ";'>"
    result += this.leftButton.getHtml();
    result += "</div>"
  }

  if (this.rightButton != null) {
    result += "<div style='float: right; text-align: right; margin-top: " + this.buttonPaneMargin + ";'>"
    result += this.rightButton.getHtml();
    result += "</div>"
  }

  return result;
}

PisoftInputPanel.prototype.addPisoftInputComponent = function(pisoftComponent, label) {
  if (pisoftComponent instanceof PisoftInputComponent) {
    this.addChildPisoftComponent(pisoftComponent);
    this.inputComponents.push({ component: pisoftComponent, label: label });
    pisoftComponent.addCssClass("pisoft-inputpanel-inputcomponent");
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Input Component";
  }
}


PisoftInputPanel.prototype.addLeftPisoftButton = function(pisoftButton) {
  if (pisoftButton instanceof PisoftComponent) {
    this.addChildPisoftComponent(pisoftButton);
    this.leftButton = pisoftButton;
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Button";
  }
}

PisoftInputPanel.prototype.addRightPisoftButton = function(pisoftButton) {
  if (pisoftButton instanceof PisoftComponent) {
    this.addChildPisoftComponent(pisoftButton);
    this.rightButton = pisoftButton;
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Button";
  }
}

PisoftInputPanel.prototype.setItemMargin = function(margin) {
  this.componentMargin = margin;
  this.update();
}


// Private implementation

PisoftInputPanel.prototype._getLabelledComponentHtml = function(labelledComponent) {
  var result = "<div style='display: block; margin-bottom: " + this.componentMargin + ";'>"
  result += "<div class='pisoft-inputpanel-label'>" + labelledComponent.label + "</div>";
  result += labelledComponent.component.getHtml();
  result += "</div>"

  return result;
}

