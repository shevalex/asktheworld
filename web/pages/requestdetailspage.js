RequestDetailsPage = ClassUtils.defineClass(AbstractPage, function RequestDetailsPage() {
  AbstractPage.call(this, "RequestDetailsPage");
  
  this._returnPageId;
  this._navigatableRequestIds;
});

RequestDetailsPage.prototype.definePageContent = function(root) {
  var generalPanel = root.appendChild(UIUtils.createBlock("RequestDetailsPage-GeneralPanel"));
  
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-PreviousLink", "Previous"));
  UIUtils.setEnabled("RequestDetailsPage-GeneralPanel-PreviousLink", false);

  generalPanel.appendChild(UIUtils.createSpan("56%", "0 2% 2% 0")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-GoBackLink", "Go back to the request list"));
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("RequestDetailsPage-GeneralPanel-NextLink", "Next"));
  UIUtils.setEnabled("RequestDetailsPage-GeneralPanel-NextLink", false);


  root.appendChild(UIUtils.createBlock("RequestDetailsPage-RequestsPanel"));


  $("#RequestDetailsPage-GeneralPanel-GoBackLink").click(function() {
    Application.getMenuPage().showPage(this._returnPageId);
  }.bind(this));

  $("#RequestDetailsPage-GeneralPanel-PreviousLink").click(function() {
    this._currentRequestId = this._getPreviousRequestId();
    this._updatePage();
  }.bind(this));

  $("#RequestDetailsPage-GeneralPanel-NextLink").click(function() {
    this._currentRequestId = this._getNextRequestId();
    this._updatePage();
  }.bind(this));
}

RequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._navigatableRequestIds = paramBundle.otherRequestIds;
  this._currentRequestId = paramBundle.requestId;

  this._requestCacheUpdateListener = this._updatePage.bind(this);

  this._updatePage();
  
  Backend.addRequestCacheChangeListener(this._requestCacheUpdateListener);
}

RequestDetailsPage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
}


RequestDetailsPage.prototype._getPreviousRequestId = function() {
  if (this._navigatableRequestIds == null) {
    return null;
  }

  for (var index = 0; index < this._navigatableRequestIds.length; index++) {
    if (this._navigatableRequestIds[index] == this._currentRequestId) {
      if (index > 0) {
        return this._navigatableRequestIds[index - 1];
      } else {
        return null;
      }
    }
  }

  return null;
}

RequestDetailsPage.prototype._getNextRequestId = function() {
  if (this._navigatableRequestIds == null) {
    return null;
  }

  for (var index = 0; index < this._navigatableRequestIds.length; index++) {
    if (this._navigatableRequestIds[index] == this._currentRequestId) {
      if (index < this._navigatableRequestIds.length - 1) {
        return this._navigatableRequestIds[index + 1];
      } else {
        return null;
      }
    }
  }
  
  return null;
}

RequestDetailsPage.prototype._updatePage = function() {
  UIUtils.setEnabled("RequestDetailsPage-GeneralPanel-PreviousLink", this._getPreviousRequestId() != null);
  UIUtils.setEnabled("RequestDetailsPage-GeneralPanel-NextLink", this._getNextRequestId() != null);
  
  $("#RequestDetailsPage-RequestsPanel").empty();
  AbstractRequestPage.appendOutgoingRequestResponsesControl($("#RequestDetailsPage-RequestsPanel").get(0), [this._currentRequestId], {
    requestClickListener: null,
    requestEditable: true,
    maxResponses: -1,
    unviewedResponsesOnly: false,
    responseAreaMaxHeight: -1
  });
}



