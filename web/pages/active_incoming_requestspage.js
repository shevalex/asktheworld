ActiveIncomingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveIncomingRequestsPage() {
  AbstractPage.call(this, ActiveIncomingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
});

ActiveIncomingRequestsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._tableLabel = UIUtils.appendLabel(contentPanel, "Title");

  var page = this;
  this._requestsTable = new AbstractRequestPage.IncomingRequestsTable("RequestTable", {
    clickListener: function(requestId) {
      var paramBundle = {
        incoming: false,
        returnPageId: ActiveIncomingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: page._getRequestIds().join(",")
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
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

ActiveIncomingRequestsPage.prototype.onShow = function(root) {
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

ActiveIncomingRequestsPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

ActiveIncomingRequestsPage.prototype._updateRequests = function() {
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

ActiveIncomingRequestsPage.prototype._getRequestIds = function() {
  return Backend.getIncomingRequestIds(Backend.Request.STATUS_ACTIVE);
}

