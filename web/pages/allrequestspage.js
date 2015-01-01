AllRequestsPage = ClassUtils.defineClass(AbstractRequestPage, function AllRequestsPage() {
  AbstractRequestPage.call(this, "AllRequestsPage", "all");
});

AllRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("AllRequestsPage-GeneralPanel"));
  $("#AllRequestsPage-GeneralPanel").html("This is the complete list of requests that you Asked The World about.<br>You can find your most recent active requests in the <a href='#' id='AllRequestsPage-GeneralPanel-ActiveRequestslink'>Active Requests</a> section.");
  $("#AllRequestsPage-GeneralPanel-ActiveRequestslink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("AllRequestsPage-TablePanel"));
  root.appendChild(UIUtils.createBlock("AllRequestsPage-DetailsPanel"));
  root.appendChild(UIUtils.createBlock("AllRequestsPage-ResponsePanel"));
}

AllRequestsPage.prototype.onShow = function(root) {
  $("#AllRequestsPage-DetailsPanel").empty();
  $("#AllRequestsPage-ResponsePanel").empty();
  
  this.pullRequestsAndAppendTable("AllRequestsPage-TablePanel", this._appendDetails.bind(this));
}


AllRequestsPage.prototype._appendDetails = function(requestId, request) {
  $("#AllRequestsPage-DetailsPanel").empty();
  $("#AllRequestsPage-ResponsePanel").empty();

  var requestDate = new Date(request.time);
  
  $("#AllRequestsPage-DetailsPanel").get(0).appendChild(UIUtils.createBlock("AllRequestsPage-DetailsPanel-Request"));
  $("#AllRequestsPage-DetailsPanel-Request").addClass("message-container").html("<b>You wrote on " + requestDate.toDateString() + ", " + requestDate.toLocaleTimeString() + " to " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender) + ":</b><br>" + request.text);
  
  for (var index in request.responses) {
    var responseId = request.responses[index];
    this._getResponse(requestId, responseId, function(responseId, response) {
      var responseElementId = "AllRequestsPage-DetailsPanel-Response-" + responseId;
      $("#AllRequestsPage-ResponsePanel").get(0).appendChild(UIUtils.createBlock(responseElementId));

      var responseDate = new Date(response.time);

      $("#" + responseElementId).addClass("message-container").html("<b>A " +  Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + response.text);
    }.bind(this, responseId));
  }
}


AllRequestsPage.prototype._getResponse = function(requestId, responseId, successCallback) {
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




