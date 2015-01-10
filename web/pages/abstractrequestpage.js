AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId) {
  AbstractPage.call(this, pageId);
});


AbstractRequestPage.appendOutgoingRequestsTable = function(root, selectionCallback) {
  var containerId = root.getAttribute("id");
  $("#" + containerId).empty();
  AbstractRequestPage._appendOutgoingRequestsTable(containerId + "-Table", root, selectionCallback);
}

/*
 * settings.requestClickListener
 * settings.requestEditable: boolean
 * settings.maxResponses: integer, -1 for unlimited
 * settings.responseAreaMaxHeight: "measure unit", -1 for unlimited
 * settings.unviewedResponsesOnly: boolean
 */
AbstractRequestPage.appendOutgoingRequestResponsesControl = function(root, requestIds, settings) {
  AbstractRequestPage._OutgoingRequestResponseControl.appendControl(root, requestIds, settings);
}


  
AbstractRequestPage._appendOutgoingRequestsTable = function(tableId, root, selectionCallback) {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var requestIds = Backend.getCachedOutgoingRequestIds();
      for (var requestId in requestIds) {
        rowData.push({rowId: requestIds[requestId], temporary: true, time: "--", text: "--", numOfResponses: "--"});
      }
      
      return rowData;
    },
    
    getRowDetails: function(rowId, callback) {
      function convertRequestToRowData(request) {
        return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: request.responseIds.length};
      }

      function notifyCallback() {
        var request = Backend.getCachedRequest(rowId);
        if (request != null) {
          callback(convertRequestToRowData(request));
        }
      }
      notifyCallback();
      
      Backend.addRequestCacheChangeListener(notifyCallback);
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable(tableId, root, columns, rowDataProvider, function(rowId) {
    selectionCallback(rowId);
  }.bind(this));
}



AbstractRequestPage._OutgoingRequestResponseControl = {};

AbstractRequestPage._OutgoingRequestResponseControl.appendControl = function(root, requestIds, settings) {
  var controlPanelId = root.getAttribute("id") + "-OutgoingRequestResponsesContainer";
  $("#" + controlPanelId).addClass("outgoingrequest-and-responses-container");
  
  var containerElement;
  if ($("#" + controlPanelId).length == 0) {
    containerElement = root.appendChild(UIUtils.createBlock(controlPanelId));
  } else {
    $("#" + controlPanelId).empty();
    containerElement = $("#" + controlPanelId).get(0);
  }

  for (var index in requestIds) {
    this._appendOutgoingRequestAndResponsesPanel(containerElement, requestIds[index], settings);
  }
}

AbstractRequestPage._OutgoingRequestResponseControl._appendOutgoingRequestAndResponsesPanel = function(root, requestId, settings) {
  var requestPanelId = root.getAttribute("id") + "-" + requestId;
  var requestPanel = root.appendChild(UIUtils.createBlock(requestPanelId));
  
  //TODO: need to listen for changes and refresh
  
  var request = Backend.getCachedRequest(requestId);

  var requestHolderId = requestPanelId + "-RequestHolder";
  var requestHolderElement = requestPanel.appendChild(UIUtils.createBlock(requestHolderId));
  var requestHolderSelector = $("#" + requestHolderId);
    
  var isEditable = settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;
  
  if (isEditable) { 
    requestHolderSelector.addClass("outgoingrequest-holder-editable");
  } else {
    requestHolderSelector.addClass("outgoingrequest-holder");
  }
  
  var appendRequestText = function() {
    requestHolderSelector.empty();
      
    var requestTextId = requestHolderId + "-RequestText";
    var requestTextElement = requestHolderElement.appendChild(UIUtils.createBlock(requestTextId));
    var requestTextSelector = $("#" + requestTextId);
      
    var requestDate = new Date(request.time);
      
    requestTextSelector.addClass("outgoingrequest-text-holder");
    if (settings.requestClickListener != null) {
      requestTextSelector.addClass("outgoingrequest-text-holder-activable");
      requestTextSelector.click(function() {
        settings.requestClickListener(requestId);
      });
    }
        
    requestTextSelector.html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
        
    if (isEditable) {
      var controlPanelId = requestHolderId + "-ControlPanel";
      var controlPanel = requestHolderElement.appendChild(UIUtils.createBlock(controlPanelId));
      $("#" + controlPanelId).addClass("outgoingrequest-controls");

      var requestEditButtonId = controlPanelId + "-EditButton";
      controlPanel.appendChild(UIUtils.createButton(requestEditButtonId, "Edit"));
      $("#" + requestEditButtonId).addClass("outgoingrequest-editbutton");
      $("#" + requestEditButtonId).click(function() {
        requestHolderSelector.empty();
            
        this._appendEditPanel(requestHolderElement, requestId, request, function() {
          appendRequestText();
        });
      }.bind(this));
    }
  }.bind(this);
      
  appendRequestText();
    
  this._appendResponses(requestPanel, requestId, request, settings);
}

