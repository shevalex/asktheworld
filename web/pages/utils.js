
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
  labelElement.style.display = "block";
  if (labelText != null) {
    labelElement.innerHTML = labelText;
  }
  
  return labelElement;
}

UIUtils.createButton = function(buttonId, text) {
  var buttonElement = document.createElement("button");
  buttonElement.setAttribute("id", buttonId);
  buttonElement.style.whiteSpace = "nowrap";
  buttonElement.style.overflow = "hidden";

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

UIUtils.createSpan = function(width, margin, blockId) {
  var blockElement = document.createElement("span");
  if (blockId != null) {
    blockElement.setAttribute("id", blockId);
  }
  if (width != null) {
    blockElement.style.width = width;
  }
  if (margin != null) {
    blockElement.style.margin = margin;
  }
  blockElement.style.display = "inline-block";
  
  return blockElement;
}

UIUtils.createTextInput = function(inputFieldId) {
  return UIUtils._createInputField(inputFieldId, "text");
}

UIUtils.createPasswordInput = function(inputFieldId) {
  return UIUtils._createInputField(inputFieldId, "password");
}

UIUtils.createTextArea = function(textAreaId, rows, defaultText) {
  var textAreaElement = document.createElement("textarea");
  textAreaElement.setAttribute("id", textAreaId);
  textAreaElement.setAttribute("rows", rows);
  
  textAreaElement.style.width = "100%";
  textAreaElement.style.resize = "none";
  
  
  textAreaElement.defaultValue = defaultText != null ? defaultText : "";
  
  textAreaElement.onfocus = function() {
    if (textAreaElement.value == textAreaElement.defaultValue) {
      textAreaElement.value = "";
    }
  }
  textAreaElement.onblur = function() {
    if (textAreaElement.value == "") {
      textAreaElement.value = textAreaElement.defaultValue;
    }
  }

  return textAreaElement;
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
  var linkElement = document.createElement("button");
  linkElement.setAttribute("id", linkId);
  linkElement.setAttribute("class", "link-button");
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

UIUtils.createImage = function(imageId, src) {
  var imageElement = document.createElement("img");
  
  if (imageId != null) {
    imageElement.setAttribute("id", imageId);
  }
  if (src != null) {
    imageElement.setAttribute("src", src);
  }
    
  return imageElement;
}


UIUtils.appendFeaturedTable = function(tableId, root, columns, rowDataProvider, selectionListener) {
  var tableElement = document.createElement("table");
  tableElement.setAttribute("class", "display");
  tableElement.setAttribute("id", tableId);
  
  root.appendChild(tableElement);
  
  var dataTableObject = $("#" + tableId).DataTable({
    columns: columns,
    data: rowDataProvider.getRows(),
    createdRow: function(row, rowData, index) {
      var table = this.api();
      rowDataProvider.getRowDetails(rowData.rowId, function(rowDetailedData) {
        rowDetailedData.rowId = rowData.rowId;
        table.row(index).data(rowDetailedData);  //we may need to add .draw()
      });
    },
    aLengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
    iDisplayLength: 5
  });
  
  dataTableObject.on("click", "tr", function() {
    var tableRowObjectData = dataTableObject.row(this).data();
    if (tableRowObjectData == null || tableRowObjectData.temporary) {
      return;
    }
    
    if (dataTableObject.$("tr.selected").get(0) == $(this).get(0)) {
      return;
    }
    
    dataTableObject.$("tr.selected").removeClass("selected");
    $(this).addClass("selected");

    if (selectionListener != null) {
      selectionListener(tableRowObjectData.rowId);
    }
  });
  
  return dataTableObject;
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

UIUtils.setEnabled = function(elementId, isEnabled) {
  $("#" + elementId).prop("disabled", !isEnabled);
}




UIUtils._createLabeledCombo = function(inputFieldId, labelText, inputElement, margin) {
  var compoundElement = document.createElement("div");
  compoundElement.style.display = "inline-block";
  compoundElement.style.width = "100%";
  compoundElement.style.textAlign = "left";
  compoundElement.style.whiteSpace = "nowrap";
  compoundElement.style.overflow = "hidden";

  compoundElement.appendChild(UIUtils.createLabel(inputFieldId + "-Label", labelText));

  compoundElement.appendChild(inputElement);
  inputElement.setAttribute("font-size", "inherit");
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

