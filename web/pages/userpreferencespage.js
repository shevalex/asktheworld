UserPreferencesPage = ClassUtils.defineClass(AbstractDataPage, function UserPreferencesPage() {
  AbstractDataPage.call(this, UserPreferencesPage.name);
  
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

  this._updating = false;
});

UserPreferencesPage.prototype.definePageContent = function(root) {
  var preferencesPanel = UIUtils.appendBlock(root, "PreferencesPanel");
  UIUtils.appendLabel(preferencesPanel, "PreferencesLabel", this.getLocale().PreferencesLabel);
  
  var requestsPreferencesPanel = UIUtils.appendBlock(preferencesPanel, "RequestsPreferencesPanel");
  UIUtils.appendLabel(requestsPreferencesPanel, "RequestsPreferencesLabel", this.getLocale().RequestsPreferencesLabel);
  
  this._genderElement = requestsPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestsPreferencesPanel, "Gender"), I18n.getLocale().literals.GenderPreferenceLabel, Application.Configuration.GENDER_PREFERENCE)).getInputElement();

  this._ageElement = requestsPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestsPreferencesPanel, "Age"), I18n.getLocale().literals.AgePreferenceLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE)).getInputElement();
  
  this._quantityElement = requestsPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestsPreferencesPanel, "Quantity"), I18n.getLocale().literals.NumOfResponsesPreferenceLabel, Application.Configuration.RESPONSE_QUANTITY)).getInputElement();
  
  this._waitTimeElement = requestsPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(requestsPreferencesPanel, "WaitTime"), I18n.getLocale().literals.WaitPreferenceLabel, Application.Configuration.RESPONSE_WAIT_TIME)).getInputElement();
  
  
  var inquiriesPreferencesPanel = UIUtils.appendBlock(preferencesPanel, "InquiriesPreferencesPanel");
  UIUtils.appendLabel(inquiriesPreferencesPanel, "InquiriesPreferencesLabel", this.getLocale().InquiriesPreferencesLabel);
  
  this._inquiryGenderElement = inquiriesPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(inquiriesPreferencesPanel, "Gender"), this.getLocale().InquiriesGenderPreferenceLabel, Application.Configuration.GENDER_PREFERENCE)).getInputElement();

  this._inquiryAgeElement = inquiriesPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(inquiriesPreferencesPanel, "Age"), this.getLocale().InquiriesAgePreferenceLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE)).getInputElement();
  
  this._inquiryLimitElement = inquiriesPreferencesPanel.appendChild(UIUtils.createLabeledDropList(UIUtils.createId(inquiriesPreferencesPanel, "DailyInquiryLimit"), this.getLocale().NumOfInquiriesPreferenceLabel, Application.Configuration.INQUIRY_LIMIT_PREFERENCE)).getInputElement();
  
  
  var contactPreferencesPanel = UIUtils.appendBlock(preferencesPanel, "ContactPreferencesPanel");
  UIUtils.appendLabel(contactPreferencesPanel, "ContactPreferencesLabel", this.getLocale().ContactPreferencesLabel);
  
  this._expertiseElement = contactPreferencesPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(contactPreferencesPanel, "Expertise"), this.getLocale().ExpertisePreferenceLabel, Application.Configuration.EXPERTISES)).getInputElement();
  
  this._makeContactInfoRequestableCheckbox = UIUtils.appendCheckbox(contactPreferencesPanel, "AllowContactInfo", this.getLocale().AllowContactInfoPreferenceLabel);
  
  this._nameElement = contactPreferencesPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contactPreferencesPanel, "Name"), this.getLocale().NamePreferenceLabel)).getInputElement();

  this._contactElement = contactPreferencesPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(contactPreferencesPanel, "Contact"), this.getLocale().ContactPreferenceLabel)).getInputElement();
  
  
  var buttonsPanel = UIUtils.appendBlock(preferencesPanel, "ButtonsPanel");
  var updateButton = UIUtils.appendButton(buttonsPanel, "UpdateButton", this.getLocale().UpdateButton);
  UIUtils.setClickListener(updateButton, function() {
    this._updateUserPreferences();
  }.bind(this));

  var cancelButton = UIUtils.appendButton(buttonsPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.setClickListener(cancelButton, function() {
    Application.goBack();
  }.bind(this));
  
  
  
  var leftClarificationPanel = UIUtils.appendBlock(preferencesPanel, "LeftClarificationPanel");
  UIUtils.appendExplanationPad(leftClarificationPanel, "ResponsesClarificationPanel", I18n.getLocale().literals.NumOfResponsesPreferenceLabel, this.getLocale().ResponsesClarificationText);
  

  var rightClarificationPanel = UIUtils.appendBlock(preferencesPanel, "RightClarificationPanel");
  UIUtils.appendExplanationPad(rightClarificationPanel, "TimeFrameClarificationPanel", I18n.getLocale().literals.WaitPreferenceLabel, this.getLocale().TimeFrameClarificationText);
  UIUtils.appendExplanationPad(rightClarificationPanel, "ContactClarificationPanel", this.getLocale().ContactPreferencesLabel, this.getLocale().ContactClarificationText);
}

UserPreferencesPage.prototype.onShow = function() {
  this._resetParameters();
  
  this._updating = false;
}

UserPreferencesPage.prototype.onHide = function() {
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
  if (this._updating) {
    return;
  }
  
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
  
  if (this._expertiseElement.getSelectedData().length == 0) {
    this._expertiseElement.selectChoices([Application.Configuration.EXPERTISES[0]]);
  }

  var page = this;
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      Application.showMessage(page.getLocale().PreferencesUpdatedMessage);
      Application.goBack();
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
      this._updating = false;
      Application.hideSpinningWheel();
    }.bind(this)
  }

  this._updating = true;
  Application.showSpinningWheel();

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
