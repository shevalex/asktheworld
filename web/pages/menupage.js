MenuPage = ClassUtils.defineClass(AbstractPage, function MenuPage() {
  AbstractPage.call(this, MenuPage.name);
  
  this._contentPanel;
  this._selectedMenuItemId;
  this._activePage;
  
  this._lastShownPageBundle;
  this._lastShownPageId;
  

  this._pages = [];
  
  this._menuPanel;
});


MenuPage.prototype.definePageContent = function(root) {
  this._menuPanel = this._appendMenuPanel(root);
  
  this._contentPanel = UIUtils.appendBlock(root, "ContentPanel");

  for (var index in this._pages) {
    this._pages[index].reload();
  }
}

MenuPage.prototype.onShow = function(root) {
  if (this._lastShownPageId != null) {
    this.showChildPage(this._lastShownPageId, this._lastShownPageBundle);
  }
}

MenuPage.prototype.onHide = function() {
  this._lastShownPageId = this._activePage.getPageId();
  this._lastShownPageBundle = this._activePage.getParamBundle();

  this._selectedMenuItemId = null;
  this._activePage = null;
  
  this._contentPanel.innerHTML = "";
}

MenuPage.prototype.onDestroy = function() {
  for (var index in this._pages) {
    this._pages[index].destroy();
  }
  this._pages = [];
}




MenuPage.prototype.showChildPage = function(pageId, paramBundle, observer) {
  var newPage = this.getPage(pageId);
  if (newPage == null) {
    console.error("No page for id " + pageId);
    return;
  }

  if (this._activePage == newPage && Application.isEqualBundle(this._activePage.getParamBundle(), paramBundle)) {
    return;
  }

  var menuItemId = UIUtils.createId(this._menuPanel, pageId);
  var pageIsMenuItem = UIUtils.get$(menuItemId).length > 0;
  if (pageIsMenuItem) {
    if (this._selectedMenuItemId != null) {
      UIUtils.get$(this._selectedMenuItemId).removeClass("menupage-menuitem-selected");
    }
    this._selectedMenuItemId = menuItemId;
    UIUtils.get$(this._selectedMenuItemId).addClass("menupage-menuitem-selected");
  }
  
  
  if (this._activePage != null) {
    Application.hideSpinningWheel();
    this._activePage.hide();
  }
  
  this._activePage = newPage;
  this._activePage.showAnimated(this._contentPanel, paramBundle, observer);
}

MenuPage.prototype.getPage = function(pageId) {
  var page = this._pages[pageId];
  if (page == null) {
    if (window[pageId] == null) {
      console.error("requested unsupported page: " + pageId);
      return null;
    }
    
    page = new window[pageId]();
    this._pages[pageId] = page;
  }
  
  return page;
}


MenuPage.prototype.hasHistory = function() {
  return false;
}



MenuPage.prototype._appendMenuPanel = function(root) {
  var menuPanel = UIUtils.appendBlock(root, "MenuPanel");

  var clickListener = function(itemId) {
    Application.showMenuPage(itemId);
  };
  
  
  this._appendMenuItem(menuPanel, HomePage.name, this.getLocale().HomeMenuItem, null, clickListener);
  menuPanel.appendChild(this._createMenuSeparator());

  this._appendMenuItem(menuPanel, NewRequestPage.name, this.getLocale().CreateNewRequestItem, null, clickListener);
  this._appendMenuItem(menuPanel, ActiveOutgoingRequestsPage.name, this.getLocale().ActiveOutgoingRequestsItem, null, clickListener);
  this._appendMenuItem(menuPanel, AllOutgoingRequestsPage.name, this.getLocale().AllOutgoingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createMenuSeparator());
  
  this._appendMenuItem(menuPanel, ActiveIncomingRequestsPage.name, this.getLocale().ActiveIncomingRequestsItem, null, clickListener);
  this._appendMenuItem(menuPanel, AllIncomingRequestsPage.name, this.getLocale().AllIncomingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createMenuSeparator());
  
  this._appendMenuItem(menuPanel, UserProfilePage.name, this.getLocale().ProfileItem, null, clickListener);
  this._appendMenuItem(menuPanel, UserPreferencesPage.name, this.getLocale().PreferencesItem, null, clickListener);
  menuPanel.appendChild(this._createMenuSeparator());

  this._appendMenuItem(menuPanel, "logout", this.getLocale().LogOutItem, null, function() {
    Application.reset();
  });
  
  return menuPanel;
}

MenuPage.prototype._appendMenuItem = function(root, itemId, text, icon, clickCallback) {
  var itemElement = UIUtils.appendBlock(root, itemId);
  
  itemElement.setAttribute("class", "menupage-menuitem");
  itemElement.innerHTML = text;
    
  itemElement.onclick = clickCallback.bind(this, itemId);
}

MenuPage.prototype._createMenuSeparator = function() {
  var separatorElement = UIUtils.createBlock();
  separatorElement.setAttribute("class", "menupage-menuseparator");

  return separatorElement;
}


