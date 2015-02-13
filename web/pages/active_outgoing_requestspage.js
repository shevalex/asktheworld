ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveOutgoingRequestsPage() {
  AbstractPage.call(this, "ActiveOutgoingRequestsPage");
  
  this._requestsPanelRequests;
  this._requestList
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var textPanel = UIUtils.appendBlock(generalPanel, "Text");
  textPanel.innerHTML = this.getLocale().ActiveOutgoingRequestsLabel;

  var seeAllLinkId = UIUtils.createId(generalPanel, "Link");
  var seeAllElement = UIUtils.appendBlock(generalPanel, "SeeAll");
  seeAllElement.innerHTML = this.getLocale().AllRequestsLinkProvider(seeAllLinkId);
  UIUtils.setClickListener(seeAllLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID);
  });
  
  this._requestsPanelRequests = UIUtils.appendBlock(root, "RequestsPanel");
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  this._requestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        incoming: false,
        returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE)
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: true,
    showFullContent: true,
    maxResponses: 2,
    showResponseCount: true,
    responseAreaMaxHeight: "300px",
    requestInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE,
    responseInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      },
      requestUpdated: function() {
        Application.showMessage(I18n.getLocale().literals.RequestUpdatedMessage, Application.MESSAGE_TIMEOUT_FAST);
      }
    }
  });
  
  this._requestList.append(this._requestsPanelRequests);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  this._requestList.destroy();
}


