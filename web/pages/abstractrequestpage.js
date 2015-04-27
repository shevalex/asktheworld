AbstractRequestPage = ClassUtils.defineClass(AbstractPage, function AbstractRequestPage(pageId) {
  AbstractPage.call(this, pageId);
});



AbstractRequestPage._AbstractRequestItem = ClassUtils.defineClass(Object, function _AbstractRequestItem(requestId, baseCssClass, settings) {
  this._requestId = requestId;
  this._settings = settings || {};
  this._baseCssClass = baseCssClass;
  
  this._container = null;
  
  this._cacheChangeListener = function(event) {
    if (event.requestId == this._requestId
        && (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED || Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED)) {

      var request = Backend.getRequest(this._requestId);
      if (request != null) {
        this._fill();
      }
    }
  }.bind(this);
});

AbstractRequestPage._AbstractRequestItem.prototype.append = function(root) {
  if (this._container != null) {
    throw "Item " + this._requestId + " is already added";
  }
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  this._container = UIUtils.appendBlock(root, this._requestId);
  UIUtils.addClass(this._container, this._baseCssClass);
  
  if (this._settings.clickListener) {
    UIUtils.setClickListener(this._container, this._settings.clickListener.bind(this, this._requestId));
  }

  var request = Backend.getRequest(this._requestId);
  if (request != null) {
    this._fill();
  }
}

AbstractRequestPage._AbstractRequestItem.prototype.remove = function() {
  if (this._container == null) {
    throw "Item " + this._requestId + " cannot be removed since it was never added";
  }
  
  UIUtils.get$(this._container).remove();
  this._container = null;
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AbstractRequestPage._AbstractRequestItem.prototype._fill = function() {
  throw "Inimplemented";
}


// settings.fullRecord;
AbstractRequestPage.OutgoingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestItem, function OutgoingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractRequestItem.call(this, requestId, settings.fullRecord ? "full-outgoing-request-container" : "outgoing-request-container", settings);
});

AbstractRequestPage.OutgoingRequestItem.prototype._fill = function() {
  UIUtils.get$(this._container).empty();
  
  var request = Backend.getRequest(this._requestId);
  
  var dateLabel = UIUtils.appendLabel(this._container, "DateLabel", TimeUtils.getDateTimeSrting(request.time));
  UIUtils.addClass(dateLabel, "request-date-label");
  
  var targetLabel = UIUtils.appendLabel(this._container, "TargetLabel", I18n.getPageLocale("AbstractRequestPage").TargetLabel + " " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender));
  UIUtils.addClass(targetLabel, "request-target-label");
  
  var unreadResponses = Backend.getIncomingResponseIds(this._requestId, Backend.Response.STATUS_READ);
  var allResponses = Backend.getIncomingResponseIds(this._requestId);
  var counterText = null;
  if (allResponses != null && unreadResponses != null) {
    counterText = "<b>" + unreadResponses.length + "</b>/" + allResponses.length;
  } else {
    counterText = "--";
  }
  var counterLabel = UIUtils.appendLabel(this._container, "CounterLabel", counterText);
  UIUtils.addClass(counterLabel, "request-responsecounter-label");
  
  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  UIUtils.addClass(requestText, "request-text");
  if (this._settings.fullRecord) {
    requestText.innerHTML = request.text;
  } else {
    requestText.innerHTML = UIUtils.getOneLine(request.text);
  }

  var expertiseLabel = UIUtils.appendLabel(this._container, "ExpertiseLabel", Application.Configuration.toExpertiseString(request.expertise_category));
  UIUtils.addClass(expertiseLabel, "request-expertise-label");
}


AbstractRequestPage.IncomingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestItem, function IncomingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractRequestItem.call(this, requestId, settings.fullRecord ? "full-incoming-request-container" : "incoming-request-container", settings);
});

AbstractRequestPage.IncomingRequestItem.prototype._fill = function() {
  UIUtils.get$(this._container).empty();
  
  var request = Backend.getRequest(this._requestId);
  
  var dateLabel = UIUtils.appendLabel(this._container, "DateLabel", TimeUtils.getDateTimeSrting(request.time));
  UIUtils.addClass(dateLabel, "request-date-label");
  
  var timeToLive = (request.time + request.response_wait_time * 1000 * 60 * 60) - Date.now();
  var numOfDaysLeft = Math.floor(timeToLive / (1000 * 60 * 60 * 24));
  var numOfHoursLeft = Math.floor((timeToLive % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var numOfMinutesLeft = Math.floor((timeToLive % (1000 * 60 * 60)) / (1000 * 60));

  var expiresLabel = UIUtils.appendLabel(this._container, "ExpiresLabel", I18n.getPageLocale("AbstractRequestPage").ExpiresLabelProvider(numOfDaysLeft, numOfHoursLeft, numOfMinutesLeft));
  UIUtils.addClass(expiresLabel, "request-expires-label");
  
  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  UIUtils.addClass(requestText, "request-text");
  if (this._settings.fullRecord) {
    requestText.innerHTML = request.text;
  } else {
    requestText.innerHTML = UIUtils.getOneLine(request.text);
  }

  var expertiseLabel = UIUtils.appendLabel(this._container, "ExpertiseLabel", Application.Configuration.toExpertiseString(request.expertise_category));
  UIUtils.addClass(expertiseLabel, "request-expertise-label");
}



// settings.clickListener(requestId);

AbstractRequestPage._AbstractRequestsView = ClassUtils.defineClass(Object, function _AbstractRequestsView(viewId, requestClass, settings) {
  this._viewId = viewId;
  this._requestClass = requestClass;
  this._settings = settings || {};
  this._root = null;
  this._containerElement = null;
  this._requestIds = null;
  
  this._requestItems = [];
});

AbstractRequestPage._AbstractRequestsView.prototype.setRequestIds = function(requestIds) {
  this.clear();
  this._requestIds = requestIds;
  
  if (this._requestIds != null) {
    for (var index in requestIds) {
      var requestItem = new AbstractRequestPage[this._requestClass](requestIds[index], this._settings);
      this._requestItems.push(requestItem);

      if (this._containerElement != null) {
        this._requestItems[index].append(this._containerElement);
      }
    }
  }
}

AbstractRequestPage._AbstractRequestsView.prototype.append = function(root) {
  if (this._containerElement != null) {
    this.remove();
  }
  
  this._root = root;
  this._containerElement = UIUtils.appendBlock(this._root, this._viewId);
  UIUtils.addClass(this._containerElement, "request-view");
  
  this.setRequestIds(this._requestIds);
}

AbstractRequestPage._AbstractRequestsView.prototype.clear = function() {
  for (var index in this._requestItems) {
    this._requestItems[index].remove();
  }
  
  this._requestItems = [];
}

AbstractRequestPage._AbstractRequestsView.prototype.remove = function() {
  this.clear();
  UIUtils.get$(this._rootElement).remove();
}


AbstractRequestPage.OutgoingRequestsView = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsView, function OutgoingRequestsView(viewId, settings) {
  AbstractRequestPage._AbstractRequestsView.call(this, viewId, "OutgoingRequestItem", settings);
});

AbstractRequestPage.IncomingRequestsView = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsView, function IncomingRequestsView(viewId, settings) {
  AbstractRequestPage._AbstractRequestsView.call(this, viewId, "IncomingRequestItem", settings);
});



// settings.clickListener(requestId);
// settings.visibleItemCount;
// settings.hideWhenEmpty;
// settings.maxNumOfPageButtons
AbstractRequestPage._AbstractRequestsTable = ClassUtils.defineClass(Object, function _AbstractRequestsTable(tableId, requestView, settings) {
  this._tableId = tableId;
  this._requestsView = requestView;
  this._settings = settings || {};
  this._root = null;
  this._containerElement = null;

  this._visibleItemCount = this._settings.visibleItemCount || 10;
  this._maxNumOfPageButtons = this._settings.maxNumOfPageButtons || 5;
  
  this._currentPage = 0;
  this._beginIndex = 0;
  this._endIndex = 0;
  this._numOfPages = 0;
  
  this._statusLabel = null;
  this._previousButton = null;
  this._nextButton = null;
  
  this.setRequestIds(null);
});

