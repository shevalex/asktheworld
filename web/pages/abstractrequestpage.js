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
    this._getRequestIds(function(requestIds) {
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
        this._getRequestDetails(rowId, function(request) {
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


AbstractRequestPage.prototype._getRequestIds = function(successCallback) {
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

AbstractRequestPage.prototype._getRequestDetails = function(requestId, successCallback) {
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

