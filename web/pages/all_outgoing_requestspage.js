AllOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllOutgoingRequestsPage() {
  AbstractRequestPage.call(this, "AllOutgoingRequestsPage", "all");
  
  this._requestCacheUpdateListener;
});

AllOutgoingRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("AllOutgoingRequestsPage-GeneralPanel"));
  $("#AllOutgoingRequestsPage-GeneralPanel").html("This is the complete list of requests that you Asked The World about.<br>You can find your most recent active requests in the <a href='#' id='AllOutgoingRequestsPage-GeneralPanel-ActiveRequestslink'>Active Requests</a> section.");
  $("#AllOutgoingRequestsPage-GeneralPanel-ActiveRequestslink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("AllOutgoingRequestsPage-TablePanel"));
  root.appendChild(UIUtils.createBlock("AllOutgoingRequestsPage-RequestPanel"));
}

AllOutgoingRequestsPage.prototype.onShow = function(root) {
  this._requestCacheUpdateListener = function() {
    Application.hideSpinningWheel();
    
    var requestPanelElement = $("#AllOutgoingRequestsPage-RequestPanel").get(0);
    AbstractRequestPage.appendOutgoingRequestsTable($("#AllOutgoingRequestsPage-TablePanel").get(0), function(requestId) {
      AbstractRequestPage.appendOutgoingRequestResponsesControl(requestPanelElement, [requestId], {
        requestClickListener: function(requestId) {
          var paramBundle = {
            returnPageId: MenuPage.prototype.ALL_REQUESTS_ITEM_ID,
            requestId: requestId,
            otherRequestIds: Backend.getCachedOutgoingRequestIds()
          }
          
          Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
        },
        requestEditable: true,
        maxResponses: 3,
        unviewedResponsesOnly: false
      });
    });
  }
  
  if (!Backend.isRequestCacheInitialized()) {
    Application.showSpinningWheel();
  } else {
    this._requestCacheUpdateListener();
  }
  
  Backend.addRequestCacheChangeListener(this._requestCacheUpdateListener);
}

AllOutgoingRequestsPage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
  Application.hideSpinningWheel();
}


