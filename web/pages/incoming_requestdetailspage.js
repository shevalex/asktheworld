IncomingRequestDetailsPage = ClassUtils.defineClass(AbstractRequestPage, function IncomingRequestDetailsPage() {
  AbstractRequestPage.call(this, IncomingRequestDetailsPage.name);
  
  this._currentRequestId;
  this._returnPageId;
  this._requestStatus;
  this._navigatableRequestIds;
  
  this._previousButton;
  this._nextButton;
  this._requestPanel;
  this._requestItem = null;
  
  this._incomingResponsesView;
  
  this._responsePanel;
  this._responseItem = null;
  this._cacheChangeListener;
  
  this._refreshTimer;
  
  this._updating = false;
  this._editing = false;
});

IncomingRequestDetailsPage.prototype.definePageContent = function(root) {
  AbstractRequestPage.prototype.definePageContent.call(this, root);

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
      requestStatus: this._requestStatus,
      returnPageId: this._returnPageId,
      otherRequestIds: this._navigatableRequestIds.join(",")
    });
  }.bind(this));
  
  this._nextButton = UIUtils.appendButton(previousNextPanel, "NextButton", this.getLocale().NextButton);
  UIUtils.setClickListener(this._nextButton, function() {
    Application.showMenuPage(IncomingRequestDetailsPage.name, {
      requestId: this._getNextRequestId(),
      requestStatus: this._requestStatus,
      returnPageId: this._returnPageId,
      otherRequestIds: this._navigatableRequestIds.join(",")
    });
  }.bind(this));
  
  this._requestPanel = UIUtils.appendBlock(contentPanel, "RequestPanel");
  this._responsePanel = UIUtils.appendBlock(contentPanel, "ResponsePanel");
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
      var requests  = Backend.getIncomingRequestIds();
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
      if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
        this._showRequest();
        this._showViewableResponse();
      }
    }
  }.bind(this);
}


IncomingRequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  //Check if request is still valid
  var requestFound = false;
  var incomingRequestIds = Backend.getIncomingRequestIds(paramBundle.requestStatus);
  for (var index in incomingRequestIds) {
    if (incomingRequestIds[index] == paramBundle.requestId) {
      requestFound = true;
      break;
    }
  }
  if (!requestFound) {
    throw AbstractPage.prototype.EXPIRED;
  }
  
  AbstractRequestPage.prototype.onShow.call(this, root, paramBundle);
  
  this._returnPageId = paramBundle.returnPageId;
  this._requestStatus = paramBundle.requestStatus;
  this._currentRequestId = paramBundle.requestId;
  this._type = paramBundle.type;
  this._navigatableRequestIds = paramBundle.otherRequestIds.split(",");
  
  this._showRequest();
  this._showViewableResponse();
  
  UIUtils.setEnabled(this._previousButton, this._getPreviousRequestId() != null);
  UIUtils.setEnabled(this._nextButton, this._getNextRequestId() != null);

  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  this._refreshTimer = setInterval(function() {
    this._requestItem.refresh();
  }.bind(this), 60000);
}

IncomingRequestDetailsPage.prototype.onHide = function() {
  AbstractRequestPage.prototype.onHide.call(this);
  
  this._requestItem.remove();
  UIUtils.emptyContainer(this._requestPanel);

  if (this._responseItem != null) {
    this._responseItem.remove();
    this._responseItem = null;
  }
  UIUtils.emptyContainer(this._responsePanel);
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  clearInterval(this._refreshTimer);
}

IncomingRequestDetailsPage.prototype._showRequest = function() {
  UIUtils.emptyContainer(this._requestPanel);
  
  var request = Backend.getRequest(this._currentRequestId);
  this._requestItem = new AbstractRequestPage.ExtendedIncomingRequestItem(this._currentRequestId);
  this._requestItem.append(this._requestPanel);
  
  var responseIds = Backend.getOutgoingResponseIds(this._currentRequestId);
  if (responseIds != null && responseIds.length == 0) {
    var buttonsPanel = UIUtils.appendBlock(this._requestPanel, "ButtonsPanel");
    
    if (request.status == Backend.Request.STATUS_ACTIVE) {
      var respondButton = UIUtils.appendButton(buttonsPanel, "RespondButton", this.getLocale().RespondButton);
      UIUtils.setClickListener(respondButton, function() {
        if (!this._editing) {
          this._showCreatingResponse();
        }
      }.bind(this));
    }
    
    var ignoreButton = UIUtils.appendButton(buttonsPanel, "IgnoreButton", this.getLocale().IgnoreButton, true);
    UIUtils.setClickListener(ignoreButton, function() {
      if (!this._editing) {
        this._ignoreRequest();
      }
    }.bind(this));
  }
}

