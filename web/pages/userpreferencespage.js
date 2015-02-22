UserPreferencesPage = ClassUtils.defineClass(AbstractPage, function UserPreferencesPage() {
  AbstractPage.call(this, UserPreferencesPage.name);
  
  this._quantityElement;
  this._waitTimeElement;
  this._ageElement;
  this._genderElement;
  this._inquiryLimitElement;
  this._inquiryAgeElement;
  this._inquiryGenderElement;
  
  this._expertiseElement;
  this._makeContactInfoRequestableCheckbox;
  this._nameElement;
  this._contactElement;  
  
  this._updateButton;
  this._resetButton;
});

UserPreferencesPage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  generalPanel.innerHTML = this.getLocale().UpdatePreferencesText;

  UIUtils.appendLabel(root, "RequestPreferencesLabel", this.getLocale().RequestPreferencesLabel);
  this._appendRequestPreferencesPanel(root);
  
  UIUtils.appendLabel(root, "InquiryPreferencesLabel", this.getLocale().InquiryPreferencesLabel);
  this._appendInquiryPreferencesPanel(root);
  
  UIUtils.appendLabel(root, "ContactInfoPreferencesLabel", this.getLocale().ContactInfoPreferencesLabel);
  this._appendContactInfoPreferencesPanel(root);
  
  this._appendControlPanel(root);
}

UserPreferencesPage.prototype.onShow = function() {
  this._resetParameters();
}

UserPreferencesPage.prototype.onHide = function() {
  UIUtils.setEnabled(this._updateButton, true);
}



UserPreferencesPage.prototype._appendRequestPreferencesPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "RequestPreferencesPanel");
  
  this._quantityElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Quantity"), this.getLocale().NumOfResponsesPreferenceLabel, Application.Configuration.RESPONSE_QUANTITY, "10px")).getInputElement();
  
  this._ageElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "AgeCategory"), this.getLocale().AgePreferenceLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();
  
  this._waitTimeElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "WaitTime"), this.getLocale().WaitPreferenceLabel, Application.Configuration.RESPONSE_WAIT_TIME, "10px")).getInputElement();
  
  this._genderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "Gender"), this.getLocale().GenderPreferenceLabel, Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
}

UserPreferencesPage.prototype._appendInquiryPreferencesPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "InquiryPreferencesPanel");
  
  this._inquiryLimitElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "DailyInquiryLimit"), this.getLocale().NumOfInquiriesPreferenceLabel, Application.Configuration.INQUIRY_LIMIT_PREFERENCE, "10px")).getInputElement();
  
  this._inquiryAgeElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "InquiryAge"), this.getLocale().RequestersAgePreferenceLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px")).getInputElement();
  
  this._inquiryGenderElement = contentPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(contentPanel, "InquiryGender"), this.getLocale().RequestersGenderPreferenceLabel, Application.Configuration.GENDER_PREFERENCE, "10px")).getInputElement();
}

UserPreferencesPage.prototype._appendContactInfoPreferencesPanel = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContactInfoPreferencesPanel");
  
  this._expertiseElement = contentPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(contentPanel, "Expertise"), this.getLocale().ExpertisePreferenceLabel, Application.Configuration.EXPERTISES, "10px")).getInputElement();
  
  this._makeContactInfoRequestableCheckbox = UIUtils.appendCheckbox(contentPanel, "AllowContactInfo", this.getLocale().AllowContactInfoPreferenceLabel);
  
  this._nameElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Name"), this.getLocale().NamePreferenceLabel, "10px")).getInputElement();

  this._contactElement = contentPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contentPanel, "Contact"), this.getLocale().ContactPreferenceLabel, "10px")).getInputElement();
}


UserPreferencesPage.prototype._appendControlPanel = function(root) {
  var controlPanel = UIUtils.appendBlock(root, "ControlPanel");
  
  controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0"));
  
  this._updateButton = controlPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "UpdateButton"), this.getLocale().UpdateButton));
  
  this._resetButton = controlPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createButton(UIUtils.createId(controlPanel, "ResetButton"), this.getLocale().ResetButton));
  
  UIUtils.setClickListener(this._resetButton, this._resetParameters.bind(this));
  UIUtils.setClickListener(this._updateButton, function() {
    if (this._makeContactInfoRequestableCheckbox.getValue()) {
      if (this._expertiseElement.getSelectedData().length == 0) {
        this._expertiseElement.indicateInvalidInput();
        Application.showMessage(this.getLocale().NoExpertiseMessage);
        return;
      }
      if (this._nameElement.getValue() == "") {
        UIUtils.indicateInvalidInput(this._nameElement);
        Application.showMessage(this.getLocale().NoNameMessage);
        return;
      }
      if (this._contactElement.getValue() == "") {
        UIUtils.indicateInvalidInput(this._contactElement);
        Application.showMessage(this.getLocale().NoContactInfoMessage);
        return;
      }
    }

    var page = this;
    
    var callback = {
      success: function(requestId) {
        this._onCompletion();
        Application.showMessage(page.getLocale().PreferencesUpdatedMessage);
      },
      failure: function() {
        this._onCompletion();
        Application.showMessage(page.getLocale().UpdateFailedMessage);
      },
      error: function() {
        this._onCompletion();
        Application.showMessage(I18n.getLocale().literals.ServerErrorMessage);
      },

      _onCompletion: function() {
        UIUtils.setEnabled(this._updateButton, true);
        Application.hideSpinningWheel();
      }.bind(this)
    }

    UIUtils.setEnabled(this._updateButton, false);
    Application.showSpinningWheel();
    
    this._updateUserPreferences(callback);
  }.bind(this));
}

UserPreferencesPage.prototype._resetParameters = function() {
  this._quantityElement.selectData(Backend.getUserPreferences().responseQuantity);
  this._waitTimeElement.selectData(Backend.getUserPreferences().responseWaitTime);
  this._ageElement.selectData(Backend.getUserPreferences().requestTargetAge);
  this._genderElement.selectData(Backend.getUserPreferences().requestTargetGender);
  this._inquiryLimitElement.selectData(Backend.getUserPreferences().dailyInquiryLimit);
  this._inquiryAgeElement.selectData(Backend.getUserPreferences().inquiryAge);
  this._inquiryGenderElement.selectData(Backend.getUserPreferences().inquiryGender);
  
  this._expertiseElement.selectChoices(Backend.getUserPreferences().expertises);
  this._makeContactInfoRequestableCheckbox.setValue(Backend.getUserPreferences().contactVisible);
  this._nameElement.setValue(Backend.getUserPreferences().contactName);
  this._contactElement.setValue(Backend.getUserPreferences().contactInfo);
}


UserPreferencesPage.prototype._updateUserPreferences = function(callback) {
  var userPreferences = {
    responseQuantity: this._quantityElement.getSelectedData(),
    responseWaitTime: this._waitTimeElement.getSelectedData(),
    requestTargetAge: this._ageElement.getSelectedData(),
    requestTargetGender: this._genderElement.getSelectedData(),
    dailyInquiryLimit: this._inquiryLimitElement.getSelectedData(),
    inquiryAge: this._inquiryAgeElement.getSelectedData(),
    inquiryGender: this._inquiryGenderElement.getSelectedData(),

    expertises: this._expertiseElement.getSelectedData(),
    contactVisible: this._makeContactInfoRequestableCheckbox.getValue(),
    contactName: this._nameElement.getValue(),
    contactInfo: this._contactElement.getValue()
  };
  
  Backend.updateUserPreferences(userPreferences, callback);
}
