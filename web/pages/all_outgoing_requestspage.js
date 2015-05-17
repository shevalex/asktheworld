AllOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllOutgoingRequestsPage() {
  AbstractRequestPage.call(this, AllOutgoingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
  this._noRequestsNote;
  this._cacheChangeListener;
});

AllOutgoingRequestsPage.prototype.definePageContent = function(root) {
  AbstractRequestPage.prototype.definePageContent.call(this, root);
  
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  this._tableLabel = UIUtils.appendLabel(contentPanel, "Title");
  var newRequestLinkId = UIUtils.createId(contentPanel, "NewRequestLink");
  this._noRequestsNote = UIUtils.appendExplanationPad(contentPanel, "NoRequestsNote", null, this.getLocale().NoRequestsNoteProvider(newRequestLinkId));
  UIUtils.setClickListener(newRequestLinkId, function() {
    Application.showMenuPage(NewRequestPage.name);
  });

  var page = this;
  this._requestsTable = new AbstractRequestPage.OutgoingRequestsTable("RequestTable", {
    clickListener: function(requestId) {
      var paramBundle = {
        returnPageId: AllOutgoingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: ""
      }

      Application.showMenuPage(OutgoingRequestDetailsPage.name, paramBundle);
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

AllOutgoingRequestsPage.prototype.onShow = function(root) {
  AbstractRequestPage.prototype.onShow.call(this, root);
  
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

AllOutgoingRequestsPage.prototype.onHide = function() {
  AbstractRequestPage.prototype.onHide.call(this);
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AllOutgoingRequestsPage.prototype._updateRequests = function() {
  var requestIds = Backend.getOutgoingRequestIds();
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
