AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId) {
  AbstractPage.call(this, pageId);
});


/*
 * settings.requestStatus
 * settings.selectionObserver
 * settings.updateListener
 */
AbstractRequestPage.OutgoingRequestsTable = function(settings) {
  this._settings = settings;
  this._cacheChangeListener = null;
  this._cacheRowListeners = {};
  this._rootContainer = null;
}

AbstractRequestPage.OutgoingRequestsTable.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, "TableContainer");

  var appendTableElement  = function() {
    var requestIds = Backend.getOutgoingRequestIds(this._settings.requestStatus);
    if (requestIds != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      this._appendTableElement();
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
      UIUtils.emptyContainer(this._rootContainer);
      this._cacheRowListeners = {};
      
      appendTableElement();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED
               || event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED) {
      
      for (var id in this._cacheRowListeners) {
        if (event.requestId == null || id == event.requestId) {
          this._cacheRowListeners[id]();
        }
      }
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  appendTableElement();
}

AbstractRequestPage.OutgoingRequestsTable.prototype.remove = function() {
  this._cacheRowListeners = {};
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  UIUtils.get$(this._rootContainer).remove();
}


AbstractRequestPage.OutgoingRequestsTable.prototype._appendTableElement = function() {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var requestIds = Backend.getOutgoingRequestIds();
      for (var requestId in requestIds) {
        rowData.push({rowId: requestIds[requestId], temporary: true, time: "--", text: "--", numOfResponses: "--"});
      }
      
      return rowData;
    },
    
    getRowDetails: function(rowId, callback) {
      function convertRequestToRowData(request) {
        return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: Backend.getIncomingResponseIds(rowId).length};
      }

      var reportRowDataReady = function() {
        var request = Backend.getRequest(rowId);
        var responseIds = Backend.getIncomingResponseIds(rowId);
        if (request != null && responseIds != null) {
          if (this._settings.updateListener != null) {
            this._settings.updateListener.updateFinished();
          }
          
          callback(convertRequestToRowData(request));
        } else {
          if (this._settings.updateListener != null) {
            this._settings.updateListener.updateStarted();
          }
        }
      }.bind(this);
      
      this._cacheRowListeners[rowId] = reportRowDataReady;
      reportRowDataReady();
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable("Table", this._rootContainer, columns, rowDataProvider, function(rowId) {
    this._settings.selectionObserver(rowId);
  }.bind(this));
}



/*
 * settings.requestIds
 * settings.requestStatus
 * settings.requestClickListener
 * settings.requestEditable: boolean
 * settings.maxResponses: integer, -1 for unlimited
 * settings.responseAreaMaxHeight: "measure unit", -1 for unlimited
 * settings.unviewedResponsesOnly: boolean
 * settings.updateListener
 */
AbstractRequestPage.OutgoingRequestList = function OutgoingRequestList(settings) {
  this._settings = settings;
  
  this._rootContainer = null;
  
  this._cacheChangeListener = null;
  this._requestPanels = [];
}

AbstractRequestPage.OutgoingRequestList.prototype.append = function(root) {
  this._rootContainer = UIUtils.appendBlock(root, "OutgoingRequestResponsesContainer");
  UIUtils.addClass(this._rootContainer, "outgoingrequest-and-responses-container");

  
  if (this._settings.requestIds != null) {
    for (var index in this._settings.requestIds) {
      var requestPanel = new AbstractRequestPage.OutgoingRequestList.RequestPanel(this._settings.requestIds[index], this._settings);
      this._requestPanels.push(requestPanel);
      requestPanel.append(this._rootContainer);
    }
  } else {
    var appendRequestPanels = function() {
      var requestIds = Backend.getOutgoingRequestIds(this._settings.requestStatus);
      if (requestIds != null) {
        if (this._settings.updateListener != null) {
          this._settings.updateListener.updateFinished();
        }
        
        for (var index in requestIds) {
          var requestPanel = new AbstractRequestPage.OutgoingRequestList.RequestPanel(requestIds[index], this._settings);
          this._requestPanels.push(requestPanel);
          requestPanel.append(this._rootContainer);
        }
      } else {
        if (this._settings.updateListener != null) {
          this._settings.updateListener.updateStarted();
        }
      }
    }.bind(this);
    
    this._cacheChangeListener = function(event) {
      if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
        for (var index in this._requestPanels) {
          this._requestPanels[index].remove();
        }

        appendRequestPanels();
      } 
    }.bind(this);

    Backend.addCacheChangeListener(this._cacheChangeListener);
    appendRequestPanels();
  }
    
  return this._rootContainer;
}

AbstractRequestPage.OutgoingRequestList.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  for (var index in this._requestPanels) {
    this._requestPanels[index].remove();
  }
  
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage.OutgoingRequestList.prototype.getInfo = function() {
  var requestIds = [];
  var responseIds = [];
  for (var requestIndex in this._requestPanels) {
    var requestPanel = this._requestPanels[requestIndex];
    requestIds.push(requestPanel._requestId);
    
    for (var responseIndex in requestPanel._responsePanels) {
      responseIds.push(requestPanel._responsePanels[responseIndex]._responseId);
    }
  }
  
  var info = {
    requestIds: requestIds,
    responseIds: responseIds 
  }
  
  return info;
}


