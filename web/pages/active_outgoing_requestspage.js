ActiveOutgoingRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function ActiveOutgoingRequestsPage() {
  AbstractRequestPage.call(this, ActiveOutgoingRequestsPage.name);
  
  this._requestsTable;
  this._tableLabel;
  this._noRequestsNote;
  this._cacheChangeListener;
  this._sortRule = Backend.REQUEST_IDS_SORT_BY_DATE;
});

ActiveOutgoingRequestsPage.prototype.definePageContent = function(root) {
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
        returnPageId: ActiveOutgoingRequestsPage.name,
        requestId: requestId,
        otherRequestIds: page._getRequestIds().join(",")
      }

      Application.showMenuPage(OutgoingRequestDetailsPage.name, paramBundle);
    },
    pageListener: function(currentPage) {
      var paramBundle = page.getParamBundle() || {};
      paramBundle.tablePage = currentPage;
      Application.showPage(page.getPageId(), paramBundle);
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
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
      this._updateRequests();
    }
  }.bind(this);
}

ActiveOutgoingRequestsPage.prototype.onShow = function(root) {
  AbstractRequestPage.prototype.onShow.call(this, root);
  
  this._updateRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

ActiveOutgoingRequestsPage.prototype.onHide = function() {
  AbstractRequestPage.prototype.onHide.call(this);
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}


ActiveOutgoingRequestsPage.prototype._updateRequests = function() {
  var requestIds = this._getRequestIds();
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
  
  var tablePageNum = 0;
  var paramBundle = this.getParamBundle();
  if (paramBundle != null && paramBundle.tablePage != null) {
    tablePageNum = parseInt(paramBundle.tablePage);
  }
  this._requestsTable.setCurrentPage(tablePageNum);
}

ActiveOutgoingRequestsPage.prototype._getRequestIds = function() {
  return Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE, this._sortRule);
}