IncomingRequestDetailsPage.prototype._showViewableResponse = function() {
  this._editing = false;
  
  if (this._responseItem != null) {
    this._responseItem.remove();
    this._responseItem = null;
  }
  UIUtils.emptyContainer(this._responsePanel);

  var request = Backend.getRequest(this._currentRequestId);
  
  var responseIds = Backend.getOutgoingResponseIds(this._currentRequestId);
  if (responseIds != null && responseIds.length == 0) {
    if (request.status == Backend.Request.STATUS_INACTIVE) {
      UIUtils.appendLabel(this._responsePanel, "StatusLabel", this.getLocale().CannotCommentOnRequestLabel);
    }
  } else if (responseIds != null && responseIds.length > 0) {
    this._responseItem = new AbstractRequestPage.OutgoingResponseItem(this._currentRequestId, responseIds[0]);
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
  this._editing = true;
  
  if (this._responseItem != null) {
    this._responseItem.remove();
  }
  UIUtils.emptyContainer(this._responsePanel);

  var responseIds = Backend.getOutgoingResponseIds(this._currentRequestId);
  var responseId = responseIds[0];
  this._responseItem = new AbstractRequestPage.EditableOutgoingResponseItem(this._currentRequestId, responseId);
  this._responseItem.append(this._responsePanel);
  
  var response = Backend.getResponse(this._currentRequestId, responseId);

  var responseTextEditor = UIUtils.appendTextEditor(this._responsePanel, "TextEditor");
  responseTextEditor.setValue(response.text);
  
  var request = Backend.getRequest(this._currentRequestId);
  var responseHiddenTextEditor = null;
  if (request.expertise_category != Application.Configuration.GENERAL_EXPERTISE_CATEGORY
      && (response.paid_features.hidden_text.status != Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE || Backend.isPaidFeaturesEnabled() && Backend.getUserPreferences().paid_features.hidden_text.enabled)) {
    responseHiddenTextEditor = UIUtils.appendTextEditor(this._responsePanel, "HiddenTextEditor");
    responseHiddenTextEditor.setValue(response.paid_features.hidden_text.data.text);
  }
  
  var attachmentsBar = UIUtils.appendAttachmentBar(this._responsePanel, null, true, Account.canOpenFileController);
  attachmentsBar.setAttachments(response.attachments);
  
  var buttonsPanel = UIUtils.appendBlock(this._responsePanel, "ControlButtonsPanel");
  
  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    this._showViewableResponse();
  }.bind(this));

  var updateButton = UIUtils.appendButton(buttonsPanel, "UpdateButton", this.getLocale().UpdateButton);
  UIUtils.setClickListener(updateButton, function() {
    var responseText = responseTextEditor.getValue();
    if (responseText != null && responseText != "") {
      this._updateResponse(responseId, response, responseText, responseHiddenTextEditor != null ? responseHiddenTextEditor.getValue() : null, attachmentsBar.getAttachments());
    } else {
      UIUtils.indicateInvalidInput(responseTextEditor);
    }
  }.bind(this));
}

IncomingRequestDetailsPage.prototype._showCreatingResponse = function() {
  this._editing = true;
  
  if (this._responseItem != null) {
    this._responseItem.remove();
  }
  UIUtils.emptyContainer(this._responsePanel);

  var responseTextEditor = UIUtils.appendTextEditor(this._responsePanel, "TextEditor");
  
  var responseHiddenTextEditor = null;
  var request = Backend.getRequest(this._currentRequestId);
  if (request.expertise_category != Application.Configuration.GENERAL_EXPERTISE_CATEGORY
      && Backend.isPaidFeaturesEnabled() && Backend.getUserPreferences().paid_features.hidden_text.enabled) {
    responseHiddenTextEditor = UIUtils.appendTextEditor(this._responsePanel, "HiddenTextEditor");
  }
  
  var attachmentsBar = UIUtils.appendAttachmentBar(this._responsePanel, null, true, Account.canOpenFileController);
  
  var buttonsPanel = UIUtils.appendBlock(this._responsePanel, "ControlButtonsPanel");
  
  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    UIUtils.emptyContainer(this._responsePanel);
    this._editing = false;
  }.bind(this));

  var createButton = UIUtils.appendButton(buttonsPanel, "CreateButton", this.getLocale().CreateButton);
  UIUtils.setClickListener(createButton, function() {
    var responseText = responseTextEditor.getValue();
    if (responseText != null && responseText != "") {
      this._createResponse(responseText, responseHiddenTextEditor != null ? responseHiddenTextEditor.getValue() : null, attachmentsBar.getAttachments());
    } else {
      UIUtils.indicateInvalidInput(responseTextEditor);
    }
  }.bind(this));
  
  var rightClarificationPanel = UIUtils.appendBlock(this._responsePanel, "RightClarificationPanel");
  UIUtils.appendExplanationPad(rightClarificationPanel, "PublicTextClarification", this.getLocale().PublicTextClarification, this.getLocale().PublicTextClarificationText);
  UIUtils.appendExplanationPad(rightClarificationPanel, "HiddenTextClarification", this.getLocale().HiddenTextClarification, this.getLocale().HiddenTextClarificationText);
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


