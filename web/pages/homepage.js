HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, "HomePage");
  
  this._outgoingRequestsPanelRequests = null;
  this._outgoingRequestsStatusElement = null;
  this._outgoingStatistics = null;
  
  this._incomingRequestsPanelRequests = null;
  this._incomingRequestsStatusElement = null;
  this._incomingStatistics = null;
  

  this._outgoingRequestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        returnPageId: MenuPage.prototype.HOME_ITEM_ID,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE)
      }

      Application.getMenuPage().showPage(MenuPage.prototype.REQUEST_DETAILS_PAGE_ID, paramBundle);
    },
    requestEditable: false,
    showFullContent: false,
    showResponseCount: true,
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
  
  this._incomingRequestList = new AbstractRequestPage.IncomingRequestList({
    requestClickListener: function(requestId) {
      Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
    },
    requestEditable: false,
    showFullContent: false,
    maxResponses: 0,
    responseAreaMaxHeight: -1,
    requestInclusionPolicy: AbstractRequestPage.IncomingRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE | AbstractRequestPage.IncomingRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITHOUT_RESPONSES,
    //responseInclusionPolicy: AbstractRequestPage.OutgoingRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_ALL,
    updateListener: {
      updateStarted: function() {
        Application.showSpinningWheel();
      },
      updateFinished: function() {
        Application.hideSpinningWheel();
      }.bind(this)
    }
  });
});

HomePage.prototype.definePageContent = function(root) {
  var generalPanel = UIUtils.appendBlock(root, "GeneralPanel");
  UIUtils.get$(generalPanel).html("Welcome, " + Backend.getUserProfile().name + ".");

  var outgoingRequestsPanel = UIUtils.appendBlock(root, "OutgoingRequestPanel");
  this._outgoingRequestsStatusElement = UIUtils.appendBlock(outgoingRequestsPanel, "Status");
  
  var seeActiveOutgoingRequestsElement = UIUtils.appendBlock(outgoingRequestsPanel, "SeeActiveRequests");
  var activeOutgoingRequestsLinkId = UIUtils.createId(seeActiveOutgoingRequestsElement, "Link");
  UIUtils.get$(seeActiveOutgoingRequestsElement).html("You can always find all your active requests in the <a href='#' id='" + activeOutgoingRequestsLinkId + "'>Active Requests</a> section.");
  UIUtils.setClickListener(activeOutgoingRequestsLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });
  
  this._outgoingRequestsPanelRequests = UIUtils.appendBlock(outgoingRequestsPanel, "Requests");

  this._outgoingStatistics = new AbstractRequestPage.OutgoingRequestStatistics(Backend.Request.STATUS_ACTIVE, Backend.Response.STATUS_UNREAD, function() {
    var info = this._outgoingStatistics.getStatistics();

    var countRequests = 0;
    var countResponses = 0; 
    for (var id in info) {
      if (info[id] != null && info[id] != 0) {
        countRequests++;
        countResponses += info[id];
      }
    }
    
    UIUtils.get$(this._outgoingRequestsStatusElement).html("You have " + countResponses + " unviewed responses for " + countRequests + " your requests");
  }.bind(this));
  
  
  
  var incomingRequestsPanel = UIUtils.appendBlock(root, "IncomingRequestPanel");
  this._incomingRequestsStatusElement = UIUtils.appendBlock(incomingRequestsPanel, "Status");
  
  var seeActiveIncomingRequestsElement = UIUtils.appendBlock(incomingRequestsPanel, "SeeActiveRequests");
  var activeIncomingRequestsLinkId = UIUtils.createId(seeActiveIncomingRequestsElement, "Link");
  UIUtils.get$(seeActiveIncomingRequestsElement).html("See all incoming inquiries in <a href='#' id='" + activeIncomingRequestsLinkId + "'>Active Inquiries</a> section.");
  UIUtils.setClickListener(activeIncomingRequestsLinkId, function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
  });
  
  this._incomingRequestsPanelRequests = UIUtils.appendBlock(incomingRequestsPanel, "Requests");
  
  this._incomingStatistics = new AbstractRequestPage.IncomingRequestStatistics(Backend.Request.STATUS_ACTIVE, null, function() {
    var info = this._incomingStatistics.getStatistics();

    var countRequests = 0;
    for (var id in info) {
      if (info[id] != null && info[id] == 0) {
        countRequests++;
      }
    }
    
    UIUtils.get$(this._incomingRequestsStatusElement).html("You have " + countRequests + " unanswered requests");
  }.bind(this));
}

HomePage.prototype.onShow = function(root) {
  UIUtils.get$(this._outgoingRequestsStatusElement).html("Checking if you have any new responses to your requests...");
  UIUtils.get$(this._incomingRequestsStatusElement).html("Checking if you have any new requests for your attention...");
  
  this._outgoingStatistics.start();
  this._incomingStatistics.start();

  this._outgoingRequestList.append(this._outgoingRequestsPanelRequests);
  this._incomingRequestList.append(this._incomingRequestsPanelRequests);
}

HomePage.prototype.onHide = function() {
  this._outgoingRequestList.remove();
  this._outgoingStatistics.stop();
  
  this._incomingRequestList.remove();
  this._incomingStatistics.stop();
}


