RequestDetailsPage = ClassUtils.defineClass(AbstractPage, function RequestDetailsPage() {
  AbstractPage.call(this, "RequestDetailsPage");
  
  this._previousLinkId;
  this._nextLinkId;
  
  this._returnPageId;
  this._navigatableRequestIds;
  this._requestList = null;
  this._requestsPanel = null;
  this._isIncomingList = false;
  
  this._cacheChangeListener;
});

RequestDetailsPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  
  this._previousLinkId = UIUtils.createId(generalPanel, "PreviousLink");
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink(this._previousLinkId, this.getLocale().PreviousLink));
  UIUtils.setClickListener(this._previousLinkId, function() {
    this._currentRequestId = this._getPreviousRequestId();
    this._updatePage();
  }.bind(this));

  var goBackLinkId = UIUtils.createId(generalPanel, "GoBackLink");
  generalPanel.appendChild(UIUtils.createSpan("56%", "0 2% 2% 0")).appendChild(UIUtils.createLink(goBackLinkId, this.getLocale().GoBackLink));
  UIUtils.setClickListener(goBackLinkId, function() {
    Application.getMenuPage().showPage(this._returnPageId);
  }.bind(this));

  this._nextLinkId = UIUtils.createId(generalPanel, "NextLink");
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink(this._nextLinkId, this.getLocale().NextLink));
  UIUtils.setClickListener(this._nextLinkId, function() {
    this._currentRequestId = this._getNextRequestId();
    this._updatePage();
  }.bind(this));

  this._requestsPanel = UIUtils.appendBlock(root, "RequestsPanel");
}

RequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._navigatableRequestIds = paramBundle.otherRequestIds;
  this._currentRequestId = paramBundle.requestId;
  this._isIncomingList = paramBundle.incoming != null && paramBundle.incoming;

  this._updatePage();
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED || Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
      var requestList;
      if (this._isIncomingList) {
        requestList = Backend.getIncomingRequestIds();
      } else {
        requestList = Backend.getOutgoingRequestIds();
      }
      
      for (var index in requestList) {
        if (requestList[index] == this._currentRequestId) {
          return;
        }
      }
      
      Application.getMenuPage().showPage(this._returnPageId);
    }
  }.bind(this);

  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

RequestDetailsPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  this._requestList.remove();
}


RequestDetailsPage.prototype._getPreviousRequestId = function() {
  if (this._navigatableRequestIds == null) {
    return null;
  }

  for (var index = 0; index < this._navigatableRequestIds.length; index++) {
    if (this._navigatableRequestIds[index] == this._currentRequestId) {
      if (index > 0) {
        return this._navigatableRequestIds[index - 1];
      } else {
        return null;
      }
    }
  }

  return null;
}

RequestDetailsPage.prototype._getNextRequestId = function() {
  if (this._navigatableRequestIds == null) {
    return null;
  }

  for (var index = 0; index < this._navigatableRequestIds.length; index++) {
    if (this._navigatableRequestIds[index] == this._currentRequestId) {
      if (index < this._navigatableRequestIds.length - 1) {
        return this._navigatableRequestIds[index + 1];
      } else {
        return null;
      }
    }
  }
  
  return null;
}

RequestDetailsPage.prototype._updatePage = function() {
  UIUtils.setEnabled(this._previousLinkId, this._getPreviousRequestId() != null);
  UIUtils.setEnabled(this._nextLinkId, this._getNextRequestId() != null);
  
  if (this._requestList != null) {
    this._requestList.remove();
  }
  
  var requestListParams = {
    requestClickListener: null,
    requestIds: [this._currentRequestId],
    requestEditable: true,
    maxResponses: -1,
    responseAreaMaxHeight: -1,
    responseInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_ALL,
    showFullContent: true,
    showResponseCount: true,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      },
      responseCreated: function() {
        Application.showMessage(I18n.getLocale().literals.ResponseSentMessage, Application.MESSAGE_TIMEOUT_FAST);
      },
      requestUpdated: function() {
        Application.showMessage(I18n.getLocale().literals.RequestUpdatedMessage, Application.MESSAGE_TIMEOUT_FAST);
      },
      requestDeleted: function() {
        Application.showMessage(I18n.getLocale().literals.RequestRemovedMessage, Application.MESSAGE_TIMEOUT_FAST);
      }
    }
  };
  
  if (this._isIncomingList) {
    this._requestList = new AbstractRequestPage.IncomingRequestList(requestListParams);
  } else {
    this._requestList = new AbstractRequestPage.OutgoingRequestList(requestListParams);
  }
  
  this._requestList.append(this._requestsPanel);
}