IncomingRequestDetailsPage.prototype._updateResponse = function(responseId, response, responseText, hiddenText, attachments) {
  if (this._updating) {
    return;
  }
  
  var page = this;
  
  var callback = {
    success: function() {
      this._onCompletion();
    },
    failure: function() {
      Application.showMessage(page.getLocale().ResponseUpdateFailedMessage);
      this._onCompletion();
    },
    error: function() {
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      this._onCompletion();
    },
    
    _onCompletion: function() {
      page._updating = false;
      page._showViewableResponse();
    }
  }

  
  response.text = responseText;
  response.attachments = attachments;
      
  if (hiddenText != null) {
    response.paid_features.hidden_text.data = {text: hiddenText};
    if (response.paid_features.hidden_text.status == Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE) {
      response.paid_features.hidden_text.status = Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE;
    }
  } else {
    response.paid_features.hidden_text.status == Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE;
    response.paid_features.hidden_text.data = {};
  }
      
  
//  var response = {
//    text: responseText,
//    time: Date.now(),
//    attachments: attachments,
//    
//    paid_features: {
//      hidden_text: {
//        status: Backend.getUserPreferences().paid_features.hidden_text.enabled && hiddenText != null ? Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE : Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE,
//        policy: Backend.getUserPreferences().paid_features.hidden_text.policy,
//        data: {text: hiddenText}
//      },
//      contact_info: {
//        status: Backend.getUserPreferences().paid_features.contact_info.enabled ? Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE : Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE,
//        policy: Backend.getUserPreferences().paid_features.contact_info.policy,
//        data: Backend.getUserPreferences().paid_features.contact_info.data
//      }
//    }
//  }
  
  Backend.updateResponse(this._currentRequestId, responseId, response, callback);
}

IncomingRequestDetailsPage.prototype._createResponse = function(responseText, hiddenText, attachments) {
  if (this._updating) {
    return;
  }
  
  var page = this;
  
  var callback = {
    success: function() {
      this._onCompletion();
    },
    failure: function() {
      Application.showMessage(page.getLocale().ResponseCreateFailedMessage);
      this._onCompletion();
    },
    error: function() {
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      this._onCompletion();
    },
    
    _onCompletion: function() {
      page._updating = false;
      page._showRequest();
      page._showViewableResponse();
    }
  }

  var response = {
    text: responseText, 
    attachments: attachments,
    
    paid_features: {
      hidden_text: {
        status: Backend.getUserPreferences().paid_features.hidden_text.enabled && hiddenText != null ? Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE : Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE,
        policy: Backend.getUserPreferences().paid_features.hidden_text.policy,
        data: {text: hiddenText}
      },
      contact_info: {
        status: Backend.getUserPreferences().paid_features.contact_info.enabled ? Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE : Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE,
        policy: Backend.getUserPreferences().paid_features.contact_info.policy,
        data: Backend.getUserPreferences().paid_features.contact_info.data
      }
    }
  }

  Backend.createResponse(this._currentRequestId, response, callback);
}

IncomingRequestDetailsPage.prototype._ignoreRequest = function() {
  if (this._updating) {
    return;
  }

  var transactionCallback = {
    success: function() {
      Application.showMenuPage(this._returnPageId);
    }.bind(this),
    failure: function() {
    },
    error: function() {
      Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
    }
  }
  Backend.removeIncomingRequest(this._currentRequestId, transactionCallback);
}

