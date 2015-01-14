AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId) {
  AbstractPage.call(this, pageId);
});


// THIS IS THE SECTION WHICH DEFINES RequestTable element

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

AbstractRequestPage.appendIncomingRequestsTable = function(root, selectionCallback) {
  var containerId = root.getAttribute("id");
  $("#" + containerId).empty();
  AbstractRequestPage._appendIncomingRequestsTable(containerId + "-Table", root, selectionCallback);
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







// THIS IS THE SECTION WHICH DEFINES RequestList element


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
AbstractRequestPage._AbstractRequestList = ClassUtils.defineClass(Object, function _AbstractRequestList(settings) {
  this._settings = settings;
  
  this._rootContainer = null;
  
  this._cacheChangeListener = null;
  this._requestPanels = [];
});

//abstract
AbstractRequestPage._AbstractRequestList.prototype._createRequestPanel = function(requestId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._createResponsePanel = function(requestId, responseId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getRequestIds = function() {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getResponseIds = function(requestId) {
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
    var appendRequestPanels = function() {
      var requestIds = this._getRequestIds();
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
      this.__appendResponses(this._requestId);
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
  UIUtils.addClass(responsesPanel, "incomingresponses-container");
  if (this._settings.responseAreaMaxHeight != null && this._settings.responseAreaMaxHeight != -1) {
    responsesPanel.style.maxHeight = this._settings.responseAreaMaxHeight;
  }

  var appendResponsePanels = function() {
    var responseIds = this._requestList._getResponseIds(requestId);
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

AbstractRequestPage._AbstractRequestList.__setResponseStatus = function(requestId, responseId, status, completionCallback) {
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

AbstractRequestPage._AbstractRequestList.__updateResponse = function(requestId, response, completionCallback) {
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

  var requestDate = new Date(request.time);
  UIUtils.get$(requestTextElement).html("<b>On " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " the World asked you:</b><br>" + request.text);

  if (isEditable) {
    var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
    UIUtils.addClass(controlPanel, "incomingrequest-controls");

    var commentButton = UIUtils.appendButton(controlPanel, "CommentButton", "Comment");
    UIUtils.addClass(commentButton, "incomingrequest-commentbutton");
    UIUtils.setClickListener(commentButton, function() {
      this.__appendCreateResponsePanel(request, function() {});
    }.bind(this));
  }
}

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype.__appendCreateResponsePanel = function(request, completionCallback) {
  var createResponsePanel = UIUtils.appendBlock(this._rootContainer, "CreateResponsePanel");
  UIUtils.addClass(createResponsePanel, "outgoingresponse-createresponsepanel");

  var responseTextElement = createResponsePanel.appendChild(UIUtils.createTextArea(UIUtils.createId(createResponsePanel, "ResponseText"), 5));
  
  var controlPanel = UIUtils.appendBlock(createResponsePanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingresponse-controls");
    
  var submitButton = UIUtils.appendButton(controlPanel, "SubmitButton", "Send");
  UIUtils.addClass(submitButton, "outgoingresponse-submitbutton");
  
  UIUtils.setClickListener(submitButton, function() {
    var responseText = UIUtils.get$(responseTextElement).val();
    if (responseText != "") {
      response = {
        text: responseText
      }
      AbstractRequestPage._AbstractRequestList.__updateResponse(this._requestId, response, completionCallback);
    } else {
      UIUtils.indicateInvalidInput(responseElementId);
    }
  });

  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", "Cancel");
  UIUtils.addClass(cancelButton, "outgoingresponse-cancelbutton");
  UIUtils.setClickListener(cancelButton, completionCallback);
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
        UIUtils.removeClass(responseHolder, "incomingresponse-text-holder-activable");
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
      UIUtils.get$(responseHolder).html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
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

AbstractRequestPage.OutgoingRequestList.prototype._getRequestIds = function() {
  return Backend.getOutgoingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.OutgoingRequestList.prototype._getResponseIds = function(requestId) {
  return Backend.getIncomingResponseIds(requestId, this._settings.unviewedResponsesOnly ? Backend.Response.STATUS_UNREAD : null);
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

AbstractRequestPage.IncomingRequestList.prototype._getRequestIds = function() {
  return Backend.getIncomingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIds = function(requestId) {
  return Backend.getOutgoingResponseIds(requestId, this._settings.unviewedResponsesOnly ? Backend.Response.STATUS_UNREAD : null);
}

AbstractRequestPage.IncomingRequestList.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}


