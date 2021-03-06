NewRequestPage = ClassUtils.defineClass(AbstractDataPage, function NewRequestPage() {
  AbstractDataPage.call(this, NewRequestPage.name);
  
  this._requestTextEditor;
  
  this._requestGenderElement;
  this._attachmentsBar;
  this._requestAgeElement;
  this._requestWaitTimeElement;
  this._requestQuantityElement;
  
  this._updating = false;
});

NewRequestPage.prototype.definePageContent = function(root) {
  AbstractDataPage.prototype.definePageContent.call(this, root);
  
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");
  
  UIUtils.appendLabel(contentPanel, "ExpertiseCategoryLabel", this.getLocale().ExpertiseCategoryLabel);
  this._requestExpertiseCategoryElement = contentPanel.appendChild(UIUtils.createMultiOptionList(UIUtils.createId(contentPanel, "ExpertiseCategory"), Backend.getUserSettings().expertise_categories, true));
  
  this._requestTextEditor = UIUtils.appendTextEditor(contentPanel, "TextEditor");

  this._attachmentsBar = UIUtils.appendAttachmentBar(contentPanel, "AttachmentBar", null, true, Account.canOpenFileController);
  
  UIUtils.appendLabel(contentPanel, "WhomToSendLabel", this.getLocale().WhomToSendLabel);
  var whomToSendPanel = UIUtils.appendBlock(contentPanel, "WhomToSendPanel");
  this._requestGenderElement = whomToSendPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(whomToSendPanel, "Gender"), I18n.getLocale().literals.GenderPreferenceLabel, Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
  this._requestAgeElement = whomToSendPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(whomToSendPanel, "Age"), I18n.getLocale().literals.AgePreferenceLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();

  UIUtils.appendLabel(contentPanel, "HowLongToWaitLabel", this.getLocale().HowLongToWaitLabel);
  var howLongToWaitPanel = UIUtils.appendBlock(contentPanel, "HowLongToWaitPanel");
  this._requestQuantityElement = howLongToWaitPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(howLongToWaitPanel, "Quantity"), I18n.getLocale().literals.NumOfResponsesPreferenceLabel, Application.Configuration.RESPONSE_QUANTITY, "10px")).getInputElement();
  this._requestWaitTimeElement = howLongToWaitPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(howLongToWaitPanel, "WaitTime"), I18n.getLocale().literals.WaitPreferenceLabel, Application.Configuration.RESPONSE_WAIT_TIME, "10px")).getInputElement();
  
  var sendButton = UIUtils.appendButton(contentPanel, "SendButton", this.getLocale().SendButton);
  UIUtils.setClickListener(sendButton, function() {
    if (this._requestTextEditor.getValue() != "") {
      this._createRequest();
    } else {
      UIUtils.indicateInvalidInput(this._requestTextEditor);
      UIUtils.showMessage(this.getLocale().RequestEmptyMessage, UIUtils.MESSAGE_TIMEOUT_FAST);
    }
  }.bind(this));
  
  var resetButton = UIUtils.appendButton(contentPanel, "ResetButton", this.getLocale().ResetButton);
  UIUtils.setClickListener(resetButton, function() {
    this._resetPage();
  }.bind(this));
  
  
  var rightClarificationPanel = UIUtils.appendBlock(contentPanel, "RightClarificationPanel");
  UIUtils.appendExplanationPad(rightClarificationPanel, "FileFormatsClarification", this.getLocale().FileTitle, this.getLocale().FileClarificationText);
  
  var preferencesLinkId = UIUtils.createId(rightClarificationPanel, "PreferencesLink");
  UIUtils.appendExplanationPad(rightClarificationPanel, "PreferencesClarification", this.getLocale().PreferencesTitle, this.getLocale().PreferencesClarificationTextProvider(preferencesLinkId));
  UIUtils.setClickListener(preferencesLinkId, function() {
    Application.showPage(UserPreferencesPage.name);
  });
}

NewRequestPage.prototype.onShow = function(root) {
  AbstractDataPage.prototype.onShow.call(this, root);
  
  this._resetPage();
}

NewRequestPage.prototype.onHide = function() {
  AbstractDataPage.prototype.onHide.call(this);
}


NewRequestPage.prototype._resetPage = function() {
  if (this._updating) {
    return;
  }
  
  this._requestTextEditor.reset();
  this._requestTextEditor.focus();
  this._attachmentsBar.setAttachments(null);

  this._requestGenderElement.selectData(Backend.getUserPreferences().default_gender_preference);
  this._requestAgeElement.selectData(Backend.getUserPreferences().default_response_age_group_preference);
  this._requestQuantityElement.selectData(Backend.getUserPreferences().default_response_quantity);
  this._requestWaitTimeElement.selectData(Backend.getUserPreferences().default_response_wait_time);
  
  this._requestExpertiseCategoryElement.selectData(Application.Configuration.GENERAL_EXPERTISE_CATEGORY);
}

NewRequestPage.prototype._createRequest = function() {
  if (this._updating) {
    return;
  }
  
  var page = this;
  
  var callback = {
    success: function(requestId) {
      UIUtils.showMessage(page.getLocale().RequestSentMessage);
      this._onCompletion();
    },
    failure: function() {
      UIUtils.showMessage(page.getLocale().RequestFailedMessage);
      this._onCompletion();
    },
    error: function() {
      UIUtils.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      this._onCompletion();
    },
    
    _onCompletion: function() {
      page._updating = false;
      
      Application.showMenuPage(ActiveOutgoingRequestsPage.name);
    }
  }

  var request = {
    text: this._requestTextEditor.getValue(),
    attachments: this._attachmentsBar.getAttachments(),
    response_gender: this._requestGenderElement.getSelectedData(),
    response_quantity: this._requestQuantityElement.getSelectedData(),
    response_wait_time: this._requestWaitTimeElement.getSelectedData(),
    response_age_group: this._requestAgeElement.getSelectedData(),
    expertise_category: this._requestExpertiseCategoryElement.getSelectedData()
  }
  
  Backend.createRequest(request, callback);
}

