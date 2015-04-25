ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveOutgoingRequestsPage() {
  AbstractPage.call(this, ActiveOutgoingRequestsPage.name);
  
  this._outgoingRequestsTable;
  this._requestList
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  UIUtils.appendLabel(contentPanel, "Title", this.getLocale().TableTitle);
  
  var page = this;
  this._outgoingRequestsTable = new AbstractRequestPage.OutgoingRequestsTable("RequestTable", {
    clickListener: function(requestId) {
      var paramBundle = {
        incoming: false,
        returnPageId: ActiveOutgoingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: page._getOutgoingRequestIds().join(",")
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
    },
    hideWhenEmpty: true
  });
  this._outgoingRequestsTable.append(contentPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
      this._outgoingRequestsTable.setRequestIds(this._getOutgoingRequestIds());
    }
  }.bind(this);
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  this._outgoingRequestsTable.setRequestIds(this._getOutgoingRequestIds());
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}


ActiveOutgoingRequestsPage.prototype._getOutgoingRequestIds = function() {
  return Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
}

