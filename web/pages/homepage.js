HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, "HomePage");
  
  this._requestList = null;
  this._requestsPanelRequests = null;
  this._requestsStatusElement = null;
  
  this._statistics = null;
});

HomePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Welcome, " + Backend.getUserProfile().name + ".");

  var requestsPanel = UIUtils.appendBlock(root, "RequestPanel");
  this._requestsStatusElement = UIUtils.appendBlock(requestsPanel, "Status");
  
  var seeActiveRequestsElement = UIUtils.appendBlock(requestsPanel, "SeeActiveRequests");
  var activeRequestsLinkId = UIUtils.createId(seeActiveRequestsElement, "Link");
  UIUtils.get$(seeActiveRequestsElement).html("You can always find all your active requests in the <a href='#' id='" + activeRequestsLinkId + "'>Active Requests</a> section.");
  UIUtils.setClickListener(activeRequestsLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  
  this._requestsPanelRequests = UIUtils.appendBlock(requestsPanel, "Requests");

  /*
  var inquiryPanel = root.appendChild(UIUtils.createBlock("HomePage-InquiryPanel"));
  inquiryPanel.appendChild(UIUtils.createBlock("HomePage-InquiryPanel-Status"));
  $("#HomePage-InquiryPanel-Status").html("Checking if you have any new inquiries...");
  */
  
  
  this._statistics = new AbstractRequestPage.OutgoingRequestStatistics(Backend.Request.STATUS_ACTIVE, Backend.Response.STATUS_UNREAD, function() {
    var info = this._statistics.getStatistics();
    
    var countRequests = 0;
    var countResponses = 0; 
    for (var id in info) {
      if (info[id] != null) {
        countRequests++;
        countResponses += info[id];
      }
    }
    
    UIUtils.get$(this._requestsStatusElement).html("You have " + countResponses + " unviewed responses for " + countRequests + " your requests");
  }.bind(this));
}

HomePage.prototype.onShow = function(root) {
  UIUtils.get$(this._requestsStatusElement).html("Checking if you have any new responses to your requests...");
  this._statistics.start();

  this._requestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        returnPageId: MenuPage.prototype.HOME_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds()
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: false,
    maxResponses: 0,
    responseAreaMaxHeight: -1,
    requestInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE | AbstractRequestPage.OutgoingRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITH_RESPONSES,
    responseInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      }.bind(this)
    }
  });
  
  this._requestList.append(this._requestsPanelRequests);
}

HomePage.prototype.onHide = function() {
  this._requestList.remove();
  this._statistics.stop();
}


