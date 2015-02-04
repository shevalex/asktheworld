
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


FileUtils = {};
FileUtils.IMAGE_FILE_TYPE = "image";

FileUtils.isImage = function(file) {
  return file.type.match(FileUtils.IMAGE_FILE_TYPE + ".*");
}

FileUtils.loadFile = function(file, loadObserver) {
  var reader = new FileReader();

  reader.onload = function() {
    loadObserver(file, reader.result);
  };

  reader.readAsDataURL(file);
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

    var item = items[index];
    optionElement.item = item;
    
    if (typeof item == "object") {
      if (item.element != null) {
        optionElement.appendChild(item.element);
      } else if (item.display != null) {
        optionElement.innerHTML = item.display;
      } else {
        optionElement.innerHTML = item.data;
      }
    } else {
      optionElement.innerHTML = item;
    }
    listElement.appendChild(optionElement);
  }
  
  listElement.getSelectedItem = function() {
    return listElement.options[listElement.selectedIndex].item;
  }
  
  listElement.getSelectedDisplay = function() {
    return this.getSelectedItem().display;
  }
  
  listElement.getSelectedData = function() {
    return this.getSelectedItem().data;
  }
  
  listElement.getValue = function() {
    return this.getSelectedData();
  }
  
  listElement.selectData = function(itemData) {
    for (var index = 0; index < listElement.options.length; index++) {
      if (listElement.options[index].item.data == itemData) {
        listElement.selectedIndex = index;
        break;
      }
    }
  }
  
  listElement.selectDisplay = function(itemDisplay) {
    for (var index = 0; index < listElement.options.length; index++) {
      if (listElement.options[index].item.display == itemDisplay) {
        listElement.selectedIndex = index;
        break;
      }
    }
  }
  
  listElement.setValue = function(value) {
    return this.selectData(value);
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
  var checkbox = UIUtils._createInputField(cbId, "checkbox");
  checkbox.style.display = "inline-block";
  checkbox.style.width = "initial";
  
  checkbox.getValue = function() {
    return checkbox.checked;
  };
  
  checkbox.setValue = function(checked) {
    checkbox.checked = checked;
  };
  
  return checkbox;
}

UIUtils.appendCheckbox = function(root, cbId, text) {
  var checkboxElement = UIUtils.createCheckbox(UIUtils.createId(root, cbId));
  
  if (text != null) {
    var combo = UIUtils.appendBlock(root, cbId + "-Container");
    combo.appendChild(checkboxElement);
    var label = UIUtils.createLabel(cbId + "-Label", text);
    label.style.marginLeft = "10px";
    combo.appendChild(label);
  } else {
    root.appendChild(checkboxElement);
  }
  
  return checkboxElement;
}


UIUtils.createLineBreak = function() {
  return document.createElement("br");
}

/*
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
*/

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

UIUtils.appendImage = function(root, imageId, src) {
  return root.appendChild(UIUtils.createImage(UIUtils.createId(root, imageId), src));
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


UIUtils.appendFeaturedTable = function(tableId, root, columns, rowDataProvider, selectionListener, clickListener) {
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

    if (dataTableObject.$("tr.selected").get(0) != $(this).get(0)) {
      dataTableObject.$("tr.selected").removeClass("selected");
      $(this).addClass("selected");

      if (selectionListener != null) {
        selectionListener(tableRowObjectData.rowId);
      }
    }
    
    if (clickListener != null) {
      clickListener(tableRowObjectData.rowId);
    }
  });
  
  return dataTableObject;
}

