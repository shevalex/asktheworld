NewRequestPage = ClassUtils.defineClass(AbstractPage, function NewRequestPage() {
  AbstractPage.call(this, NewRequestPage.name);
  
  this._requestTextEditor;
  
  this._requestGenderElement;
  this._requestAgeElement;
  this._requestWaitTimeElement;
  this._requestQuantityElement;
  
  this._updating = false;
});

NewRequestPage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  UIUtils.appendLabel(contentPanel, "RequestEditorLabel", this.getLocale().RequestEditorLabel);
  this._requestTextEditor = UIUtils.appendTextEditor(contentPanel, "TextEditor", {
    fileTooBigListener: function(file) {
      Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
    }
  });
  
  UIUtils.appendLabel(contentPanel, "ExpertiseCategoryLabel", this.getLocale().ExpertiseCategoryLabel);
  this._requestExpertiseCategoryElement = contentPanel.appendChild(UIUtils.createMultiOptionList(UIUtils.createId(contentPanel, "ExpertiseCategory"), Application.Configuration.EXPERTISES, true));
  
  UIUtils.appendLabel(contentPanel, "WhomToSendLabel", this.getLocale().WhomToSendLabel);
  var whomToSendPanel = UIUtils.appendBlock(contentPanel, "WhomToSendPanel");
  this._requestGenderElement = whomToSendPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(whomToSendPanel, "Gender"), I18n.getLocale().literals.TargetGenderLabel, Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
  this._requestAgeElement = whomToSendPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(whomToSendPanel, "Age"), I18n.getLocale().literals.TargetAgeGroupLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();

  UIUtils.appendLabel(contentPanel, "HowLongToWaitLabel", this.getLocale().HowLongToWaitLabel);
  var howLongToWaitPanel = UIUtils.appendBlock(contentPanel, "HowLongToWaitPanel");
  this._requestQuantityElement = howLongToWaitPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(howLongToWaitPanel, "Quantity"), I18n.getLocale().literals.NumOfResponsesLabel, Application.Configuration.RESPONSE_QUANTITY, "10px")).getInputElement();
  this._requestWaitTimeElement = howLongToWaitPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(howLongToWaitPanel, "WaitTime"), I18n.getLocale().literals.WaitTimeLabel, Application.Configuration.RESPONSE_WAIT_TIME, "10px")).getInputElement();
  
  var sendButton = UIUtils.appendButton(contentPanel, "SendButton", this.getLocale().SendButton);
  UIUtils.setClickListener(sendButton, function() {
    if (this._requestTextEditor.getValue() != "") {
      this._createRequest();
    } else {
      this._requestTextEditor.indicateInvalidInput();
      Application.showMessage(this.getLocale().RequestEmptyMessage, Application.MESSAGE_TIMEOUT_FAST);
    }
  }.bind(this));
  
  var resetButton = UIUtils.appendButton(contentPanel, "ResetButton", this.getLocale().ResetButton);
  UIUtils.setClickListener(resetButton, function() {
    this._resetPage();
  }.bind(this));
}

NewRequestPage.prototype.onShow = function() {
  this._resetPage();
}

NewRequestPage.prototype.onHide = function() {
}


NewRequestPage.prototype._resetPage = function() {
  if (this._updating) {
    return;
  }
  
  this._requestTextEditor.reset();
  this._requestTextEditor.focus();

  this._requestGenderElement.selectData(Backend.getUserPreferences().requestTargetGender);
  this._requestAgeElement.selectData(Backend.getUserPreferences().requestTargetAge);
  this._requestQuantityElement.selectData(Backend.getUserPreferences().responseQuantity);
  this._requestWaitTimeElement.selectData(Backend.getUserPreferences().responseWaitTime);
  
  this._requestExpertiseCategoryElement.selectChoices([Application.Configuration.EXPERTISES[0]]);
}

NewRequestPage.prototype._createRequest = function() {
  if (this._updating) {
    return;
  }
  
  var page = this;
  
  var callback = {
    success: function(requestId) {
      Application.showMessage(page.getLocale().RequestSentMessage);
      this._onCompletion();
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
      Application.showMenuPage(ActiveOutgoingRequestsPage.name);
    }
  }

  var request = {
    text: this._requestTextEditor.getValue(),
    attachments: this._requestTextEditor.getAttachments(),
    response_gender: this._requestGenderElement.getSelectedData(),
    response_quantity: this._requestQuantityElement.getSelectedData(),
    response_wait_time: this._requestWaitTimeElement.getSelectedData(),
    response_age_group: this._requestAgeElement.getSelectedData(),
    expertise_category: this._requestExpertiseCategoryElement.getSelectedData()
  }
  
  Application.showSpinningWheel();

  Backend.createRequest(request, callback);
}

