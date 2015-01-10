ActiveIncomingRequestsPage = ClassUtils.defineClass(AbstractPage, function ActiveIncomingRequestsPage() {
  AbstractPage.call(this, "ActiveIncomingRequestsPage");
  
  this._requestCacheUpdateListener;
});

ActiveIncomingRequestsPage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("ActiveIncomingRequestsPage-GeneralPanel"));
  $("#ActiveIncomingRequestsPage-GeneralPanel").html("This is what the World is asking you to comment and is awaiting your opinion about<br>You can always see your older inquiries in the <a href='#' id='ActiveIncomingRequestsPage-GeneralPanel-AllInquiriesLink'>All Inquiries</a> section.");
  $("#ActiveIncomingRequestsPage-GeneralPanel-AllInquiriesLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ALL_INQUIRIES_ITEM_ID);
  });
  
  root.appendChild(UIUtils.createBlock("ActiveIncomingRequestsPage-RequestsPanel"));
}

ActiveIncomingRequestsPage.prototype.onShow = function(root) {
  this._requestCacheUpdateListener = function() {
    Application.hideSpinningWheel();
    
    var activeRequestIds = Backend.getCachedIncomingRequestIds(Backend.Request.STATUS_ACTIVE);
    AbstractRequestPage.appendIncomingRequestResponseControl($("#ActiveIncomingRequestsPage-RequestsPanel").get(0), activeRequestIds, {
      incomingRequestClickListener: null,
      canRespond: true
    });
  }
  
  if (!Backend.isRequestCacheInitialized()) {
    Application.showSpinningWheel();
  } else {
    this._requestCacheUpdateListener();
  }
  
  Backend.addRequestCacheChangeListener(this._requestCacheUpdateListener);
}

ActiveIncomingRequestsPage.prototype.onHide = function() {
  Backend.removeRequestCacheChangeListener(this._requestCacheUpdateListener);
  Application.hideSpinningWheel();
}


