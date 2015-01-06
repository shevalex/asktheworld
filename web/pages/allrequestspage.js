AllRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllRequestsPage() {
  AbstractRequestPage.call(this, "AllRequestsPage", "all");
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
  var updateListener = function() {
    Application.hideSpinningWheel();
    
    var requestPanelElement = $("#AllRequestsPage-RequestPanel").get(0);
  
    AbstractRequestPage.appendRequestsTable($("#AllRequestsPage-TablePanel").get(0), function(requestId) {
      AbstractRequestPage.appendRequestResponsesControl(requestPanelElement, [requestId], {
        requestClickListener: function(requestId) {
          Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, {returnPageId: MenuPage.prototype.ALL_REQUESTS_ITEM_ID, requestId: requestId});
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
    updateListener();
  }
  
  Backend.addRequestCacheChangeListener(updateListener);
}




