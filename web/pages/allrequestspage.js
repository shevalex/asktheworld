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
  var responsesPanelElement = $("#AllRequestsPage-RequestPanel").get(0);
  
  this.pullRequestsAndAppendTable("AllRequestsPage-TablePanel", function(requestId, request) {
    AbstractRequestPage.appendRequestResponsesControl(responsesPanelElement, [requestId], {
      requestClickListener: function(requestId, request) {
        Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, {returnPageId: MenuPage.prototype.ALL_REQUESTS_ITEM_ID, requestId: requestId, request: request});
      },
      requestEditable: true,
      maxResponses: 3,
      unviewedResponsesOnly: false
    });
  });
}




