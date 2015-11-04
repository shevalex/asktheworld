HomePage = ClassUtils.defineClass(AbstractDataPage, function HomePage() {
  AbstractDataPage.call(this, HomePage.name);

  
  this._outgoingRequestsView;
  this._incomingRequestsView;
  this._outgoingRequestsLabel;
  this._incomingRequestsLabel;
  this._noIncomingRequestsNote;
  this._noOutgoingRequestsNote;
  
  this._cacheChangeListener;
  this._refreshTimer;
  
  this._outgoingRequestIds;
  this._incomingRequestIds;
});


HomePage.prototype.definePageContent = function(root) {
  AbstractDataPage.prototype.definePageContent.call(this, root);
  
  var contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  var incomingRequestPanel = UIUtils.appendBlock(contentPanel, "IncomingRequestsPanel");
  this._incomingRequestsLabel = UIUtils.appendLabel(incomingRequestPanel, "Title");
  this._noIncomingRequestsNote = UIUtils.appendExplanationPad(incomingRequestPanel, "NoRequestsNote", null, this.getLocale().NoIncomingRequestsNote);
  
  this._incomingRequestsView = new AbstractRequestPage.IncomingRequestsView("RequestView", {
    clickListener: function(requestId) {
      var paramBundle = {
        type: "incoming",
        returnPageId: HomePage.name,
        requestId: requestId,
        requestStatus: Backend.Request.STATUS_ACTIVE,
        otherRequestIds: page._getIncomingRequestIds().join(",")
      }

      Application.showMenuPage(IncomingRequestDetailsPage.name, paramBundle);
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
        type: "outgoing",
        returnPageId: HomePage.name,
        requestId: requestId,
        otherRequestIds: page._getOutgoingRequestIds().join(",")
      }

      Application.showMenuPage(OutgoingRequestDetailsPage.name, paramBundle);
    }
  });
  this._outgoingRequestsView.append(outgoingRequestPanel);
  
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED) {
      if (this.isShown()) {
        this._updateOutgoingRequests();
      } else {
        var requests = this._getOutgoingRequestIds();
        if (requests != null && requests.length > 0) {
          if (this._outgoingRequestIds == null || this._outgoingRequestIds.length < requests.length) {
            Application.showMenuMarker(HomePage.name);
          }
          this._outgoingRequestIds = requests;
        }
      }
    } else if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED || event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED) {
      if (this.isShown()) {
        this._updateIncomingRequests();
      } else {
        var requests = this._getIncomingRequestIds();
        if (requests != null && requests.length > 0) {
          if (this._incomingRequestIds == null || this._incomingRequestIds.length < requests.length) {
            Application.showMenuMarker(HomePage.name);
          }
          this._incomingRequestIds = requests;
        }
      }
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
}

HomePage.prototype.onShow = function(root) {
  AbstractDataPage.prototype.onShow.call(this, root);
  
  this._incomingRequestsLabel.innerHTML = this.getLocale().UpdatingIncomingRequestsTitle;
  this._noIncomingRequestsNote.style.display = "none";
  this._updateIncomingRequests();
  
  this._outgoingRequestsLabel.innerHTML = this.getLocale().UpdatingOutgoingRequestsTitle;
  this._noOutgoingRequestsNote.style.display = "none";
  this._updateOutgoingRequests();
  
  this._refreshTimer = setInterval(function() {
    this._incomingRequestsView.refresh();
  }.bind(this), 60000);
}

HomePage.prototype.onHide = function() {
  AbstractDataPage.prototype.onHide.call(this);
  
  clearInterval(this._refreshTimer);
  
  this._outgoingRequestsView.setObjectIds([]);
  this._incomingRequestsView.setObjectIds([]);
}

HomePage.prototype.onDestroy = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

HomePage.prototype._updateOutgoingRequests = function() {
  var outgoingRequestIds = this._getOutgoingRequestIds();
  if (outgoingRequestIds == null) {
    return;
  }
    
  if (outgoingRequestIds.length == 0) {
    this._outgoingRequestsLabel.innerHTML = this.getLocale().NoOutgoingRequestsTitle;
    this._noOutgoingRequestsNote.style.display = "block";
  } else {
    this._outgoingRequestsLabel.innerHTML = this.getLocale().OutgoingRequestsTitle;
    this._noOutgoingRequestsNote.style.display = "none";
  }
  this._outgoingRequestsView.setObjectIds(outgoingRequestIds);
}

HomePage.prototype._updateIncomingRequests = function() {
  var incomingRequestIds = this._getIncomingRequestIds();
  if (incomingRequestIds == null) {
    return;
  }
  
  if (incomingRequestIds.length == 0) {
    this._incomingRequestsLabel.innerHTML = this.getLocale().NoIncomingRequestsTitle;
    this._noIncomingRequestsNote.style.display = "block";
  } else {
    this._incomingRequestsLabel.innerHTML = this.getLocale().IncomingRequestsTitle;
    this._noIncomingRequestsNote.style.display = "none";
  }
  this._incomingRequestsView.setObjectIds(incomingRequestIds);
}

HomePage.prototype._getOutgoingRequestIds = function() {
  var allActiveRequestIds = Backend.getOutgoingRequestIds(Backend.Request.STATUS_ACTIVE);
  if (allActiveRequestIds == null) {
    return null;
  }
  
  var ready = true;
  var requestIds = [];
  for (var i in allActiveRequestIds) {
    var responseIds = Backend.getIncomingResponseIds(allActiveRequestIds[i], Backend.Response.STATUS_UNVIEWED);
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
    } else if (responseIds.length == 0) {
      requestIds.push(allActiveRequestIds[i]);
    }
  }

  return ready ? requestIds : null;
}