IncomingRequestDetailsPage = ClassUtils.defineClass(AbstractPage, function IncomingRequestDetailsPage() {
  AbstractPage.call(this, OutgoingRequestDetailsPage.name);
  
  this._currentRequestId;
  this._returnPageId;
  this._navigatableRequestIds;
  
  this._previousButton;
  this._nextButton;
  this._requestPanel;
  this._requestItem = null;
  
  this._incomingResponsesView;
  
  this._responsePanel;
  this._responseItem = null;
  this._cacheChangeListener;
  
  this._updating = false;
});

IncomingRequestDetailsPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var backLink = UIUtils.appendLink(contentPanel, "BackLink", this.getLocale().GoBackLink);
  UIUtils.setClickListener(backLink, function() {
    Application.showMenuPage(this._returnPageId);
  }.bind(this));
  
  var previousNextPanel = UIUtils.appendBlock(contentPanel, "PreviousNextPanel");
  this._previousButton = UIUtils.appendButton(previousNextPanel, "PreviousButton", this.getLocale().PreviousButton);
  UIUtils.setClickListener(this._previousButton, function() {
    Application.showMenuPage(IncomingRequestDetailsPage.name, {
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
  this._responsePanel = UIUtils.appendBlock(contentPanel, "ResponsePanel");
  
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
      var requests  = Backend.getIncomingRequestIds();
      for (var i = 0; i < requests.length; i++) {
        if (requests[i] == this._currentRequestId) {
          return;
        }
      }
      
      // The request was removed - we need to show something else.
      Application.showMenuPage(this._returnPageId);
    } else if (event.requestId == this._currentRequestId) {
      if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
        this._showViewableResponse();
      }
    }
  }.bind(this);
}


IncomingRequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._currentRequestId = paramBundle.requestId;
  this._type = paramBundle.type;
  this._navigatableRequestIds = paramBundle.otherRequestIds.split(",");
  
  this._requestItem = new AbstractRequestPage.ExtendedIncomingRequestItem(this._currentRequestId);
  this._requestItem.append(this._requestPanel);
  
  this._showViewableResponse();
  
  UIUtils.setEnabled(this._previousButton, this._getPreviousRequestId() != null);
  UIUtils.setEnabled(this._nextButton, this._getNextRequestId() != null);

  Backend.addCacheChangeListener(this._cacheChangeListener);
}

IncomingRequestDetailsPage.prototype.onHide = function() {
  this._requestItem.remove();

  if (this._responseItem != null) {
    this._responseItem.remove();
    this._responseItem = null;
  }
  UIUtils.get$(this._responsePanel).empty();
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

IncomingRequestDetailsPage.prototype._showViewableResponse = function() {
  if (this._responseItem != null) {
    this._responseItem.remove();
    this._responseItem = null;
  }
  UIUtils.get$(this._responsePanel).empty();

  var request = Backend.getRequest(this._currentRequestId);
  var responseId = this._getResponseId();

  if (responseId == null) {
    if (request.status == Backend.Request.STATUS_ACTIVE) {
    } else {
      UIUtils.appendLabel(this._responsePanel, "StatusLabel", this.getLocale().CannotCommentOnRequestLabel);
    }
  } else {
    this._responseItem = new AbstractRequestPage.OutgoingResponseItem(this._currentRequestId, responseId);
    this._responseItem.append(this._responsePanel);
    
    if (request.status == Backend.Request.STATUS_ACTIVE) {
      var editButton = UIUtils.appendButton(this._responsePanel, "EditButton", this.getLocale().EditButton);

      UIUtils.setClickListener(editButton, function() {
        this._showEditingResponse();
      }.bind(this));
    }
  }
}

IncomingRequestDetailsPage.prototype._showEditingResponse = function() {
  if (this._requestItem != null) {
    this._requestItem.remove();
  }
  UIUtils.get$(this._requestPanel).empty();

  var responseId = this._getResponseId();
  this._responseItem = new AbstractRequestPage.EditableOutgoingResponseItem(this._currentRequestId, responseId);
  this._responseItem.append(this._responsePanel);
  
  var response = Backend.getResponse(this._currentRequestId, responseId);

  this._responseTextEditor = UIUtils.appendTextEditor(this._responsePanel, "TextEditor");
  this._responseTextEditor.setValue(response.text);
  this._attachmentsBar = UIUtils.appendAttachmentBar(this._responsePanel, null, true, function(file) {
    Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
  });
  
  var buttonsPanel = UIUtils.appendBlock(this._responsePanel, "ControlButtonsPanel");
  
  var updateButton = UIUtils.appendButton(buttonsPanel, "UpdateButton", this.getLocale().UpdateButton);
  UIUtils.setClickListener(updateButton, function() {
    this._updateRequest({text: this._responseTextEditor.getValue(), attachments: this._attachmentsBar.getAttachments()});
  }.bind(this));

  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    this._showViewableResponse();
  }.bind(this));
}


IncomingRequestDetailsPage.prototype._getPreviousRequestId = function() {
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

IncomingRequestDetailsPage.prototype._getNextRequestId = function() {
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

IncomingRequestDetailsPage.prototype._getResponseId = function() {
  var responses = Backend.getOutgoingResponseIds(this._currentRequestId);
  if (responses == null) {
    return null;
  }
  
  if (responses.length == 0) {
    return null;
  }
  
  return responses[0];
}



IncomingRequestDetailsPage.prototype._updateResponse = function(requestAttributesToUpdate) {
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
      
      Application.hideSpinningWheel();
    }
  }

  Application.showSpinningWheel();

  Backend.updateRequest(this._currentRequestId, requestAttributesToUpdate, callback);
}
