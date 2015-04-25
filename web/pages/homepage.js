HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, HomePage.name);

  
  this._outgoingRequestsView;
  this._incomingRequestsView;
  
  this._cacheChangeListener;
});


HomePage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var incomingRequestPanel = UIUtils.appendBlock(contentPanel, "IncomingRequestsPanel");
  UIUtils.appendLabel(incomingRequestPanel, "Title", this.getLocale().IncomingRequestsTitle);
  
  this._incomingRequestsView = new AbstractRequestPage.IncomingRequestsView("RequestView", {
    clickListener: function(requestId) {
      var paramBundle = {
        incoming: true,
        returnPageId: HomePage.name,
        requestId: requestId,
        otherRequestIds: page._getIncomingRequestIds().join(",")
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
    }
  });
  this._incomingRequestsView.append(incomingRequestPanel);
  
  
  var outgoingRequestPanel = UIUtils.appendBlock(contentPanel, "OutgoingRequestsPanel");
  UIUtils.appendLabel(outgoingRequestPanel, "Title", this.getLocale().OutgoingRequestsTitle);
  
  var page = this;
  this._outgoingRequestsView = new AbstractRequestPage.OutgoingRequestsView("RequestView", {
    clickListener: function(requestId) {
      var paramBundle = {
        incoming: false,
        returnPageId: HomePage.name,
        requestId: requestId,
        otherRequestIds: page._getOutgoingRequestIds().join(",")
      }

      Application.showMenuPage(RequestDetailsPage.name, paramBundle);
    }
  });
  this._outgoingRequestsView.append(outgoingRequestPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED) {
      this._outgoingRequestsView.setRequestIds(this._getOutgoingRequestIds());
    } else if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
      this._incomingRequestsView.setRequestIds(this._getIncomingRequestIds());
    }
  }.bind(this);
}

HomePage.prototype.onShow = function(root) {
  this._outgoingRequestsView.setRequestIds(this._getOutgoingRequestIds());
  this._incomingRequestsView.setRequestIds(this._getIncomingRequestIds());
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

HomePage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}


HomePage.prototype._getOutgoingRequestIds = function() {
  var allActiveRequestIds = Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
  var requestIds = [];
  for (var i in allActiveRequestIds) {
    var responseIds = Backend.getIncomingResponseIds(allActiveRequestIds[i], Backend.Response.STATUS_UNREAD);
    if (responseIds != null && responseIds.length > 0) {
      requestIds.push(allActiveRequestIds[i]);
    }
  }
  
  return requestIds;
}

HomePage.prototype._getIncomingRequestIds = function() {
  var allActiveRequestIds = Backend.getIncomingRequestIds(Backend.Request.STATUS_ACTIVE);
  var requestIds = [];
  for (var i in allActiveRequestIds) {
    var responseIds = Backend.getOutgoingResponseIds(allActiveRequestIds[i]);
    if (responseIds != null && responseIds.length == 0) {
      requestIds.push(allActiveRequestIds[i]);
    }
  }

  return requestIds;
}