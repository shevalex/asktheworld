
PisoftInputPanel = ClassUtils.defineClass(PisoftComponent, function PisoftInputPanel(uniqueId, margin) {
  PisoftComponent.call(this, uniqueId, "pisoft-inputpanel pisoft-rounded-border");
  this.panelComponents = [];
  this.rightButton = null;
  this.leftButton = null;
  this.componentMargin = margin != null ? margin : "5px";
  this.buttonPaneMargin = "20px";
});

PisoftInputPanel.prototype.buildComponentStructure = function() {
  for (var index in this.panelComponents) {
    this.getHtmlElement().appendChild(this._getLabelledComponent(this.panelComponents[index]));
  }

  if (this.leftButton != null) {
    var leftPanel = document.createElement("div");
    leftPanel.style.float = "left";
    leftPanel.style.textAlign = "left";
    leftPanel.style.marginTop = this.buttonPaneMargin;
    leftPanel.appendChild(this.leftButton.getHtmlElement());
    this.getHtmlElement().appendChild(leftPanel);
  }

  if (this.rightButton != null) {
    var rightPanel = document.createElement("div");
    rightPanel.style.float = "right";
    rightPanel.style.textAlign = "right";
    rightPanel.style.marginTop = this.buttonPaneMargin;
    rightPanel.appendChild(this.rightButton.getHtmlElement());
    this.getHtmlElement().appendChild(rightPanel);
  }
}


PisoftInputPanel.prototype.addPisoftInputComponent = function(pisoftComponent, label) {
  if (pisoftComponent instanceof PisoftInputComponent) {
    this.panelComponents.push({ component: pisoftComponent, label: label });
    pisoftComponent.addCssClass("pisoft-inputpanel-inputcomponent");
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Input Component";
  }
}

PisoftInputPanel.prototype.addPisoftComponent = function(pisoftLabel) {
  if (pisoftComponent instanceof PisoftComponent) {
    this.panelComponents.push({ component: pisoftComponent });
    pisoftComponent.addCssClass("pisoft-inputpanel-component");
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Input Component";
  }
}


PisoftInputPanel.prototype.addLeftPisoftButton = function(pisoftButton) {
  if (pisoftButton instanceof PisoftComponent) {
    this.leftButton = pisoftButton;
    this.update();
  } else {
    throw "Passed in component is not a Pisoft Button";
  }
}

PisoftInputPanel.prototype.addRightPisoftButton = function(pisoftButton) {
  if (pisoftButton instanceof PisoftComponent) {
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

PisoftInputPanel.prototype._getLabelledComponent = function(formComponent) {
  var compound = document.createElement("div");
  compound.style.display = "block";
  compound.style.marginBottom = this.componentMargin;

  if (formComponent.label != null) {
    var label = document.createElement("div");
    label.setAttribute("class", "pisoft-inputpanel-label");
    label.innerHTML = formComponent.label;
    compound.appendChild(label);
  }

  compound.appendChild(formComponent.component.getHtmlElement());

  return compound;
}

