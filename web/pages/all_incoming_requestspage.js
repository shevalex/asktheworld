AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, "AllIncomingRequestsPage", "all");
  
  this._requestTable = null;
  this._requestTableContainer = null;
});

AllIncomingRequestsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  var textPanel = UIUtils.appendBlock(generalPanel, "Text");
  textPanel.innerHTML = this.getLocale().AllIncomingRequestsLabel;

  var linkId = UIUtils.createId(generalPanel, "ActiveInquiriesLink");
  var seeActiveElement = UIUtils.appendBlock(generalPanel, "SeeActive");
  seeActiveElement.innerHTML = this.getLocale().ActiveRequestsLinkProvider(linkId);
  UIUtils.setClickListener(linkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
  });

  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");

  this._requestTable = new AbstractRequestPage.IncomingRequestsTable({
    requestStatus: null,
    clickObserver: function(requestId) {
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


