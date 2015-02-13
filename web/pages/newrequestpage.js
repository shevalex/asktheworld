NewRequestPage = ClassUtils.defineClass(AbstractPage, function NewRequestPage() {
  AbstractPage.call(this, "NewRequestPage");
  
  this._requestTextEditor;
  
  this._requestGenderElement;
  this._requestAgeElement;
  this._requestWaitTimeElement;
  this._requestQuantityElement;
  
  this._sendButton = null;
});

NewRequestPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  generalPanel.innerHTML = this.getLocale().OutlineText;

  var requestTextPanel = UIUtils.appendBlock(root, "RequestContentPanel");
  UIUtils.appendLabel(requestTextPanel, "Label", this.getLocale().StepOneLabel);
  this._requestTextEditor = UIUtils.appendTextEditor(requestTextPanel, "TextEditor", {
    fileTooBigListener: function(file) {
      Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
    }
  });
  
  var requestParamsPanel = UIUtils.appendBlock(root, "RequestParametersPanel");
  UIUtils.appendLabel(requestParamsPanel, "Label", this.getLocale().StepTwoLabel);

  var prefLinkId = UIUtils.createId(root, "PreferencesLink");
  UIUtils.appendLabel(requestParamsPanel, "Note", this.getLocale().ModifySettingsLinkProvider(prefLinkId));
  UIUtils.setClickListener(prefLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID);
  });
  
  var targetSelectorPanel = UIUtils.appendBlock(requestParamsPanel, "TargetSelectors");

  this._requestGenderElement = targetSelectorPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(targetSelectorPanel, "Gender"), I18n.getLocale().literals.TargetGenderLabel, Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
  
  this._requestAgeElement = targetSelectorPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(targetSelectorPanel, "AgeCategory"), I18n.getLocale().literals.TargetAgeGroupLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();
  
  requestParamsPanel.appendChild(UIUtils.createLineBreak());
  
  this._requestWaitTimeElement = targetSelectorPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(targetSelectorPanel, "WaitTime"), I18n.getLocale().literals.WaitTimeLabel, Application.Configuration.RESPONSE_WAIT_TIME, "10px")).getInputElement();
  
  this._requestQuantityElement = targetSelectorPanel.appendChild(UIUtils.createSpan("48%", "20px 0 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(targetSelectorPanel, "Quantity"), I18n.getLocale().literals.NumOfResponsesLabel, Application.Configuration.RESPONSE_QUANTITY, "10px")).getInputElement();
  
  var controlPanel = UIUtils.appendBlock(root, "RequestControlPanel");
  UIUtils.appendLabel(controlPanel, "Label", this.getLocale().StepThreeLabel);
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  this._sendButton = controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "SendButton"), this.getLocale().SendButton));
  var resetButton = controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "ResetButton"), this.getLocale().ResetButton));
  
  
  UIUtils.setClickListener(this._sendButton, function() {
    if (this._requestTextEditor.getValue() != "") {
      this._createRequest();
    } else {
      this._requestTextEditor.indicateInvalidInput();
      Application.showMessage(this.getLocale().RequestEmptyMessage, Application.MESSAGE_TIMEOUT_FAST);
    }
  }.bind(this));
  
  UIUtils.setClickListener(resetButton, function() {
    this._resetPage();
  }.bind(this));
}

NewRequestPage.prototype.onShow = function() {
  this._requestTextEditor.focus();
}

NewRequestPage.prototype.onHide = function() {
  UIUtils.setEnabled(this._sendButton, true);
}


NewRequestPage.prototype._resetPage = function() {
  this._requestTextEditor.reset();
  this._requestTextEditor.focus();

  this._requestGenderElement.selectData(Backend.getUserPreferences().requestTargetGender);
  this._requestAgeElement.selectData(Backend.getUserPreferences().requestTargetAge);
  this._requestQuantityElement.selectData(Backend.getUserPreferences().responseQuantity);
  this._requestWaitTimeElement.selectData(Backend.getUserPreferences().responseWaitTime);
}

NewRequestPage.prototype._createRequest = function() {
  var page = this;
  
  var callback = {
    success: function(requestId) {
      Application.showMessage(page.getLocale().RequestSentMessage);
      page._resetPage();
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
      Application.hideSpinningWheel();
      UIUtils.setEnabled(this._sendButton, true);
      Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
    }.bind(this)
  }

  var request = {
    text: this._requestTextEditor.getValue(),
    attachments: this._requestTextEditor.getAttachments(),
    response_gender: this._requestGenderElement.getSelectedData(),
    response_quantity: this._requestQuantityElement.getSelectedData(),
    response_wait_time: this._requestWaitTimeElement.getSelectedData(),
    response_age_group: this._requestAgeElement.getSelectedData()
  }
  
  UIUtils.setEnabled(this._sendButton, false);
  Application.showSpinningWheel();

  Backend.createRequest(request, callback);
}

