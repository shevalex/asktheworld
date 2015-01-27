
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

ResourceUtils = {};
ResourceUtils.loadResource = function(resourceUrl, isJsonResource, callback) {
  $.ajax({
    url: resourceUrl,
    type: "GET",
    dataType: isJsonResource ? "json" : "text",
    success: callback.success,
    error: callback.error
  });
}


ValidationUtils = {};
ValidationUtils.isValidEmail = function(email) {
  //TODO!!!
  return email != null && email.length > 1
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
  var labelElement = document.createElement("label");
  labelElement.setAttribute("id", labelId);
  //labelElement.style.display = "block";
  if (labelText != null) {
    labelElement.innerHTML = labelText;
  }
  
  return labelElement;
}

UIUtils.appendLabel = function(root, labelId, text) {
  return root.appendChild(UIUtils.createLabel(UIUtils.createId(root, labelId), text));
}


UIUtils.createButton = function(buttonId, text) {
  var buttonElement = document.createElement("button");
  buttonElement.setAttribute("id", buttonId);
  buttonElement.style.whiteSpace = "nowrap";
  buttonElement.style.overflow = "hidden";

  buttonElement.innerHTML = text;
  
  return buttonElement;
}

UIUtils.appendButton = function(root, buttonId, text) {
  return root.appendChild(UIUtils.createButton(UIUtils.createId(root, buttonId), text));
}


UIUtils.createBlock = function(blockId) {
  var blockElement = document.createElement("div");
  if (blockId != null) {
    blockElement.setAttribute("id", blockId);
  }
  
  return blockElement;
}

UIUtils.appendBlock = function(root, blockId) {
  return root.appendChild(UIUtils.createBlock(UIUtils.createId(root, blockId)));
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

UIUtils.appendLink = function(root, linkId, text) {
  return root.appendChild(UIUtils.createLink(UIUtils.createId(root, linkId), text));
}


UIUtils.createCheckbox = function(cbId) {
  var checkboxElement = document.createElement("input");
  checkboxElement.setAttribute("id", cbId);
  checkboxElement.setAttribute("type", "checkbox");
  
  return checkboxElement;
}

UIUtils.appendCheckbox = function(root, cbId, text) {
  return root.appendChild(UIUtils.createCheckbox(UIUtils.createId(root, cbId)));
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

UIUtils.createTable = function(tableId, columns) {
  var tableElement = document.createElement("table");
  tableElement.setAttribute("id", tableId);
  tableElement.style.width = "100%";
  
  var rowElement = document.createElement("tr");
  rowElement.setAttribute("id", UIUtils.createId(tableId, "row1"));
  tableElement.appendChild(rowElement);
  
  for (var index in columns) {
    var column = columns[index];
    
    var columnElement = document.createElement("td");
    columnElement.setAttribute("id", UIUtils.createId(rowElement, "column" + index));
    rowElement.appendChild(columnElement);
    
    if (column.width != null) {
      columnElement.style.width = column.width;
      columnElement.style.verticalAlign = "top";
    }
    
    if (column.text != null) {
      UIUtils.get$(columnElement).html(column.text);
    } else if (column.element != null) {
      columnElement.appendChild(column.element);
    }
  }
  
  return tableElement;
}

UIUtils.appendTable = function(root, tableId, columns) {
  return root.appendChild(UIUtils.createTable(UIUtils.createId(root, tableId), columns));
}


UIUtils.appendFeaturedTable = function(tableId, root, columns, rowDataProvider, selectionListener) {
  var tableElement = document.createElement("table");
  tableElement.setAttribute("class", "display");
  
  var tableElementId = UIUtils.createId(root, tableId);
  tableElement.setAttribute("id", tableElementId);
  
  root.appendChild(tableElement);
  
  var dataTableObject = $("#" + tableElementId).DataTable({
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


UIUtils.animateBackgroundColor = function(element, color, speed, observer) {
  var selector = UIUtils.get$(element);
  var initialColor = selector.css("backgroundColor");
  
  var speed = speed || "slow";
  selector.animate({backgroundColor: color}, speed, function() {
    selector.animate({backgroundColor: initialColor}, speed, function() {
      if (observer != null) {
        observer();
      }
    });
  });
}

UIUtils.indicateInvalidInput = function(element, observer) {
  UIUtils.animateBackgroundColor(element, UIUtils.INVALID_INPUT_BACKGROUND, "slow", observer);
}

UIUtils.setEnabled = function(element, isEnabled) {
  UIUtils.get$(element).prop("disabled", !isEnabled);
}

UIUtils.get$ = function(component) {
  return $("#" + UIUtils._getId(component));
}

UIUtils.addClass = function(component, cls) {
  UIUtils.get$(component).addClass(cls);
}

UIUtils.removeClass = function(component, cls) {
  UIUtils.get$(component).removeClass(cls);
}

UIUtils.emptyContainer = function(container) {
  UIUtils.get$(container).empty();
}

UIUtils.setClickListener = function(element, listener) {
  UIUtils.get$(element).click(listener);
}


UIUtils.createId = function(container, elementId) {
  return UIUtils._getId(container) + "-" + elementId;
}



UIUtils._createLabeledCombo = function(inputFieldId, labelText, inputElement, margin) {
  var compoundElement = document.createElement("div");
  compoundElement.style.display = "inline-block";
  compoundElement.style.width = "100%";
  compoundElement.style.textAlign = "left";
  compoundElement.style.whiteSpace = "nowrap";
  compoundElement.style.overflow = "hidden";

  compoundElement.appendChild(UIUtils.createLabel(inputFieldId + "-Label", labelText));
  compoundElement.appendChild(UIUtils.createLineBreak());

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

UIUtils._getId = function(component) {
  var id = null;
  if (typeof component == "string") {
    id = component;
  } else {
    id = component.getAttribute("id");
  }
  
  return id;
}