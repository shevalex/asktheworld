ActiveIncomingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveIncomingRequestsPage() {
  AbstractPage.call(this, "ActiveIncomingRequestsPage");
  
  this._requestList = null;
  this._requestsPanel = null;
});

ActiveIncomingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var textPanel = UIUtils.appendBlock(generalPanel, "Text");
  textPanel.innerHTML = this.getLocale().ActiveIncomingRequestsLabel;

  var linkId = UIUtils.createId(generalPanel, "AllInquiriesLink");
  var seeAllElement = UIUtils.appendBlock(generalPanel, "SeeAll");
  seeAllElement.innerHTML = this.getLocale().AllRequestsLinkProvider(linkId);
  UIUtils.setClickListener(linkId, function() {
    Application.showMenuPage(MenuPage.prototype.ALL_INQUIRIES_ITEM_ID);
  });
  
  this._requestsPanel = UIUtils.appendBlock(root, "RequestsPanel");
}

ActiveIncomingRequestsPage.prototype.onShow = function(root) {
  this._requestList = new AbstractRequestPage.IncomingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        incoming: true,
        returnPageId: MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getIncomingRequestIds(Backend.Request.STATUS_ACTIVE)
      }

      Application.showMenuPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: true,
    showFullContent: false,
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
        Application.showMessage(I18n.getLocale().literals.ResponseSentMessage, Application.MESSAGE_TIMEOUT_FAST);
      }.bind(this),
      requestDeleted: function() {
        Application.showMessage(I18n.getLocale().literals.RequestRemovedMessage, Application.MESSAGE_TIMEOUT_FAST);
      }.bind(this)
    }
  });
  
  this._requestList.append(this._requestsPanel);
}

ActiveIncomingRequestsPage.prototype.onHide = function() {
  this._requestList.destroy();
}
