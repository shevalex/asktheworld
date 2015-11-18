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
  this._professionalFeaturesPanel;
  
  this._enableContactInfoCheckbox;
  this._contactInfoPanel;
  this._nameElement;
  this._contactElement;  

  this._enableHiddenTextCheckbox;
  
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
  
  
  var professionalCategoriesPanel = UIUtils.appendBlock(preferencesPanel, "ProfessionalCategoriesPanel");
  UIUtils.appendLabel(professionalCategoriesPanel, "ProfessionalCategoriesLabel", this.getLocale().ProfessionalCategoriesLabel);
  
  this._expertiseElement = professionalCategoriesPanel.appendChild(UIUtils.createLabeledMultiChoiceList(UIUtils.createId(professionalCategoriesPanel, "Expertise"), this.getLocale().ExpertisePreferenceLabel, Backend.getUserSettings().expertise_categories)).getInputElement();
  this._expertiseElement.setChangeListener(function() {
    if (this._expertiseElement.getSelectedData().length == 0) {
      this._expertiseElement.selectData(Application.Configuration.GENERAL_EXPERTISE_CATEGORY);
    } else if (this._isOnlyGeneralExpertiseSelected()) {
      this._professionalFeaturesPanel.style.display = "none";
    } else {
      this._professionalFeaturesPanel.style.display = "block";
    }
  }.bind(this));

  this._professionalFeaturesPanel = UIUtils.appendBlock(professionalCategoriesPanel, "ProfessionalFeaturesPanel");
  
  this._enableContactInfoCheckbox = UIUtils.appendCheckbox(this._professionalFeaturesPanel, "AllowContactInfo", this.getLocale().AllowContactInfoPreferenceLabel);
  this._enableContactInfoCheckbox.setChangeListener(function() {
    this._contactInfoPanel.style.display = this._enableContactInfoCheckbox.getValue() ? "block" : "none";
  }.bind(this));
  
  this._contactInfoPanel = UIUtils.appendBlock(this._professionalFeaturesPanel, "ContactInfoPanel");
  
  this._nameElement = this._contactInfoPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(this._contactInfoPanel, "Name"), this.getLocale().NamePreferenceLabel)).getInputElement();

  this._contactElement = this._contactInfoPanel.appendChild(UIUtils.createLabeledTextInput(UIUtils.createId(this._contactInfoPanel, "Contact"), this.getLocale().ContactPreferenceLabel)).getInputElement();
  
  
  this._enableHiddenTextCheckbox = UIUtils.appendCheckbox(this._professionalFeaturesPanel, "AllowHiddenText", this.getLocale().AllowHiddenTextPreferenceLabel);
  
  
  
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
  UIUtils.appendExplanationPad(rightClarificationPanel, "ProfessionalClarificationPanel", this.getLocale().ContactPreferencesLabel, this.getLocale().ProfessionalClarificationText);
}

UserPreferencesPage.prototype.onShow = function() {
  this._resetParameters();
  
  this._updating = false;
}

UserPreferencesPage.prototype.onHide = function() {
}


UserPreferencesPage.prototype._isOnlyGeneralExpertiseSelected = function() {
  return this._expertiseElement.getSelectedData().length == 1 && this._expertiseElement.getSelectedData()[0] == Application.Configuration.GENERAL_EXPERTISE_CATEGORY;
}


UserPreferencesPage.prototype._resetParameters = function() {
  this._quantityElement.selectData(Backend.getUserPreferences().default_response_quantity);
  this._waitTimeElement.selectData(Backend.getUserPreferences().default_response_wait_time);
  this._ageElement.selectData(Backend.getUserPreferences().default_response_age_group_preference);
  this._genderElement.selectData(Backend.getUserPreferences().default_gender_preference);
  this._inquiryLimitElement.selectData(Backend.getUserPreferences().inquiry_quantity_per_day);
  this._inquiryAgeElement.selectData(Backend.getUserPreferences().inquiry_age_group_preference);
  this._inquiryGenderElement.selectData(Backend.getUserPreferences().inquiry_gender_preference);
  
  this._expertiseElement.selectChoices(Backend.getUserPreferences().expertises);
  this._professionalFeaturesPanel.style.display = this._isOnlyGeneralExpertiseSelected() ? "none" : "block";
  
  this._enableContactInfoCheckbox.setValue(Backend.getUserPreferences().paid_features.contact_info.enabled);
  this._contactInfoPanel.style.display = this._enableContactInfoCheckbox.getValue() ? "block" : "none";
  
  this._nameElement.setValue(Backend.getUserPreferences().paid_features.contact_info.data.contact_name);
  this._contactElement.setValue(Backend.getUserPreferences().paid_features.contact_info.data.contact_information);
  
  this._enableHiddenTextCheckbox.setValue(Backend.getUserPreferences().paid_features.hidden_text.enabled);
}


UserPreferencesPage.prototype._updateUserPreferences = function(callback) {
  if (this._updating) {
    return;
  }
  
  if (this._enableContactInfoCheckbox.getValue()) {
    if (this._expertiseElement.getSelectedData().length == 0 
        || this._expertiseElement.getSelectedData().length == 1 && this._expertiseElement.getSelectedData()[0] == Application.Configuration.GENERAL_EXPERTISE_CATEGORY) {
      
      this._expertiseElement.indicateInvalidInput();
      Application.showMessage(this.getLocale().NoProfessionalExpertiseMessage);
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
    default_response_quantity: this._quantityElement.getSelectedData(),
    default_response_wait_time: this._waitTimeElement.getSelectedData(),
    default_response_age_group_preference: this._ageElement.getSelectedData(),
    default_gender_preference: this._genderElement.getSelectedData(),
    inquiry_quantity_per_day: this._inquiryLimitElement.getSelectedData(),
    inquiry_age_group_preference: this._inquiryAgeElement.getSelectedData(),
    inquiry_gender_preference: this._inquiryGenderElement.getSelectedData(),

    expertises: this._expertiseElement.getSelectedData(),
    
    paid_features: {
      hidden_text: {
        enabled: false,
        policy: Application.Configuration.PAID_FEATURE_POLICY_FREE,
        data: {}
      },

      contact_info: {
        enabled: this._enableContactInfoCheckbox.getValue(),
        policy: Application.Configuration.PAID_FEATURE_POLICY_FREE,
        data: {contact_name: this._nameElement.getValue(), contact_information: this._contactElement.getValue()}
      }
    }
  };
  
  Backend.updateUserPreferences(userPreferences, callback);
}
