AbstractRequestPage = ClassUtils.defineClass(AbstractDataPage, function AbstractRequestPage(pageId) {
  AbstractDataPage.call(this, pageId);
});

AbstractRequestPage.prototype.definePageContent = function(root) {
  AbstractDataPage.prototype.definePageContent.call(this, root);
}

AbstractRequestPage.prototype.onShow = function(root, paramBundle) {
  AbstractDataPage.prototype.onShow.call(this, root, paramBundle);
}

AbstractRequestPage.prototype.onHide = function() {
  AbstractDataPage.prototype.onHide.call(this);
}



AbstractRequestPage._AbstractObjectItem = ClassUtils.defineClass(Object, function _AbstractObjectItem(objectId, baseCssClass, settings) {
  this._objectId = objectId;
  this._settings = settings || {};
  this._baseCssClass = baseCssClass;
  
  this._container = null;
  this._header = null;

  this._cacheChangeListener = this._cacheChangeListener();
});

AbstractRequestPage._AbstractObjectItem.prototype.append = function(root) {
  if (this._container != null) {
    throw "Item " + this._objectId + " is already added";
  }
  
  Backend.addCacheChangeListener(this._cacheChangeListener);
  
  this._container = UIUtils.appendBlock(root, this._objectId);
  UIUtils.addClass(this._container, this._baseCssClass);
  
  if (this._settings.clickListener) {
    UIUtils.setClickListener(this._container, this._createClickListener());
  }
  
  if (this._getObject() != null) {
    this.refresh();
  }
}

AbstractRequestPage._AbstractObjectItem.prototype.remove = function() {
  if (this._container == null) {
    throw "Item " + this._objectId + " cannot be removed since it was never added";
  }
  
  UIUtils.get$(this._container).remove();
  this._container = null;
  
  Backend.removeCacheChangeListener(this._cacheChangeListener);
}

AbstractRequestPage._AbstractObjectItem.prototype.refresh = function() {
  this._clear();
  this._fill();
}
AbstractRequestPage._AbstractObjectItem.prototype._clear = function() {
  UIUtils.emptyContainer(this._container);
  
  this._header = UIUtils.appendBlock(this._container, "Header");
  UIUtils.addClass(this._header, "container-header");
}

AbstractRequestPage._AbstractObjectItem.prototype._cacheChangeListener = function() {
  throw "Not implemented";
}

AbstractRequestPage._AbstractObjectItem.prototype._getObject = function() {
  throw "Not implemented";
}

AbstractRequestPage._AbstractObjectItem.prototype._fill = function() {
  throw "Not implemented";
}

AbstractRequestPage._AbstractObjectItem.prototype._createClickListener = function() {
  throw "Not implemented";
}



AbstractRequestPage._AbstractRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractObjectItem, function _AbstractRequestItem(requestId, baseCssClass, settings) {
  AbstractRequestPage._AbstractObjectItem.call(this, requestId, baseCssClass, settings);
});
AbstractRequestPage._AbstractRequestItem.prototype._cacheChangeListener = function() {
  return function(event) {
    if (event.requestId == this._objectId
        && (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED || Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED)) {

      if (this._getObject() != null) {
        this.refresh();
      }
    }
  }.bind(this);
}
AbstractRequestPage._AbstractRequestItem.prototype._getObject = function() {
  return Backend.getRequest(this._objectId);
}
AbstractRequestPage._AbstractRequestItem.prototype._createClickListener = function() {
  return this._settings.clickListener.bind(this, this._objectId);
}



AbstractRequestPage._AbstractOutgoingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestItem, function _AbstractOutgoingRequestItem(requestId, cssClass, settings) {
  AbstractRequestPage._AbstractRequestItem.call(this, requestId, cssClass, settings);
});

