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
  UIUtils.get$(generalPanel).html("Asking The World is just that easy. You are only three steps away.");

  var requestTextPanel = UIUtils.appendBlock(root, "RequestContentPanel");
  UIUtils.appendLabel(requestTextPanel, "Label", "1. Type in the text of your request first...");
  this._requestTextEditor = UIUtils.appendTextEditor(requestTextPanel, "TextEditor", {
    fileTooBigListener: function(file) {
      Application.showMessage("File is too big");
    }
  });
  
  var requestParamsPanel = UIUtils.appendBlock(root, "RequestParametersPanel");
  UIUtils.appendLabel(requestParamsPanel, "Label", "2. Choose who will see your question");

  var prefLinkId = UIUtils.createId(root, "PreferencesLink");
  UIUtils.appendLabel(requestParamsPanel, "Note", "Note: You can always modify your defaut settings in <a href='#' id='" + prefLinkId + "'>Your Preferences</a>");
  UIUtils.setClickListener(prefLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID);
  });
  
  this._requestGenderElement = requestParamsPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestParamsPanel, "Gender"), "Target gender", Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
  
  this._requestAgeElement = requestParamsPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestParamsPanel, "AgeCategory"), "Target age group", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();
  
  requestParamsPanel.appendChild(UIUtils.createLineBreak());
  
  this._requestWaitTimeElement = requestParamsPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestParamsPanel, "WaitTime"), "How long do you want to wait", Application.Configuration.RESPONSE_WAIT_TIME, "10px")).getInputElement();
  
  this._requestQuantityElement = requestParamsPanel.appendChild(UIUtils.createSpan("48%", "20px 0 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestParamsPanel, "Quantity"), "Maximum # of responses you want", Application.Configuration.RESPONSE_QUANTITY, "10px")).getInputElement();
  
  var controlPanel = UIUtils.appendBlock(root, "RequestControlPanel");
  UIUtils.appendLabel(controlPanel, "Label", "3. And finally send it out!");
  
//  var buttonHolder = UIUtils.appendBlock(controlPanel, "ButtonHolder");
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  this._sendButton = controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "SendButton"), "Ask The World!"));
  var resetButton = controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "ResetButton"), "Reset"));
  
  
  UIUtils.setClickListener(this._sendButton, function() {
    if (this._requestTextEditor.getValue() != "") {
      this._createRequest();
    } else {
      this._requestTextEditor.indicateInvalidInput();
      Application.showMessage("Please create a message", Application.MESSAGE_TIMEOUT_FAST);
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
      Application.showMessage("New request was successfully sent");
      page._resetPage();
      this._onCompletion();
    },
    failure: function() {
      Application.showMessage("Failed to send a request. Try again later");
      this._onCompletion();
    },
    error: function() {
      Application.showMessage("Error: cannot reach the server");
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