AbstractRequestPage.OutgoingRequestList.RequestPanel = function(requestId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._rootContainer = null;
  this._responsePanels = [];
  this._cacheResponsesChangeListener = null;
  this._cacheRequestChangeListener = null;
}

AbstractRequestPage.OutgoingRequestList.RequestPanel.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, this._requestId);
  
  var appendRequestElement = function() {
    var request = Backend.getRequest(this._requestId);
    if (request != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      
      this._appendRequestElement(request);
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);
  
  this._cacheRequestChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED 
        && (event.requestId == null || event.requestId == this._requestId)) {

      UIUtils.emptyContainer(this._rootContainer);
      appendRequestElement();
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheRequestChangeListener);
  appendRequestElement();
}

AbstractRequestPage.OutgoingRequestList.RequestPanel.prototype.remove = function() {
  if (this._cacheRequestChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheRequestChangeListener);
  }
  if (this._cacheResponsesChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheResponsesChangeListener);
  }
  for (var index in this._responsePanels) {
    this._responsePanels[index].remove();
  }
  
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage.OutgoingRequestList.RequestPanel.prototype._appendRequestElement = function(request) {
  var requestHolderElement = UIUtils.appendBlock(this._rootContainer, "RequestHolder");

  var isEditable = this._settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;

  if (isEditable) { 
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder-editable");
  } else {
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder");
  }

  var appendRequestText = function() {
    var requestTextElement = UIUtils.appendBlock(requestHolderElement, "RequestText");
    
    var requestDate = new Date(request.time);
      
    UIUtils.addClass(requestTextElement, "outgoingrequest-text-holder");
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(requestTextElement, "outgoingrequest-text-holder-activable");
      UIUtils.setClickListener(requestTextElement, function() {
        this._settings.requestClickListener(this._requestId);
      }.bind(this));
    }
        
    UIUtils.get$(requestTextElement).html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
    
    if (isEditable) {
      var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
      UIUtils.addClass(controlPanel, "outgoingrequest-controls");

      var editButton = UIUtils.appendButton(controlPanel, "EditButton", "Edit");
      UIUtils.addClass(editButton, "outgoingrequest-editbutton");
      UIUtils.setClickListener(editButton, function() {
        UIUtils.emptyContainer(requestHolderElement);
            
        this._appendEditPanel(requestHolderElement, request, function() {
          UIUtils.emptyContainer(requestHolderElement);
          appendRequestText();
        });
      }.bind(this));
    }
  }.bind(this);
      
  appendRequestText();
    
  this._appendResponses(this._requestId);
}

