AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId, requestsType) {
  AbstractPage.call(this, pageId);
});


AbstractRequestPage.appendRequestsTable = function(root, selectionCallback) {
  var containerId = root.getAttribute("id");
  $("#" + containerId).empty();
  this._appendRequestsTable(containerId + "-Table", root, selectionCallback);
}

/*
 * settings.requestClickListener
 * settings.requestEditable
 * settings.maxResponses
 */
AbstractRequestPage.appendRequestResponsesControl = function(root, requestIds, settings) {
  AbstractRequestPage._RequestResponseControl.appendControl(root, requestIds, settings);
}


  
AbstractRequestPage._appendRequestsTable = function(tableId, root, selectionCallback) {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var requestIds = Backend.getCachedRequestIds();
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



AbstractRequestPage._RequestResponseControl = {};

AbstractRequestPage._RequestResponseControl.appendControl = function(root, requestIds, settings) {
  var controlPanelId = root.getAttribute("id") + "-RequestResponsesContainer";
  $("#" + controlPanelId).addClass("request-and-responses-container");
  
  var containerElement;
  if ($("#" + controlPanelId).length == 0) {
    containerElement = root.appendChild(UIUtils.createBlock(controlPanelId));
  } else {
    $("#" + controlPanelId).empty();
    containerElement = $("#" + controlPanelId).get(0);
  }

  for (var index in requestIds) {
    this._appendRequestAndResponsesPanel(containerElement, requestIds[index], settings);
  }
}

AbstractRequestPage._RequestResponseControl._appendRequestAndResponsesPanel = function(root, requestId, settings) {
  var requestPanelId = root.getAttribute("id") + "-" + requestId;
  var requestPanel = root.appendChild(UIUtils.createBlock(requestPanelId));
  
  //TODO: need to listen for changes and refresh
  
  var request = Backend.getCachedRequest(requestId);

  var requestHolderId = requestPanelId + "-RequestHolder";
  var requestHolderElement = requestPanel.appendChild(UIUtils.createBlock(requestHolderId));
  var requestHolderSelector = $("#" + requestHolderId);
    
  var isEditable = settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;
  
  if (isEditable) { 
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
    if (settings.requestClickListener != null) {
      requestTextSelector.addClass("request-text-holder-activable");
      requestTextSelector.click(function() {
        settings.requestClickListener(requestId, request);
      });
    }
        
    requestTextSelector.html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
        
    if (isEditable) {
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
    
  this._appendResponses(requestPanel, requestId, request, settings);
}

AbstractRequestPage._RequestResponseControl._appendResponses = function(root, requestId, request, settings) {
  var responsesPanelId = root.getAttribute("id") + "-Responses";
  var responsesPanel = root.appendChild(UIUtils.createBlock(responsesPanelId));
  $("#" + responsesPanelId).addClass("responses-container");
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
      responseSelector.addClass("response-text-holder");
      if (settings.requestClickListener != null) {
        responseSelector.addClass("response-text-holder-activable");
        responseSelector.click(settings.requestClickListener.bind(this, requestId, request));
      }

      responseSelector.html("And more responses. Click to see them all");
    } else {
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
    }
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

  Application.showSpinningWheel();

  Backend.updateRequest(request, requestParams, callback);
  */
}

AbstractRequestPage.prototype._deleteRequest = function(requestId) {
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
      Application.hideSpinningWheel();
    }
  }
  
  /*
  Application.showSpinningWheel();

  Backend.deleteRequest(requestId, callback);
  */
}

