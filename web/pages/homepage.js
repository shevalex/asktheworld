HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, HomePage.name);

  
  this._outgoingRequestsView;
  this._incomingRequestsView;
  this._outgoingRequestsLabel;
  this._incomingRequestsLabel;
  this._noIncomingRequestsNote;
  this._noOutgoingRequestsNote;
  
  
  this._cacheChangeListener;
});


HomePage.prototype.definePageContent = function(root) {
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var incomingRequestPanel = UIUtils.appendBlock(contentPanel, "IncomingRequestsPanel");
  this._incomingRequestsLabel = UIUtils.appendLabel(incomingRequestPanel, "Title");
  this._noIncomingRequestsNote = UIUtils.appendExplanationPad(incomingRequestPanel, "NoRequestsNote", null, this.getLocale().NoIncomingRequestsNote);
  
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
  this._outgoingRequestsLabel = UIUtils.appendLabel(outgoingRequestPanel, "Title");
  
  var newRequestLinkId = UIUtils.createId(outgoingRequestPanel, "NewRequestLink");
  this._noOutgoingRequestsNote = UIUtils.appendExplanationPad(outgoingRequestPanel, "NoRequestsNote", null, this.getLocale().NoOutgoingRequestsNoteProvider(newRequestLinkId));
  UIUtils.setClickListener(newRequestLinkId, function() {
    Application.showMenuPage(NewRequestPage.name);
  });

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
      this._updateOutgoingRequests();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
      this._updateIncomingRequests();
    }
  }.bind(this);
}

HomePage.prototype.onShow = function(root) {
  this._updateIncomingRequests();
  this._updateOutgoingRequests();
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

HomePage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}


HomePage.prototype._updateOutgoingRequests = function() {
  var outgoingRequestIds = this._getOutgoingRequestIds();
  if (outgoingRequestIds == null) {
    this._outgoingRequestsLabel.innerHTML = this.getLocale().UpdatingOutgoingRequestsTitle;
    this._noOutgoingRequestsNote.style.display = "none";
  } else if (outgoingRequestIds.length == 0) {
    this._outgoingRequestsLabel.innerHTML = this.getLocale().NoOutgoingRequestsTitle;
    this._noOutgoingRequestsNote.style.display = "block";
  } else {
    this._outgoingRequestsLabel.innerHTML = this.getLocale().OutgoingRequestsTitle;
    this._noOutgoingRequestsNote.style.display = "none";
  }
  this._outgoingRequestsView.setRequestIds(outgoingRequestIds);
}

HomePage.prototype._updateIncomingRequests = function() {
  var incomingRequestIds = this._getIncomingRequestIds();
  if (incomingRequestIds == null) {
    this._incomingRequestsLabel.innerHTML = this.getLocale().UpdatingIncomingRequestsTitle;
    this._noIncomingRequestsNote.style.display = "none";
  } else if (incomingRequestIds.length == 0) {
    this._incomingRequestsLabel.innerHTML = this.getLocale().NoIncomingRequestsTitle;
    this._noIncomingRequestsNote.style.display = "block";
  } else {
    this._incomingRequestsLabel.innerHTML = this.getLocale().IncomingRequestsTitle;
    this._noIncomingRequestsNote.style.display = "none";
  }
  this._incomingRequestsView.setRequestIds(incomingRequestIds);
}

HomePage.prototype._getOutgoingRequestIds = function() {
  var allActiveRequestIds = Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
  if (allActiveRequestIds == null) {
    return null;
  }
  
  var ready = true;
  var requestIds = [];
  for (var i in allActiveRequestIds) {
    var responseIds = Backend.getIncomingResponseIds(allActiveRequestIds[i], Backend.Response.STATUS_UNREAD);
    if (responseIds == null) {
      ready = false;
    } else if (responseIds.length > 0) {
      requestIds.push(allActiveRequestIds[i]);
    }
  }
  
  return ready ? requestIds : null;
}

HomePage.prototype._getIncomingRequestIds = function() {
  var allActiveRequestIds = Backend.getIncomingRequestIds(Backend.Request.STATUS_ACTIVE);
  if (allActiveRequestIds == null) {
    return null;
  }
  
  var ready = true;
  var requestIds = [];
  for (var i in allActiveRequestIds) {
    var responseIds = Backend.getOutgoingResponseIds(allActiveRequestIds[i]);
    if (responseIds == null) {
      ready = false;
    } else if (responseIds.length > 0) {
      requestIds.push(allActiveRequestIds[i]);
    }
  }

  return ready ? requestIds : null;
}