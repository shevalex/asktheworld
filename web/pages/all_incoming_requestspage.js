AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, "AllIncomingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
});

AllIncomingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var linkId = UIUtils.createId(generalPanel, "ActiveRequestsLink");
  UIUtils.get$(generalPanel).html("This is the complete list of requests that The World asked you about.<br>You can find the most recent requests in the <a href='#' id='" + linkId + "'>Active Inquiries</a> section.");
  UIUtils.setClickListener(linkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
  });

  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");

  this._requestTable = new AbstractRequestPage.IncomingRequestsTable({
    requestStatus: null,
    selectionObserver: function(requestId) {
      var paramBundle = {
        incoming: true,
        returnPageId: MenuPage.prototype.ALL_INQUIRIES_ITEM_ID,
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

AllIncomingRequestsPage.prototype.onShow = function(root) {
}

AllIncomingRequestsPage.prototype.onHide = function() {
}