AbstractRequestPage._AbstractRequestsTable.prototype.setRequestIds = function(requestIds) {
  this.clear();
  this._requestIds = requestIds || [];
  
  if (this._containerElement != null) {
    if (this._requestIds.length == 0 && this._settings.hideWhenEmpty) {
      this._containerElement.style.display = "none";
    } else {
      this._containerElement.style.display = "block";
    }
  }

  this._numOfPages = Math.ceil(this._requestIds.length / this._visibleItemCount);
  
  this.setCurrentPage(0);
}

AbstractRequestPage._AbstractRequestsTable.prototype.append = function(root) {
  if (this._containerElement != null) {
    this.remove();
  }
  
  this._root = root;
  this._containerElement = UIUtils.appendBlock(this._root, this._tableId);
  UIUtils.addClass(this._containerElement, "request-table");

  this._appendTableHeader();
  this._requestsView.append(this._containerElement);
  this._appendTableFooter();
  
  this.setRequestIds(this._requestIds);
}

AbstractRequestPage._AbstractRequestsTable.prototype.clear = function() {
  this._requestsView.clear();
  this._requestItems = [];
  this._currentPage = 0;
}

AbstractRequestPage._AbstractRequestsTable.prototype.remove = function() {
  this.clear();
  UIUtils.get$(this._rootElement).remove();
}

AbstractRequestPage._AbstractRequestsTable.prototype.getCurrentPage = function() {
  return this._currentPage;
}

AbstractRequestPage._AbstractRequestsTable.prototype.setCurrentPage = function(currentPage) {
  this._currentPage = currentPage;
  
  this._beginIndex = this._currentPage * this._visibleItemCount;
  this._endIndex = this._beginIndex + this._visibleItemCount < this._requestIds.length ? this._beginIndex + this._visibleItemCount : this._requestIds.length;

  this._requestsView.setRequestIds(this._requestIds.slice(this._beginIndex, this._endIndex));
  
  if (this._statusLabel != null) {
    this._statusLabel.innerHTML = I18n.getPageLocale("AbstractRequestPage").TableStatusLabelProvider(this._beginIndex + 1, this._endIndex, this._requestIds.length);
    
    this._updateTableControl();
  }
}

AbstractRequestPage._AbstractRequestsTable.prototype._appendTableHeader = function() {
}

AbstractRequestPage._AbstractRequestsTable.prototype._appendTableFooter = function() {
  var footer = UIUtils.appendBlock(this._containerElement, "Footer");
  UIUtils.addClass(footer, "request-table-footer");
  
  this._statusLabel = UIUtils.appendLabel(footer, "StatusLabel");
  UIUtils.addClass(this._statusLabel, "request-table-statuslabel");
  
  
  var tableControlPanel = UIUtils.appendBlock(footer, "TableControlPanel");
  UIUtils.addClass(tableControlPanel, "request-table-tablecontrolpanel");
  
  this._previousButton = UIUtils.appendButton(tableControlPanel, "PreviousButton", I18n.getPageLocale("AbstractRequestPage").TablePreviousButton);
  UIUtils.addClass(this._previousButton, "request-table-previousbutton");
  UIUtils.setClickListener(this._previousButton, function() {
    if (this._currentPage > 0) {
      this.setCurrentPage(this._currentPage - 1);
    }
  }.bind(this));

  this._pageButtonsPanel = UIUtils.appendBlock(tableControlPanel, "PageButtonsPanel");
  UIUtils.addClass(this._pageButtonsPanel, "request-table-pagebuttonpanel");
  
  this._nextButton = UIUtils.appendButton(tableControlPanel, "NextButton", I18n.getPageLocale("AbstractRequestPage").TableNextButton);
  UIUtils.addClass(this._nextButton, "request-table-nextbutton");
  UIUtils.setClickListener(this._nextButton, function() {
    if (this._currentPage + 1 < this._numOfPages) {
      this.setCurrentPage(this._currentPage + 1);
    }
  }.bind(this));
}

AbstractRequestPage._AbstractRequestsTable.prototype._updateTableControl = function() {
  UIUtils.setEnabled(this._previousButton, this._currentPage > 0);
  UIUtils.setEnabled(this._nextButton, this._currentPage + 1 < this._numOfPages);
  
  UIUtils.get$(this._pageButtonsPanel).empty();
  if (this._numOfPages == 0 || this._maxNumOfPageButtons <= 0) {
    return;
  }
  
  var startPage;
  var endPage;
  if (this._numOfPages <= this._maxNumOfPageButtons) {
    startPage = 1;
    endPage = this._numOfPages;
  } else {
    startPage = Math.max(this._currentPage + 1 - Math.floor(this._maxNumOfPageButtons / 2), 1);
    endPage = Math.min(startPage + this._maxNumOfPageButtons - 1, this._numOfPages);
  }
  
  for (var i = startPage; i <= endPage; i++) {
    var pageButton = UIUtils.appendButton(this._pageButtonsPanel, "PageButton" + i, i);
    UIUtils.addClass(pageButton, "request-table-pagebutton");
    if (i - 1 == this._currentPage) {
      UIUtils.setEnabled(pageButton, false);
    }
    UIUtils.setClickListener(pageButton, function(pageNum) {
      this.setCurrentPage(pageNum);
    }.bind(this, i - 1));
  }
}


AbstractRequestPage.OutgoingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function OutgoingRequestsTable(tableId, settings) {
  var requestView = new AbstractRequestPage.OutgoingRequestsView(tableId + "-RequestsView", settings);
  AbstractRequestPage._AbstractRequestsTable.call(this, tableId, requestView, settings);
});

AbstractRequestPage.IncomingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function IncomingRequestsTable(tableId, settings) {
  var requestView = new AbstractRequestPage.IncomingRequestsView(tableId + "-RequestsView", settings);
  AbstractRequestPage._AbstractRequestsTable.call(this, tableId, requestView, settings);
});









// THIS IS THE SECTION WHICH DEFINES RequestTable element

/*
 * settings.requestStatus
 * settings.selectionObserver
 * settings.clickObserver
 * settings.updateListener
 */
