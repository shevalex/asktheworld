NewRequestPage = ClassUtils.defineClass(AbstractPage, function NewRequestPage() {
  AbstractPage.call(this, "NewRequestPage");
});

NewRequestPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("NewRequestPage-GeneralPanel"));
  $("#NewRequestPage-GeneralPanel").html("Asking The World is just that easy. You are only three steps away.");

  var requestPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestContentPanel"));
  requestPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestContentPanel-Label", "1. Type in the text of your request first..."));
  requestPanel.appendChild(UIUtils.createTextArea("NewRequestPage-RequestContentPanel-Text", 6, "Start typing here..."));

  var requestPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestParametersPanel"));
  requestPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestParametersPanel-Label", "2. Choose who will see your question.<br>Note: You can always modify your defaut settings in <a href='#' id='NewRequestPage-PreferencesLink'>Your Preferences</a>"));
  
  requestPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-AgeCategory", "Target age group", Application.Configuration.AGE_CATEGORIES, "10px"));
  requestPanel.appendChild(UIUtils.createSpan("32%", "0 2% 0 0")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-WaitTime", "How long do you want to wait", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  requestPanel.appendChild(UIUtils.createSpan("32%")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-Quantity", "Maximum # of responses you want", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  
  
  var controlPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestControlPanel"));
  controlPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestControlPanel-Label"));
  controlPanel.appendChild(UIUtils.createBlock()).appendChild(UIUtils.createButton("NewRequestPage-RequestControlPanel-SendButton", "Ask The World!"));
  
  $("#NewRequestPage-RequestControlPanel-SendButton").click(this._createRequest.bind(this));
  
  $("#NewRequestPage-PreferencesLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID);
  });
}

NewRequestPage.prototype.onShow = function() {
  //TODO: Set the default values for the request parameters
  
  $("#NewRequestPage-RequestControlPanel-Label").text("3. And finally send it out!");
}


NewRequestPage.prototype._createRequest = function() {
  $("#NewRequestPage-RequestControlPanel-Label").text("3. We are sending the request...");
  
  var buttonSelector = $("#NewRequestPage-RequestControlPanel-SendButton");
  
  var callback = {
    success: function(requestId) {
      this._onCompletion();
      $("#NewRequestPage-RequestControlPanel-Label").text("3. Here you go. The request is sent!");
    },
    failure: function() {
      this._onCompletion();
      $("#NewRequestPage-RequestControlPanel-Label").text("3. You are likely not logged in properly...");
    },
    error: function() {
      this._onCompletion();
      $("#NewRequestPage-RequestControlPanel-Label").text("3. Something went wrong. Try again later.");
    },
    
    _onCompletion: function() {
      buttonSelector.prop("disabled", false);
      Application.hideSpinningWheel();
    }
  }
  
  var request = {
    text: $("#NewRequestPage-RequestContentPanel-Text").val(),
    pictures: [],
    audios: []
  }
  
  var requestParams = {
    quantity: $("#NewRequestPage-RequestParametersPanel-Quantity").val(),
    waitTime: $("#NewRequestPage-RequestParametersPanel-WaitTime").val(),
    age: $("#NewRequestPage-RequestParametersPanel-AgeCategory").val()
  }

  buttonSelector.prop("disabled", true);
  Application.showSpinningWheel();

  Backend.createRequest(request, requestParams, callback);
}
