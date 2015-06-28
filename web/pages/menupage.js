MenuPage = ClassUtils.defineClass(AbstractContainerPage, function MenuPage() {
  AbstractContainerPage.call(this, MenuPage.name);
  
  this._contentPanel;
  this._selectedMenuItemId;
  this._activePage;
  
  this._menuPanel;
});


MenuPage.prototype.definePageContent = function(root) {
  this._menuPanel = this._appendMenuPanel(root);
  
  this._contentPanel = UIUtils.appendBlock(root, "ContentPanel");
}

MenuPage.prototype.onShow = function(root, paramBundle) {
  var menuItemId = UIUtils.createId(this._menuPanel, paramBundle.page);
  var pageIsMenuItem = UIUtils.get$(menuItemId).length > 0;
  if (pageIsMenuItem) {
    if (this._selectedMenuItemId != null) {
      UIUtils.get$(this._selectedMenuItemId).removeClass("menupage-menuitem-selected");
    }
    this._selectedMenuItemId = menuItemId;
    UIUtils.get$(this._selectedMenuItemId).addClass("menupage-menuitem-selected");
  }
}

MenuPage.prototype.onHide = function() {
  if (this._selectedMenuItemId != null) {
    UIUtils.get$(this._selectedMenuItemId).removeClass("menupage-menuitem-selected");
    this._selectedMenuItemId = null;
  }
  this._activePage = null;
  
  this._contentPanel.innerHTML = "";
}

MenuPage.prototype.getPageContainer = function() {
  return this._contentPanel;
}


MenuPage.prototype._appendMenuPanel = function(root) {
  var menuPanel = UIUtils.appendBlock(root, "MenuPanel");

  var clickListener = function(itemId) {
    Application.showMenuPage(itemId);
  };
  
  
  this._appendMenuItem(menuPanel, HomePage.name, this.getLocale().HomeMenuItem, null, clickListener);
  menuPanel.appendChild(this._createThickMenuSeparator());

  this._appendMenuItem(menuPanel, NewRequestPage.name, this.getLocale().CreateNewRequestItem, null, clickListener);
  menuPanel.appendChild(this._createThinMenuSeparator());
  this._appendMenuItem(menuPanel, ActiveOutgoingRequestsPage.name, this.getLocale().ActiveOutgoingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createThinMenuSeparator());
  this._appendMenuItem(menuPanel, AllOutgoingRequestsPage.name, this.getLocale().AllOutgoingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createThickMenuSeparator());
  
  this._appendMenuItem(menuPanel, ActiveIncomingRequestsPage.name, this.getLocale().ActiveIncomingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createThinMenuSeparator());
  this._appendMenuItem(menuPanel, AllIncomingRequestsPage.name, this.getLocale().AllIncomingRequestsItem, null, clickListener);
  menuPanel.appendChild(this._createThickMenuSeparator());
  
  return menuPanel;
}

MenuPage.prototype._appendMenuItem = function(root, itemId, text, icon, clickCallback) {
  var itemElement = UIUtils.appendBlock(root, itemId);
  
  itemElement.setAttribute("class", "menupage-menuitem");
  itemElement.innerHTML = text;
    
  itemElement.onclick = clickCallback.bind(this, itemId);
}

MenuPage.prototype._createThickMenuSeparator = function() {
  var separatorElement = UIUtils.createBlock();
  separatorElement.setAttribute("class", "menupage-menu-thick-separator");

  return separatorElement;
}

MenuPage.prototype._createThinMenuSeparator = function() {
  var separatorElement = UIUtils.createBlock();
  separatorElement.setAttribute("class", "menupage-menu-thin-separator");

  return separatorElement;
}


