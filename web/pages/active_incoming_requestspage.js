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
    maxResponses: -1,
    responseAreaMaxHeight: "300px",
    requestInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE | AbstractRequestPage.OutgoingRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITHOUT_RESPONSES,
    responseInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_ALL,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      },
      responseCreated: function() {
        Application.showMessage("You response was sent");
      }
    }
  });
  
  this._requestList.append(this._requestsPanel);
}

ActiveIncomingRequestsPage.prototype.onHide = function() {
  this._requestList.destroy();
}
