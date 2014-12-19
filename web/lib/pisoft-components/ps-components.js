
// Label

PisoftLabel = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayText) {
  PisoftComponent.call(this, uniqueId, "pisoft-label", displayText);
});



// Button

PisoftButton = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayName) {
  PisoftComponent.call(this, uniqueId, "pisoft-solidbutton pisoft-button pisoft-rounded-border", displayName);
});

PisoftLinkButton = ClassUtils.defineClass(PisoftComponent, function PisoftLinkButton(uniqueId, displayName) {
  PisoftComponent.call(this, uniqueId, "pisoft-linkbutton pisoft-button pisoft-rounded-border-active", displayName);
});




// Input components

PisoftInputComponent = ClassUtils.defineClass(PisoftComponent, function PisoftInputComponent(uniqueId, type, tagType) {
  PisoftComponent.call(this, uniqueId, "pisoft-inputcomponent pisoft-rounded-border", "", tagType ? tagType : "input");
  this.getHtmlElement().setAttribute("type", type);
});
PisoftInputComponent.prototype.getValue = function() {
  return this.getHtmlElement().value;
}

PisoftInputField = ClassUtils.defineClass(PisoftInputComponent, function PisoftInputField(uniqueId) {
  PisoftInputComponent.call(this, uniqueId, "text");
  this.addCssClass("pisoft-inputfield");
});

PisoftInputPassword = ClassUtils.defineClass(PisoftInputComponent, function PisoftInputPassword(uniqueId) {
  PisoftInputComponent.call(this, uniqueId, "password");
  this.addCssClass("pisoft-inputpassword");
});


// Drop Lists

PisoftDropList = ClassUtils.defineClass(PisoftInputComponent, function PisoftDropList(uniqueId, options) {
  PisoftInputComponent.call(this, uniqueId, "", "select");
  this.addCssClass("pisoft-droplist");
  this.setOptions(options);
});
PisoftDropList.prototype.setOptions = function(options) {
  this.options = options;
  this.update();
}
PisoftDropList.prototype.buildComponentStructure = function() {
  for (var index in this.options) {
    var optionElement = document.createElement("option");
    optionElement.innerHTML = this.options[index];
    this.getHtmlElement().appendChild(optionElement);
  }
}


