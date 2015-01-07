UserPreferencesPage = ClassUtils.defineClass(AbstractPage, function UserPreferencesPage() {
  AbstractPage.call(this, "UserPreferencesPage");
});

UserPreferencesPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("UserPreferencesPage-GeneralPanel"));
  $("#UserPreferencesPage-GeneralPanel").html("Update your request preferences. This is what we will use as your default choice when you are Asking The World.<br>Note, that you can always override these defauls for the specific request.");
  

  root.appendChild(UIUtils.createLabel("UserPreferencesPage-RequestPreferencesLabel", "Tell us whom do you want to send your requests to"));
  root.appendChild(this._createRequestPreferencesPanel());
  
  root.appendChild(UIUtils.createLabel("UserPreferencesPage-InquiryPreferencesLabel", "Tell us who do you want to receive the inquiries from"));
  root.appendChild(this._createInquiryPreferencesPanel());
  
  root.appendChild(this._createControlPanel());

  root.appendChild(UIUtils.createBlock("UserPreferencesPage-StatusPanel"));
  
  $("#UserPreferencesPage-ControlPanel-ResetButton").click(this._resetParameters.bind(this));
  $("#UserPreferencesPage-ControlPanel-UpdateButton").click(this._updateUserPreferences.bind(this));
}

UserPreferencesPage.prototype.onShow = function() {
  this._resetParameters();
}



UserPreferencesPage.prototype._createRequestPreferencesPanel = function() {
  var contentPanel = UIUtils.createBlock("UserPreferencesPage-RequestPreferencesPanel");
  
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-Quantity", "Maximum number of responses that you want to see", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-AgeCategory", "Who do you want to send this request to", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-WaitTime", "How long do you want to wait", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-Gender", "Gender preference", Application.Configuration.GENDER_PREFERENCE, "10px"));

  return contentPanel;
}

UserPreferencesPage.prototype._createInquiryPreferencesPanel = function() {
  var contentPanel = UIUtils.createBlock("UserPreferencesPage-InquiryPreferencesPanel");
  
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-DailyInquiryLimit", "Maximum daily amount of inquiries you want to receive", Application.Configuration.INQUIRY_LIMIT_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-InquiryAge", "Age of requesters", Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  contentPanel.appendChild(UIUtils.createLineBreak());
  contentPanel.appendChild(UIUtils.createLabeledDropList("UserPreferencesPage-InquiryGender", "Sex of requesters", Application.Configuration.GENDER_PREFERENCE, "10px"));

  return contentPanel;
}


UserPreferencesPage.prototype._createControlPanel = function() {
  var controlPanel = UIUtils.createBlock("UserPreferencesPage-ControlPanel");
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton("UserPreferencesPage-ControlPanel-UpdateButton", "Update Preferences"));
  controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createLink("UserPreferencesPage-ControlPanel-ResetButton", "Reset"));
  
  return controlPanel;
}

UserPreferencesPage.prototype._resetParameters = function() {
  $("#UserPreferencesPage-Quantity").val(Backend.getUserPreferences().responseQuantity);
  $("#UserPreferencesPage-WaitTime").val(Backend.getUserPreferences().responseWaitTime);
  $("#UserPreferencesPage-AgeCategory").val(Backend.getUserPreferences().requestTargetAge);
  $("#UserPreferencesPage-Gender").val(Backend.getUserPreferences().requestTargetGender);
  $("#UserPreferencesPage-DailyInquiryLimit").val(Backend.getUserPreferences().dailyInquiryLimit);
  $("#UserPreferencesPage-InquiryAge").val(Backend.getUserPreferences().inquiryAge);
  $("#UserPreferencesPage-InquiryGender").val(Backend.getUserPreferences().inquiryGender);
}


UserPreferencesPage.prototype._updateUserPreferences = function() {
  $("#UserPreferencesPage-StatusPanel").text("");
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      $("#UserPreferencesPage-StatusPanel").text("");
    },
    failure: function() {
      this._onCompletion();
      $("#UserPreferencesPage-StatusPanel").text("Cannot update user profile on the server");
    },
    error: function() {
      this._onCompletion();
      $("#UserPreferencesPage-StatusPanel").text("Server communication error");
    },
    
    _onCompletion: function() {
      UIUtils.setEnabled("UserPreferencesPage-ControlPanel-UpdateButton", true);
      Application.hideSpinningWheel();
    }
  }
  
  UIUtils.setEnabled("UserPreferencesPage-ControlPanel-UpdateButton", false);
  Application.showSpinningWheel();

  var userPreferences = {
    responseQuantity: $("#UserPreferencesPage-Quantity").val(),
    responseWaitTime: $("#UserPreferencesPage-WaitTime").val(),
    requestTargetAge: $("#UserPreferencesPage-AgeCategory").val(),
    requestTargetGender: $("#UserPreferencesPage-Gender").val(),
    dailyInquiryLimit: $("#UserPreferencesPage-DailyInquiryLimit").val(),
    inquiryAge: $("#UserPreferencesPage-InquiryAge").val(),
    inquiryGender: $("#UserPreferencesPage-InquiryGender").val()
  };
  
  Backend.updateUserPreferences(userPreferences, callback);
}
