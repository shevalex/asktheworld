ActiveRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveRequestsPage() {
  AbstractPage.call(this, "ActiveRequestsPage");
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
  var updateListener = function() {
    Application.hideSpinningWheel();
    
    var activeRequestIds = Backend.getCachedRequestIds(Backend.Request.STATUS_ACTIVE);
    AbstractRequestPage.appendRequestResponsesControl($("#ActiveRequestsPage-RequestsPanel").get(0), activeRequestIds, {
      requestClickListener: function(requestId, request) {
        Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, {returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID, requestId: requestId});
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
    updateListener();
  }
  
  Backend.addRequestCacheChangeListener(updateListener);
}