/*
AbstractRequestPage._AbstractRequestsTable = ClassUtils.defineClass(Object, function _AbstractRequestsTable(settings) {
  this._settings = settings;
  this._cacheChangeListener = null;
  this._cacheRowListeners = {};
  this._rootContainer = null;
  this._dataTable = null;
  this._state = null;
});

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRequests = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getResponses = function(requestId) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getColumns = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestsTable.prototype._getRowData = function(requestId, request) {
  throw "Not implemented";
}

AbstractRequestPage._AbstractRequestsTable.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, "TableContainer");

  var appendTableElement  = function() {
    var requestIds = this._getRequests();
    if (requestIds != null) {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateFinished();
      }
      this._dataTable = this.__appendTableElement();
    } else {
      if (this._settings.updateListener != null) {
        this._settings.updateListener.updateStarted();
      }
    }
  }.bind(this);
  
  this._cacheChangeListener = function(event) {
    if (event.type == this._getRequestIdsChangeEventType()) {
      UIUtils.emptyContainer(this._rootContainer);
      this._cacheRowListeners = {};
      
      appendTableElement();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED
               || event.type == this._getResponseIdsChangeEventType()) {
      
      for (var id in this._cacheRowListeners) {
        if (event.requestId == null || id == event.requestId) {
          this._cacheRowListeners[id]();
        }
      }
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  appendTableElement();
}

AbstractRequestPage._AbstractRequestsTable.prototype.save = function() {
  this._state = {};
  
  this._state.selectedIndex = this._dataTable.getSelectedRow();
  this._state.search = this._dataTable.search();
  this._state.order = this._dataTable.order();
  this._state.page = this._dataTable.page();
}

AbstractRequestPage._AbstractRequestsTable.prototype.restore = function() {
  if (this._state == null) {
    return;
  }
  
  this._dataTable.search(this._state.search);
  this._dataTable.order(this._state.order);
  this._dataTable.page(this._state.page);
  this._dataTable.setSelectedRow(this._state.selectedIndex);
  
  this._dataTable.draw(false);
}

AbstractRequestPage._AbstractRequestsTable.prototype.getSelectedRow = function() {
  return this._dataTable != null ? this._dataTable.getSelectedRow() : null;
}

AbstractRequestPage._AbstractRequestsTable.prototype.setSelectedRow = function(row) {
  if (this._dataTable != null) {
    this._dataTable.setSelectedRow(row);
  }
}

AbstractRequestPage._AbstractRequestsTable.prototype.remove = function() {
  this._cacheRowListeners = {};
  Backend.removeCacheChangeListener(this._cacheChangeListener);
  this._dataTable = null;
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage._AbstractRequestsTable.prototype.destroy = function() {
  this.remove();
}

AbstractRequestPage._AbstractRequestsTable.prototype.__appendTableElement = function() {
  var rowDataProvider = {
    getRows: function() {
      var rowData = [];
      var columns = this._getColumns();
      var requestIds = this._getRequests();
      for (var requestId in requestIds) {
        var defaultRowData = {rowId: requestIds[requestId], temporary: true};
        for (var index in columns) {
          defaultRowData[columns[index].data] = "--";
        }
        
        rowData.push(defaultRowData);
      }
      
      return rowData;
    }.bind(this),
    
    getRowData: function(rowId, callback) {
      var reportRowDataReady = function() {
        var request = Backend.getRequest(rowId);
        var responseIds = this._getResponses(rowId);
        if (request != null && responseIds != null) {
          if (this._settings.updateListener != null) {
            this._settings.updateListener.updateFinished();
          }
          
          callback(this._getRowData(rowId, request));
        } else {
          if (this._settings.updateListener != null) {
            this._settings.updateListener.updateStarted();
          }
        }
      }.bind(this);
      
      this._cacheRowListeners[rowId] = reportRowDataReady;
      reportRowDataReady();
    }.bind(this)
  }
  
  return UIUtils.appendFeaturedTable("Table", this._rootContainer, this._getColumns(), rowDataProvider, this._settings.selectionObserver, this._settings.clickObserver);
}



AbstractRequestPage.OutgoingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function OutgoingRequestsTable(settings) {
  AbstractRequestPage._AbstractRequestsTable.call(this, settings);
});

AbstractRequestPage.OutgoingRequestsTable.prototype._getRequests = function() {
  return Backend.getOutgoingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getResponses = function(requestId) {
  return Backend.getIncomingResponseIds(requestId);
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getColumns = function() {
  return [
    {title: I18n.getPageLocale("AbstractRequestPage").TableColumnDate, data: "time", type: "date", width: "100px"},
    {title: I18n.getPageLocale("AbstractRequestPage").TableColumnNumOfResponses, data: "numOfResponses", type: "num", width: "40px"},
    {title: I18n.getPageLocale("AbstractRequestPage").TableColumnOutgoingRequest, data: "text", type: "string"}
  ];
}

AbstractRequestPage.OutgoingRequestsTable.prototype._getRowData = function(requestId, request) {
  return {time: new Date(request.time).toDateString(), text: request.text, numOfResponses: this._getResponses(requestId).length};
}


AbstractRequestPage.IncomingRequestsTable = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsTable, function IncomingRequestsTable(settings) {
  AbstractRequestPage._AbstractRequestsTable.call(this, settings);
});

AbstractRequestPage.IncomingRequestsTable.prototype._getRequests = function() {
  return Backend.getIncomingRequestIds(this._settings.requestStatus);
}

AbstractRequestPage.IncomingRequestsTable.prototype._getResponses = function(requestId) {
  return Backend.getOutgoingResponseIds(requestId);
}

AbstractRequestPage.IncomingRequestsTable.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestsTable.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}

AbstractRequestPage.IncomingRequestsTable.prototype._getColumns = function() {
  return [
    {title: I18n.getPageLocale("AbstractRequestPage").TableColumnDate, data: "time", type: "date", width: "100px"},
    {title: I18n.getPageLocale("AbstractRequestPage").TableColumnIncomingRequest, data: "text", type: "string"}
  ];
}

AbstractRequestPage.IncomingRequestsTable.prototype._getRowData = function(requestId, request) {
  return {time: new Date(request.time).toDateString(), text: request.text};
}
*/






// THIS IS THE SECTION WHICH DEFINES RequestList element


/*
 * settings.requestIds
 * settings.requestClickListener
 * settings.requestEditable: boolean
 * settings.requestInclusionPolicy: mask
 * settings.responseInclusionPolicy: mask
 * settings.maxResponses: integer, -1 for unlimited
 * settings.responseAreaMaxHeight: "measure unit", -1 for unlimited
 * settings.showResponseCount: boolean
 * settings.showFullContent: boolean
 * settings.updateListener
 */
AbstractRequestPage._AbstractRequestList = ClassUtils.defineClass(Object, function _AbstractRequestList(settings) {
  this._settings = settings;
  
  this._rootContainer = null;
  
  this._cacheChangeListener = null;
  this._requestPanels = [];
});

AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ALL = 0;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITH_RESPONSES = 1;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITHOUT_RESPONSES = 2;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE = 4;
AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_INACTIVE = 8;

AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_ALL = 0;
AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_VIEWED = 1;
AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED = 2;


