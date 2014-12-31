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
  var requestInfo = this._activeRequests[rowId];
  
  $("#ActiveRequestsPage-RequestContentPanel").remove();
  
  var requestPanel = root.appendChild(UIUtils.createBlock("ActiveRequestsPage-RequestContentPanel"));
  
  var requestDate = new Date(requestInfo.time);
  requestPanel.appendChild(UIUtils.createLabel("ActiveRequestsPage-RequestContentPanel-Label", "This request was sent on <b>" + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() +"</b>"));
  
  requestPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList("ActiveRequestsPage-RequestContentPanel-Gender", "Target sex", Application.Configuration.GENDER_PREFERENCE, "10px"));
  $("#ActiveRequestsPage-RequestContentPanel-Gender").val(requestInfo.response_gender);
  
  requestPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList("ActiveRequestsPage-RequestContentPanel-AgeCategory", "Target age group", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  $("#ActiveRequestsPage-RequestContentPanel-AgeCategory").val(requestInfo.response_age_group);
  
  requestPanel.appendChild(UIUtils.createLineBreak());
  requestPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 0 0")).appendChild(UIUtils.createLabeledDropList("ActiveRequestsPage-RequestContentPanel-WaitTime", "Wait time for responses", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  $("#ActiveRequestsPage-RequestContentPanel-WaitTime").val(requestInfo.response_wait_time);
  
  requestPanel.appendChild(UIUtils.createSpan("48%", "20px 0 0 0")).appendChild(UIUtils.createLabeledDropList("ActiveRequestsPage-RequestContentPanel-Quantity", "Maximum # of responses", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  $("#ActiveRequestsPage-RequestContentPanel-Quantity").val(requestInfo.response_quantity);
  
  requestPanel.appendChild(UIUtils.createTextArea("ActiveRequestsPage-RequestContentPanel-Text", 6));
  $("#ActiveRequestsPage-RequestContentPanel-Text").val(requestInfo.text);

  var controlPanel = requestPanel.appendChild(UIUtils.createBlock("ActiveRequestsPage-ControlPanel"));
  controlPanel.appendChild(UIUtils.createButton("ActiveRequestsPage-ControlPanel-UpdateButton", "Update"));
  controlPanel.appendChild(UIUtils.createButton("ActiveRequestsPage-ControlPanel-DeleteButton", "Delete"));
  
  $("#ActiveRequestsPage-ControlPanel-UpdateButton").click(this._updateRequest.bind(this, rowId));
  $("#ActiveRequestsPage-ControlPanel-DeleteButton").click(this._deleteRequest.bind(this, rowId));
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


ActiveRequestsPage.prototype._updateRequest = function(requestId) {
  var buttonSelector = $("#ActiveRequestsPage-ControlPanel-UpdateButton");
  
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
      buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  
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
}

ActiveRequestsPage.prototype._deleteRequest = function(requestId) {
  var buttonSelector = $("#ActiveRequestsPage-ControlPanel-DeleteButton");
  
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
      buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  
  buttonSelector.prop("disabled", true);
  Application.showSpinningWheel();

  Backend.deleteRequest(requestId, callback);
}
