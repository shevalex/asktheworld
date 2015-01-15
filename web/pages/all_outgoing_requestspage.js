AllOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllOutgoingRequestsPage() {
  AbstractRequestPage.call(this, "AllOutgoingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
  this._requestsContainer = null;
  this._requestList = null;
});

AllOutgoingRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("AllOutgoingRequestsPage-GeneralPanel"));
  $("#AllOutgoingRequestsPage-GeneralPanel").html("This is the complete list of requests that you Asked The World about.<br>You can find your most recent active requests in the <a href='#' id='AllOutgoingRequestsPage-GeneralPanel-ActiveRequestsLink'>Active Requests</a> section.");
  $("#AllOutgoingRequestsPage-GeneralPanel-ActiveRequestsLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");
  this._requestsContainer = UIUtils.appendBlock(root, "RequestPanel");
}

AllOutgoingRequestsPage.prototype.onShow = function(root) {
  var updateListener = {
    updateStarted: function() {
      Application.showSpinningWheel();
    },
    updateFinished: function() {
      Application.hideSpinningWheel();
    }
  }
  
  this._requestTable = new AbstractRequestPage.OutgoingRequestsTable({
    requestStatus: null,
    selectionObserver: function(requestId) {
      if (this._requestList != null) {
        this._requestList.destroy();
      }
      
      this._requestList = new AbstractRequestPage.OutgoingRequestList({
        requestClickListener: function(requestId) {
          var paramBundle = {
            returnPageId: MenuPage.prototype.ALL_REQUESTS_ITEM_ID,
            requestId: requestId,
            otherRequestIds: Backend.getOutgoingRequestIds()
          }

          Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
        },
        requestIds: [requestId],
        requestEditable: true,
        maxResponses: 3,
        responseAreaMaxHeight: -1,
        unviewedResponsesOnly: false,
        updateListener: updateListener
      });
      
      this._requestList.append(this._requestsContainer);
    }.bind(this),
    updateListener: updateListener
  });
  
  this._requestTable.append(this._requestTableContainer);
}

AllOutgoingRequestsPage.prototype.onHide = function() {
  this._requestTable.remove();
  
  if (this._requestList != null) {
    this._requestList.destroy();
  }
}


