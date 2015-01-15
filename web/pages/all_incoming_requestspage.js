AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, "AllIncomingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
  this._requestsContainer = null;
  this._requestList = null;
});

AllIncomingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var linkId = UIUtils.createId(generalPanel, "ActiveRequestsLink");
  UIUtils.get$(generalPanel).html("This is the complete list of requests that The World asked you about.<br>You can find the most recent requests in the <a href='#' id='" + linkId + "'>Active Inquiries</a> section.");
  UIUtils.setClickListener(linkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
  });


  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");
  this._requestsContainer = UIUtils.appendBlock(root, "RequestPanel");
}

AllIncomingRequestsPage.prototype.onShow = function(root) {
  var updateListener = {
    updateStarted: function() {
      Application.showSpinningWheel();
    },
    updateFinished: function() {
      Application.hideSpinningWheel();
    }
  }
  
  this._requestTable = new AbstractRequestPage.IncomingRequestsTable({
    requestStatus: null,
    selectionObserver: function(requestId) {
      if (this._requestList != null) {
        this._requestList.destroy();
      }
      
      this._requestList = new AbstractRequestPage.IncomingRequestList({
        requestClickListener: null,
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

AllIncomingRequestsPage.prototype.onHide = function() {
  this._requestTable.remove();
  
  if (this._requestList != null) {
    this._requestList.destroy();
  }
}


