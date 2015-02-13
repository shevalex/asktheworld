AllOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllOutgoingRequestsPage() {
  AbstractRequestPage.call(this, "AllOutgoingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
});

AllOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var textPanel = UIUtils.appendBlock(generalPanel, "Text");
  textPanel.innerHTML = this.getLocale().AllOutgoingRequestsLabel;

  var seeActiveLinkId = UIUtils.createId(generalPanel, "ActiveRequestsLink");
  var seeActiveElement = UIUtils.appendBlock(generalPanel, "SeeActiveLink");
  seeActiveElement.innerHTML = this.getLocale().ActiveOutgoingRequestsLinkProvider(seeActiveLinkId);
  UIUtils.setClickListener(seeActiveLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");

  this._requestTable = new AbstractRequestPage.OutgoingRequestsTable({
    requestStatus: null,
    clickObserver: function(requestId) {
      var paramBundle = {
        incoming: false,
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
}

AllOutgoingRequestsPage.prototype.onShow = function(root) {
  this._requestTable.append(this._requestTableContainer);
  this._requestTable.restore();
}

AllOutgoingRequestsPage.prototype.onHide = function() {
  this._requestTable.save();
  this._requestTable.remove();
}


