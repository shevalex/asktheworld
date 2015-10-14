OutgoingRequestDetailsPage = ClassUtils.defineClass(AbstractRequestPage, function OutgoingRequestDetailsPage() {
  AbstractRequestPage.call(this, OutgoingRequestDetailsPage.name);
  
  this._currentRequestId;
  this._returnPageId;
  this._navigatableRequestIds;
  
  this._previousButton;
  this._nextButton;
  this._requestPanel;
  this._requestItem = null;
  
  this._incomingResponsesView;
  
  this._cacheChangeListener;
  
  this._updating = false;
});

OutgoingRequestDetailsPage.prototype.definePageContent = function(root) {
  AbstractRequestPage.prototype.definePageContent.call(this, root);
  
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
  
  this._incomingResponsesView = new AbstractRequestPage.IncomingResponsesView("ResponseView", {
    clickListener: function(requestId, responseId) {
      var response = Backend.getResponse(requestId, responseId);
      if (response.status == Backend.Response.STATUS_UNVIEWED) {
        Backend.updateResponse(requestId, responseId, {status: Backend.Response.STATUS_VIEWED});
      }
    },
    ratingChangeListener: function(requestId, responseId, rating) {
      Backend.updateResponse(requestId, responseId, {star_rating: rating, status: Backend.Response.STATUS_VIEWED});
    },
    removeListener: function(requestId, responseId) {
      Backend.removeIncomingResponse(requestId, responseId);      
    }
  });
  this._incomingResponsesView.append(contentPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
      var requests = Backend.getOutgoingRequestIds();
      if (requests == null) {
        return;
      }
      for (var i = 0; i < requests.length; i++) {
        if (requests[i] == this._currentRequestId) {
          return;
        }
      }
      
      // The request was removed - we need to show something else.
      Application.showMenuPage(this._returnPageId);
    } else if (event.requestId == this._currentRequestId) {
      if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
        this._showViewableRequest();
      } else if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED) {
        this._incomingResponsesView.setObjectIds(this._getResponseIds());
      }
    }
  }.bind(this);
}


OutgoingRequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  AbstractRequestPage.prototype.onShow.call(this, root, paramBundle);
  
  this._returnPageId = paramBundle.returnPageId;
  this._currentRequestId = paramBundle.requestId;
  this._type = paramBundle.type;
  this._navigatableRequestIds = paramBundle.otherRequestIds.split(",");
  
  this._showViewableRequest();
  
  this._incomingResponsesView.setRequestId(this._currentRequestId);
  this._incomingResponsesView.setObjectIds(this._getResponseIds());
  
  UIUtils.setEnabled(this._previousButton, this._getPreviousRequestId() != null);
  UIUtils.setEnabled(this._nextButton, this._getNextRequestId() != null);

  Backend.addCacheChangeListener(this._cacheChangeListener);
}

OutgoingRequestDetailsPage.prototype.onHide = function() {
  AbstractRequestPage.prototype.onHide.call(this);
  
  this._requestItem.remove();
  this._requestItem = null;  
  UIUtils.emptyContainer(this._requestPanel);  

  this._incomingResponsesView.clear();
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

OutgoingRequestDetailsPage.prototype._showViewableRequest = function() {
  if (this._requestItem != null) {
    this._requestItem.remove();
    UIUtils.emptyContainer(this._requestPanel);
  }

  this._requestItem = new AbstractRequestPage.ExtendedOutgoingRequestItem(this._currentRequestId);
  this._requestItem.append(this._requestPanel);
  
  var request = Backend.getRequest(this._currentRequestId);
  
  if (request.status == Backend.Request.STATUS_ACTIVE) {
    var editButton = UIUtils.appendButton(this._requestPanel, "EditButton", this.getLocale().EditButton);
    
    UIUtils.setClickListener(editButton, function() {
      this._showEditingRequest();
    }.bind(this));
  }
}

OutgoingRequestDetailsPage.prototype._showEditingRequest = function() {
  if (this._requestItem != null) {
    this._requestItem.remove();
    UIUtils.emptyContainer(this._requestPanel);
  }

  this._requestItem = new AbstractRequestPage.EditableOutgoingRequestItem(this._currentRequestId);
  this._requestItem.append(this._requestPanel);
  
  var request = Backend.getRequest(this._currentRequestId);

  var requestTextEditor = UIUtils.appendTextEditor(this._requestPanel, "TextEditor");
  requestTextEditor.setValue(request.text);
  var attachmentsBar = UIUtils.appendAttachmentBar(this._requestPanel, null, true, Account.canOpenFileController);
  attachmentsBar.setAttachments(request.attachments);
  
  
  var buttonsPanel = UIUtils.appendBlock(this._requestPanel, "ControlButtonsPanel");
  
  var deactivateButton = UIUtils.appendButton(buttonsPanel, "DeactivateButton", this.getLocale().DeactivateButton);
  UIUtils.setClickListener(deactivateButton, function() {
    this._updateRequest({status: Backend.Request.STATUS_INACTIVE});
  }.bind(this));

  var updateButton = UIUtils.appendButton(buttonsPanel, "UpdateButton", this.getLocale().UpdateButton);
  UIUtils.setClickListener(updateButton, function() {
    var requestText = requestTextEditor.getValue();
    if (requestText != null && requestText != "") {
      this._updateRequest({text: requestText, attachments: attachmentsBar.getAttachments()});
    } else {
      requestText.indicateInvalidInput();
    }
  }.bind(this));

  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    this._showViewableRequest();
  }.bind(this));
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

OutgoingRequestDetailsPage.prototype._getResponseIds = function() {
  return Backend.getIncomingResponseIds(this._currentRequestId);
}



OutgoingRequestDetailsPage.prototype._updateRequest = function(requestAttributesToUpdate) {
  if (this._updating) {
    return;
  }
  
  var page = this;
  
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      page._showViewableRequest();
    },
    failure: function() {
      Application.showMessage(page.getLocale().RequestFailedMessage);
      this._onCompletion();
    },
    error: function() {
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      this._onCompletion();
    },
    
    _onCompletion: function() {
      page._updating = false;
    }
  }

  Backend.updateRequest(this._currentRequestId, requestAttributesToUpdate, callback);
}