//abstract
AbstractRequestPage._AbstractRequestList.prototype._createRequestPanel = function(requestId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._createResponsePanel = function(requestList, requestId, responseId) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getRequestIds = function(status) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getResponseIds = function(requestId, status) {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented"
}

//abstract
AbstractRequestPage._AbstractRequestList.prototype._getResponseIdsChangeEventType = function() {
  throw "Not implemented"
}


AbstractRequestPage._AbstractRequestList.prototype.append = function(root) {
  this._rootContainer = UIUtils.appendBlock(root, "RequestResponsesContainer");
  UIUtils.addClass(this._rootContainer, "request-and-responses-container");

  if (this._settings.requestIds != null) {
    for (var index in this._settings.requestIds) {
      var requestPanel = this._createRequestPanel(this._settings.requestIds[index]);
      this._requestPanels.push(requestPanel);
      requestPanel.append(this._rootContainer);
    }
  } else {
    var status = this.__getRequestStatusFromSettings();
    
    var appendRequestPanels = function() {
      var requestIds = this._getRequestIds(status);

      if (requestIds != null) {
        this.__updateFinished();
        
        for (var index in requestIds) {
          var requestPanel = this._createRequestPanel(requestIds[index]);
          this._requestPanels.push(requestPanel);
          requestPanel.append(this._rootContainer);
        }
      } else {
        this.__updateStarted();
      }
    }.bind(this);
    
    this._cacheChangeListener = function(event) {
      if (event.type == this._getRequestIdsChangeEventType()) {
        for (var index in this._requestPanels) {
          this._requestPanels[index].remove();
        }

        appendRequestPanels();
      } 
    }.bind(this);

    Backend.addCacheChangeListener(this._cacheChangeListener);
    appendRequestPanels();
  }
    
  return this._rootContainer;
}

AbstractRequestPage._AbstractRequestList.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  for (var index in this._requestPanels) {
    this._requestPanels[index].remove();
  }
  
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage._AbstractRequestList.prototype.destroy = function() {
  this.remove();
}

AbstractRequestPage._AbstractRequestList.prototype.getInfo = function() {
  var requestIds = [];
  var responseIds = [];
  for (var requestIndex in this._requestPanels) {
    var requestPanel = this._requestPanels[requestIndex];
    requestIds.push(requestPanel._requestId);
    
    for (var responseIndex in requestPanel._responsePanels) {
      responseIds.push(requestPanel._responsePanels[responseIndex]._responseId);
    }
  }
  
  var info = {
    requestIds: requestIds,
    responseIds: responseIds 
  }
  
  return info;
}


AbstractRequestPage._AbstractRequestList.prototype.__getRequestStatusFromSettings = function() {
  var status = null;
  if ((this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_ACTIVE) != 0) {
    status = Backend.Request.STATUS_ACTIVE;
  } else if ((this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_STATUS_INACTIVE) != 0) {
    status = Backend.Request.STATUS_INACTIVE;
  }
  return status;
}

AbstractRequestPage._AbstractRequestList.prototype.__getResponseStatusFromSettings = function() {
  var status = null;
  if ((this._settings.responseInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_VIEWED) != 0) {
    status = Backend.Response.STATUS_READ;
  } else if ((this._settings.responseInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.RESPONSE_INCLUSION_POLICY_STATUS_UNVIEWED) != 0) {
    status = Backend.Response.STATUS_UNREAD;
  }
  return status;
}

AbstractRequestPage._AbstractRequestList.prototype.__updateStarted = function() {
  if (this._settings.updateListener != null && this._settings.updateListener.updateStarted != null) {
    this._settings.updateListener.updateStarted();
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__updateFinished = function() {
  if (this._settings.updateListener != null && this._settings.updateListener.updateFinished != null) {
    this._settings.updateListener.updateFinished();
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__updateFailed = function() {
  if (this._settings.updateListener != null && this._settings.updateListener.updateFailed != null) {
    this._settings.updateListener.updateFailed();
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__responseCreated = function(requestId, responseId) {
  if (this._settings.updateListener != null && this._settings.updateListener.responseCreated != null) {
    this._settings.updateListener.responseCreated(requestId, responseId);
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__responseUpdated = function(requestId, responseId) {
  if (this._settings.updateListener != null && this._settings.updateListener.responseUpdated != null) {
    this._settings.updateListener.responseUpdated(requestId, responseId);
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__requestUpdated = function(requestId) {
  if (this._settings.updateListener != null && this._settings.updateListener.requestUpdated != null) {
    this._settings.updateListener.requestUpdated(requestId);
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__requestDeleted = function(requestId) {
  if (this._settings.updateListener != null && this._settings.updateListener.requestDeleted != null) {
    this._settings.updateListener.requestDeleted(requestId);
  }
}
AbstractRequestPage._AbstractRequestList.prototype.__responseDeleted = function(requestId, responseId) {
  if (this._settings.updateListener != null && this._settings.updateListener.responseDeleted != null) {
    this._settings.updateListener.responseDeleted(requestId, responseId);
  }
}


AbstractRequestPage._AbstractRequestList.__appendAttachmentPanel = function(root, attachments) {
  if (attachments == null || attachments.length == 0) {
    return;
  }
  
  var attachmentsPanel = UIUtils.appendBlock(root, "Attachments");
  UIUtils.addClass(attachmentsPanel, "common-attachments");

  for (var index in attachments) {
    var attachment = attachments[index];
    
    var thumbnail = UIUtils.appendBlock(attachmentsPanel, "Attachment-" + index);
    UIUtils.addClass(thumbnail, "common-attachment-thumbnail");

    var thumbnailTitle = UIUtils.appendBlock(thumbnail, "Title");
    UIUtils.addClass(thumbnailTitle, "common-attachment-thumbnail-title");
    thumbnailTitle.innerHTML = attachment.name;
    
    if (FileUtils.isImage(attachment)) {
      thumbnail.style.backgroundImage = "url(" + attachment.data + ")";

      UIUtils.setClickListener(thumbnail, function(attachment) {
        var previewElement = UIUtils.appendBlock(attachmentsPanel, "Preview");
        UIUtils.addClass(previewElement, "common-attachment-preview");

        var previewCloser = UIUtils.appendBlock(previewElement, "X");
        UIUtils.addClass(previewCloser, "common-attachment-preview-x");

        UIUtils.removeIfClickedOutside(previewElement);

        UIUtils.setClickListener(previewCloser, function() {
          UIUtils.get$(previewElement).remove();
        });

        previewElement.style.backgroundImage = "url(" + attachment.data + ")";

        var previewTitle = UIUtils.appendBlock(previewElement, "Title");
        UIUtils.addClass(previewTitle, "common-attachment-preview-title");
        previewTitle.innerHTML = attachment.name;
      }.bind(this, attachment));
    } else {
      // TBD provide special icons for other file types
    }
  }
}





AbstractRequestPage._AbstractRequestList._AbstractRequestPanel = ClassUtils.defineClass(Object, function _AbstractRequestPanel(requestList, requestId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._requestList = requestList;
  this._rootContainer = null;
  this._responsePanels = [];
  this._cacheResponsesChangeListener = null;
  this._cacheRequestChangeListener = null;
  this._requestUpdateListeners = [];
});

//abstract
AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype._appendRequestElement = function(request) {
  throw "Not implemented"
}

AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, this._requestId);

  var requestOnlyWithResponses = (this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITH_RESPONSES) != 0;
  var requestOnlyWithoutResponses = (this._settings.requestInclusionPolicy & AbstractRequestPage._AbstractRequestList.prototype.REQUEST_INCLUSION_POLICY_ONLY_WITHOUT_RESPONSES) != 0;

  var status = this._requestList.__getRequestStatusFromSettings();
  
  var appendRequestElement = function() {
    var request = Backend.getRequest(this._requestId);
    if (request != null) {
      var responseIds = this._requestList._getResponseIds(this._requestId, this._requestList.__getResponseStatusFromSettings());
      if (responseIds != null) {
        this._requestList.__updateFinished();

        if ((!requestOnlyWithResponses && !requestOnlyWithoutResponses
             || requestOnlyWithResponses && responseIds.length > 0
             || requestOnlyWithoutResponses && responseIds.length == 0)
            && (status == null || status == request.status)) {
          
          this._appendRequestElement(request);

          if (this._settings.maxResponses != 0) {
            this.__appendResponses(this._requestId);
          }
        }
        return;
      }
    }
      
    this._requestList.__updateStarted();
  }.bind(this);
  
  this._cacheRequestChangeListener = function(event) {
    if ((event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED 
         && (event.requestId == null || event.requestId == this._requestId))
        || event.type == this._requestList._getResponseIdsChangeEventType() && event.requestId == this._requestId) {

      UIUtils.emptyContainer(this._rootContainer);
      appendRequestElement();
    } else if (this._settings.showResponseCount && event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED && event.requestId == this._requestId) {
      for (var index in this._requestUpdateListeners) {
        this._requestUpdateListeners[index]();
      }
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheRequestChangeListener);
  appendRequestElement();
}

AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.remove = function() {
  if (this._cacheRequestChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheRequestChangeListener);
  }
  if (this._cacheResponsesChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheResponsesChangeListener);
  }
  for (var index in this._responsePanels) {
    this._responsePanels[index].remove();
  }
  
  UIUtils.get$(this._rootContainer).remove();
}

AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.__appendResponses = function(requestId) {
  var responsesPanel = UIUtils.appendBlock(this._rootContainer, "ResponsesPanel");
  UIUtils.addClass(responsesPanel, "responses-container");
  if (this._settings.responseAreaMaxHeight != null && this._settings.responseAreaMaxHeight != -1) {
    responsesPanel.style.maxHeight = this._settings.responseAreaMaxHeight;
  }
  
  var status = this._requestList.__getResponseStatusFromSettings();

  var appendResponsePanels = function() {
    var responseIds = this._requestList._getResponseIds(requestId, status);
    if (responseIds != null) {
      this._requestList.__updateFinished();

      for (var responseCount = 0; responseCount < responseIds.length; responseCount++) {
        var responsePanel = null;
        if (this._settings.maxResponses == null || this._settings.maxResponses == -1 || responseCount < this._settings.maxResponses) {
          responsePanel = this._requestList._createResponsePanel(this._requestList, requestId, responseIds[responseCount]);
        } else if (responseCount == this._settings.maxResponses) {
          responsePanel = this._requestList._createResponsePanel(this._requestList, requestId, -1);
        } else {
          break;
        }

        this._responsePanels.push(responsePanel);
        responsePanel.append(responsesPanel);
      }
    } else {
      this._requestList.__updateStarted();
    }
  }.bind(this);

  this._cacheResponsesChangeListener = function(event) {
    if (event.type == this._requestList._getResponseIdsChangeEventType()
        && event.requestId == this._requestId) {

      for (var index in this._responsePanels) {
        this._responsePanels[index].remove();
      }

      appendResponsePanels();
    } 
  }.bind(this);

  Backend.addCacheChangeListener(this._cacheResponsesChangeListener);
  appendResponsePanels();
}


AbstractRequestPage._AbstractRequestList._AbstractResponsePanel = ClassUtils.defineClass(Object, function _AbstractResponsePanel(requestList, requestId, responseId, settings) {
  this._settings = settings;
  this._requestId = requestId;
  this._responseId = responseId;
  this._requestList = requestList;

  this._rootContainer = null;
  this._cacheChangeListener = null;
});


AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype.append = function(container) {
  this._rootContainer = UIUtils.appendBlock(container, this._responseId != -1 ? this._responseId : "andmore");

  var appendResponseElement = function() {
    if (this._responseId != -1) {
      var response = Backend.getResponse(this._requestId, this._responseId);
      if (response != null) {
        this._requestList.__updateFinished();

        this._appendResponseElement(response);
      } else {
        this._requestList.__updateStarted();
      }
    } else {
      this._appendMoreResponsesElement();
    }
  }.bind(this);
  
  this._cacheChangeListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED 
        && event.requestId == this._requestId 
        && (event.responseId == null || event.responseId == this._responseId)) {

      UIUtils.emptyContainer(this._rootContainer);
      appendResponseElement();
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  appendResponseElement();
}

AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype.remove = function() {
  if (this._cacheChangeListener != null) {
    Backend.removeCacheChangeListener(this._cacheChangeListener);
  }
  UIUtils.get$(this._rootContainer).remove();
}

//abstract
AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype._appendResponseElement = function(response) {
  throw "Not implemented"
}

AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.prototype._appendMoreResponsesElement = function() {
  var responseTextElement = UIUtils.appendBlock(this._rootContainer, "TextMessage");
  UIUtils.addClass(responseTextElement, "common-moreresponses");

  if (this._settings.requestClickListener != null) {
    UIUtils.addClass(responseTextElement, "common-moreresponses-activable");
    UIUtils.setClickListener(responseTextElement, this._settings.requestClickListener.bind(this, this._requestId))

    UIUtils.get$(responseTextElement).html(I18n.getPageLocale("AbstractRequestPage").SeeMoreResponses);
  } else {
    UIUtils.get$(responseTextElement).html(I18n.getPageLocale("AbstractRequestPage").MoreResponsesAvailable);
  }
}


AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractRequestPanel, function _OutgoingRequestPanel(requestList, requestId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.call(this, requestList, requestId, settings);
});

AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel.prototype._appendRequestElement = function(request) {
  var requestHolderElement = UIUtils.appendBlock(this._rootContainer, "RequestHolder");

  var isEditable = this._settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;

  if (isEditable) { 
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder-editable");
  } else {
    UIUtils.addClass(requestHolderElement, "outgoingrequest-holder");
  }

  var appendRequestText = function() {
    var requestInfoElement = UIUtils.appendBlock(requestHolderElement, "RequestInfo");
    UIUtils.addClass(requestInfoElement, "outgoingrequest-info");
    
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(requestInfoElement, "outgoingrequest-info-activable");
      UIUtils.setClickListener(requestInfoElement, function() {
        this._settings.requestClickListener(this._requestId);
      }.bind(this));
    }
    
    var textElement = UIUtils.appendBlock(requestInfoElement, "RequestText");
    if (this._settings.showResponseCount) {
      UIUtils.addClass(textElement, "outgoingrequest-message-withcounter");
      
      var responseCounterElement = UIUtils.appendBlock(requestInfoElement, "ResponseCounter");
      UIUtils.addClass(responseCounterElement, "outgoingrequest-responsecounter");
      
      var drawCounterText = function() {
        var unviewedResponses = this._requestList._getResponseIds(this._requestId, Backend.Response.STATUS_UNREAD);
        numOfUnviewedResponses = unviewedResponses != null ? unviewedResponses.length : 0;

        var viewedResponses = this._requestList._getResponseIds(this._requestId, Backend.Response.STATUS_READ);
        numOfViewedResponses = viewedResponses != null ? viewedResponses.length : 0;

        var counterText = numOfUnviewedResponses > 0 ? "<b>" : "";
        counterText += numOfUnviewedResponses;
        counterText += numOfUnviewedResponses > 0 ? "</b>" : "";
        counterText += "/" + (numOfViewedResponses + numOfUnviewedResponses);
        UIUtils.get$(responseCounterElement).html(counterText);
      }.bind(this);
      
      drawCounterText();
      this._requestUpdateListeners.push(drawCounterText);
    }

    var text;
    if (this._settings.showFullContent) {
      UIUtils.addClass(textElement, "outgoingrequest-message-full");
      text = request.text;
    } else {
      UIUtils.addClass(textElement, "outgoingrequest-message-short");
      text = UIUtils.getOneLine(request.text);
    }
    
    var requestDate = new Date(request.time);
    UIUtils.get$(textElement).html("<b>" + I18n.getPageLocale("AbstractRequestPage").OutgoingRequestTitleProvider(requestDate.toDateString() + ", " + requestDate.toLocaleTimeString(), Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender), Application.Configuration.toExpertiseString(request.expertise_category)) + "</b><br>" + text);
    
    AbstractRequestPage._AbstractRequestList.__appendAttachmentPanel(requestHolderElement, request.attachments);
    
    if (isEditable) {
      var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
      UIUtils.addClass(controlPanel, "outgoingrequest-controlpanel");

      var editButton = UIUtils.appendButton(controlPanel, "EditButton", I18n.getPageLocale("AbstractRequestPage").EditRequestButton);
      UIUtils.addClass(editButton, "outgoingrequest-editbutton");
      UIUtils.setClickListener(editButton, function() {
        UIUtils.emptyContainer(requestHolderElement);
            
        this.__appendEditPanel(requestHolderElement, request, function() {
          UIUtils.emptyContainer(requestHolderElement);
          appendRequestText();
        });
      }.bind(this));
    }
  }.bind(this);
      
  appendRequestText();
}

AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel.prototype.__appendEditPanel = function(root, request, completionCallback) {
  var editPanel = UIUtils.appendBlock(root, "RequestEditPanel");
  UIUtils.addClass(editPanel, "outgoingrequest-editpanel");

  var requestDate = new Date(request.time);
  var label = UIUtils.appendLabel(editPanel, "Label", I18n.getPageLocale("AbstractRequestPage").SentRequestTextProvider(requestDate.toDateString() + ", " + requestDate.toLocaleTimeString()));
  UIUtils.addClass(label, "outgoingrequest-editpanel-label");
  
  var expertiseCombo = editPanel.appendChild(UIUtils.createSpan("100%", "0 0 20px 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(editPanel, "ExpertiseCategory"), I18n.getLocale().literals.ExpertiseCategoryLabel, Application.Configuration.EXPERTISES, "10px"));
  expertiseCombo.getInputElement().selectData(request.expertise_category);
  
  var genderCombo = editPanel.appendChild(UIUtils.createSpan("48%", "0 4% 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(editPanel, "Gender"), I18n.getLocale().literals.TargetGenderLabel, Application.Configuration.GENDER_PREFERENCE, "10px"));
  genderCombo.getInputElement().selectData(request.response_gender);
  
  var ageCombo = editPanel.appendChild(UIUtils.createSpan("48%", "0 0 0 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(editPanel, "AgeCategory"), I18n.getLocale().literals.TargetAgeGroupLabel, Application.Configuration.AGE_CATEGORY_PREFERENCE, "10px"));
  ageCombo.getInputElement().selectData(request.response_age_group);
  
  editPanel.appendChild(UIUtils.createLineBreak());
  
  var waitTimeCombo = editPanel.appendChild(UIUtils.createSpan("48%", "20px 4% 20px 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(editPanel, "WaitTime"), I18n.getLocale().literals.WaitTimeLabel, Application.Configuration.RESPONSE_WAIT_TIME, "10px"));
  waitTimeCombo.getInputElement().selectData(request.response_wait_time);
  
  var quantityCombo = editPanel.appendChild(UIUtils.createSpan("48%", "20px 0 20px 0")).appendChild(UIUtils.createLabeledDropList(UIUtils.createId(editPanel, "Quantity"), I18n.getLocale().literals.NumOfResponsesLabel, Application.Configuration.RESPONSE_QUANTITY, "10px"));
  quantityCombo.getInputElement().selectData(request.response_quantity);
  
  var textEditor = UIUtils.appendTextEditor(editPanel, "TextArea", {
    textCssClass: "outgoingrequest-editpanel-text",
    fileTooBigListener: function(file) {
      Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
    }
  });
  textEditor.setValue(request.text);
  textEditor.addAttachments(request.attachments);
  textEditor.focus();

  var controlPanel = UIUtils.appendBlock(editPanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingrequest-controlpanel");
  
  var deactivateButton = UIUtils.appendButton(controlPanel, "DeactivateButton", I18n.getPageLocale("AbstractRequestPage").DeactivateRequestButton);
  UIUtils.addClass(deactivateButton, "outgoingrequest-deactivatebutton");
  UIUtils.setClickListener(deactivateButton, function() {
    this._requestList.__updateStarted();
    
    Backend.updateRequest(this._requestId, {status: Backend.Request.STATUS_INACTIVE}, {
      success: function() {
        this._requestList.__updateFinished();
        this._requestList.__requestUpdated(this._requestId);
        completionCallback();
      }.bind(this),
      failure: function() {
        this._requestList.__updateFailed();
      }.bind(this),
      error: function() {
        this._requestList.__updateFailed();
      }.bind(this)
    });
  }.bind(this));
  
  var updateButton = UIUtils.appendButton(controlPanel, "UpdateButton", I18n.getPageLocale("AbstractRequestPage").UpdateRequestButton);
  UIUtils.addClass(updateButton, "outgoingrequest-updatebutton");
  UIUtils.setClickListener(updateButton, function() {
    this._requestList.__updateStarted();

    Backend.updateRequest(this._requestId, {
        text: textEditor.getValue(),
        attachments: textEditor.getAttachments(),
        response_quantity: quantityCombo.getInputElement().getSelectedData(),
        response_wait_time: waitTimeCombo.getInputElement().getSelectedData(),
        response_age_group: ageCombo.getInputElement().getSelectedData(),
        response_gender: genderCombo.getInputElement().getSelectedData(),
        expertise_category: expertiseCombo.getInputElement().getSelectedData()
      }, {
        success: function() {
          this._requestList.__updateFinished();
          this._requestList.__requestUpdated(this._requestId);
          completionCallback();
        }.bind(this),
        failure: function() {
          this._requestList.__updateFailed();
        }.bind(this),
        error: function() {
          this._requestList.__updateFailed();
        }.bind(this)
    });
  }.bind(this));
  
  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", I18n.getPageLocale("AbstractRequestPage").CancelRequestButton);
  UIUtils.addClass(cancelButton, "outgoingrequest-cancelbutton");
  UIUtils.setClickListener(cancelButton, completionCallback);
}



AbstractRequestPage._AbstractRequestList._IncomingRequestPanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractRequestPanel, function _IncomingRequestPanel(requestList, requestId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.call(this, requestList, requestId, settings);
  
  this._responseIdsChangeListener = null;
});

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype.remove = function() {
  Backend.removeCacheChangeListener(this._responseIdsChangeListener);
  AbstractRequestPage._AbstractRequestList._AbstractRequestPanel.prototype.remove.call(this);
}

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype._appendRequestElement = function(request) {
  var requestHolderElement = UIUtils.appendBlock(this._rootContainer, "RequestHolder");

  var appendTextElement = function() {
    var responseIds = this._requestList._getResponseIds(this._requestId);

    if (responseIds == null) {
      this._requestList.__updateStarted();
      return;
    }

    var requestTextElement = UIUtils.appendBlock(requestHolderElement, "RequestText");
    UIUtils.addClass(requestTextElement, "incomingrequest-info");
    
    if (this._settings.requestClickListener != null) {
      UIUtils.addClass(requestTextElement, "incomingrequest-info-activable");
      UIUtils.setClickListener(requestTextElement, function() {
        this._settings.requestClickListener(this._requestId);
      }.bind(this));
    }

    var isEditable = responseIds.length == 0 && this._settings.requestEditable == true && request.status == Backend.Request.STATUS_ACTIVE;
    
    if (isEditable) {
      UIUtils.removeClass(requestHolderElement, "incomingrequest-holder");
      UIUtils.addClass(requestHolderElement, "incomingrequest-holder-editable");
    } else {
      UIUtils.removeClass(requestHolderElement, "incomingrequest-holder-editable");
      UIUtils.addClass(requestHolderElement, "incomingrequest-holder");
    }
    
    var text;
    if (this._settings.showFullContent) {
      UIUtils.addClass(requestTextElement, "incomingrequest-message-full");
      text = request.text;
    } else {
      UIUtils.addClass(requestTextElement, "incomingrequest-message-short");
      text = UIUtils.getOneLine(request.text);
    }

    var requestDate = new Date(request.time);
    UIUtils.get$(requestTextElement).html("<b>" + I18n.getPageLocale("AbstractRequestPage").IncomingRequestTitleProvider(requestDate.toDateString() + ", " + requestDate.toLocaleTimeString(), Application.Configuration.toExpertiseString(request.expertise_category)) + "</b><br>" + text);
    
    AbstractRequestPage._AbstractRequestList.__appendAttachmentPanel(requestHolderElement, request.attachments);

    if (isEditable) {
      var controlPanel = UIUtils.appendBlock(requestHolderElement, "ControlPanel");
      UIUtils.addClass(controlPanel, "incomingrequest-controlpanel");

      var ignoreButton = UIUtils.appendButton(controlPanel, "IgnoreButton", I18n.getPageLocale("AbstractRequestPage").IgnoreRequestButton);
      UIUtils.addClass(ignoreButton, "incomingrequest-ignorebutton");
      UIUtils.setClickListener(ignoreButton, function() {
        this._requestList.__updateStarted();
        
        Backend.removeIncomingRequest(this._requestId, {
          success: function() {
            this._requestList.__updateFinished();
            this._requestList.__requestDeleted(this._requestId);
          }.bind(this),
          failure: function() {
            this._requestList.__updateFailed();
          }.bind(this),
          error: function() {
            this._requestList.__updateFailed();
          }.bind(this)
        });
      }.bind(this));

      var commentButton = UIUtils.appendButton(controlPanel, "CommentButton", I18n.getPageLocale("AbstractRequestPage").CommentRequestButton);
      UIUtils.addClass(commentButton, "incomingrequest-commentbutton");
      UIUtils.setClickListener(commentButton, function() {
        UIUtils.get$(controlPanel).remove();
        this.__appendCreateResponsePanel(requestHolderElement, request, appendTextElement);
      }.bind(this));
    }
  }.bind(this);

  this._responseIdsChangeListener = function(event) {
    if (event.type == this._requestList._getResponseIdsChangeEventType()
        && event.requestId == this._requestId) {

      this._requestList.__updateFinished();
      
      UIUtils.emptyContainer(requestHolderElement);
      appendTextElement();
    }
  }.bind(this);
  
  Backend.addCacheChangeListener(this._responseIdsChangeListener);
  appendTextElement();
}

AbstractRequestPage._AbstractRequestList._IncomingRequestPanel.prototype.__appendCreateResponsePanel = function(root, request, completionCallback) {
  var createResponsePanel = UIUtils.appendBlock(root, "CreateResponsePanel");
  UIUtils.addClass(createResponsePanel, "outgoingresponse-createresponsepanel");

  var textEditor = UIUtils.appendTextEditor(createResponsePanel, "TextArea", {
    textCssClass: "outgoingresponse-createresponsepanel-text",
    fileTooBigListener: function(file) {
      Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
    }
  });
  textEditor.focus();
  
  var controlPanel = UIUtils.appendBlock(createResponsePanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingresponse-controlpanel");
    
  var submitButton = UIUtils.appendButton(controlPanel, "SubmitButton", I18n.getPageLocale("AbstractRequestPage").SendResponseButton);
  UIUtils.addClass(submitButton, "outgoingresponse-submitbutton");
  
  UIUtils.setClickListener(submitButton, function() {
    var responseText = textEditor.getValue();
    if (responseText != "") {
      this._requestList.__updateStarted();
      
      Backend.createResponse(this._requestId, {text: responseText, contact_info_status: Backend.UserPreferences.contactVisible ? Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE : Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE, attachments: textEditor.getAttachments()}, {
        success: function(responseId) {
          UIUtils.get$(createResponsePanel).remove();
          this._requestList.__updateFinished();
          this._requestList.__responseCreated(this._requestId, responseId);

          completionCallback();
        }.bind(this),
        failure: function() {
          this._requestList.__updateFailed();
        }.bind(this),
        error: function() {
          this._requestList.__updateFailed();
        }.bind(this)
      });
    } else {
      textEditor.indicateInvalidInput();
    }
  }.bind(this));

  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.addClass(cancelButton, "outgoingresponse-cancelbutton");
  UIUtils.setClickListener(cancelButton, function() {
    UIUtils.get$(createResponsePanel).remove();
    completionCallback();
  });
}


AbstractRequestPage._AbstractRequestList._IncomingResponsePanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractResponsePanel, function _IncomingResponsePanel(requestList, requestId, responseId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.call(this, requestList, requestId, responseId, settings); 
});

AbstractRequestPage._AbstractRequestList._IncomingResponsePanel.prototype._appendResponseElement = function(response) {
  var responseHolder = UIUtils.appendBlock(this._rootContainer, "TextHolder");
  UIUtils.addClass(responseHolder, "incomingresponse-holder");

  var responseInfoElement = UIUtils.appendBlock(responseHolder, "Info");
  UIUtils.addClass(responseInfoElement, "incomingresponse-info");

  var responseTextElement = UIUtils.appendBlock(responseInfoElement, "TextMessage");
  if (response.status == Backend.Response.STATUS_UNREAD) {
    UIUtils.addClass(responseInfoElement, "incomingresponse-info-activable");
    UIUtils.setClickListener(responseInfoElement, function() {
      Backend.updateResponse(this._requestId, this._responseId, {status: Backend.Response.STATUS_READ}, {
        success: function() {
          //We update when the server informs us to update
          //UIUtils.removeClass(responseInfoElement, "incomingresponse-info-activable");
        }.bind(this),
        failure: function() {
          this._requestList.__updateFailed();
        }.bind(this),
        error: function() {
          this._requestList.__updateFailed();
        }.bind(this)
      });
    }.bind(this));
  }
  

  var text;
  if (this._settings.showFullContent) {
    UIUtils.addClass(responseTextElement, "incomingresponse-message-full");
    text = response.text;
    
    var removeResponseElement = UIUtils.appendBlock(responseInfoElement, "Remover");
    UIUtils.addClass(removeResponseElement, "incomingresponse-x");
    UIUtils.setClickListener(removeResponseElement, function(event) {
      this._requestList.__updateStarted();
        
      Backend.removeIncomingResponse(this._requestId, this._responseId, {
        success: function(responseId) {
          this._requestList.__updateFinished();
          this._requestList.__responseDeleted(this._requestId, this._responseId);
        }.bind(this),
        failure: function() {
          this._requestList.__updateFailed();
        }.bind(this),
        error: function() {
          this._requestList.__updateFailed();
        }.bind(this)
      });
      
      return false;
    }.bind(this));
    
    if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE) {
      var requestContactInfoElement = UIUtils.appendBlock(responseInfoElement, "RequestContact");
      UIUtils.addClass(requestContactInfoElement, "incomingresponse-requestcontact");
      UIUtils.setClickListener(requestContactInfoElement, function(event) {
        var callback = {
          success: function() {
            Backend.updateResponse(this._requestId, this._responseId, {contact_info_status: Backend.Response.CONTACT_INFO_STATUS_PROVIDED}, {
              success: function() {
                this._requestList.__updateFinished();
              }.bind(this),
              failure: function() {
                this._requestList.__updateFailed();
              }.bind(this),
              error: function() {
                this._requestList.__updateFailed();
              }.bind(this)
            });
          }.bind(this),
          failure: function() {
            this._requestList.__updateFailed();
          }.bind(this),
          error: function() {
            this._requestList.__updateFailed();
          }.bind(this)
        }
        
        this._requestList.__updateStarted();
        Backend.getContactInfo(this._requestId, this._responseId, callback);

        return false;
      }.bind(this));
    }
  } else {
    UIUtils.addClass(responseTextElement, "incomingresponse-message-short");
    text = UIUtils.getOneLine(response.text);
  }
  
  
  var responseDate = new Date(response.time);
  UIUtils.get$(responseTextElement).html("<b>A " + Application.Configuration.toUserIdentityString(response.age_category, response.gender) + " responded on " + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + ":</b><br>" + text);
  
  if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_PROVIDED) {
    var callback = {
      success: function(contactInfo) {
        UIUtils.get$(responseTextElement).html(UIUtils.get$(responseTextElement).html() + "<hr>" + contactInfo.contact_name + ", " + contactInfo.contact_info);
      }
    }
    
    var contactInfo = Backend.getContactInfo(this._requestId, this._responseId, callback);
  }
  
  
  
  AbstractRequestPage._AbstractRequestList.__appendAttachmentPanel(responseInfoElement, response.attachments);
}

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList._AbstractResponsePanel, function _OutgoingResponsePanel(requestList, requestId, responseId, settings) {
  AbstractRequestPage._AbstractRequestList._AbstractResponsePanel.call(this, requestList, requestId, responseId, settings); 
});

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel.prototype._appendResponseElement = function(response) {
  var responseHolder = UIUtils.appendBlock(this._rootContainer, "TextHolder");
  
  var isEditable = response.status == Backend.Response.STATUS_UNREAD;
  
  if (isEditable) {
    UIUtils.addClass(responseHolder, "outgoingresponse-holder-editable");
  } else {
    UIUtils.addClass(responseHolder, "outgoingresponse-holder");
  }
  
  var appendResponseText = function() {
    var responseInfoElement = UIUtils.appendBlock(responseHolder, "Info");
    UIUtils.addClass(responseInfoElement, "outgoingresponse-info");

    var responseTextElement = UIUtils.appendBlock(responseInfoElement, "TextMessage");

    var text;
    if (this._settings.showFullContent) {
      UIUtils.addClass(responseTextElement, "outgoingresponse-message-full");
      text = response.text;
    } else {
      UIUtils.addClass(responseTextElement, "outgoingresponse-message-short");
      text = UIUtils.getOneLine(response.text);
    }

    var responseDate = new Date(response.time);
    UIUtils.get$(responseTextElement).html("<b>" + I18n.getPageLocale("AbstractRequestPage").OutgoingResponseTitleProvider(responseDate.toDateString() + ", " + responseDate.toLocaleTimeString()) + "</b><br>" + text);

    AbstractRequestPage._AbstractRequestList.__appendAttachmentPanel(responseHolder, response.attachments);
    
    if (isEditable) {
      var responseControlPanel = UIUtils.appendBlock(responseHolder, "ControlPanel");
      UIUtils.addClass(responseControlPanel, "outgoingresponse-controlpanel");

      var editButton = UIUtils.appendButton(responseControlPanel, "ModifyButton", I18n.getPageLocale("AbstractRequestPage").ModifyResponseButton);
      UIUtils.addClass(editButton, "outgoingresponse-editbutton");
      UIUtils.setClickListener(editButton, function() {
        UIUtils.emptyContainer(responseHolder);

        this.__appendEditPanel(responseHolder, response, function() {
          UIUtils.emptyContainer(responseHolder);
          appendResponseText();
        });
      }.bind(this));
    }
  }.bind(this);
  
  appendResponseText();
}

AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel.prototype.__appendEditPanel = function(root, response, completionCallback) {
  var editPanel = UIUtils.appendBlock(root, "RequestEditPanel");
  
  var responseDate = new Date(response.time);
  UIUtils.appendLabel(editPanel, "Label", I18n.getPageLocale("AbstractRequestPage").OutgoingResponseTitleProvider("<b>" + responseDate.toDateString() + ", " + responseDate.toLocaleTimeString() + "</b>"));
  
  var textEditor = UIUtils.appendTextEditor(editPanel, "TextArea", {
    textCssClass: "outgoingresponse-controlpanel-text",
    fileTooBigListener: function(file) {
      Application.showMessage(I18n.getLocale().literals.FileTooBigMessage);
    }
  });
  textEditor.setValue(response.text);
  textEditor.addAttachments(response.attachments);
  textEditor.focus();

  var controlPanel = UIUtils.appendBlock(editPanel, "ControlPanel");
  UIUtils.addClass(controlPanel, "outgoingresponse-controlpanel");
  
  var updateButton = UIUtils.appendButton(controlPanel, "UpdateButton", I18n.getPageLocale("AbstractRequestPage").UpdateResponseButton);
  UIUtils.addClass(updateButton, "outgoingresponse-updatebutton");
  UIUtils.setClickListener(updateButton, function() {
    this._requestList.__updateStarted();
    
    Backend.updateResponse(this._requestId, this._responseId, {text: textEditor.getValue(), attachments: textEditor.getAttachments()}, {
      success: function() {
        this._requestList.__updateFinished();
        this._requestList.__responseUpdated(this._requestId, this._responseId);
        completionCallback();
      }.bind(this),
      failure: function() {
        this._requestList.__updateFailed();
      }.bind(this),
      error: function() {
        this._requestList.__updateFailed();
      }.bind(this)
    });
  }.bind(this));
  
  var cancelButton = UIUtils.appendButton(controlPanel, "CancelButton", I18n.getLocale().literals.CancelOperationButton);
  UIUtils.addClass(cancelButton, "outgoingresponse-cancelbutton");
  UIUtils.setClickListener(cancelButton, completionCallback);
}



AbstractRequestPage.OutgoingRequestList = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList, function OutgoingRequestList(settings) {
  AbstractRequestPage._AbstractRequestList.call(this, settings);
});

AbstractRequestPage.OutgoingRequestList.prototype._createRequestPanel = function(requestId) {
  return new AbstractRequestPage._AbstractRequestList._OutgoingRequestPanel(this, requestId, this._settings);
}

AbstractRequestPage.OutgoingRequestList.prototype._createResponsePanel = function(requestList, requestId, responseId) {
  return new AbstractRequestPage._AbstractRequestList._IncomingResponsePanel(requestList, requestId, responseId, this._settings);
}

AbstractRequestPage.OutgoingRequestList.prototype._getRequestIds = function(status) {
  return Backend.getOutgoingRequestIds(status);
}

AbstractRequestPage.OutgoingRequestList.prototype._getResponseIds = function(requestId, status) {
  return Backend.getIncomingResponseIds(requestId, status);
}

AbstractRequestPage.OutgoingRequestList.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestList.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}



AbstractRequestPage.IncomingRequestList = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestList, function IncomingRequestList(settings) {
  AbstractRequestPage._AbstractRequestList.call(this, settings);
});

AbstractRequestPage.IncomingRequestList.prototype._createRequestPanel = function(requestId) {
  return new AbstractRequestPage._AbstractRequestList._IncomingRequestPanel(this, requestId, this._settings);
}

AbstractRequestPage.IncomingRequestList.prototype._createResponsePanel = function(requestList, requestId, responseId) {
  return new AbstractRequestPage._AbstractRequestList._OutgoingResponsePanel(requestList, requestId, responseId, this._settings);
}

AbstractRequestPage.IncomingRequestList.prototype._getRequestIds = function(status) {
  return Backend.getIncomingRequestIds(status);
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIds = function(requestId, status) {
  return Backend.getOutgoingResponseIds(requestId, status);
}

AbstractRequestPage.IncomingRequestList.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestList.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}





// THIS IS THE SECTION WHICH DEFINES RequestStatistics object

AbstractRequestPage._AbstractRequestStatistics = ClassUtils.defineClass(Object, function _AbstractRequestStatistics(requestStatus, responseStatus, updateListener) {
  this._requestStatus = requestStatus;
  this._responseStatus = responseStatus;
  this._updateListener = updateListener;

  this._statistics = {};
  
  this._cacheChangeListener = function(event) {
    if (event.type == this._getRequestIdsChangeEventType()
        || (this._requestStatus != null
            && event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED
            && this._statistics.hasOwnProperty(event.requestId))) {
      this.__rebuildStatistics();
    } else if ((event.type == this._getResponseIdsChangeEventType() || event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED)
                && this._statistics.hasOwnProperty(event.requestId)) {

      this._statistics[event.requestId] = this._getResponseIds(event.requestId, this._responseStatus).length;
      this._updateListener();
    }
  }.bind(this);
});

AbstractRequestPage._AbstractRequestStatistics.prototype.start = function() {
  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  this.__rebuildStatistics();
}

AbstractRequestPage._AbstractRequestStatistics.prototype.stop = function() {
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AbstractRequestPage._AbstractRequestStatistics.prototype.getStatistics = function() {
  return this._statistics;
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getResponseIds = function(requestId, responseStatus) {
  throw "Not implemented";
}

//abstract
AbstractRequestPage._AbstractRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  throw "Not implemented";
}


AbstractRequestPage._AbstractRequestStatistics.prototype.__rebuildStatistics = function() {
  this._statistics = {};
  
  var requestIds = this._getRequestIds(this._requestStatus);
  
  if (requestIds != null) {
    for (var index in requestIds) {
      var requestId = requestIds[index];

      if (!this._statistics.hasOwnProperty(requestId)) {
        var responseIds = this._getResponseIds(requestId, this._responseStatus);
        if (responseIds != null) {
          this._statistics[requestId] = responseIds.length;
        } else {
          this._statistics[requestId] = null;
        }
      }
    }

    this._updateListener();
  }
}



AbstractRequestPage.OutgoingRequestStatistics = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestStatistics, function OutgoingRequestStatistics(requestStatus, responseStatus, updateListener) {
  AbstractRequestPage._AbstractRequestStatistics.call(this, requestStatus, responseStatus, updateListener);
});

AbstractRequestPage.OutgoingRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  return Backend.getOutgoingRequestIds(requestStatus);
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getResponseIds = function(requestId, responseStatus) {
  return Backend.getIncomingResponseIds(requestId, responseStatus);
}

AbstractRequestPage.OutgoingRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
}


AbstractRequestPage.IncomingRequestStatistics = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestStatistics, function IncomingRequestStatistics(requestStatus, responseStatus, updateListener) {
  AbstractRequestPage._AbstractRequestStatistics.call(this, requestStatus, responseStatus, updateListener);
});

AbstractRequestPage.IncomingRequestStatistics.prototype._getRequestIds = function(requestStatus) {
  return Backend.getIncomingRequestIds(requestStatus);
}

AbstractRequestPage.IncomingRequestStatistics.prototype._getRequestIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
}

AbstractRequestPage.IncomingRequestStatistics.prototype._getResponseIds = function(requestId, responseStatus) {
  return Backend.getOutgoingResponseIds(requestId, responseStatus);
}

AbstractRequestPage.IncomingRequestStatistics.prototype._getResponseIdsChangeEventType = function() {
  return Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
}

