RequestDetailsPage = ClassUtils.defineClass(AbstractPage, function RequestDetailsPage() {
  AbstractPage.call(this, "RequestDetailsPage");
  
  this._returnPageId;
});

RequestDetailsPage.prototype.definePageContent = function(root) {
  var generalPanel = root.appendChild(UIUtils.createBlock("RequestDetailsPage-GeneralPanel"));
  
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-PreviousLink", "Previous"));
  generalPanel.appendChild(UIUtils.createSpan("56%", "0 2% 2% 0")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-GoBackLink", "Go back to the request list"));
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-NextLink", "Next"));

  
  root.appendChild(UIUtils.createBlock("RequestDetailsPage-RequestPanel"));
  root.appendChild(UIUtils.createBlock("RequestDetailsPage-EditRequestPanel"));
  root.appendChild(UIUtils.createBlock("RequestDetailsPage-ResponsePanel"));
  
  
  $("#RequestDetailsPage-GeneralPanel-GoBackLink").click(function() {
    Application.getMenuPage().showPage(this._returnPageId);
  }.bind(this));
  
  //TODO
  $("#RequestDetailsPage-GeneralPanel-PreviousLink").prop("disabled", "true");
  $("#RequestDetailsPage-GeneralPanel-NextLink").prop("disabled", "true");
}

RequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._appendRequest(paramBundle.requestId, paramBundle.request);
}


RequestDetailsPage.prototype._appendRequest = function(requestId, request) {
  this._appendRequestInfo(requestId, request);
  this._appendResponses(requestId, request);
}

RequestDetailsPage.prototype._appendRequestInfo = function(requestId, request) {
  $("#RequestDetailsPage-RequestPanel").empty();
  
  $("#RequestDetailsPage-RequestPanel").get(0).appendChild(UIUtils.createBlock("RequestDetailsPage-RequestPanel-Request"));

  var requestDate = new Date(request.time);
  $("#RequestDetailsPage-RequestPanel-Request").addClass("message-container").html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
}

RequestDetailsPage.prototype._appendResponses = function(requestId, request) {
  $("#RequestDetailsPage-ResponsePanel").empty();

  for (var index in request.responses) {
    var responseId = request.responses[index];
    this._getResponse(requestId, responseId, function(responseId, response) {
      var responseElementId = "RequestDetailsPage-ResponsePanel-" + responseId;
      $("#RequestDetailsPage-ResponsePanel").get(0).appendChild(UIUtils.createBlock(responseElementId));

      var responseDate = new Date(response.time);

      $("#" + responseElementId).addClass("message-container").html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
    }.bind(this, responseId));
  }
}


RequestDetailsPage.prototype._getResponse = function(requestId, responseId, successCallback) {
  var callback = {
    success: function(response) {
      successCallback(response);
    },
    failure: function() {
    },
    error: function() {
    }
  }
  
  Backend.getResponse(requestId, responseId, callback);
}




