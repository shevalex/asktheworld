OutgoingRequestDetailsPage = ClassUtils.defineClass(AbstractPage, function OutgoingRequestDetailsPage() {
  AbstractPage.call(this, "OutgoingRequestDetailsPage");
  
  this._returnPageId;
  this._navigatableRequestIds;
  this._requestList = null;
  this._requestsPanel = null;
});

OutgoingRequestDetailsPage.prototype.definePageContent = function(root) {
  var generalPanel = root.appendChild(UIUtils.createBlock("OutgoingRequestDetailsPage-GeneralPanel"));
  
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("OutgoingRequestDetailsPage-GeneralPanel-PreviousLink", "Previous"));
  UIUtils.setEnabled("OutgoingRequestDetailsPage-GeneralPanel-PreviousLink", false);

  generalPanel.appendChild(UIUtils.createSpan("56%", "0 2% 2% 0")).appendChild(UIUtils.createLink("OutgoingRequestDetailsPage-GeneralPanel-GoBackLink", "Take me back"));
  generalPanel.appendChild(UIUtils.createSpan("20%")).appendChild(UIUtils.createLink("OutgoingRequestDetailsPage-GeneralPanel-NextLink", "Next"));
  UIUtils.setEnabled("OutgoingRequestDetailsPage-GeneralPanel-NextLink", false);


  this._requestsPanel = root.appendChild(UIUtils.createBlock("OutgoingRequestDetailsPage-RequestsPanel"));


  $("#OutgoingRequestDetailsPage-GeneralPanel-GoBackLink").click(function() {
    Application.getMenuPage().showPage(this._returnPageId);
  }.bind(this));

  $("#OutgoingRequestDetailsPage-GeneralPanel-PreviousLink").click(function() {
    this._currentRequestId = this._getPreviousRequestId();
    this._updatePage();
  }.bind(this));

  $("#OutgoingRequestDetailsPage-GeneralPanel-NextLink").click(function() {
    this._currentRequestId = this._getNextRequestId();
    this._updatePage();
  }.bind(this));
}

OutgoingRequestDetailsPage.prototype.onShow = function(root, paramBundle) {
  this._returnPageId = paramBundle.returnPageId;
  this._navigatableRequestIds = paramBundle.otherRequestIds;
  this._currentRequestId = paramBundle.requestId;

  this._updatePage();
}

OutgoingRequestDetailsPage.prototype.onHide = function() {
  if (this._requestList != null) {
    this._requestList.remove();
  }
}


OutgoingRequestDetailsPage.prototype._getPreviousRequestId = function() {
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

OutgoingRequestDetailsPage.prototype._getNextRequestId = function() {
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

OutgoingRequestDetailsPage.prototype._updatePage = function() {
  UIUtils.setEnabled("OutgoingRequestDetailsPage-GeneralPanel-PreviousLink", this._getPreviousRequestId() != null);
  UIUtils.setEnabled("OutgoingRequestDetailsPage-GeneralPanel-NextLink", this._getNextRequestId() != null);
  
  if (this._requestList != null) {
    this._requestList.remove();
  }
  
  this._requestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: null,
    requestIds: [this._currentRequestId],
    requestEditable: true,
    maxResponses: -1,
    responseAreaMaxHeight: -1,
    unviewedResponsesOnly: false,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      }
    }
  });
  
  this._requestList.append(this._requestsPanel);
}



