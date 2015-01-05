AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId, requestsType) {
  AbstractPage.call(this, pageId);
  
  this._requestsType = requestsType;
  this._requests = null;
});


AbstractRequestPage.prototype.pullRequestsAndAppendTable = function(containerId, selectionCallback) {
  function appendTable() {
    $("#" + containerId).empty();
    this._appendRequestsTable(containerId + "-Table", $("#" + containerId).get(0), selectionCallback);
  };
  
  if (this._requests == null) {
    AbstractRequestPage._getRequestIds(function(requestIds) {
      this._requests = {};
      for (var index in requestIds) {
        this._requests[requestIds[index]] = null;
      }
    
      appendTable.call(this);
    }.bind(this));
  } else {
    appendTable.call(this);
  }
}

AbstractRequestPage.appendRequestResponsesControl = function(root, requestIds, requestClickListener, requestEditable) {
  AbstractRequestPage._RequestResponseControl.appendControl(root, requestIds, requestClickListener, requestEditable);
}


  
AbstractRequestPage.prototype._appendRequestsTable = function(tableId, root, selectionCallback) {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      for (var requestId in this._requests) {
        rowData.push({rowId: requestId, temporary: true, time: "--", text: "--", numOfResponses: "--"});
      }
      
      return rowData;
    }.bind(this),
    
    getRowDetails: function(rowId, callback) {
      function convertRequestToRowData(request) {
        return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: request.responses.length};
      }
      
      if (this._requests[rowId] == null) {
        AbstractRequestPage._getRequest(rowId, function(request) {
          this._requests[rowId] = request;
          
          callback(convertRequestToRowData(request));
        }.bind(this));
      } else {
        callback(convertRequestToRowData(this._requests[rowId]));
      }
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable(tableId, root, columns, rowDataProvider, function(rowId) {
    selectionCallback(rowId, this._requests[rowId]);
  }.bind(this));
}



AbstractRequestPage._RequestResponseControl = {};

AbstractRequestPage._RequestResponseControl.appendControl = function(root, requestIds, requestClickListener, requestEditable) {
  var controlPanelId = root.getAttribute("id") + "-RequestResponsesContainer";
  
  var containerElement;
  if ($("#" + controlPanelId).length == 0) {
    containerElement = root.appendChild(UIUtils.createBlock(controlPanelId));
  } else {
    $("#" + controlPanelId).empty();
    containerElement = $("#" + controlPanelId).get(0);
  }

  for (var index in requestIds) {
    this._appendRequestAndResponsesPanel(containerElement, requestIds[index], requestClickListener, requestEditable);
  }
}

AbstractRequestPage._RequestResponseControl._appendRequestAndResponsesPanel = function(root, requestId, requestClickListener, requestEditable) {
  var requestPanelId = root.getAttribute("id") + "-" + requestId;
  var requestPanel = root.appendChild(UIUtils.createBlock(requestPanelId));
  $("#" + requestPanelId).addClass("request-container");

  AbstractRequestPage._getRequest(requestId, function(request) {
    var requestHolderId = requestPanelId + "-RequestHolder";
    var requestHolderElement = requestPanel.appendChild(UIUtils.createBlock(requestHolderId));
    var requestHolderSelector = $("#" + requestHolderId);
    
    if (requestEditable == true) { 
      requestHolderSelector.addClass("request-holder-editable");
    } else {
      requestHolderSelector.addClass("request-holder");
    }
      
    var appendRequestText = function() {
      requestHolderSelector.empty();
      
      var requestTextId = requestHolderId + "-RequestText";
      var requestTextElement = requestHolderElement.appendChild(UIUtils.createBlock(requestTextId));
      var requestTextSelector = $("#" + requestTextId);
      
      var requestDate = new Date(request.time);
      
      requestTextSelector.addClass("request-text-holder");
      if (requestClickListener != null) {
        requestTextSelector.addClass("request-text-holder-activable");
        requestTextSelector.click(function() {
          requestClickListener(requestId, request);
        });
      }
        
      requestTextSelector.html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
        
      if (requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE) {
        var controlPanelId = requestHolderId + "-ControlPanel";
        var controlPanel = requestHolderElement.appendChild(UIUtils.createBlock(controlPanelId));
        $("#" + controlPanelId).addClass("request-edit-control");

        var requestEditButtonId = controlPanelId + "-EditButton";
        controlPanel.appendChild(UIUtils.createButton(requestEditButtonId, "Edit"));
        $("#" + requestEditButtonId).addClass("request-edit-control");
        $("#" + requestEditButtonId).click(function() {
          requestHolderSelector.empty();
            
          this._appendEditPanel(requestHolderElement, requestId, request, function() {
            appendRequestText();
          });
        }.bind(this));
      }
    }.bind(this);
      
    appendRequestText();
    
    this._appendResponses(requestPanel, requestId, request);
  }.bind(this));
}

