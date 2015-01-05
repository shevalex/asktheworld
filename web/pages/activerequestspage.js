ActiveRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveRequestsPage() {
  AbstractPage.call(this, "ActiveRequestsPage");
  
  this._activeRequests = null;
});

ActiveRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("ActiveRequestsPage-GeneralPanel"));
  $("#ActiveRequestsPage-GeneralPanel").html("This is what you recently Asked The World about and still waiting for more responses.<br>You can always see your older requests in the <a href='#' id='ActiveRequestsPage-GeneralPanel-AllRequestslink'>All Requests</a> section.");
  $("#ActiveRequestsPage-GeneralPanel-AllRequestslink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("ActiveRequestsPage-RequestsPanel"));
  root.appendChild(UIUtils.createBlock("ActiveRequestsPage-RequestContentPanel"));
}

ActiveRequestsPage.prototype.onShow = function(root) {
  //TBD: define a better rule for update
  if (this._activeRequests == null) {
    this._getRequestIds(function(requestIds) {
      this._activeRequests = {};
      for (var index in requestIds) {
        this._activeRequests[requestIds[index]] = null;
      }
    
      this._dataTableObject = this._appendRequestsTable($("#ActiveRequestsPage-RequestsPanel").get(0));
    }.bind(this));
  } else {
    $("#ActiveRequestsPage-RequestsPanel").empty();
    this._dataTableObject = this._appendRequestsTable($("#ActiveRequestsPage-RequestsPanel").get(0));
  }
}



ActiveRequestsPage.prototype._appendRequestsTable = function(root) {
  var columns = [
    {title: "Date", data: "time", type: "date", width: "100px"},
    {title: "Responses", data: "numOfResponses", type: "num", width: "40px"},
    {title: "Your Request", data: "text", type: "string"}
  ];
            
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      for (var requestId in this._activeRequests) {
        rowData.push({rowId: requestId, time: "--", text: "--", numOfResponses: "--"});
      }
      
      return rowData;
    }.bind(this),
    
    getRowDetails: function(rowId, callback) {
      function convertRequestToRowData(request) {
        return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: request.responses.length};
      }
      
      if (this._activeRequests[rowId] == null) {
        this._getRequestDetails(rowId, function(request) {
          this._activeRequests[rowId] = request;
          
          callback(convertRequestToRowData(request));
        }.bind(this));
      } else {
        callback(convertRequestToRowData(this._activeRequests[rowId]));
      }
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable("ActiveRequestsPage-RequestsTable", root, columns, rowDataProvider, this._reappendRequestPanel.bind(this, root));
}

ActiveRequestsPage.prototype._reappendRequestPanel = function(root, rowId) {
  $("#ActiveRequestsPage-RequestContentPanel").empty();
  
  var request = this._activeRequests[rowId];
  if (request == null) {
    return;
  }
  
  AbstractRequestPage.appendRequestResponsesControl($("#ActiveRequestsPage-RequestContentPanel").get(0), [rowId], function() {
    Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, {returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID, requestId: requestId, request: request});
  }, true);
}


ActiveRequestsPage.prototype._getRequestIds = function(successCallback) {
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

  Backend.getRequestIds("active", callback);
}

ActiveRequestsPage.prototype._getRequestDetails = function(requestId, successCallback) {
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


