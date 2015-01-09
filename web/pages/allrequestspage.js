AllRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllRequestsPage() {
  AbstractRequestPage.call(this, "AllRequestsPage", "all");
  
  this._requestCacheUpdateListener;
});

AllRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("AllRequestsPage-GeneralPanel"));
  $("#AllRequestsPage-GeneralPanel").html("This is the complete list of requests that you Asked The World about.<br>You can find your most recent active requests in the <a href='#' id='AllRequestsPage-GeneralPanel-ActiveRequestslink'>Active Requests</a> section.");
  $("#AllRequestsPage-GeneralPanel-ActiveRequestslink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("AllRequestsPage-TablePanel"));
  root.appendChild(UIUtils.createBlock("AllRequestsPage-RequestPanel"));
}

AllRequestsPage.prototype.onShow = function(root) {
  this._requestCacheUpdateListener = function() {
    Application.hideSpinningWheel();
    
    var requestPanelElement = $("#AllRequestsPage-RequestPanel").get(0);
    AbstractRequestPage.appendOutgoingRequestsTable($("#AllRequestsPage-TablePanel").get(0), function(requestId) {
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

AllRequestsPage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
}


