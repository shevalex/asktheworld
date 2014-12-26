
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

UIUtils.INVALID_INPUT_BACKGROUND = "rgb(255, 100, 100)";


UIUtils.createLabeledTextInput = function(inputFieldId, labelText, margin) {
  return UIUtils._createLabeledCombo(inputFieldId, labelText, UIUtils.createTextInput(inputFieldId), margin);
}

UIUtils.createLabeledPasswordInput = function(inputFieldId, labelText, margin) {
  return UIUtils._createLabeledCombo(inputFieldId, labelText, UIUtils.createPasswordInput(inputFieldId), margin);
}

UIUtils.createLabeledDropList = function(dropListId, labelText, options, margin) {
  return UIUtils._createLabeledCombo(dropListId, labelText, UIUtils.createDropList(dropListId, options), margin);
}

UIUtils.createLabel = function(labelId, labelText) {
  var labelElement = document.createElement("div");
  labelElement.setAttribute("id", labelId);
  labelElement.innerHTML = labelText;
  labelElement.style.display = "block";
  
  return labelElement;
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

UIUtils.createTextInput = function(inputFieldId) {
  return UIUtils._createInputField(inputFieldId, "text");
}

UIUtils.createPasswordInput = function(inputFieldId) {
  return UIUtils._createInputField(inputFieldId, "password");
}

UIUtils.createDropList = function(listId, items) {
  var listElement = document.createElement("select");
  listElement.setAttribute("id", listId);
  listElement.style.width = "100%";
  
  for (var index in items) {
    var optionElement = document.createElement("option");
    optionElement.innerHTML = items[index];
    listElement.appendChild(optionElement);
  }
  
  return listElement;
}

UIUtils.createLink = function(linkId, text) {
  var linkElement = document.createElement("a");
  linkElement.setAttribute("id", linkId);
  linkElement.setAttribute("href", "#");
  linkElement.style.display = "block";
  linkElement.innerHTML = text;
  
  return linkElement;
}

UIUtils.createLineBreak = function() {
  return document.createElement("br");
}

UIUtils.createList = function(listId, items) {
  var listElement = document.createElement("ul");
  linkElement.setAttribute("id", listId);
  
  for (var index in items) {
    var itemElement = listElement.appendChild(document.createElement("li"));
    itemElement.setAttribute("id", listId + "-Item" + index);
    itemElement.innerHTML = items[index];
  }
  
  return listElement;
}

UIUtils.createSeparator = function() {
  return document.createElement("hr");
}


UIUtils.animateBackgroundColor = function(elementId, color, speed, observer) {
  var jQueryObject = $("#" + elementId);
  var initialColor = jQueryObject.css("backgroundColor");
  
  var speed = speed || "slow";
  jQueryObject.animate({backgroundColor: color}, speed, function() {
    jQueryObject.animate({backgroundColor: initialColor}, speed, function() {
      if (observer != null) {
        observer();
      }
    });
  });
}

UIUtils.indicateInvalidInput = function(elementId, observer) {
  UIUtils.animateBackgroundColor(elementId, UIUtils.INVALID_INPUT_BACKGROUND, "slow", observer);
}




UIUtils._createLabeledCombo = function(inputFieldId, labelText, inputElement, margin) {
  var compoundElement = document.createElement("div");
  compoundElement.style.display = "block";
  compoundElement.style.textAlign = "left";

  compoundElement.appendChild(UIUtils.createLabel(inputFieldId + "-Label", labelText));

  compoundElement.appendChild(inputElement);
  if (margin != null) {
    inputElement.style.marginTop = margin;
  }

  return compoundElement;
}

UIUtils._createInputField = function(inputFieldId, inputType) {
  var inputFieldElement = document.createElement("input");
  inputFieldElement.setAttribute("type", inputType != null ? inputType : "text");
  inputFieldElement.setAttribute("id", inputFieldId);
  inputFieldElement.style.display = "block";
  inputFieldElement.style.width = "100%";
  
  return inputFieldElement;
}

