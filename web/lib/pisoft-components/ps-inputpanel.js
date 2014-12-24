
PisoftInputPanel = ClassUtils.defineClass(PisoftContainer, function PisoftInputPanel(uniqueId, margin) {
  PisoftContainer.call(this, uniqueId, "pisoft-inputpanel");
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
    leftPanel.style.cssFloat = "left";
    leftPanel.style.textAlign = "left";
    leftPanel.style.marginTop = this.buttonPaneMargin;
    this.leftButton.attachToContainer(leftPanel);
    this.getHtmlElement().appendChild(leftPanel);
  }

  if (this.rightButton != null) {
    var rightPanel = document.createElement("div");
    rightPanel.style.cssFloat = "right";
    rightPanel.style.textAlign = "right";
    rightPanel.style.marginTop = this.buttonPaneMargin;
    this.rightButton.attachToContainer(rightPanel);
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

PisoftInputPanel.prototype.addPisoftComponent = function(pisoftComponent) {
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

  formComponent.component.attachToContainer(compound);

  return compound;
}