AbstractRequestPage._AbstractOutgoingRequestItem.prototype._fill = function() {
  var request = this._getObject();

  var dateLabel = UIUtils.appendLabel(this._header, "DateLabel", TimeUtils.getDateTimeSrting(request.time));
  UIUtils.addClass(dateLabel, "request-date-label");
  
  var targetLabel = UIUtils.appendLabel(this._header, "TargetLabel", I18n.getPageLocale("AbstractRequestPage").TargetLabel + " " + Application.Configuration.toTargetGroupString(request.response_age_group, request.response_gender));
  UIUtils.addClass(targetLabel, "request-target-label");
  
  var allResponses = Backend.getIncomingResponseIds(this._objectId);
  var unreadResponses = Backend.getIncomingResponseIds(this._objectId, Backend.Response.STATUS_UNVIEWED);

  var counterText = null;
  if (allResponses != null && unreadResponses != null) {
    if (unreadResponses.length > 0) {
      counterText = "<b>" + unreadResponses.length + "</b>";
    } else {
      counterText = "0";
    }
    counterText += "/" + allResponses.length;
  } else {
    counterText = "--";
  }
  var counterLabel = UIUtils.appendLabel(this._header, "CounterLabel", counterText);
  UIUtils.addClass(counterLabel, "request-responsecounter-label");
  
  var expertiseItem = Application.Configuration.findConfigurationItem(Backend.getUserSettings().expertise_categories, request.expertise_category);
  var expertiseLabel = UIUtils.appendLabel(this._header, "ExpertiseLabel", expertiseItem.display);
  UIUtils.addClass(expertiseLabel, "request-expertise-label");
  expertiseLabel.style.backgroundColor = expertiseItem.bg;
  expertiseLabel.style.color = expertiseItem.fg;
}


AbstractRequestPage.OutgoingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractOutgoingRequestItem, function OutgoingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractOutgoingRequestItem.call(this, requestId, "outgoing-request-container", settings);
});

AbstractRequestPage.OutgoingRequestItem.prototype._fill = function() {
  AbstractRequestPage._AbstractOutgoingRequestItem.prototype._fill.call(this);
  
  var request = this._getObject();

  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  UIUtils.addClass(requestText, "request-text");
  requestText.innerHTML = UIUtils.getOneLine(request.text);
}
  
AbstractRequestPage.EditableOutgoingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractOutgoingRequestItem, function EditableOutgoingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractOutgoingRequestItem.call(this, requestId, "full-outgoing-request-container", settings);
});

AbstractRequestPage.EditableOutgoingRequestItem.prototype._fill = function() {
  AbstractRequestPage._AbstractOutgoingRequestItem.prototype._fill.call(this);
  
  var request = this._getObject();
  
  var quantityLabel = UIUtils.appendLabel(this._header, "QuantityLabel", I18n.getPageLocale("AbstractRequestPage").QuantityLabel + " " + Application.Configuration.dataToString(Application.Configuration.RESPONSE_QUANTITY, request.response_quantity));
  UIUtils.addClass(quantityLabel, "request-quantity-label");

  var timeFrameLabel = UIUtils.appendLabel(this._header, "TimeFrameLabel", I18n.getPageLocale("AbstractRequestPage").TimeFrameLabel + " " + Application.Configuration.dataToString(Application.Configuration.RESPONSE_WAIT_TIME, request.response_wait_time));
  UIUtils.addClass(timeFrameLabel, "request-timeframe-label");
}


AbstractRequestPage.ExtendedOutgoingRequestItem = ClassUtils.defineClass(AbstractRequestPage.EditableOutgoingRequestItem, function ExtendedOutgoingRequestItem(requestId, settings) {
  AbstractRequestPage.EditableOutgoingRequestItem.call(this, requestId, settings);
});

AbstractRequestPage.ExtendedOutgoingRequestItem.prototype._fill = function() {
  AbstractRequestPage.EditableOutgoingRequestItem.prototype._fill.call(this);
  
  var request = this._getObject();

  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  UIUtils.addClass(requestText, "request-text");
  requestText.innerHTML = request.text;

  if (request.attachments != null && request.attachments.length > 0) {
    var attachmentBar = UIUtils.appendAttachmentBar(this._container, "AttachmentBar", request.attachments);
    UIUtils.addClass(attachmentBar, "request-attachmentbar");
  }
}




AbstractRequestPage._AbstractIncomingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestItem, function _AbstractIncomingRequestItem(requestId, cssClass, settings) {
  AbstractRequestPage._AbstractRequestItem.call(this, requestId, cssClass, settings);
});

