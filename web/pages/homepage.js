HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, "HomePage");
  
  this._requestCacheUpdateListener;
});

HomePage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("HomePage-GeneralPanel"));
  $("#HomePage-GeneralPanel").html("Welcome, " + Backend.getUserProfile().name + ".");

  var requestPanel = root.appendChild(UIUtils.createBlock("HomePage-RequestPanel"));
  requestPanel.appendChild(UIUtils.createBlock("HomePage-RequestPanel-Status"));
  $("#HomePage-RequestPanel-Status").html("Checking if you have any new responses to your requests...");
  
  requestPanel.appendChild(UIUtils.createBlock("HomePage-RequestPanel-Requests"));
  

  var inquiryPanel = root.appendChild(UIUtils.createBlock("HomePage-InquiryPanel"));
  inquiryPanel.appendChild(UIUtils.createBlock("HomePage-InquiryPanel-Status"));
  $("#HomePage-InquiryPanel-Status").html("Checking if you have any new inquiries...");
}

HomePage.prototype.onShow = function(root) {
  this._requestCacheUpdateListener = function() {
    Application.hideSpinningWheel();
    
    var responseCount = 0;
    var requestsWithUnviewedResponses = [];
    var activeRequestIds = Backend.getCachedOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
    for (var requestIndex in activeRequestIds) {
      var isAdded = false;
      var requestId = activeRequestIds[requestIndex];
      var request = Backend.getCachedRequest(requestId);
      for (var responseIndex in request.responseIds) {
        var response = Backend.getCachedResponse(requestId, request.responseIds[responseIndex]);
        if (response.status == Backend.Response.STATUS_UNREAD) {
          responseCount++;
          
          if (!isAdded) {
            requestsWithUnviewedResponses.push(requestId);
            isAdded = true;
          }
        }
      }
    }
    
    if (requestsWithUnviewedResponses.length > 0) {
      $("#HomePage-RequestPanel-Status").html("You have " + responseCount + " unviewed responses for " + requestsWithUnviewedResponses.length + " your requests:");
      
      AbstractRequestPage.appendOutgoingRequestResponsesControl($("#HomePage-RequestPanel-Requests").get(0), requestsWithUnviewedResponses, {
        requestClickListener: function(requestId) {
          var paramBundle = {
            returnPageId: MenuPage.prototype.HOME_ITEM_ID,
            requestId: requestId,
            otherRequestIds: requestsWithUnviewedResponses
          }
        
          Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
        },
        requestEditable: false,
        maxResponses: 3,
        responseAreaMaxHeight: -1,
        unviewedResponsesOnly: true
      });
    } else {
      $("#HomePage-RequestPanel-Status").html("You have no new responses. You can review your <a href='#' id='HomePage-RequestPanel-ActiveRequestLink'>active requests</a>.");
      $("#HomePage-RequestPanel-ActiveRequestLink").click(function() {
        Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
      });
      $("#HomePage-RequestPanel-Requests").empty();
    }
  }
  
  if (!Backend.isRequestCacheInitialized()) {
    Application.showSpinningWheel();
  } else {
    this._requestCacheUpdateListener();
  }
  
  Backend.addRequestCacheChangeListener(this._requestCacheUpdateListener);
}

HomePage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
  Application.hideSpinningWheel();
}


