ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveOutgoingRequestsPage() {
  AbstractPage.call(this, ActiveOutgoingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
  this._cacheChangeListener;
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._tableLabel = UIUtils.appendLabel(contentPanel, "Title");

  var page = this;
  this._requestsTable = new AbstractRequestPage.OutgoingRequestsTable("RequestTable", {
    clickListener: function(requestId) {
      var paramBundle = {
        incoming: false,
        returnPageId: ActiveOutgoingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: page._getRequestIds().join(",")
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
    },
    hideWhenEmpty: true
  });
  this._requestsTable.append(contentPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
      this._updateRequests();
    }
  }.bind(this);
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}


ActiveOutgoingRequestsPage.prototype._updateRequests = function() {
  var requestIds = this._getRequestIds();
  if (requestIds == null) {
    this._tableLabel.innerHTML = this.getLocale().UpdatingRequestsTitle;
  } else if (requestIds.length == 0) {
    this._tableLabel.innerHTML = this.getLocale().NoRequestsTitle;
  } else {
    this._tableLabel.innerHTML = this.getLocale().RequestsTitle;
  }
  this._requestsTable.setRequestIds(requestIds);
}

ActiveOutgoingRequestsPage.prototype._getRequestIds = function() {
  return Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
}
