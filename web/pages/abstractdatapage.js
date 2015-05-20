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
  var contentPanel = UIUtils.createBlock("AbstractDataPage-ContentPanel");
  root.appendChild(contentPanel);
  UIUtils.appendLabel(contentPanel, "NoContentLabel", I18n.getPageLocale("AbstractDataPage").NoContentLabel);
  
  var loginLink = UIUtils.appendButton(contentPanel, "LoginLink", I18n.getPageLocale("AbstractDataPage").LoginLink);
  UIUtils.setClickListener(loginLink, function() {
    Application.showPage(LoginPage.name);
  });
}

AbstractDataPage.prototype.onShow = function(root, paramBundle) {
  Backend.addCacheChangeListener(this._updateListener);
}

AbstractDataPage.prototype.onHide = function() {
  Backend.removeCacheChangeListener(this._updateListener);
}

