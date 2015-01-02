AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId, requestsType) {
  AbstractPage.call(this, pageId);
  
  this._requestsType = requestsType;
  this._requests = null;
});

AbstractRequestPage.appendRequestResponsesControl = function(root, requestIds, requestClickListener) {
  var rootId = root.getAttribute("id");
  
  var controlPanelId = rootId + "-RequestResponsesContainer";
  
  var containerElement;
  if ($("#" + controlPanelId).length == 0) {
    containerElement = root.appendChild(UIUtils.createBlock(controlPanelId));
  } else {
    $("#" + controlPanelId).empty();
    containerElement = $("#" + controlPanelId).get(0);
  }

  for (var index in requestIds) {
    var requestId = requestIds[index];
    var requestPanelId = controlPanelId + "-RequestPanel-" + requestId;
    var requestPanel = containerElement.appendChild(UIUtils.createBlock(requestPanelId));
    $("#" + requestPanelId).addClass("request-container");
    
    this._getRequest(requestId, function(requestId, requestPanel, requestPanelId, request) {
      var requestHolderId = requestPanelId + "-Request";
      requestPanel.appendChild(UIUtils.createBlock(requestHolderId));
      
      var requestDate = new Date(request.time);
      
      var requestHolderSelector = $("#" + requestHolderId);
      requestHolderSelector.addClass("request-text-holder");
      if (requestClickListener != null) {
        requestHolderSelector.addClass("request-text-holder-activable");
        requestHolderSelector.click(requestClickListener);
      }
      requestHolderSelector.html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
      
      
      var responsesPanelId = requestPanelId + "-Responses";
      var responsesPanel = requestPanel.appendChild(UIUtils.createBlock(responsesPanelId));
      $("#" + responsesPanelId).addClass("responses-container");
      
      for (var responseIndex in request.responses) {
        var responseId = request.responses[responseIndex];
        
        this._getResponse(requestId, responseId, function(responseId, responsesPanelId, responsesPanel, response) {
          var responseHolderId = responsesPanelId + "-" + responseId;
          responsesPanel.appendChild(UIUtils.createBlock(responseHolderId));

          var responseDate = new Date(response.time);
          $("#" + responseHolderId).addClass("response-text-holder").html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
        }.bind(this, responseId, responsesPanelId, responsesPanel));
      }
    }.bind(this, requestId, requestPanel, requestPanelId));
  }
}

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
        rowData.push({rowId: requestId, time: "--", text: "--", numOfResponses: "--"});
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

