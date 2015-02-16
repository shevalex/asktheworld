HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, HomePage.name);
  
  this._outgoingRequestsPanelRequests = null;
  this._outgoingRequestsStatusElement = null;
  this._outgoingStatistics = null;
  
  this._incomingRequestsPanelRequests = null;
  this._incomingRequestsStatusElement = null;
  this._incomingStatistics = null;
  

  this._outgoingRequestList = new AbstractRequestPage.OutgoingRequestList({
    requestClickListener: function(requestId) {
      var paramBundle = {
        returnPageId: HomePage.name,
        requestId: requestId,
        otherRequestIds: Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE)
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
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
      Application.showMenuPage(ActiveIncomingRequestsPage.name);
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
  generalPanel.innerHTML = this.getLocale().WelcomeProvider(Backend.getUserProfile().name);

  var outgoingRequestsPanel = UIUtils.appendBlock(root, "OutgoingRequestPanel");
  this._outgoingRequestsStatusElement = UIUtils.appendBlock(outgoingRequestsPanel, "Status");
  
  var seeActiveOutgoingRequestsElement = UIUtils.appendBlock(outgoingRequestsPanel, "SeeActiveRequests");
  var activeOutgoingRequestsLinkId = UIUtils.createId(seeActiveOutgoingRequestsElement, "Link");
  seeActiveOutgoingRequestsElement.innerHTML = this.getLocale().ActiveOutgoingRequestsLinkProvider(activeOutgoingRequestsLinkId);
  UIUtils.setClickListener(activeOutgoingRequestsLinkId, function() {
    Application.showMenuPage(ActiveOutgoingRequestsPage.name);
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
    
    this._outgoingRequestsStatusElement.innerHTML = this.getLocale().OutgoingRequestsStatisticProvider(countRequests, countResponses);
  }.bind(this));
  
  
  
  var incomingRequestsPanel = UIUtils.appendBlock(root, "IncomingRequestPanel");
  this._incomingRequestsStatusElement = UIUtils.appendBlock(incomingRequestsPanel, "Status");
  
  var seeActiveIncomingRequestsElement = UIUtils.appendBlock(incomingRequestsPanel, "SeeActiveRequests");
  var activeIncomingRequestsLinkId = UIUtils.createId(seeActiveIncomingRequestsElement, "Link");
  seeActiveIncomingRequestsElement.innerHTML = this.getLocale().ActiveIncomingRequestsLinkProvider(activeIncomingRequestsLinkId);
  UIUtils.setClickListener(activeIncomingRequestsLinkId, function() {
    Application.showMenuPage(ActiveIncomingRequestsPage.name);
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
    
    this._incomingRequestsStatusElement.innerHTML = this.getLocale().IncomingRequestsStatisticProvider(countRequests);
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