AbstractRequestPage._AbstractIncomingRequestItem.prototype._fill = function() {
  var request = this._getObject();
  var dateLabel = UIUtils.appendLabel(this._header, "DateLabel", TimeUtils.getDateTimeSrting(request.time));
  UIUtils.addClass(dateLabel, "request-date-label");
  
  var expiresLabel;
  if (request.status == Backend.Request.STATUS_ACTIVE) {
    var timeToLive = (request.time + request.response_wait_time * 1000 * 60 * 60) - Date.now();
    var numOfDaysLeft = Math.floor(timeToLive / (1000 * 60 * 60 * 24));
    var numOfHoursLeft = Math.floor((timeToLive % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var numOfMinutesLeft = Math.floor((timeToLive % (1000 * 60 * 60)) / (1000 * 60));
    expiresLabel = UIUtils.appendLabel(this._header, "ExpiresLabel", I18n.getPageLocale("AbstractRequestPage").ExpiresLabelProvider(numOfDaysLeft, numOfHoursLeft, numOfMinutesLeft));
    UIUtils.addClass(expiresLabel, "request-expires-label");
  }
  
  var expertiseItem = Application.Configuration.findConfigurationItem(Backend.getUserSettings().expertise_categories, request.expertise_category);
  var expertiseLabel = UIUtils.appendLabel(this._header, "ExpertiseLabel", expertiseItem.display);
  UIUtils.addClass(expertiseLabel, "request-expertise-label");
  expertiseLabel.style.backgroundColor = expertiseItem.bg;
  expertiseLabel.style.color = expertiseItem.fg;
}

AbstractRequestPage.IncomingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractIncomingRequestItem, function IncomingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractIncomingRequestItem.call(this, requestId, "incoming-request-container", settings);
});
AbstractRequestPage.IncomingRequestItem.prototype._fill = function() {
  AbstractRequestPage._AbstractIncomingRequestItem.prototype._fill.call(this);
  
  var request = this._getObject();

  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  requestText.innerHTML = UIUtils.getOneLine(request.text);
  UIUtils.addClass(requestText, "request-text");
}

AbstractRequestPage.ExtendedIncomingRequestItem = ClassUtils.defineClass(AbstractRequestPage._AbstractIncomingRequestItem, function IncomingRequestItem(requestId, settings) {
  AbstractRequestPage._AbstractIncomingRequestItem.call(this, requestId, "full-incoming-request-container", settings);
});
AbstractRequestPage.ExtendedIncomingRequestItem.prototype._fill = function() {
  AbstractRequestPage._AbstractIncomingRequestItem.prototype._fill.call(this);
  
  var request = this._getObject();

  var requestText = UIUtils.appendBlock(this._container, "RequestText");
  UIUtils.addClass(requestText, "request-text");
  requestText.innerHTML = request.text;

  if (request.attachments != null && request.attachments.length > 0) {
    var attachmentBar = UIUtils.appendAttachmentBar(this._container, "AttachmentBar", request.attachments);
    UIUtils.addClass(attachmentBar, "request-attachmentbar");
  }
}




// Responses

AbstractRequestPage._AbstractResponseItem = ClassUtils.defineClass(AbstractRequestPage._AbstractObjectItem, function _AbstractResponseItem(requestId, responseId, baseCssClass, settings) {
  AbstractRequestPage._AbstractObjectItem.call(this, responseId, baseCssClass, settings);
  this._requestId = requestId;
});
AbstractRequestPage._AbstractResponseItem.prototype._cacheChangeListener = function() {
  return function(event) {
    if (event.requestId == this._requestId && event.responseId == this._objectId
        && (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED)) {

      if (this._getObject() != null) {
        this.refresh();
      }
    }
  }.bind(this);
}
AbstractRequestPage._AbstractResponseItem.prototype._getObject = function() {
  return Backend.getResponse(this._requestId, this._objectId);
}
AbstractRequestPage._AbstractResponseItem.prototype._createClickListener = function() {
  return this._settings.clickListener.bind(this, this._requestId, this._objectId);
}


