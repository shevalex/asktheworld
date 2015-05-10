AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, AllIncomingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
  this._noRequestsNote;
  this._cacheChangeListener;
});

AllIncomingRequestsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._tableLabel = UIUtils.appendLabel(contentPanel, "Title");
  this._noRequestsNote = UIUtils.appendExplanationPad(contentPanel, "NoRequestsNote", null, this.getLocale().NoRequestsNote);

  var page = this;
  this._requestsTable = new AbstractRequestPage.IncomingRequestsTable("RequestTable", {
    clickListener: function(requestId) {
      var paramBundle = {
        returnPageId: AllIncomingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: ""
      }

      Application.showMenuPage(IncomingRequestDetailsPage.name, paramBundle);
    },
    hideWhenEmpty: true
  });
  this._requestsTable.append(contentPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
      this._updateRequests();
    }
  }.bind(this);
}

AllIncomingRequestsPage.prototype.onShow = function(root) {
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

AllIncomingRequestsPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AllIncomingRequestsPage.prototype._updateRequests = function() {
  var requestIds = Backend.getIncomingRequestIds();
  if (requestIds == null) {
    this._tableLabel.innerHTML = this.getLocale().UpdatingRequestsTitle;
    this._noRequestsNote.style.display = "none";
  } else if (requestIds.length == 0) {
    this._tableLabel.innerHTML = this.getLocale().NoRequestsTitle;
    this._noRequestsNote.style.display = "block";
  } else {
    this._tableLabel.innerHTML = this.getLocale().RequestsTitle;
    this._noRequestsNote.style.display = "none";
  }
  this._requestsTable.setRequestIds(requestIds);
}
