AbstractDataPage = ClassUtils.defineClass(AbstractPage, function AbstractDataPage(pageId) {
  AbstractPage.call(this, pageId);
  
  this._updateListener;
});

AbstractDataPage.prototype.definePageContent = function(root) {
  if (!Backend.isLogged()) {
    throw AbstractPage.prototype.NO_CONTENT;
  }
  
  this._updateListener = function(event) {
    if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
      Application.showSpinningWheel();
    } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
      Application.hideSpinningWheel();
    }
  };
}

AbstractDataPage.prototype.definePageNoContent = function(root) {
  root.innerHTML = "No Content - TODO: Make it look nicer";
}

AbstractDataPage.prototype.onShow = function(root, paramBundle) {
  Backend.addCacheChangeListener(this._updateListener);
}

AbstractDataPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._updateListener);
}