// settings.ratingChangeListener
// settings.removeListener
AbstractRequestPage.IncomingResponseItem = ClassUtils.defineClass(AbstractRequestPage._AbstractResponseItem, function IncomingResponseItem(requestId, responseId, settings) {
  AbstractRequestPage._AbstractResponseItem.call(this, requestId, responseId, "incoming-response-container", settings);
});
AbstractRequestPage.IncomingResponseItem.prototype._fill = function() {
  var response = this._getObject();
  var isRead = response.status == Backend.Response.STATUS_VIEWED;
  
  if (!isRead) {
    UIUtils.addClass(this._header, "response-header-unread");
// Maybe
//    UIUtils.setHoverListener(this._header, function() {
//      Backend.updateResponse(this._requestId, this._objectId, {status: Backend.Response.STATUS_VIEWED});
//    }.bind(this));
  }
  
  var dateLabel = UIUtils.appendLabel(this._header, "DateLabel", TimeUtils.getDateTimeSrting(response.time));
  UIUtils.addClass(dateLabel, "response-date-label");
  
  var fromLabel = UIUtils.appendLabel(this._header, "FromLabel", I18n.getPageLocale("AbstractRequestPage").FromLabel + " " + Application.Configuration.toUserIdentityString(response.age_category, response.gender));
  UIUtils.addClass(fromLabel, "response-from-label");
  
  if (this._settings.removeListener != null) {
    var responseRemover = UIUtils.appendBlock(this._header, "Remover");
    UIUtils.addClass(responseRemover, "response-remover");

    UIUtils.setClickListener(responseRemover, function() {
      this._settings.removeListener(this._requestId, this._objectId);
      return false;
    }.bind(this));
  }
  
  var responseText = UIUtils.appendBlock(this._container, "ResponseText");
  UIUtils.addClass(responseText, "response-text");
  responseText.innerHTML = response.text;
  
  if (response.paid_features.hidden_text.status == Backend.Response.PAID_INFO_STATUS_PROVIDED || response.paid_features.hidden_text.status == Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE) {
    var responseHiddenText = UIUtils.appendBlock(this._container, "ResponseHiddenText");
    
    if (response.paid_features.hidden_text.status == Backend.Response.PAID_INFO_STATUS_PROVIDED) {
      UIUtils.addClass(responseHiddenText, "response-hidden-text");
      responseHiddenText.innerHTML = response.paid_features.hidden_text.data.text;
    } else {
      UIUtils.addClass(responseHiddenText, "response-hidden-text-reveal");
      responseHiddenText.innerHTML = I18n.getPageLocale("AbstractRequestPage").HiddenTextCanBeRequested;
      UIUtils.setClickListener(responseHiddenText, function() {
        Backend.getResponseWithHiddenText(this._requestId, this._objectId);
      }.bind(this));
    }
  }

  if (response.attachments != null && response.attachments.length > 0) {
    var attachmentBar = UIUtils.appendAttachmentBar(this._container, "AttachmentBar", response.attachments);
    UIUtils.addClass(attachmentBar, "response-attachmentbar");
  }

  var contactInfoPanel = UIUtils.appendBlock(this._container, "ContactInfoPanel");
  UIUtils.addClass(contactInfoPanel, "response-contactinfopanel");
  
  if (response.paid_features.contact_info.status == Backend.Response.PAID_INFO_STATUS_PROVIDED) {  
    var contactInfo = UIUtils.appendLabel(contactInfoPanel, "ContactInfoLabel", response.paid_features.contact_info.data.contact_name + ", " + response.paid_features.contact_info.data.contact_information);
    UIUtils.addClass(contactInfo, "response-contactinfo");
  } else if (response.paid_features.contact_info.status == Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE) {
    var requestContactInfoButton = UIUtils.appendButton(contactInfoPanel, "RequestContactButton", I18n.getPageLocale("AbstractRequestPage").RequestContactButton);
    UIUtils.setClickListener(requestContactInfoButton, function() {
      Backend.getResponseWithContactInfo(this._requestId, this._objectId);
    }.bind(this));
  }
  
  var ratingBar = UIUtils.appendRatingBar(contactInfoPanel, "RatingBar", this._settings.ratingChangeListener.bind(this, this._requestId, this._objectId));
  UIUtils.addClass(ratingBar, "response-starrating");
  ratingBar.setRating(response.star_rating);
}


AbstractRequestPage._AbstractOutgoingResponseItem = ClassUtils.defineClass(AbstractRequestPage._AbstractResponseItem, function _AbstractOutgoingResponseItem(requestId, responseId, cssClass, settings) {
  AbstractRequestPage._AbstractResponseItem.call(this, requestId, responseId, cssClass, settings);
});
AbstractRequestPage._AbstractOutgoingResponseItem.prototype._fill = function() {
  var response = this._getObject();
  var isRead = response.status == Backend.Response.STATUS_VIEWED;
  
  if (!isRead) {
    UIUtils.addClass(this._header, "response-header-unread");
  }
  
  var dateLabel = UIUtils.appendLabel(this._header, "DateLabel", TimeUtils.getDateTimeSrting(response.time));
  UIUtils.addClass(dateLabel, "response-date-label");
}

