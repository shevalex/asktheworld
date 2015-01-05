RequestDetailsPage = ClassUtils.defineClass(AbstractPage, function RequestDetailsPage() {
  AbstractPage.call(this, "RequestDetailsPage");
  
  this._returnPageId;
});

RequestDetailsPage.prototype.definePageContent = function(root) {
  var generalPanel = root.appendChild(UIUtils.createBlock("RequestDetailsPage-GeneralPanel"));
  
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-PreviousLink", "Previous"));
  generalPanel.appendChild(UIUtils.createSpan("56%", "0 2% 2% 0")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-GoBackLink", "Go back to the request list"));
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-NextLink", "Next"));

  $("#RequestDetailsPage-GeneralPanel-GoBackLink").click(function() {
    Application.getMenuPage().showPage(this._returnPageId);
  }.bind(this));
  
  //TODO
  $("#RequestDetailsPage-GeneralPanel-PreviousLink").prop("disabled", "true");
  $("#RequestDetailsPage-GeneralPanel-NextLink").prop("disabled", "true");
}

RequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  AbstractRequestPage.appendRequestResponsesControl(root, [paramBundle.requestId], {
    requestClickListener: null,
    requestEditable: true,
    maxResponses: -1,
    unviewedResponsesOnly: false
  });
}



