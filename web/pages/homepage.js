HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, "HomePage");
  
  this._requestList = null;
  this._requestsPanelRequests = null;
  this._requestsStatusElement = null;
});

HomePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Welcome, " + Backend.getUserProfile().name + ".");

  var requestsPanel = UIUtils.appendBlock(root, "RequestPanel");
  this._requestsStatusElement = UIUtils.appendBlock(requestsPanel, "Status");
  this._requestsPanelRequests = UIUtils.appendBlock(requestsPanel, "Requests");

  /*
  var inquiryPanel = root.appendChild(UIUtils.createBlock("HomePage-InquiryPanel"));
  inquiryPanel.appendChild(UIUtils.createBlock("HomePage-InquiryPanel-Status"));
  $("#HomePage-InquiryPanel-Status").html("Checking if you have any new inquiries...");
  */
}

HomePage.prototype.onShow = function(root) {
  UIUtils.get$(this._requestsStatusElement).html("Checking if you have any new responses to your requests...");
  
  this._requestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        returnPageId: MenuPage.prototype.HOME_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds()
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: false,
    maxResponses: 3,
    responseAreaMaxHeight: -1,
    unviewedResponsesOnly: true,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
        
        var info = this._requestList.getInfo();
        UIUtils.get$(this._requestsStatusElement).html("You have " + info.responseIds.length + " unviewed responses for " + info.requestIds.length + " your requests:");
      }.bind(this)
    }
  });
  
  this._requestList.append(this._requestsPanelRequests);
}

HomePage.prototype.onHide = function() {
  this._requestList.remove();
}


