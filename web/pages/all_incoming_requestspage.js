AllIncomingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllIncomingRequestsPage() {
  AbstractRequestPage.call(this, AllIncomingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
  this._noRequestsNote;
  this._cacheChangeListener;
  this._refreshTimer;
  this._sortRule = Backend.REQUEST_IDS_SORT_BY_DATE;
});

AllIncomingRequestsPage.prototype.definePageContent = function(root) {
  AbstractRequestPage.prototype.definePageContent.call(this, root);
  
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
    sortListener: function(sortRule) {
      var sortRule;
      if (sortRule == AbstractRequestPage.SORT_BY_DATE) {
        sortRule = Backend.REQUEST_IDS_SORT_BY_DATE;
      } else if (sortRule == AbstractRequestPage.SORT_BY_RATE) {
        sortRule = Backend.REQUEST_IDS_SORT_BY_RATE;
      } else if (sortRule == AbstractRequestPage.SORT_BY_CATEGORY) {
        sortRule = Backend.REQUEST_IDS_SORT_BY_CATEGORY;
      }
      
      if (this._sortRule != sortRule) {
        this._updateRequests();
      }
    }.bind(this),
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
  AbstractRequestPage.prototype.onShow.call(this, root);
  
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  this._refreshTimer = setInterval(function() {
    this._requestsTable.refresh();
  }.bind(this), 60000);
}

AllIncomingRequestsPage.prototype.onHide = function() {
  AbstractRequestPage.prototype.onHide.call(this);
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  clearInterval(this._refreshTimer);
}

AllIncomingRequestsPage.prototype._updateRequests = function() {
  var requestIds = Backend.getIncomingRequestIds(null, this._sortRule);
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
