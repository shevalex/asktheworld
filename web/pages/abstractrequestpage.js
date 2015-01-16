AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId) {
  AbstractPage.call(this, pageId);
});


// THIS IS THE SECTION WHICH DEFINES RequestTable element

/*
 * settings.requestStatus
 * settings.selectionObserver
 * settings.updateListener
 */
AbstractRequestPage._AbstractRequestsTable = ClassUtils.defineClass(Object, function _AbstractRequestsTable(settings) {
  this._settings = settings;
  this._cacheChangeListener = null;
  this._cacheRowListeners = {};
  this._rootContainer = null;
});

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRequests = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getResponses = function(requestId) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getColumns = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRowData = function(requestId, request) {
  throw "Not implemented";
}

AbstractRequestPage._AbstractRequestsTable.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, "TableContainer");

  var appendTableElement  = function() {
    var requestIds = this._getRequests();
    if (requestIds != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      this.__appendTableElement();
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);
  
  this._cacheChangeListener = function(event) {
    if (event.type == this._getRequestIdsChangeEventType()) {
      UIUtils.emptyContainer(this._rootContainer);
      this._cacheRowListeners = {};
      
      appendTableElement();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED
               || event.type == this._getResponseIdsChangeEventType()) {
      
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

AbstractRequestPage._AbstractRequestsTable.prototype.remove = function() {
  this._cacheRowListeners = {};
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage._AbstractRequestsTable.prototype.destroy = function() {
  this.destroy();
}

AbstractRequestPage._AbstractRequestsTable.prototype.__appendTableElement = function() {
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var columns = this._getColumns();
      var requestIds = this._getRequests();
      for (var requestId in requestIds) {
        var defaultRowData = {rowId: requestIds[requestId], temporary: true};
        for (var index in columns) {
          defaultRowData[columns[index].data] = "--";
        }
        
        rowData.push(defaultRowData);
      }
      
      return rowData;
    }.bind(this),
    
    getRowDetails: function(rowId, callback) {
      function convertRequestToRowData(request) {
        return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: Backend.getIncomingResponseIds(rowId).length};
      }

      var reportRowDataReady = function() {
        var request = Backend.getRequest(rowId);
        var responseIds = this._getResponses(rowId);
        if (request != null && responseIds != null) {
          if (this._settings.updateListener != null) {
            this._settings.updateListener.updateFinished();
          }
          
          callback(this._getRowData(rowId, request));
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
  
  return UIUtils.appendFeaturedTable("Table", this._rootContainer, this._getColumns(), rowDataProvider, function(rowId) {
    this._settings.selectionObserver(rowId);
  }.bind(this));
}



AbstractRequestPage.OutgoingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function OutgoingRequestsTable(settings) {
  AbstractRequestPage._AbstractRequestsTable.call(this, settings);
});

AbstractRequestPage.OutgoingRequestsTable.prototype._getRequests = function() {
  return Backend.getOutgoingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getResponses = function(requestId) {
  return Backend.getIncomingResponseIds(requestId);
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getColumns = function() {
  return [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getRowData = function(requestId, request) {
  return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: this._getResponses(requestId).length};
}


AbstractRequestPage.IncomingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function IncomingRequestsTable(settings) {
  AbstractRequestPage._AbstractRequestsTable.call(this, settings);
});

AbstractRequestPage.IncomingRequestsTable.prototype._getRequests = function() {
  return Backend.getIncomingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.IncomingRequestsTable.prototype._getResponses = function(requestId) {
  return Backend.getOutgoingResponseIds(requestId);
}

AbstractRequestPage.IncomingRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}

AbstractRequestPage.IncomingRequestsTable.prototype._getColumns = function() {
  return [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Inquiry", data: "text", type: "string"}
  ];
}

AbstractRequestPage.IncomingRequestsTable.prototype._getRowData = function(requestId, request) {
  return {time: new Date(request.time).toDateString(), text: request.text};
}







// THIS IS THE SECTION WHICH DEFINES RequestList element


/*
 * settings.requestIds
 * settings.requestClickListener
 * settings.requestEditable: boolean
 * settings.requestInclusionPolicy: mask
 * settings.responseInclusionPolicy: mask
 * settings.maxResponses: integer, -1 for unlimited
 * settings.responseAreaMaxHeight: "measure unit", -1 for unlimited
 * settings.updateListener
 */
AbstractRequestPage._AbstractRequestList = ClassUtils.defineClass(Object, function _AbstractRequestList(settings) {
  this._settings = settings;
  
  this._rootContainer = null;
  
  this._cacheChangeListener = null;
  this._requestPanels = [];
});

AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ALL = 0;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITH_RESPONSES = 1;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITHOUT_RESPONSES = 2;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE = 4;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_INACTIVE = 8;

AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_ALL = 0;
AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_VIEWED = 1;
AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED = 2;


//abstract
AbstractRequestPage._AbstractRequestList.prototype._createRequestPanel = function(requestId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._createResponsePanel = function(requestId, responseId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getRequestIds = function(status) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getResponseIds = function(requestId, status) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented"
}


AbstractRequestPage._AbstractRequestList.prototype.append = function(root) {
  this._rootContainer = UIUtils.appendBlock(root, "RequestResponsesContainer");
  UIUtils.addClass(this._rootContainer, "request-and-responses-container");

  if (this._settings.requestIds != null) {
    for (var index in this._settings.requestIds) {
      var requestPanel = this._createRequestPanel(this._settings.requestIds[index]);
      this._requestPanels.push(requestPanel);
      requestPanel.append(this._rootContainer);
    }
  } else {
    var status = this.__getRequestStatusFromSettings();
    
    var appendRequestPanels = function() {
      var requestIds = this._getRequestIds(status);
      if (requestIds != null) {
        if (this._settings.updateListener != null) {
          this._settings.updateListener.updateFinished();
        }
        
        for (var index in requestIds) {
          var requestPanel = this._createRequestPanel(requestIds[index]);
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
      if (event.type == this._getRequestIdsChangeEventType()) {
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

AbstractRequestPage._AbstractRequestList.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  for (var index in this._requestPanels) {
    this._requestPanels[index].remove();
  }
  
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage._AbstractRequestList.prototype.destroy = function() {
  this.remove();
}

AbstractRequestPage._AbstractRequestList.prototype.getInfo = function() {
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

AbstractRequestPage._AbstractRequestList.prototype.__getRequestStatusFromSettings = function() {
  var status = null;
  if ((this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE) != 0) {
    status = Backend.Request.STATUS_ACTIVE;
  } else if ((this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_INACTIVE) != 0) {
    status = Backend.Request.REQUEST_INCLUSION_POLICY_STATUS_INACTIVE;
  }
  return status;
}

AbstractRequestPage._AbstractRequestList.prototype.__getResponseStatusFromSettings = function() {
  var status = null;
  if ((this._settings.responseInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_VIEWED) != 0) {
    status = Backend.Response.STATUS_READ;
  } else if ((this._settings.responseInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED) != 0) {
    status = Backend.Response.STATUS_UNREAD;
  }
  return status;
}


AbstractRequestPage._AbstractRequestList._AbstractRequestPanel = ClassUtils.defineClass(Object, function _AbstractRequestPanel(requestList, requestId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._requestList = requestList;
  this._rootContainer = null;
  this._responsePanels = [];
  this._cacheResponsesChangeListener = null;
  this._cacheRequestChangeListener = null;
});

//abstract
AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype._appendRequestElement = function(request) {
  throw "Not implemented"
}


AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, this._requestId);

  var appendRequestElement = function() {
    var request = Backend.getRequest(this._requestId);
    if (request != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      
      this._appendRequestElement(request);
      
      if (this._settings.maxResponses != 0) {
        this.__appendResponses(this._requestId);
      }
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

AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.remove = function() {
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

AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.__appendResponses = function(requestId) {
  var responsesPanel = UIUtils.appendBlock(this._rootContainer, "ResponsesPanel");
  UIUtils.addClass(responsesPanel, "responses-container");
  if (this._settings.responseAreaMaxHeight != null && this._settings.responseAreaMaxHeight != -1) {
    responsesPanel.style.maxHeight = this._settings.responseAreaMaxHeight;
  }
  
  var status = this._requestList.__getResponseStatusFromSettings();

  var appendResponsePanels = function() {
    var responseIds = this._requestList._getResponseIds(requestId, status);
    if (responseIds != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }

      for (var responseCount = 0; responseCount < responseIds.length; responseCount++) {
        var responsePanel = null;
        if (this._settings.maxResponses == null || this._settings.maxResponses == -1 || responseCount < this._settings.maxResponses) {
          responsePanel = this._requestList._createResponsePanel(requestId, responseIds[responseCount]);
        } else if (responseCount == this._settings.maxResponses) {
          responsePanel = this._requestList._createResponsePanel(requestId, -1);
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
    if (event.type == this._requestList._getResponseIdsChangeEventType()
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


AbstractRequestPage._AbstractRequestList._AbstractResponsePanel = ClassUtils.defineClass(Object, function _AbstractResponsePanel(requestId, responseId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._responseId = responseId;

  this._rootContainer = null;
  this._cacheChangeListener = null;
});


AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype.append = function(container) {
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

AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  UIUtils.get$(this._rootContainer).remove();
}

//abstract
AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype._appendResponseElement = function(response) {
  throw "Not implemented"
}

AbstractRequestPage._AbstractRequestList.__updateRequest = function(requestId, request, completionCallback) {
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

AbstractRequestPage._AbstractRequestList.__createResponse = function(requestId, response, completionCallback) {
  var callback = {
    success: function(requestId) {
      completionCallback();
    },
    failure: function() {
    },
    error: function() {
    }
  }

  Backend.createResponse(requestId, response, callback);
}

AbstractRequestPage._AbstractRequestList.__setResponseStatus = function(requestId, responseId, status, completionCallback) {
  this.__updateResponse(requestId, responseId, {status: Backend.Response.STATUS_READ}, completionCallback);
}

AbstractRequestPage._AbstractRequestList.__updateResponse = function(requestId, responseId, response, completionCallback) {
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



AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractRequestPanel, function _OutgoingRequestPanel(requestList, requestId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.call(this, requestList, requestId, settings);
});

AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel.prototype._appendRequestElement = function(request) {
  var requestHolderElement = UIUtils.appendBlock(this._rootContainer, "RequestHolder");

  var isEditable = this._settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;

  if (isEditable) { 
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder-editable");
  } else {
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder");
  }

  var appendRequestText = function() {
    var requestTextElement = UIUtils.appendBlock(requestHolderElement, "RequestText");
    
    UIUtils.addClass(requestTextElement, "outgoingrequest-text-holder");
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(requestTextElement, "outgoingrequest-text-holder-activable");
      UIUtils.setClickListener(requestTextElement, function() {
        this._settings.requestClickListener(this._requestId);
      }.bind(this));
    }
        
    var requestDate = new Date(request.time);
    UIUtils.get$(requestTextElement).html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
    
    if (isEditable) {
      var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
      UIUtils.addClass(controlPanel, "outgoingrequest-controls");

      var editButton = UIUtils.appendButton(controlPanel, "EditButton", "Edit");
      UIUtils.addClass(editButton, "outgoingrequest-editbutton");
      UIUtils.setClickListener(editButton, function() {
        UIUtils.emptyContainer(requestHolderElement);
            
        this.__appendEditPanel(requestHolderElement, request, function() {
          UIUtils.emptyContainer(requestHolderElement);
          appendRequestText();
        });
      }.bind(this));
    }
  }.bind(this);
      
  appendRequestText();
}

AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel.prototype.__appendEditPanel = function(root, request, completionCallback) {
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
  UIUtils.addClass(controlPanel, "outgoingrequest-controls");
  
  var updateButton = UIUtils.appendButton(controlPanel, "UpdateButton", "Update");
  UIUtils.addClass(updateButton, "outgoingrequest-updatebutton");
  UIUtils.setClickListener(updateButton, function() {
    request.text = UIUtils.get$(textArea).val();
    request.response_quantity = UIUtils.get$(quantityListId).val();
    request.response_wait_time = UIUtils.get$(waitTimeListId).val();
    request.response_age_group = UIUtils.get$(ageListId).val();
    request.response_gender = UIUtils.get$(genderListId).val();

    AbstractRequestPage._AbstractRequestList.__updateRequest(this._requestId, request, completionCallback);
  }.bind(this));
  
  var deactivateButton = UIUtils.appendButton(controlPanel, "DeactivateButton", "Deactivate");
  UIUtils.addClass(updateButton, "outgoingrequest-deactivatebutton");
  UIUtils.setClickListener(deactivateButton, function() {
    request.status = Backend.Request.STATUS_INACTIVE;
    AbstractRequestPage._AbstractRequestList.__updateRequest(this._requestId, request, completionCallback);
  }.bind(this));
  
  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", "Cancel");
  UIUtils.addClass(cancelButton, "outgoingrequest-cancelbutton");
  UIUtils.setClickListener(cancelButton, completionCallback);
}



AbstractRequestPage._AbstractRequestList._IncomingRequestPanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractRequestPanel, function _IncomingRequestPanel(requestList, requestId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.call(this, requestList, requestId, settings);
});

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype._appendRequestElement = function(request) {
  var requestHolderElement = UIUtils.appendBlock(this._rootContainer, "RequestHolder");

  var isEditable = this._settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;
  
  if (isEditable) { 
    UIUtils.addClass(requestHolderElement, "incomingrequest-holder-editable");
  } else {
    UIUtils.addClass(requestHolderElement, "incomingrequest-holder");
  }

  var requestTextElement = UIUtils.appendBlock(requestHolderElement, "RequestText");

  UIUtils.addClass(requestTextElement, "incomingrequest-text-holder");
  if (this._settings.requestClickListener != null) {
    UIUtils.addClass(requestTextElement, "incomingrequest-text-holder-activable");
    UIUtils.setClickListener(requestTextElement, function() {
      this._settings.requestClickListener(this._requestId);
    }.bind(this));
  }

  var appendTextElement = function() {
    var requestDate = new Date(request.time);
    UIUtils.get$(requestTextElement).html("<b>On " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " the World asked you:</b><br>" + request.text);

    if (isEditable) {
      var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
      UIUtils.addClass(controlPanel, "incomingrequest-controls");

      var commentButton = UIUtils.appendButton(controlPanel, "CommentButton", "Comment");
      UIUtils.addClass(commentButton, "incomingrequest-commentbutton");
      UIUtils.setClickListener(commentButton, function() {
        UIUtils.get$(controlPanel).remove();
        this.__appendCreateResponsePanel(requestHolderElement, request, appendTextElement);
      }.bind(this));
    }
  }.bind(this);
  
  appendTextElement();
}

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype.__appendCreateResponsePanel = function(root, request, completionCallback) {
  var createResponsePanel = UIUtils.appendBlock(root, "CreateResponsePanel");
  UIUtils.addClass(createResponsePanel, "outgoingresponse-createresponsepanel");

  var responseTextElement = createResponsePanel.appendChild(UIUtils.createTextArea(UIUtils.createId(createResponsePanel, "ResponseText"), 5));
  
  var controlPanel = UIUtils.appendBlock(createResponsePanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingresponse-controls");
    
  var submitButton = UIUtils.appendButton(controlPanel, "SubmitButton", "Send");
  UIUtils.addClass(submitButton, "outgoingresponse-submitbutton");
  
  var finishEditing = function() {
    UIUtils.get$(createResponsePanel).remove();
    completionCallback();
  }
  
  UIUtils.setClickListener(submitButton, function() {
    var responseText = UIUtils.get$(responseTextElement).val();
    if (responseText != "") {
      response = {
        text: responseText
      }
      AbstractRequestPage._AbstractRequestList.__createResponse(this._requestId, response, finishEditing);
    } else {
      UIUtils.indicateInvalidInput(responseTextElement);
    }
  }.bind(this));

  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", "Cancel");
  UIUtils.addClass(cancelButton, "outgoingresponse-cancelbutton");
  UIUtils.setClickListener(cancelButton, finishEditing);
}


AbstractRequestPage._AbstractRequestList._IncomingResponsePanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractResponsePanel, function _IncomingResponsePanel(requestId, responseId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.call(this, requestId, responseId, settings); 
});

AbstractRequestPage._AbstractRequestList._IncomingResponsePanel.prototype._appendResponseElement = function(response) {
  var responseHolder = UIUtils.appendBlock(this._rootContainer, "TextHolder");
  UIUtils.addClass(responseHolder, "incomingresponse-text-holder");

  if (this._responseId == -1) {
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(responseHolder, "incomingresponse-text-holder-activable");
      UIUtils.setClickListener(responseHolder, this._settings.requestClickListener.bind(this, this._requestId))

      UIUtils.get$(responseHolder).html("And more responses. Click to see them all");
    } 
  } else {
    if (response.status == Backend.Response.STATUS_UNREAD) {
      UIUtils.addClass(responseHolder, "incomingresponse-text-holder-activable");
      UIUtils.setClickListener(responseHolder, function() {
        AbstractRequestPage._AbstractRequestList.__setResponseStatus(this._requestId, this._responseId, Backend.Response.STATUS_READ, function() {
        });
        //We update when the server informs us to update
        //UIUtils.removeClass(responseHolder, "incomingresponse-text-holder-activable");
      }.bind(this));
    }
      
    var responseDate = new Date(response.time);
    UIUtils.get$(responseHolder).html("<b>A " + Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
  }
}

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractResponsePanel, function _OutgoingResponsePanel(requestId, responseId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.call(this, requestId, responseId, settings); 
});

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel.prototype._appendResponseElement = function(response) {
  var responseHolder = UIUtils.appendBlock(this._rootContainer, "TextHolder");
  UIUtils.addClass(responseHolder, "outgoingresponse-text-holder");
  
  var appendResponseText = function() {
    if (this._responseId == -1) {
      if (this._settings.requestClickListener != null) {
        UIUtils.addClass(responseHolder, "outgoingresponse-text-holder-activable");
        UIUtils.setClickListener(responseHolder, this._settings.requestClickListener.bind(this, this._requestId))
      }

      UIUtils.get$(responseHolder).html("And more responses. Click to see them all");
    } else {
      var responseDate = new Date(response.time);
      UIUtils.get$(responseHolder).html("<b>You responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
    }

    if (response.status == Backend.Response.STATUS_UNREAD) {
      var responseControlPanel = UIUtils.appendBlock(responseHolder, "ControlPanel");
      UIUtils.addClass(responseControlPanel, "outgoingresponse-controls");

      var editButton = UIUtils.appendButton(responseControlPanel, "ModifyButton", "Modify");
      UIUtils.addClass(editButton, "outgoingresponse-editbutton");
      UIUtils.setClickListener(editButton, function() {
        UIUtils.emptyContainer(responseHolder);

        this.__appendEditPanel(responseHolder, response, function() {
          UIUtils.emptyContainer(responseHolder);
          appendResponseText();
        });
      }.bind(this));
    }
  }.bind(this);
  
  appendResponseText();
}

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel.prototype.__appendEditPanel = function(root, response, completionCallback) {
  var editPanel = UIUtils.appendBlock(root, "RequestEditPanel");
  
  var responseDate = new Date(response.time);
  UIUtils.appendLabel(editPanel, "Label", "You responded on <b>" + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() +"</b>");
  
  var textArea = editPanel.appendChild(UIUtils.createTextArea(UIUtils.createId(editPanel, "Text"), 6));
  UIUtils.get$(textArea).val(response.text);

  var controlPanel = UIUtils.appendBlock(editPanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingresponse-controls");
  
  var updateButton = UIUtils.appendButton(controlPanel, "UpdateButton", "Update");
  UIUtils.addClass(updateButton, "outgoingresponse-updatebutton");
  UIUtils.setClickListener(updateButton, function() {
    response.text = UIUtils.get$(textArea).val();

    AbstractRequestPage._AbstractRequestList.__updateResponse(this._requestId, response, completionCallback);
  }.bind(this));
  
  UIUtils.setClickListener(deactivateButton, function() {
    request.status = Backend.Request.STATUS_INACTIVE;
    AbstractRequestPage._AbstractRequestList.__updateRequest(this._requestId, this._responseId, request, completionCallback);
  }.bind(this));
  
  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", "Cancel");
  UIUtils.addClass(cancelButton, "outgoingresponse-cancelbutton");
  UIUtils.setClickListener(cancelButton, completionCallback);
}



AbstractRequestPage.OutgoingRequestList = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList, function OutgoingRequestList(settings) {
  AbstractRequestPage._AbstractRequestList.call(this, settings);
});

AbstractRequestPage.OutgoingRequestList.prototype._createRequestPanel = function(requestId) {
  return new AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel(this, requestId, this._settings);
}

AbstractRequestPage.OutgoingRequestList.prototype._createResponsePanel = function(requestId, responseId) {
  return new AbstractRequestPage._AbstractRequestList._IncomingResponsePanel(requestId, responseId, this._settings);
}

AbstractRequestPage.OutgoingRequestList.prototype._getRequestIds = function(status) {
  return Backend.getOutgoingRequestIds(status);
}

AbstractRequestPage.OutgoingRequestList.prototype._getResponseIds = function(requestId, status) {
  return Backend.getIncomingResponseIds(requestId, status);
}

AbstractRequestPage.OutgoingRequestList.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestList.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}



AbstractRequestPage.IncomingRequestList = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList, function IncomingRequestList(settings) {
  AbstractRequestPage._AbstractRequestList.call(this, settings);
});

AbstractRequestPage.IncomingRequestList.prototype._createRequestPanel = function(requestId) {
  return new AbstractRequestPage._AbstractRequestList._IncomingRequestPanel(this, requestId, this._settings);
}

AbstractRequestPage.IncomingRequestList.prototype._createResponsePanel = function(requestId, responseId) {
  return new AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel(requestId, responseId, this._settings);
}

AbstractRequestPage.IncomingRequestList.prototype._getRequestIds = function(status) {
  return Backend.getIncomingRequestIds(status);
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIds = function(requestId, status) {
  return Backend.getOutgoingResponseIds(requestId, status);
}

AbstractRequestPage.IncomingRequestList.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}





// THIS IS THE SECTION WHICH DEFINES RequestStatistics object

AbstractRequestPage._AbstractRequestStatistics = ClassUtils.defineClass(Object, function _AbstractRequestStatistics(requestStatus, responseStatus, updateListener) {
  this._requestStatus = requestStatus;
  this._responseStatus = responseStatus;
  this._updateListener = updateListener;

  this._statistics = {};
  
  this._cacheChangeListener = function(event) {
    if (event.type == this._getRequestIdsChangeEventType()) {
      var requestIds = this._getRequestIds(this._requestStatus);

      for (var index in requestIds) {
        var requestId = requestIds[index];
        
        if (!this._statistics.hasOwnProperty(requestId)) {
          var responseIds = this._getResponseIds(requestId, this._responseStatus);
          if (responseIds != null) {
            this._statistics[requestId] = responseIds.length;
          } else {
            this._statistics[requestId] = null;
          }
        }
      }

      this._updateListener();
      //TODO: remove obsolete records from statistics if needed
    } else if (event.type == this._getResponseIdsChangeEventType()
               && this._statistics.hasOwnProperty(event.requestId)) {

      this._statistics[event.requestId] = this._getResponseIds(event.requestId, this._responseStatus).length;

      this._updateListener();
    }
  }.bind(this);
});

AbstractRequestPage._AbstractRequestStatistics.prototype.start = function() {
  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  var requestIds = this._getRequestIds(this._requestStatus);
  if (requestIds != null) {
    for (var index in requestIds) {
      var requestId = requestIds[index];

      this._statistics[requestId] = null;
      
      var responseIds = this._getResponseIds(requestId, this._responseStatus);
      if (responseIds != null) {
        this._statistics[this.requestId] = responseIds.length;
      }
    }
  }
  
  this._updateListener();
}

AbstractRequestPage._AbstractRequestStatistics.prototype.stop = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AbstractRequestPage._AbstractRequestStatistics.prototype.getStatistics = function() {
  return this._statistics;
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getResponseIds = function(requestId, responseStatus) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  throw "Not implemented";
}



AbstractRequestPage.OutgoingRequestStatistics = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestStatistics, function OutgoingRequestStatistics(requestStatus, responseStatus, updateListener) {
  AbstractRequestPage._AbstractRequestStatistics.call(this, requestStatus, responseStatus, updateListener);
});

AbstractRequestPage.OutgoingRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  return Backend.getOutgoingRequestIds(requestStatus);
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getResponseIds = function(requestId, responseStatus) {
  return Backend.getIncomingResponseIds(requestId, responseStatus);
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}


AbstractRequestPage.IncomingRequestStatistics = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestStatistics, function IncomingRequestStatistics(requestStatus, responseStatus, updateListener) {
  AbstractRequestPage._AbstractRequestStatistics.call(this, requestStatus, responseStatus, updateListener);
});

AbstractRequestPage.IncomingRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  return Backend.getIncomingResponseIds(requestStatus);
}

AbstractRequestPage.IncomingRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestStatistics._getResponseIds = function(requestId, responseStatus) {
  return Backend.getOutgoingResponseIds(requestId, responseStatus);
}

AbstractRequestPage.IncomingRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}

