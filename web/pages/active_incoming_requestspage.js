ActiveIncomingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveIncomingRequestsPage() {
  AbstractPage.call(this, "ActiveIncomingRequestsPage");
  
  this._requestList = null;
  this._requestsPanel = null;
});

ActiveIncomingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var linkId = UIUtils.createId(generalPanel, "AllInquiriesLink");
  UIUtils.get$(generalPanel).html("This is what the World is asking you to comment and is awaiting your opinion about<br>You can always see your older inquiries in the <a href='#' id='" + linkId + "'>All Inquiries</a> section.");
  UIUtils.setClickListener(linkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_INQUIRIES_ITEM_ID);
  });
  
  this._requestsPanel = UIUtils.appendBlock(root, "RequestsPanel");
}

ActiveIncomingRequestsPage.prototype.onShow = function(root) {
  this._requestList = new AbstractRequestPage.IncomingRequestList({
    requestClickListener: null,
    requestEditable: true,
    requestStatus: Backend.Request.STATUS_ACTIVE,
    maxResponses: -1,
    responseAreaMaxHeight: "300px",
    unviewedResponsesOnly: true,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      }
    }
  });
  
  this._requestList.append(this._requestsPanel);
}

ActiveIncomingRequestsPage.prototype.onHide = function() {
  this._requestList.destroy();
}
