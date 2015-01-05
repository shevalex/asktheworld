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
  root.appendChild(UIUtils.createBlock("ActiveRequestsPage-RequestContentPanel"));
}

ActiveRequestsPage.prototype.onShow = function(root) {
  this._getRequestIds(function(requestIds) {
    AbstractRequestPage.appendRequestResponsesControl($("#ActiveRequestsPage-RequestsPanel").get(0), requestIds, {
      requestClickListener: function(requestId, request) {
        Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, {returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID, requestId: requestId, request: request});
      },
      requestEditable: true,
      maxResponses: -1,
      unviewedResponsesOnly: true
    });
  });
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