AbstractRequestPage.OutgoingRequestList.RequestPanel.prototype._appendEditPanel = function(root, request, completionCallback) {
  var editPanel = UIUtils.appendBlock(root, "RequestEditPanel");
  
  var requestDate = new Date(request.time);
  UIUtils.appendLabel(editPanel, "Label", "This request was sent on <b>" + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() +"</b>");
  
  var genderListId = UIUtils.createId(editPanel, "Gender");
  editPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(genderListId, "Target sex", Application.Configuration.GENDER_PREFERENCE, "10px"));
  UIUtils.get$(genderListId).val(request.response_gender);
  
  var ageListId = UIUtils.createId(editPanel, "AgeCategory");
  editPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(ageListId, "Target age group", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  UIUtils.get$(ageListId).val(request.response_age_group);
  
  editPanel.appendChild(UIUtils.createLineBreak());
  
  var waitTimeListId = UIUtils.createId(editPanel, "WaitTime");
  editPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 20px 0")).appendChild(UIUtils.createLabeledDropList(waitTimeListId, "Wait time for responses", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  UIUtils.get$(waitTimeListId).val(request.response_wait_time);
  
  var quantityListId = UIUtils.createId(editPanel, "Quantity");
  editPanel.appendChild(UIUtils.createSpan("48%", "20px 0 20px 0")).appendChild(UIUtils.createLabeledDropList(quantityListId, "Maximum # of responses", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  UIUtils.get$(quantityListId).val(request.response_quantity);
  
  var textArea = editPanel.appendChild(UIUtils.createTextArea(UIUtils.createId(editPanel, "Text"), 6));
  UIUtils.get$(textArea).val(request.text);

  var controlPanel = UIUtils.appendBlock(editPanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingrequest-editpanel-controlpanel");
  
  var updateButton = UIUtils.appendButton(controlPanel, "UpdateButton", "Update");
  UIUtils.setClickListener(updateButton, function() {
    request.text = UIUtils.get$(textArea).val();
    request.response_quantity = UIUtils.get$(quantityListId).val();
    request.response_wait_time = UIUtils.get$(waitTimeListId).val();
    request.response_age_group = UIUtils.get$(ageListId).val();
    request.response_gender = UIUtils.get$(genderListId).val();

    AbstractRequestPage.OutgoingRequestList._updateRequest(this._requestId, request, completionCallback);
  }.bind(this));
  
  var deactivateButton = UIUtils.appendButton(controlPanel, "DeactivateButton", "Deactivate");
  UIUtils.setClickListener(deactivateButton, function() {
    request.status = Backend.Request.STATUS_INACTIVE;
    AbstractRequestPage.OutgoingRequestList._updateRequest(this._requestId, request, completionCallback);
  }.bind(this));
  
  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", "Cancel");
  UIUtils.setClickListener(cancelButton, completionCallback);
}


AbstractRequestPage.OutgoingRequestList.RequestPanel.prototype._appendResponses = function(requestId) {
  var responsesPanel = UIUtils.appendBlock(this._rootContainer, "ResponsesPanel");
  UIUtils.addClass(responsesPanel, "incomingresponses-container");
  if (this._settings.responseAreaMaxHeight != null && this._settings.responseAreaMaxHeight != -1) {
    responsesPanel.style.maxHeight = this._settings.responseAreaMaxHeight;
  }

  var appendResponsePanels = function() {
    var responseIds = Backend.getIncomingResponseIds(requestId, this._settings.unviewedResponsesOnly ? Backend.Response.STATUS_UNREAD : null);
    if (responseIds != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      
      for (var responseCount = 0; responseCount < responseIds.length; responseCount++) {
        var responsePanel = null;
        if (this._settings.maxResponses == null || this._settings.maxResponses == -1 || responseCount < this._settings.maxResponses) {
          responsePanel = new AbstractRequestPage.OutgoingRequestList.ResponsePanel(requestId, responseIds[responseCount], this._settings);
        } else if (responseCount == this._settings.maxResponses) {
          responsePanel = new AbstractRequestPage.OutgoingRequestList.ResponsePanel(requestId, -1, this._settings);
        } else {
          break;
        }

        this._responsePanels.push(responsePanel);
        responsePanel.append(responsesPanel);
      }
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);

  this._cacheResponsesChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED
        && (event.requestId == this._requestId)) {

      for (var index in this._responsePanels) {
        this._responsePanels[index].remove();
      }

      appendResponsePanels();
    } 
  }.bind(this);

  Backend.addCacheChangeListener(this._cacheResponsesChangeListener);
  appendResponsePanels();
}
  

AbstractRequestPage.OutgoingRequestList.ResponsePanel = function(requestId, responseId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._responseId = responseId;

  this._rootContainer = null;
  this._cacheChangeListener = null;
}

AbstractRequestPage.OutgoingRequestList.ResponsePanel.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, this._responseId);

  var appendResponseElement = function() {
    var response = Backend.getResponse(this._requestId, this._responseId);
    if (response != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      
      this._appendResponseElement(response);
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED 
        && event.requestId == this._requestId 
        && (event.responseId == null || event.responseId == this._responseId)) {

      UIUtils.emptyContainer(this._rootContainer);
      appendResponseElement();
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  appendResponseElement();
}

AbstractRequestPage.OutgoingRequestList.ResponsePanel.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage.OutgoingRequestList.ResponsePanel.prototype._appendResponseElement = function(response) {
  var responseHolder = UIUtils.appendBlock(this._rootContainer, "TextHolder");
  UIUtils.addClass(responseHolder, "incomingresponse-text-holder");
  
  if (this._responseId == -1) {
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(responseHolder, "incomingresponse-text-holder-activable");
      UIUtils.setClickListener(responseHolder, this._settings.requestClickListener.bind(this, this._requestId))

      UIUtils.get$(responseHolder).html("And more responses. Click to see them all");
    } 
  } else {
    var responseDate = new Date(response.time);          
    if (response.status == Backend.Response.STATUS_UNREAD) {
      UIUtils.addClass(responseHolder, "incomingresponse-text-holder-activable");
      UIUtils.setClickListener(responseHolder, function() {
        AbstractRequestPage.OutgoingRequestList._setResponseStatus(this._requestId, this._responseId, Backend.Response.STATUS_READ, function() {
        });
        UIUtils.removeClass(responseHolder, "incomingresponse-text-holder-activable");
      }.bind(this));
    }
      
    UIUtils.get$(responseHolder).html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
  }
}

AbstractRequestPage.OutgoingRequestList._setResponseStatus = function(requestId, responseId, status, completionCallback) {
  var callback = {
    success: function() {
      completionCallback();
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  var response = {status: Backend.Response.STATUS_READ};
  Backend.updateResponse(requestId, responseId, response, callback);
}

AbstractRequestPage.OutgoingRequestList._updateRequest = function(requestId, request, completionCallback) {
  var callback = {
    success: function(requestId) {
      completionCallback();
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.updateRequest(requestId, request, callback);
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


