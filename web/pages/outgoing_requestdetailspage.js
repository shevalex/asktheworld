OutgoingRequestDetailsPage = ClassUtils.defineClass(AbstractPage, function OutgoingRequestDetailsPage() {
  AbstractPage.call(this, OutgoingRequestDetailsPage.name);
  
  this._previousButton;
  this._nextButton;
  this._requestPanel;
  
  this._currentRequestId;
  this._returnPageId;
  this._navigatableRequestIds;
  
  this._requestItem;
  this._cacheChangeListener;
});

OutgoingRequestDetailsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var backLink = UIUtils.appendLink(contentPanel, "BackLink", this.getLocale().GoBackLink);
  UIUtils.setClickListener(backLink, function() {
    Application.showMenuPage(this._returnPageId);
  }.bind(this));
  
  var previousNextPanel = UIUtils.appendBlock(contentPanel, "PreviousNextPanel");
  this._previousButton = UIUtils.appendButton(previousNextPanel, "PreviousButton", this.getLocale().PreviousButton);
  UIUtils.setClickListener(this._previousButton, function() {
    Application.showMenuPage(OutgoingRequestDetailsPage.name, {
      requestId: this._getPreviousRequestId(),
      returnPageId: this._returnPageId,
      otherRequestIds: this._navigatableRequestIds.join(",")
    });
  }.bind(this));
  
  this._nextButton = UIUtils.appendButton(previousNextPanel, "NextButton", this.getLocale().NextButton);
  UIUtils.setClickListener(this._nextButton, function() {
    Application.showMenuPage(OutgoingRequestDetailsPage.name, {
      requestId: this._getNextRequestId(),
      returnPageId: this._returnPageId,
      otherRequestIds: this._navigatableRequestIds.join(",")
    });
  }.bind(this));
  
  this._requestPanel = UIUtils.appendBlock(contentPanel, "RequestPanel");
}

OutgoingRequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._currentRequestId = paramBundle.requestId;
  this._type = paramBundle.type;
  this._navigatableRequestIds = paramBundle.otherRequestIds.split(",");
//  this._updatePage();

  this._requestItem = new AbstractRequestPage.OutgoingRequestItem(this._currentRequestId, {fullRecord: true});
  this._requestItem.append(this._requestPanel);
  
  

//  this._cacheChangeListener = function(event) {
//    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED) {
//      this._updateOutgoingRequests();
//    } else if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
//      this._updateIncomingRequests();
//    }
//  }.bind(this);
  

//  Consider closing the page if the request shown is being removed
//  this._cacheChangeListener = function(event) {
//    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED || Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
//      var requestList;
//      if (this._isIncomingList) {
//        requestList = Backend.getIncomingRequestIds();
//      } else {
//        requestList = Backend.getOutgoingRequestIds();
//      }
//      
//      for (var index in requestList) {
//        if (requestList[index] == this._currentRequestId) {
//          return;
//        }
//      }
//
//      Application.showMenuPage(this._returnPageId);
//    }
//  }.bind(this);

  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

OutgoingRequestDetailsPage.prototype.onHide = function() {
  this._requestItem.remove();
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  
}

OutgoingRequestDetailsPage.prototype.provideHistory = function() {
  return Application.makeHistory([this.getHistoryPrefix(), ["request", this._currentRequestId], ["return", this._returnPageId], ["siblings", this._navigatableRequestIds != null ? this._navigatableRequestIds.join(",") : ""]]);
}



OutgoingRequestDetailsPage.prototype._getPreviousRequestId = function() {
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

OutgoingRequestDetailsPage.prototype._getNextRequestId = function() {
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


/*
OutgoingRequestDetailsPage.prototype._updatePage = function() {
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
        Application.showMenuPage(this._returnPageId);
      }.bind(this)
    }
  };

  if (this._isIncomingList) {
    this._requestList = new AbstractRequestPage.IncomingRequestList(requestListParams);
  } else {
    this._requestList = new AbstractRequestPage.OutgoingRequestList(requestListParams);
  }
  
  this._requestList.append(this._requestsPanel);
}

*/

