AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, AllIncomingRequestsPage.name);
  
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
    Application.showMenuPage(ActiveIncomingRequestsPage.name);
  });

  this._requestTableContainer = UIUtils.appendBlock(root, "TablePanel");

  this._requestTable = new AbstractRequestPage.IncomingRequestsTable({
    requestStatus: null,
    clickObserver: function(requestId) {
      var paramBundle = {
        incoming: true,
        returnPageId: AllIncomingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: ""
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
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

AllIncomingRequestsPage.prototype.onShow = function(root) {
  this._requestTable.append(this._requestTableContainer);
  this._requestTable.restore();
}

AllIncomingRequestsPage.prototype.onHide = function() {
  this._requestTable.save();
  this._requestTable.remove();
}


