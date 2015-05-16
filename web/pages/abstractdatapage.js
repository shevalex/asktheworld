AbstractDataPage = ClassUtils.defineClass(AbstractPage, function AbstractDataPage(pageId) {
  AbstractPage.call(this, pageId);
  
  this._updateListener;
});

AbstractDataPage.prototype.definePageContent = function(root) {
  this._updateListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
      Application.showSpinningWheel();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
      Application.hideSpinningWheel();
    }
  };
}

AbstractDataPage.prototype.onShow = function(root, paramBundle) {
//  if (!Backend.isLogged()) {
//    Application.showPage(LoginPage.name);
//    return;
//  }

  Backend.addCacheChangeListener(this._updateListener);
}

AbstractDataPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._updateListener);
}


