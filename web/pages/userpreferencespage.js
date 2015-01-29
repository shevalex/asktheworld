UserPreferencesPage = ClassUtils.defineClass(AbstractPage, function UserPreferencesPage() {
  AbstractPage.call(this, "UserPreferencesPage");
  
  this._quantityElementId;
  this._waitTimeElementId;
  this._ageElementId;
  this._genderElementId;
  this._inquiryLimitElementId;
  this._inquiryAgeElementId;
  this._inquiryGenderElementId;
  
  this._updateButtonId;
  this._resetButtonId;
});

UserPreferencesPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Update your request preferences. This is what we will use as your default choice when you are Asking The World.<br>Note, that you can always override these defauls for the specific request.");
  

  UIUtils.appendLabel(root, "RequestPreferencesLabel", "Tell us whom do you want to send your requests to");
  this._appendRequestPreferencesPanel(root);
  
  UIUtils.appendLabel(root, "InquiryPreferencesLabel", "Tell us who do you want to receive the inquiries from");
  this._appendInquiryPreferencesPanel(root);
  
  this._appendControlPanel(root);
}

UserPreferencesPage.prototype.onShow = function() {
  this._resetParameters();
}



UserPreferencesPage.prototype._appendRequestPreferencesPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "RequestPreferencesPanel");
  
  this._quantityElementId = UIUtils.createId(contentPanel, "Quantity");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._quantityElementId, "Maximum number of responses that you want to see", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._ageElementId = UIUtils.createId(contentPanel, "AgeCategory");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._ageElementId, "Who do you want to send this request to", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._waitTimeElementId = UIUtils.createId(contentPanel, "WaitTime");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._waitTimeElementId, "How long do you want to wait", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._genderElementId = UIUtils.createId(contentPanel, "Gender");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._genderElementId, "Gender preference", Application.Configuration.GENDER_PREFERENCE, "10px"));
}

UserPreferencesPage.prototype._appendInquiryPreferencesPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "InquiryPreferencesPanel");
  
  this._inquiryLimitElementId = UIUtils.createId(contentPanel, "DailyInquiryLimit");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._inquiryLimitElementId, "Maximum daily amount of inquiries you want to receive", Application.Configuration.INQUIRY_LIMIT_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._inquiryAgeElementId = UIUtils.createId(contentPanel, "InquiryAge");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._inquiryAgeElementId, "Age of requesters", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  
  this._inquiryGenderElementId = UIUtils.createId(contentPanel, "InquiryGender");
  contentPanel.appendChild(UIUtils.createLabeledDropList(this._inquiryGenderElementId, "Gender of requesters", Application.Configuration.GENDER_PREFERENCE, "10px"));
}


UserPreferencesPage.prototype._appendControlPanel = function(root) {
  var controlPanel = UIUtils.appendBlock(root, "ControlPanel");
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  
  this._updateButtonId = UIUtils.createId(controlPanel, "UpdateButton");
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(this._updateButtonId, "Update Preferences"));
  
  this._resetButtonId = UIUtils.createId(controlPanel, "ResetButton");
  controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(this._resetButtonId, "Reset"));
  
  UIUtils.setClickListener(this._resetButtonId, this._resetParameters.bind(this));
  UIUtils.setClickListener(this._updateButtonId, function() {
    var callback = {
      success: function(requestId) {
        this._onCompletion();
        Application.showMessage("Your preferences were successfully updated");
      },
      failure: function() {
        this._onCompletion();
        Application.showMessage("Failed to update preferences");
      },
      error: function() {
        this._onCompletion();
        Application.showMessage("Server communication error");
      },

      _onCompletion: function() {
        UIUtils.setEnabled(this._updateButtonId, true);
        Application.hideSpinningWheel();
      }.bind(this)
    }

    UIUtils.setEnabled(this._updateButtonId, false);
    Application.showSpinningWheel();
    
    this._updateUserPreferences(callback);
  }.bind(this));
}

UserPreferencesPage.prototype._resetParameters = function() {
  UIUtils.get$(this._quantityElementId).val(Backend.getUserPreferences().responseQuantity);
  UIUtils.get$(this._waitTimeElementId).val(Backend.getUserPreferences().responseWaitTime);
  UIUtils.get$(this._ageElementId).val(Backend.getUserPreferences().requestTargetAge);
  UIUtils.get$(this._genderElementId).val(Backend.getUserPreferences().requestTargetGender);
  UIUtils.get$(this._inquiryLimitElementId).val(Backend.getUserPreferences().dailyInquiryLimit);
  UIUtils.get$(this._inquiryAgeElementId).val(Backend.getUserPreferences().inquiryAge);
  UIUtils.get$(this._inquiryGenderElementId).val(Backend.getUserPreferences().inquiryGender);
}


UserPreferencesPage.prototype._updateUserPreferences = function(callback) {
  var userPreferences = {
    responseQuantity: UIUtils.get$(this._quantityElementId).val(),
    responseWaitTime: UIUtils.get$(this._waitTimeElementId).val(),
    requestTargetAge: UIUtils.get$(this._ageElementId).val(),
    requestTargetGender: UIUtils.get$(this._genderElementId).val(),
    dailyInquiryLimit: UIUtils.get$(this._inquiryLimitElementId).val(),
    inquiryAge: UIUtils.get$(this._inquiryAgeElementId).val(),
    inquiryGender: UIUtils.get$(this._inquiryGenderElementId).val()
  };
  
  Backend.updateUserPreferences(userPreferences, callback);
}