AbstractRequestPage._RequestResponseControl._appendResponses = function(root, requestId, request) {
  var responsesPanelId = root.getAttribute("id") + "-Responses";
  var responsesPanel = root.appendChild(UIUtils.createBlock(responsesPanelId));
  $("#" + responsesPanelId).addClass("responses-container");
      
  for (var responseIndex in request.responses) {
    var responseId = request.responses[responseIndex];
        
    AbstractRequestPage._getResponse(requestId, responseId, function(responseId, response) {
      var responseHolderId = responsesPanelId + "-" + responseId;
      responsesPanel.appendChild(UIUtils.createBlock(responseHolderId));

      var responseDate = new Date(response.time);
          
      var responseSelector = $("#" + responseHolderId);
      responseSelector.addClass("response-text-holder");
      if (response.status == Backend.Response.STATUS_UNREAD) {
        responseSelector.addClass("response-text-holder-activable");
        responseSelector.click(function(requestId, responseId, responseSelector) {
          AbstractRequestPage._setResponseStatus(requestId, responseId, Backend.Response.STATUS_READ);
          responseSelector.removeClass("response-text-holder-activable");
        }.bind(this, requestId, responseId, responseSelector));
      }
      responseSelector.html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
    }.bind(this, responseId));
  }
}
                                  
AbstractRequestPage._RequestResponseControl._appendEditPanel = function(root, requestId, request, completionCallback) {
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
  
  $("#" + controlPanelId + "-UpdateButton").click(completionCallback);
  
//  $("#" + controlPanelId + "-UpdateButton").click(AbstractRequestPage._updateRequest.bind(AbstractRequestPage, rowId));
//  $("#" + controlPanelId + "-DeleteButton").click(AbstractRequestPage._deleteRequest.bind(AbstractRequestPage, rowId));
}



AbstractRequestPage._getRequestIds = function(successCallback) {
  var callback = {
    success: function(requestIds) {
      this._onCompletion();
      successCallback(requestIds);
    },
    failure: function() {
      this._onCompletion();
    },
    error: function() {
      this._onCompletion();
    },
    
    _onCompletion: function() {
      Application.hideSpinningWheel();
    }
  }
  
  Application.showSpinningWheel();

  Backend.getRequestIds(this._requestsType, callback);
}

AbstractRequestPage._getRequest = function(requestId, successCallback) {
  var callback = {
    success: function(request) {
      successCallback(request);
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.getRequest(requestId, callback);
}

AbstractRequestPage._getResponse = function(requestId, responseId, successCallback) {
  var callback = {
    success: function(response) {
      successCallback(response);
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.getResponse(requestId, responseId, callback);
}

AbstractRequestPage._setResponseStatus = function(requestId, responseId, status) {
  var callback = {
    success: function() {
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  //Backend.setResponseStatus(requestId, responseId, status);
}


AbstractRequestPage.prototype._updateRequest = function(requestId) {
  //var buttonSelector = $("#" + controlId);
  
  var callback = {
    success: function(requestId) {
      this._onCompletion();
    },
    failure: function() {
      this._onCompletion();
    },
    error: function() {
      this._onCompletion();
    },
    
    _onCompletion: function() {
      //buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  /*
  var request = {
    id: requestId,
    text: $("#ActiveRequestsPage-RequestContentPanel-Text").val(),
    pictures: [],
    audios: []
  }
  
  var requestParams = {
    gender: $("#ActiveRequestsPage-RequestContentPanel-Gender").val(),
    quantity: $("#ActiveRequestsPage-RequestContentPanel-Quantity").val(),
    waitTime: $("#ActiveRequestsPage-RequestContentPanel-WaitTime").val(),
    age: $("#ActiveRequestsPage-RequestContentPanel-AgeCategory").val()
  }

  buttonSelector.prop("disabled", true);
  Application.showSpinningWheel();

  Backend.updateRequest(request, requestParams, callback);
  */
}

AbstractRequestPage.prototype._deleteRequest = function(requestId) {
  //var buttonSelector = $("#ActiveRequestsPage-ControlPanel-DeleteButton");
  
  var callback = {
    success: function() {
      this._onCompletion();
    },
    failure: function() {
      this._onCompletion();
    },
    error: function() {
      this._onCompletion();
    },
    
    _onCompletion: function() {
      //buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  
  /*
  buttonSelector.prop("disabled", true);
  Application.showSpinningWheel();

  Backend.deleteRequest(requestId, callback);
  */
}