AbstractRequestPage.OutgoingResponseItem = ClassUtils.defineClass(AbstractRequestPage._AbstractOutgoingResponseItem, function OutgoingResponseItem(requestId, responseId, settings) {
  AbstractRequestPage._AbstractOutgoingResponseItem.call(this, requestId, responseId, "outgoing-response-container", settings);
});
AbstractRequestPage.OutgoingResponseItem.prototype._fill = function() {
  AbstractRequestPage._AbstractOutgoingResponseItem.prototype._fill.call(this);
  
  var response = this._getObject();

  var responseText = UIUtils.appendBlock(this._container, "ResponseText");
  UIUtils.addClass(responseText, "response-text");
  responseText.innerHTML = response.text;
  
  if (response.paid_features.hidden_text.data != null && response.paid_features.hidden_text.data.text != null) {
    var responseHiddenText = UIUtils.appendBlock(this._container, "ResponseHiddenText");
    UIUtils.addClass(responseHiddenText, "response-hidden-text");
    responseHiddenText.innerHTML = response.paid_features.hidden_text.data.text;
  }

  if (response.attachments != null && response.attachments.length > 0) {
    var attachmentBar = UIUtils.appendAttachmentBar(this._container, "AttachmentBar", response.attachments);
    UIUtils.addClass(attachmentBar, "response-attachmentbar");
  }
}

AbstractRequestPage.EditableOutgoingResponseItem = ClassUtils.defineClass(AbstractRequestPage._AbstractOutgoingResponseItem, function OutgoingResponseItem(requestId, responseId, settings) {
  AbstractRequestPage._AbstractOutgoingResponseItem.call(this, requestId, responseId, "outgoing-response-container", settings);
});
AbstractRequestPage.EditableOutgoingResponseItem.prototype._fill = function() {
  AbstractRequestPage._AbstractOutgoingResponseItem.prototype._fill.call(this);
}




// LIST VIEWS

// settings.clickListener(requestId);

AbstractRequestPage._AbstractItemsView = ClassUtils.defineClass(Object, function _AbstractItemsView(viewId, itemClass, settings) {
  this._viewId = viewId;
  this._itemClass = itemClass;
  this._settings = settings || {};
  this._root = null;
  this._containerElement = null;
  this._objectIds = null;
  
  this._objectItems = [];
});

AbstractRequestPage._AbstractItemsView.prototype.setObjectIds = function(objectIds) {
  this.clear();
  this._objectIds = objectIds;
  
  if (this._objectIds != null) {
    for (var index in objectIds) {
      var objectItem = this._createItem(objectIds[index]);
      this._objectItems.push(objectItem);

      if (this._containerElement != null) {
        objectItem.append(this._containerElement);
      }
    }
  }
}

AbstractRequestPage._AbstractItemsView.prototype.append = function(root) {
  if (this._containerElement != null) {
    this.remove();
  }
  
  this._root = root;
  this._containerElement = UIUtils.appendBlock(this._root, this._viewId);
  UIUtils.addClass(this._containerElement, "items-view");
  
  this.setObjectIds(this._objectIds);
}

AbstractRequestPage._AbstractItemsView.prototype.clear = function() {
  for (var index in this._objectItems) {
    this._objectItems[index].remove();
  }
  
  this._objectItems = [];
}

AbstractRequestPage._AbstractItemsView.prototype.remove = function() {
  this.clear();
  UIUtils.get$(this._rootElement).remove();
}

AbstractRequestPage._AbstractItemsView.prototype.refresh = function() {
  for (var index in this._objectItems) {
    this._objectItems[index].refresh();
  }
}

AbstractRequestPage._AbstractItemsView.prototype._createItem = function(objectId) {
  throw "Undefined";
}


AbstractRequestPage._AbstractRequestsView = ClassUtils.defineClass(AbstractRequestPage._AbstractItemsView, function _AbstractRequestsView(viewId, itemClass, settings) {
  AbstractRequestPage._AbstractItemsView.call(this, viewId, itemClass, settings);
});
AbstractRequestPage._AbstractRequestsView.prototype._createItem = function(objectId) {
  return new AbstractRequestPage[this._itemClass](objectId, this._settings);
}

AbstractRequestPage.OutgoingRequestsView = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsView, function OutgoingRequestsView(viewId, settings) {
  AbstractRequestPage._AbstractRequestsView.call(this, viewId, "OutgoingRequestItem", settings);
});

