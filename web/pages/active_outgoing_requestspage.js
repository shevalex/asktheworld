ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveOutgoingRequestsPage() {
  AbstractPage.call(this, "ActiveOutgoingRequestsPage");
  
  this._requestsPanelRequests;
  this._requestList
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var textPanel = UIUtils.appendBlock(generalPanel, "Text");
  UIUtils.get$(textPanel).html("This is what you recently Asked The World about and still waiting for more responses.");

  var seeAllLinkId = UIUtils.createId(generalPanel, "Link");
  var seeAllElement = UIUtils.appendBlock(generalPanel, "SeeAll");
  UIUtils.get$(seeAllElement).html("You can always see your older requests in the <a href='#' id='" + seeAllLinkId + "'>All Requests</a> section.");
  UIUtils.setClickListener(seeAllLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID);
  });
  
  this._requestsPanelRequests = UIUtils.appendBlock(root, "RequestsPanel");
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  this._requestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        returnPageId: MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE)
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: true,
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
        Application.showMessage("Request was updated", "fast");
      }
    }
  });
  
  this._requestList.append(this._requestsPanelRequests);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  this._requestList.destroy();
}