/*
UIUtils.appendTextEditor = function(root, editorId, cssClass, defaultValue) {
  var editorArea = UIUtils.appendBlock(root, editorId + "-Area");
  
  var textArea = document.createElement("textarea");
  textArea.setAttribute("id", UIUtils.createId(root, editorId));
  if (cssClass != null) {
    textArea.setAttribute("class", cssClass);
  }

  editorArea.getValue = function() {
    return textArea.value != defaultValue ? textArea.value : "";
  }
  
  editorArea.setValue = function(value) {
    textArea.innerHTML = value;
    this.getEditor().updateFrame();
  }
  
  editorArea.refresh = function() {
    if (defaultValue != null) {
      this.setValue(defaultValue);
      this.getEditor().select();
    } else {
      this.getEditor().clear();
    }
    
    this.getEditor().refresh();
  }
  
  editorArea.focus = function() {
    this.getEditor().focus();
  }
  
  editorArea.getEditorElement = function() {
    return editorArea.firstChild;
  }
  
  editorArea.indicateIncorrectInput = function() {
  }
  
  editorArea.appendChild(textArea);
  
  var selector = UIUtils.get$(editorArea);
  var height = selector.css("height");
  
  var editorSelector = UIUtils.get$(textArea).cleditor({
    height: height,
    controls:
             "bold italic underline strikethrough"
             + " | font size style"
             + " | color highlight removeformat"
             + " | bullets numbering"
             + " | outdent indent"
             + " | alignleft center alignright justify"
             + " | undo redo"
             + " | rule image link unlink"
             + " | cut copy paste pastetext"});
  
  editorArea.getEditor = function() {
    return editorSelector[0];
  }
  
  return editorArea;
}
*/


UIUtils.appendFileChooser = function(root) {
  var fileChooser = UIUtils._createInputField(UIUtils.createId(root, "FileChooser"), "file");
  fileChooser.style.display = "none";
  root.appendChild(fileChooser);

  fileChooser.addEventListener("change", function() {
    if (fileChooser.selectionCallback != null) {
      fileChooser.selectionCallback(fileChooser.files);
      fileChooser.selectionCallback = null;
    }
  });
  
  fileChooser.open = function(callback) {
    fileChooser.selectionCallback = callback;
    UIUtils.get$(fileChooser).trigger("click");
  }
  
  return fileChooser;
}

/*
 settings.textCssClass
 settings.defaultValue
 settings.fileTooBigListener
 */