AbstractRequestPage._OutgoingRequestResponseControl._appendResponses = function(root, requestId, request, settings) {
  var responsesPanelId = root.getAttribute("id") + "-Responses";
  var responsesPanel = root.appendChild(UIUtils.createBlock(responsesPanelId));
  $("#" + responsesPanelId).addClass("incomingresponses-container");
  if (settings.responseAreaMaxHeight != null && settings.responseAreaMaxHeight != -1) {
    responsesPanel.style.maxHeight = settings.responseAreaMaxHeight;
  }

  var responseCount = 0;
  for (var responseIndex in request.responseIds) {
    var responseId = request.responseIds[responseIndex];
        
    var response = Backend.getCachedResponse(requestId, responseId);
    if (settings.unviewedResponsesOnly == true && response.status == Backend.Response.STATUS_READ) {
      continue;
    }
      
    responseCount++;
    if (settings.maxResponses != null && settings.maxResponses != -1 && responseCount > settings.maxResponses) {
      return;
    } else if (settings.maxResponses != null && settings.maxResponses == responseCount) {
      var responseHolderId = responsesPanelId + "-andmore";
      responsesPanel.appendChild(UIUtils.createBlock(responseHolderId));
      var responseSelector = $("#" + responseHolderId);
      responseSelector.addClass("incomingresponse-text-holder");
      if (settings.requestClickListener != null) {
        responseSelector.addClass("incomingresponse-text-holder-activable");
        responseSelector.click(settings.requestClickListener.bind(this, requestId));
      }

      responseSelector.html("And more responses. Click to see them all");
    } else {
      var responseHolderId = responsesPanelId + "-" + responseId;
      responsesPanel.appendChild(UIUtils.createBlock(responseHolderId));

      var responseDate = new Date(response.time);
          
      var responseSelector = $("#" + responseHolderId);
      responseSelector.addClass("incomingresponse-text-holder");
      if (response.status == Backend.Response.STATUS_UNREAD) {
        responseSelector.addClass("incomingresponse-text-holder-activable");
        responseSelector.click(function(requestId, responseId, responseSelector) {
          AbstractRequestPage._OutgoingRequestResponseControl._setResponseStatus(requestId, responseId, Backend.Response.STATUS_READ);
          responseSelector.removeClass("incomingresponse-text-holder-activable");
        }.bind(this, requestId, responseId, responseSelector));
      }
      
      responseSelector.html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
    }
  }
}
                                  
