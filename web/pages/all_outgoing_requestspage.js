AllOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllOutgoingRequestsPage() {
  AbstractRequestPage.call(this, "AllOutgoingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
});

AllOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var linkId = UIUtils.createId(generalPanel, "ActiveRequestsLink");
  UIUtils.get$(generalPanel).html("This is the complete list of requests that you Asked The World about.<br>You can find your most recent active requests in the <a href='#' id='" + linkId + "'>Active Requests</a> section.");
  
  UIUtils.setClickListener(linkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");

  this._requestTable = new AbstractRequestPage.OutgoingRequestsTable({
    requestStatus: null,
    selectionObserver: function(requestId) {
      var paramBundle = {
        returnPageId: MenuPage.prototype.ALL_REQUESTS_ITEM_ID,
        requestId: requestId,
        otherRequestIds: null
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    }.bind(this),
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      }
    }
  });
  
  this._requestTable.append(this._requestTableContainer);
}

AllOutgoingRequestsPage.prototype.onShow = function(root) {
}

AllOutgoingRequestsPage.prototype.onHide = function() {
}