UIUtils.appendTextEditor = function(root, editorId, settings) {
  var editorArea = UIUtils.appendBlock(root, editorId);
  UIUtils.addClass(editorArea, "text-editor-container");
  
  var textArea = UIUtils.appendBlock(editorArea, editorId + "EdittingArea");
  textArea.setAttribute("contenteditable", "true");
  
  var defaultValue = settings != null && settings.defaultValue != null ? settings.defaultValue : "";
  
  textArea.onfocus = function() {
    if (textArea.innerHTML == defaultValue) {
      textArea.innerHTML = "";
    }
  }
  textArea.onblur = function() {
    if (textArea.innerHTML == "") {
      textArea.innerHTML = defaultValue;
    }
  }
  
  
  UIUtils.addClass(textArea, "text-editor-textcomponent");
  if (settings != null && settings.textCssClass != null) {
    UIUtils.addClass(textArea, settings.textCssClass);
  }
  
  var attachmentBar = UIUtils.appendBlock(editorArea, "AttachmentBar");
  UIUtils.addClass(attachmentBar, "text-editor-attachmentbar");

  var attachmentsPanel = UIUtils.appendBlock(attachmentBar, "Attachments");
  UIUtils.addClass(attachmentsPanel, "text-editor-attachments");

  var controlPanel = UIUtils.appendBlock(attachmentBar, "ControlPanel");
  UIUtils.addClass(controlPanel, "text-editor-controlpanel");
  
  var attachButton = UIUtils.appendButton(controlPanel, "AttachButton", "Attach");
  UIUtils.addClass(attachButton, "text-editor-attachbutton");

  var attachedFiles = [];
  var attachmentCounter = 0;
  
  UIUtils.setClickListener(attachButton, function() {
    var fileChooser = UIUtils.appendFileChooser(attachmentBar);

    fileChooser.open(function(files) {
      var selectedFile = files[0];
      UIUtils.get$(fileChooser).remove();
      
      if (selectedFile.size > 5 * 1024000) {
        if (settings != null && settings.fileTooBigListener != null) {
          settings.fileTooBigListener(selectedFile);
        }
        return;
      }

      FileUtils.loadFile(selectedFile, function(file, dataUrl) {
        selectedFile.data = dataUrl;

        attachedFiles.push(selectedFile);
        
        attachmentCounter++;
        var thumbnail = UIUtils.appendBlock(attachmentsPanel, "Attachment-" + attachmentCounter);
        UIUtils.addClass(thumbnail, "text-editor-thumbnail");

        if (FileUtils.isImage(selectedFile)) {
          thumbnail.style.backgroundImage = "url(" + dataUrl + ")";

          UIUtils.setClickListener(thumbnail, function() {
            var previewElement = UIUtils.appendBlock(attachmentBar, "Preview");
            UIUtils.addClass(previewElement, "text-editor-preview");

            var previewCloser = UIUtils.appendBlock(previewElement, "X");
            UIUtils.addClass(previewCloser, "text-editor-preview-x");

            UIUtils.removeIfClickedOutside(previewElement);

            UIUtils.setClickListener(previewCloser, function() {
              UIUtils.get$(previewElement).remove();
            });

            previewElement.style.backgroundImage = "url(" + selectedFile.data + ")";

            var previewTitle = UIUtils.appendBlock(previewElement, "Title");
            UIUtils.addClass(previewTitle, "text-editor-preview-title");
            previewTitle.innerHTML = selectedFile.name;
          });
        } else {
          // TBD provide special icons for other file types
        }
        
        var thumbnailCloser = UIUtils.appendBlock(thumbnail, "X");
        UIUtils.addClass(thumbnailCloser, "text-editor-thumbnail-x");

        UIUtils.setClickListener(thumbnailCloser, function() {
          UIUtils.get$(thumbnail).remove();
          for (var index = 0; index < attachedFiles.length; index++) {
            if (attachedFiles[index] == selectedFile) {
              attachedFiles.splice(index, 1);
              break;
            }
          }
        });

        var thumbnailTitle = UIUtils.appendBlock(thumbnail, "Title");
        UIUtils.addClass(thumbnailTitle, "text-editor-thumbnail-title");
        thumbnailTitle.innerHTML = selectedFile.name;
      });
    });
  });
  
  
  editorArea.getValue = function() {
    var value = UIUtils.get$(textArea).html();
    return value != defaultValue ? value : "";
  }
  
  editorArea.setValue = function(value) {
    UIUtils.get$(textArea).html(value);
  }
  
  editorArea.refresh = function() {
    if (defaultValue != null) {
      this.setValue(defaultValue);
    } else {
      this.setValue("");
    }
  }
  
  editorArea.focus = function() {
    textArea.focus();
  }
  
  editorArea.getTextElement = function() {
    return textArea;
  }
  
  editorArea.getAttachedFiles = function() {
    return attachedFiles;
  }
  
  editorArea.indicateInvalidInput = function() {
    UIUtils.indicateInvalidInput(textArea);
  }
  
  return editorArea;
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

UIUtils.removeIfClickedOutside = function(component) {
  $(document).mouseup(function(event) {
    var selector = UIUtils.get$(component);

    if (!selector.is(event.target) && selector.has(event.target).length == 0) {
      selector.remove();
      $(document).unbind("mouseup");
    };
  });
}


UIUtils.createId = function(container, elementId) {
  return UIUtils._getId(container) + "-" + elementId;
}


UIUtils.getOneLine = function(text) {
  if (text == null || text == "") {
    return "";
  }

  var block = UIUtils.createBlock();
  block.innerHTML = text;
  
  var firstLine = block.firstChild;
  if (firstLine instanceof Text) {
//    var breakIndex = text.indexOf("\n");
//    return breakIndex == -1 ? text : text.substr(0, breakIndex);  
    return firstLine.nodeValue;
  } else if (firstLine instanceof HTMLElement) {
    return firstLine.innerHTML;
  } else {
    console.error("Unexpected!!!");
    return text;
  }
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

  compoundElement.getInputElement = function() {
    return inputElement;
  }

  return compoundElement;
}

UIUtils._createInputField = function(inputFieldId, inputType) {
  var inputFieldElement = document.createElement("input");
  inputFieldElement.setAttribute("type", inputType != null ? inputType : "text");
  inputFieldElement.setAttribute("id", inputFieldId);
  inputFieldElement.style.display = "block";
  inputFieldElement.style.width = "100%";
  
  inputFieldElement.getValue = function() {
    return inputFieldElement.value;
  };
  
  inputFieldElement.setValue = function(value) {
    inputFieldElement.value = value;
  };
  
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

