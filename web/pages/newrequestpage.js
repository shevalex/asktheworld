NewRequestPage = ClassUtils.defineClass(AbstractPage, function NewRequestPage() {
  AbstractPage.call(this, "NewRequestPage");
  
  this._requestTextEditorContainer = null;
  this._requestTextEditor = null;
  
  this._requestGenderId = null;
  this._requestAgeId = null;
  this._requestWaitTimeId = null;
  this._requestQuantityId = null;
  this._requestStatusLabelId = null;
  
  this._sendButton = null;
});

NewRequestPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Asking The World is just that easy. You are only three steps away.");

  this._requestTextPanel = UIUtils.appendBlock(root, "RequestContentPanel");
  UIUtils.appendLabel(this._requestTextPanel, "Label", "1. Type in the text of your request first...");
  
  var requestParamsPanel = UIUtils.appendBlock(root, "RequestParametersPanel");
  UIUtils.appendLabel(requestParamsPanel, "Label", "2. Choose who will see your question");

  var prefLinkId = UIUtils.createId(root, "PreferencesLink");
  UIUtils.appendLabel(requestParamsPanel, "Note", "Note: You can always modify your defaut settings in <a href='#' id='" + prefLinkId + "'>Your Preferences</a>");
  UIUtils.setClickListener(prefLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID);
  });
  
  this._requestGenderId = UIUtils.createId(requestParamsPanel, "Gender");
  requestParamsPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(this._requestGenderId, "Target gender", Application.Configuration.GENDER_PREFERENCE, "10px"));
  
  this._requestAgeId = UIUtils.createId(requestParamsPanel, "AgeCategory");
  requestParamsPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(this._requestAgeId, "Target age group", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  
  requestParamsPanel.appendChild(UIUtils.createLineBreak());
  
  this._requestWaitTimeId = UIUtils.createId(requestParamsPanel, "WaitTime");
  requestParamsPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 0 0")).appendChild(UIUtils.createLabeledDropList(this._requestWaitTimeId, "How long do you want to wait", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  
  this._requestQuantityId = UIUtils.createId(requestParamsPanel, "Quantity");
  requestParamsPanel.appendChild(UIUtils.createSpan("48%", "20px 0 0 0")).appendChild(UIUtils.createLabeledDropList(this._requestQuantityId, "Maximum # of responses you want", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  
  var controlPanel = UIUtils.appendBlock(root, "RequestControlPanel");
  UIUtils.appendLabel(controlPanel, "Label", "3. And finally send it out!");
  
  var buttonHolder = UIUtils.appendBlock(controlPanel, "ButtonHolder");
  this._sendButton = UIUtils.appendButton(buttonHolder, "SendButton", "Ask The World!");
  UIUtils.setClickListener(this._sendButton, function() {
    if (this._requestTextEditor.getValue() != "") {
      this._createRequest();
    } else {
      this._requestTextEditor.indicateIncorrectInput();
      Application.showMessage("Please create a message", Application.MESSAGE_TIMEOUT_FAST);
    }
  }.bind(this));
}

NewRequestPage.prototype.onShow = function() {
  this._requestTextEditor = UIUtils.appendTextEditor(this._requestTextPanel, "TextEditor");

  UIUtils.get$(this._requestGenderId).val(Backend.getUserPreferences().requestTargetGender);
  UIUtils.get$(this._requestAgeId).val(Backend.getUserPreferences().requestTargetAge);
  UIUtils.get$(this._requestQuantityId).val(Backend.getUserPreferences().responseQuantity);
  UIUtils.get$(this._requestWaitTimeId).val(Backend.getUserPreferences().responseWaitTime);
}

NewRequestPage.prototype.onHide = function() {
  UIUtils.get$(this._requestTextEditor).remove();
}


NewRequestPage.prototype._createRequest = function() {
  var callback = {
    success: function(requestId) {
      Application.showMessage("New request was successfully sent");
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
    pictures: [],
    audios: [],
    response_gender: UIUtils.get$(this._requestGenderId).val(),
    response_quantity: UIUtils.get$(this._requestQuantityId).val(),
    response_wait_time: UIUtils.get$(this._requestWaitTimeId).val(),
    response_age_group: UIUtils.get$(this._requestAgeId).val()
  }
  
  UIUtils.setEnabled(this._sendButton, false);
  Application.showSpinningWheel();

  Backend.createRequest(request, callback);
}

