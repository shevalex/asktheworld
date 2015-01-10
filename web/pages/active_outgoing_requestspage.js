ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveOutgoingRequestsPage() {
  AbstractPage.call(this, "ActiveOutgoingRequestsPage");
  
  this._requestCacheUpdateListener;
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("ActiveOutgoingRequestsPage-GeneralPanel"));
  $("#ActiveOutgoingRequestsPage-GeneralPanel").html("This is what you recently Asked The World about and still waiting for more responses.<br>You can always see your older requests in the <a href='#' id='ActiveOutgoingRequestsPage-GeneralPanel-AllRequestsLink'>All Requests</a> section.");
  $("#ActiveOutgoingRequestsPage-GeneralPanel-AllRequestsLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("ActiveOutgoingRequestsPage-RequestsPanel"));
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  this._requestCacheUpdateListener = function() {
    Application.hideSpinningWheel();
    
    var activeRequestIds = Backend.getCachedOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
    AbstractRequestPage.appendOutgoingRequestResponsesControl($("#ActiveOutgoingRequestsPage-RequestsPanel").get(0), activeRequestIds, {
      requestClickListener: function(requestId) {
        var paramBundle = {
          returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID,
          requestId: requestId,
          otherRequestIds: activeRequestIds
        }
        
        Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
      },
      requestEditable: true,
      maxResponses: -1,
      responseAreaMaxHeight: "300px",
      unviewedResponsesOnly: true
    });
  }
  
  if (!Backend.isRequestCacheInitialized()) {
    Application.showSpinningWheel();
  } else {
    this._requestCacheUpdateListener();
  }
  
  Backend.addRequestCacheChangeListener(this._requestCacheUpdateListener);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
  Application.hideSpinningWheel();
}


