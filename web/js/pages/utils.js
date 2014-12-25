
ClassUtils = {};

ClassUtils.defineClass = function(superClass, childConstructor) {
  var childClass = childConstructor;
  var childClassName = childConstructor.name;
  if (childClassName == null || childClassName.length == 0) {
    throw "Please provide a child constructor with the name";
  }

  if (superClass != null) {
    childClass.prototype = Object.create(superClass.prototype);
  }

  childClass.prototype.constructor = childConstructor;

  return childClass;
}


UIUtils = {};

UIUtils.createLabeledInputField = function(inputFieldId, labelText, margin) {
  var compoundElement = document.createElement("div");
  compoundElement.style.display = "inline-block";
  compoundElement.style.textAlign = "left";

  var labelElement = document.createElement("div");
  labelElement.setAttribute("id", inputFieldId + "-Label");
  labelElement.innerHTML = labelText;
  labelElement.style.display = "inline-block";
  compoundElement.appendChild(labelElement);
  
  compoundElement.appendChild(UIUtils.createLineBreak());

  var inputFieldElement = document.createElement("input");
  inputFieldElement.setAttribute("type", "text");
  inputFieldElement.setAttribute("id", inputFieldId);
  inputFieldElement.style.display = "inline-block";
  if (margin != null) {
    inputFieldElement.style.marginTop = margin;
  }
  compoundElement.appendChild(inputFieldElement);

  return compoundElement;
}

UIUtils.createButton = function(buttonId, text) {
  var buttonElement = document.createElement("button");
  buttonElement.setAttribute("id", buttonId);
  buttonElement.innerHTML = text;
  
  return buttonElement;
}

UIUtils.createBlock = function(blockId) {
  var blockElement = document.createElement("div");
  if (blockId != null) {
    blockElement.setAttribute("id", blockId);
  }
  
  return blockElement;
}


UIUtils.createLink = function(linkId, text) {
  var linkElement = document.createElement("a");
  linkElement.setAttribute("id", linkId);
  linkElement.setAttribute("href", "#");
  linkElement.style.display = "block";
  linkElement.innerHTML = text;
  linkElement.style.display = "block";
  
  return linkElement;
}

UIUtils.createLineBreak = function() {
  return document.createElement("br");
}