AbstractRequestPage._OutgoingRequestResponseControl._appendEditPanel = function(root, requestId, request, completionCallback) {
  var rootId = root.getAttribute("id");
  
  var editPanelId = rootId + "-RequestEditPanel";
  var editPanel = root.appendChild(UIUtils.createBlock(editPanelId));
  
  var requestDate = new Date(request.time);
  editPanel.appendChild(UIUtils.createLabel(editPanelId +  "-Label", "This request was sent on <b>" + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() +"</b>"));
  
  editPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(editPanelId + "-Gender", "Target sex", Application.Configuration.GENDER_PREFERENCE, "10px"));
  $("#" + editPanelId + "-Gender").val(request.response_gender);
  
  editPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(editPanelId + "-AgeCategory", "Target age group", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  $("#" + editPanelId + "-AgeCategory").val(request.response_age_group);
  
  editPanel.appendChild(UIUtils.createLineBreak());
  editPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 20px 0")).appendChild(UIUtils.createLabeledDropList(editPanelId + "-WaitTime", "Wait time for responses", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  $("#" + editPanelId + "-WaitTime").val(request.response_wait_time);
  
  editPanel.appendChild(UIUtils.createSpan("48%", "20px 0 20px 0")).appendChild(UIUtils.createLabeledDropList(editPanelId + "-Quantity", "Maximum # of responses", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  $("#" + editPanelId + "-Quantity").val(request.response_quantity);
  
  editPanel.appendChild(UIUtils.createTextArea(editPanelId + "-Text", 6));
  $("#" + editPanelId + "-Text").val(request.text);

  var controlPanelId = editPanelId + "-ControlPanel";
  var controlPanel = editPanel.appendChild(UIUtils.createBlock(controlPanelId));
  controlPanel.style.textAlign = "right";
  controlPanel.style.marginTop = "20px";
  controlPanel.appendChild(UIUtils.createButton(controlPanelId + "-UpdateButton", "Update"));
  controlPanel.appendChild(UIUtils.createButton(controlPanelId + "-InactivateButton", "Inactivate"));
  controlPanel.appendChild(UIUtils.createButton(controlPanelId + "-CancelButton", "Cancel"));
  
  $("#" + controlPanelId + "-UpdateButton").click(AbstractRequestPage._OutgoingRequestResponseControl._updateRequest.bind(this, requestId, request.status, editPanelId, controlPanelId, completionCallback));
  $("#" + controlPanelId + "-InactivateButton").click(AbstractRequestPage._OutgoingRequestResponseControl._updateRequest.bind(this, requestId, Backend.Request.STATUS_INACTIVE, editPanelId, controlPanelId, completionCallback));
  $("#" + controlPanelId + "-CancelButton").click(completionCallback);
}


AbstractRequestPage._OutgoingRequestResponseControl._setResponseStatus = function(requestId, responseId, status) {
  var callback = {
    success: function() {
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  var response = {status: Backend.Response.STATUS_READ};
  Backend.updateResponse(requestId, responseId, response, callback);
}


AbstractRequestPage._OutgoingRequestResponseControl._updateRequest = function(requestId, status, editRootPanelId, butttonPanelId, completionCallback) {
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      completionCallback();
    },
    failure: function() {
      this._onCompletion();
    },
    error: function() {
      this._onCompletion();
    },
    
    _onCompletion: function() {
      UIUtils.setEnabled(butttonPanelId + "-UpdateButton", true);
      UIUtils.setEnabled(butttonPanelId + "-InactivateButton", true);
      UIUtils.setEnabled(butttonPanelId + "-CancelButton", true);
      Application.hideSpinningWheel();
    }
  }
  
  var request = {
    text: $("#" + editRootPanelId + "-Text").val(),
    status: status,
    pictures: [],
    audios: []
  }
  
  var requestParams = {
    gender: $("#" + editRootPanelId + "-Gender").val(),
    quantity: $("#" + editRootPanelId + "-Quantity").val(),
    waitTime: $("#" + editRootPanelId + "-WaitTime").val(),
    age: $("#" + editRootPanelId + "-AgeCategory").val()
  }

  
  UIUtils.setEnabled(butttonPanelId + "-UpdateButton", false);
  UIUtils.setEnabled(butttonPanelId + "-InactivateButton", false);
  UIUtils.setEnabled(butttonPanelId + "-CancelButton", false);
  
  Application.showSpinningWheel();

  Backend.updateRequest(requestId, request, requestParams, callback);
}




AbstractRequestPage.appendIncomingRequestsTable = function(root, selectionCallback) {
  var containerId = root.getAttribute("id");
  $("#" + containerId).empty();
  AbstractRequestPage._appendIncomingRequestsTable(containerId + "-Table", root, selectionCallback);
}

/*
 * settings.incomingRequestClickListener
 * settings.canRespond
 */
AbstractRequestPage.appendIncomingRequestResponseControl = function(root, incomingRequestIds, settings) {
  AbstractRequestPage._IncomingRequestResponseControl.appendControl(root, incomingRequestIds, settings);
}


  
AbstractRequestPage._appendIncomingRequestsTable = function(tableId, root, selectionCallback) {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Inquiry", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var incomingRequestIds = Backend.getCachedIncomingRequestIds();
      for (var incomingRequestId in incomingRequestIds) {
        rowData.push({rowId: incomingRequestIds[incomingRequestId], temporary: true, time: "--", text: "--"});
      }
      
      return rowData;
    },
    
    getRowDetails: function(rowId, callback) {
      function convertIncomingRequestToRowData(incomingRequest) {
        return {time: new Date(request.time).toDateString(), text: incomingRequest.text};
      }

      function notifyCallback() {
        var incomingRequest = Backend.getCachedIncomingRequest(rowId);
        if (incomingRequest != null) {
          callback(convertIncomingRequestToRowData(incomingRequest));
        }
      }
      notifyCallback();
      
      Backend.addIncomingRequestCacheChangeListener(notifyCallback);
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable(tableId, root, columns, rowDataProvider, function(rowId) {
    selectionCallback(rowId);
  }.bind(this));
}



AbstractRequestPage._IncomingRequestResponseControl = {};

AbstractRequestPage._IncomingRequestResponseControl.appendControl = function(root, incomingRequestIds, settings) {
  var controlPanelId = root.getAttribute("id") + "-IncomingRequestResponseContainer";
  $("#" + controlPanelId).addClass("incomingrequest-and-respose-container");
  
  var containerElement;
  if ($("#" + controlPanelId).length == 0) {
    containerElement = root.appendChild(UIUtils.createBlock(controlPanelId));
  } else {
    $("#" + controlPanelId).empty();
    containerElement = $("#" + controlPanelId).get(0);
  }

  for (var index in incomingRequestIds) {
    this._appendIncomingRequestAndResponsePanel(containerElement, incomingRequestIds[index], settings);
  }
}

AbstractRequestPage._IncomingRequestResponseControl._appendIncomingRequestAndResponsePanel = function(root, incomingRequestId, settings) {
  var requestPanelId = root.getAttribute("id") + "-" + incomingRequestId;
  var requestPanel = root.appendChild(UIUtils.createBlock(requestPanelId));
  
  //TODO: need to listen for changes and refresh
  
  var incomingRequest = Backend.getCachedRequest(incomingRequestId);

  var appendIncomingRequestText = function(editResponse) {
    UIUtils.getSelector(requestPanelId).empty();
    
    var requestHolderId = requestPanelId + "-IncomingRequestHolder";
    var requestHolderElement = requestPanel.appendChild(UIUtils.createBlock(requestHolderId));
    var requestHolderSelector = $("#" + requestHolderId);

    var canRespond = !editResponse && settings.canRespond == true && incomingRequest.status == Backend.Request.STATUS_ACTIVE && incomingRequest.responseIds.length == 0;

    if (canRespond) { 
      requestHolderSelector.addClass("incomingrequest-holder-respondable");
    } else {
      requestHolderSelector.addClass("incomingrequest-holder");
    }

    var requestTextId = requestHolderId + "-IncomingRequestText";
    var requestTextElement = requestHolderElement.appendChild(UIUtils.createBlock(requestTextId));
    var requestTextSelector = $("#" + requestTextId);

    requestTextSelector.addClass("incomingrequest-text-holder");
    if (settings.requestClickListener != null) {
      requestTextSelector.addClass("incomingrequest-text-holder-activable");
      requestTextSelector.click(function() {
        settings.requestClickListener(incomingRequestId);
      });
    }

    var requestDate = new Date(incomingRequest.time);
    requestTextSelector.html("<b>On " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " the World asked you:</b><br>" + incomingRequest.text);

    if (canRespond) {
      var controlPanelId = requestHolderId + "-ControlPanel";
      var controlPanel = requestHolderElement.appendChild(UIUtils.createBlock(controlPanelId));
      $("#" + controlPanelId).addClass("incomingrequest-controls");

      var requestAnswerButtonId = controlPanelId + "-AnswerButton";
      controlPanel.appendChild(UIUtils.createButton(requestAnswerButtonId, "Comment"));
      
      var answerButtonSelector = UIUtils.getSelector(requestAnswerButtonId);
      answerButtonSelector.addClass("incomingrequest-answerbutton");
      answerButtonSelector.click(function() {
        appendIncomingRequestText(true);
      });
    } else if (editResponse) {
      this._appendEditResponsePanel(requestPanel, incomingRequestId, incomingRequest, function() {
        appendIncomingRequestText(false);
      });
    } else if (incomingRequest.responseIds.length > 0) {
      this._appendResponse(requestPanel, incomingRequestId, incomingRequest, function() {
        appendIncomingRequestText(true);
      });
    }
  }.bind(this);
  
  appendIncomingRequestText(false);
}

AbstractRequestPage._IncomingRequestResponseControl._appendResponse = function(root, incomingRequestId, incomingRequest, modifyListener) {
  var responsePanelId = root.getAttribute("id") + "-Response";
  var responsePanel = root.appendChild(UIUtils.createBlock(responsePanelId));
  var responsePanelSelector = UIUtils.getSelector(responsePanelId);
  responsePanelSelector.addClass("outgoingresponse-container");

  var responseId = incomingRequest.responseIds[0]
  var response = Backend.getCachedResponse(incomingRequestId, responseId);
  
  var responseHolderId = responsePanelId + "-" + responseId;
  responsePanel.appendChild(UIUtils.createBlock(responseHolderId));

  var responseSelector = $("#" + responseHolderId);
  responseSelector.addClass("outgoingresponse-text-holder");
  responseSelector.html(response.text);
  
  if (incomingRequest.status == Backend.Request.STATUS_ACTIVE) {
    var responseControlPanelId = responsePanelId + "-ControlPanel";
    var responseControlPanel = responsePanel.appendChild(UIUtils.createBlock(responseControlPanelId));
    
    UIUtils.getSelector(responseControlPanelId).addClass("outgoingresponse-controls");
    
    var editButtonId = responseControlPanelId + "-EditButton";
    var editButton = responseControlPanel.appendChild(UIUtils.createButton(editButtonId, "Modify"));
    
    var editButtonSelector = UIUtils.getSelector(editButtonId);
    editButtonSelector.addClass("outgoingresponse-editbutton");
    editButtonSelector.click(modifyListener);
  }
}

AbstractRequestPage._IncomingRequestResponseControl._appendEditResponsePanel = function(root, incomingRequestId, incomingRequest, completionCallback) {
  var editPanelId = root.getAttribute("id") + "-EditResponsePanel";
  var editPanel = root.appendChild(UIUtils.createBlock(editPanelId));
  var editPanelSelector = UIUtils.getSelector(editPanelId);
  editPanelSelector.addClass("outgoingresponse-editpanel");

  var responseElementId = editPanelId + "-ResponseText";
  var responseTextElement = editPanel.appendChild(UIUtils.createTextArea(responseElementId, 5));
  var responseElementSelector = UIUtils.getSelector(responseElementId);
  
  var responseId = incomingRequest.responseIds[0]
  var response = Backend.getCachedResponse(incomingRequestId, responseId);
  
  if (responseId != null) {
    responseElementSelector.val(response.text);
  }
  
  var controlPanelId = editPanelId + "-ControlPanel";
  var controlPanel = editPanel.appendChild(UIUtils.createBlock(controlPanelId));
  UIUtils.getSelector(controlPanelId).addClass("outgoingresponse-editpanel-controls");
    
  var submitButtonId = controlPanelId + "-SubmitButton";
  var submitButton = controlPanel.appendChild(UIUtils.createButton(submitButtonId, "Send"));
  var submitButtonSelector = UIUtils.getSelector(submitButtonId);
  submitButtonSelector.addClass("outgoingresponse-editpanel-submitbutton");
  
  submitButtonSelector.click(function() {
    var responseText = responseElementSelector.val();
    if (responseText != "") {
      if (response != null) {
        response.text = responseText;
        AbstractRequestPage._IncomingRequestResponseControl._updateResponse(incomingRequestId, responseId, response, completionCallback);
      } else {
        response = {
          text: responseText
        }
        AbstractRequestPage._IncomingRequestResponseControl._createResponse(incomingRequestId, response, completionCallback);
      }
    } else {
      UIUtils.indicateInvalidInput(responseElementId);
    }
  });

  var cancelButtonId = controlPanelId + "-CancelButton";
  var cancelButton = controlPanel.appendChild(UIUtils.createButton(cancelButtonId, "Cancel"));
  var cancelButtonSelector = UIUtils.getSelector(cancelButtonId);
  cancelButtonSelector.addClass("outgoingresponse-editpanel-cancelbutton");
  cancelButtonSelector.click(completionCallback);
}
                                  
AbstractRequestPage._IncomingRequestResponseControl._createResponse = function(requestId, response, completionCallback) {
  var callback = {
    success: function() {
      completionCallback();
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.createResponse(requestId, response, callback);
}

AbstractRequestPage._IncomingRequestResponseControl._updateResponse = function(requestId, responseId, response, completionCallback) {
  var callback = {
    success: function() {
      completionCallback();
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.updateResponse(requestId, responseId, response, callback);
}


