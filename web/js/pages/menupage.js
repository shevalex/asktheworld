MenuPage = ClassUtils.defineClass(AbstractPage, function MenuPage() {
  AbstractPage.call(this, "MenuPage");
  
  this.contentPanel = null;
  this.selectedMenuItemId = null;
});

MenuPage.prototype.definePageContent = function(root) {
  root.appendChild(this._createMenuPanel());
  
  this.contentPanel = root.appendChild(UIUtils.createBlock("MenuPage-ContentPanel"));
  
  this._selectMenuItem("MenuPage-MenuPanel-Home");
}


MenuPage.prototype._createMenuPanel = function() {
  var menuPanel = UIUtils.createBlock("MenuPage-MenuPanel");

  var clickListener = function(itemId) {
    this._selectMenuItem(itemId);
  };
  
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-Home", "Home", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-NewRequest", "Create New Request", null, clickListener));
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-ActiveRequests", "Active Requests", null, clickListener));
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-AllRequests", "All Requests", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-ActiveInquiries", "Active Inquiries", null, clickListener));
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-AllInquiries", "All Inquiries", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-UserProfile", "User's Profile", null, clickListener));
  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-UserPreferences", "User's Preferences", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem("MenuPage-MenuPanel-Logout", "Log Out", null, clickListener));
  
  return menuPanel;
}

MenuPage.prototype._createMenuItem = function(itemId, text, icon, clickCallback) {
  var itemElement = UIUtils.createBlock(itemId);
  
  itemElement.setAttribute("class", "menupage-menuitem");
  itemElement.innerHTML = text;
    
  itemElement.onclick = clickCallback.bind(this, itemId);

  return itemElement;
}

MenuPage.prototype._createMenuSeparator = function() {
  var separatorElement = UIUtils.createBlock();
  separatorElement.setAttribute("class", "menupage-menuseparator");

  return separatorElement;
}


MenuPage.prototype._selectMenuItem = function(itemId) {
  if (this.selectedMenuItemId == itemId) {
    return;
  }
  
  if (this.selectedMenuItemId != null) {
    $("#" + this.selectedMenuItemId).removeClass("menupage-menuitem-selected");
    var page = this._getPageForItem(this.selectedMenuItemId);
    page.hide();
  }
  this.selectedMenuItemId = itemId;
  $("#" + this.selectedMenuItemId).addClass("menupage-menuitem-selected");
  
  var page = this._getPageForItem(itemId);
  page.show(this.contentPanel);
}

MenuPage.prototype._getPageForItem = function(itemId) {
  return new LoginPage();;
}
