NewRequestPage = ClassUtils.defineClass(AbstractPage, function NewRequestPage() {
  AbstractPage.call(this, "NewRequestPage");
});

NewRequestPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("NewRequestPage-GeneralPanel"));
  $("#NewRequestPage-GeneralPanel").html("Asking The World is just that easy. You are just three steps away.");

  var requestPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestContentPanel"));
  requestPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestContentPanel-Label", "1. Type in the text of your request first..."));
  requestPanel.appendChild(UIUtils.createTextArea("NewRequestPage-RequestContentPanel-Text", 6, "Start typing here..."));

  var requestPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestParametersPanel"));
  requestPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestParametersPanel-Label", "2. Choose who will see your question..."));
  
  requestPanel.appendChild(UIUtils.createSpan("32%", "0 3% 0 0")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-AgeCategory", "Target age group", Application.Configuration.AGE_CATEGORIES, "10px"));
  requestPanel.appendChild(UIUtils.createSpan("32%", "0 3% 0 0")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-WaitTime", "How long you want to wait for responses", Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  requestPanel.appendChild(UIUtils.createSpan("30%")).appendChild(UIUtils.createLabeledDropList("NewRequestPage-RequestParametersPanel-Quantity", "Maximum # of responses you want to get", Application.Configuration.RESPONSE_QUANTITY, "10px"));
  
  
  var controlPanel = root.appendChild(UIUtils.createBlock("NewRequestPage-RequestControlPanel"));
  controlPanel.appendChild(UIUtils.createLabel("NewRequestPage-RequestControlPanel-Label", "3. And finally send it out!"));
  controlPanel.appendChild(UIUtils.createBlock()).appendChild(UIUtils.createButton("NewRequestPage-RequestControlPanel-SendButton", "Ask The World!"));
}