AbstractRequestPage.IncomingRequestsView = ClassUtils.defineClass(AbstractRequestPage._AbstractRequestsView, function IncomingRequestsView(viewId, settings) {
  AbstractRequestPage._AbstractRequestsView.call(this, viewId, "IncomingRequestItem", settings);
});


AbstractRequestPage._AbstractResponsesView = ClassUtils.defineClass(AbstractRequestPage._AbstractItemsView, function _AbstractResponsesView(viewId, itemClass, settings) {
  AbstractRequestPage._AbstractItemsView.call(this, viewId, itemClass, settings);
  
  this._requestId = null;
});
AbstractRequestPage._AbstractResponsesView.prototype.setRequestId = function(requestId) {
  this._requestId = requestId;
}
AbstractRequestPage._AbstractResponsesView.prototype._createItem = function(objectId) {
  return new AbstractRequestPage[this._itemClass](this._requestId, objectId, this._settings);
}

AbstractRequestPage.OutgoingResponsesView = ClassUtils.defineClass(AbstractRequestPage._AbstractResponsesView, function OutgoingResponsesView(viewId, settings) {
  AbstractRequestPage._AbstractResponsesView.call(this, viewId, "OutgoingResponseItem", settings);
});

AbstractRequestPage.IncomingResponsesView = ClassUtils.defineClass(AbstractRequestPage._AbstractResponsesView, function IncomingResponsesView(viewId, settings) {
  AbstractRequestPage._AbstractResponsesView.call(this, viewId, "IncomingResponseItem", settings);
});



// TABLES

AbstractRequestPage.SORT_BY_DATE = "date";
AbstractRequestPage.SORT_BY_RATE = "rate";

// settings.clickListener(requestId);
// settings.sortListener(sortRule);
// settings.pageListener(page);
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

AbstractRequestPage._AbstractRequestsTable._TABLE_SORTER = [ {data: AbstractRequestPage.SORT_BY_DATE, display: I18n.getPageLocale("AbstractRequestPage").SortByDate}, {data: AbstractRequestPage.SORT_BY_RATE, display: I18n.getPageLocale("AbstractRequestPage").SortByRate}, {data: AbstractRequestPage.SORT_BY_CATEGORY, display: I18n.getPageLocale("AbstractRequestPage").SortByCategory}];



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

AbstractRequestPage._AbstractRequestsTable.prototype.refresh = function() {
  this._requestsView.refresh();
}

AbstractRequestPage._AbstractRequestsTable.prototype.getCurrentPage = function() {
  return this._currentPage;
}

AbstractRequestPage._AbstractRequestsTable.prototype.setCurrentPage = function(currentPage) {
  var previousPage = this._currentPage;
  this._currentPage = currentPage;
  
  this._beginIndex = this._currentPage * this._visibleItemCount;
  this._endIndex = this._beginIndex + this._visibleItemCount < this._requestIds.length ? this._beginIndex + this._visibleItemCount : this._requestIds.length;

  this._requestsView.setObjectIds(this._requestIds.slice(this._beginIndex, this._endIndex));
  
  if (this._statusLabel != null) {
    this._statusLabel.innerHTML = I18n.getPageLocale("AbstractRequestPage").TableStatusLabelProvider(this._beginIndex + 1, this._endIndex, this._requestIds.length);
    
    this._updateTableControl();
  }
  
  if (this._settings.pageListener != null && previousPage != this._currentPage) {
    this._settings.pageListener(this._currentPage);
  }
}

AbstractRequestPage._AbstractRequestsTable.prototype._appendTableHeader = function() {
  if (this._settings.sortListener == null) {
    return;
  }
  
  var header = UIUtils.appendBlock(this._containerElement, "Header");
  UIUtils.addClass(header, "request-table-header");

  var sorter = header.appendChild(UIUtils.createMultiOptionList(UIUtils.createId(header, "Sorter"), AbstractRequestPage._AbstractRequestsTable._TABLE_SORTER, true));
  UIUtils.addClass(sorter, "request-table-header-sorter");
  sorter.setChangeListener(function(value) {
    this._settings.sortListener(value);
  }.bind(this));
  
  var sorterLabel = UIUtils.appendLabel(header, "SorterLabel", I18n.getPageLocale("AbstractRequestPage").SorterLabel);
  UIUtils.addClass(sorterLabel, "request-table-header-sorterlabel");
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
  
  UIUtils.emptyContainer(this._pageButtonsPanel);
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

