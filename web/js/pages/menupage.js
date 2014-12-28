MenuPage = ClassUtils.defineClass(AbstractPage, function MenuPage() {
  AbstractPage.call(this, "MenuPage");
  
  this._contentPanel = null;
  this._selectedMenuItemId = null;
  
  this._homePage = null;
  this._newRequestPage = null;
  this._userProfilePage = null;
});

MenuPage.prototype.HOME_ITEM_ID = "MenuPage-MenuPanel-Home";
MenuPage.prototype.NEW_REQUEST_ITEM_ID = "MenuPage-MenuPanel-NewRequest";
MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID = "MenuPage-MenuPanel-ActiveRequests";
MenuPage.prototype.ALL_REQUESTS_ITEM_ID = "MenuPage-MenuPanel-AllRequests";
MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID = "MenuPage-MenuPanel-ActiveInquiries";
MenuPage.prototype.ALL_INQUIRIES_ITEM_ID = "MenuPage-MenuPanel-AllInquiries";
MenuPage.prototype.USER_PROFILE_ITEM_ID = "MenuPage-MenuPanel-UserProfile";
MenuPage.prototype.USER_PREFERENCES_ITEM_ID = "MenuPage-MenuPanel-UserPreferences";
MenuPage.prototype.LOGOUT_ITEM_ID = "MenuPage-MenuPanel-Logout";


MenuPage.prototype.definePageContent = function(root) {
  root.appendChild(this._createMenuPanel());
  
  this._contentPanel = root.appendChild(UIUtils.createBlock("MenuPage-ContentPanel"));
  
  this.selectMenuItem("MenuPage-MenuPanel-Home");
}


MenuPage.prototype.selectMenuItem = function(itemId) {
  if (this._selectedMenuItemId == itemId) {
    return;
  }
  
  if (this._selectedMenuItemId != null) {
    $("#" + this._selectedMenuItemId).removeClass("menupage-menuitem-selected");
    var page = this._getPageForItem(this._selectedMenuItemId);
    page.hideAnimated();
  }
  
  
  // Special processing for log-out
  if (itemId == MenuPage.prototype.LOGOUT_ITEM_ID) {
    Backend.logOut(Application.showLoginPage.bind(Application));
    return;
  }
  
  this._selectedMenuItemId = itemId;
  $("#" + this._selectedMenuItemId).addClass("menupage-menuitem-selected");
  
  var page = this._getPageForItem(itemId);
  page.showAnimated(this._contentPanel);
}



MenuPage.prototype._createMenuPanel = function() {
  var menuPanel = UIUtils.createBlock("MenuPage-MenuPanel");

  var clickListener = function(itemId) {
    this.selectMenuItem(itemId);
  };
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.HOME_ITEM_ID, "Home", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.NEW_REQUEST_ITEM_ID, "Create New Request", null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID, "Active Requests", null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID, "All Requests", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID, "Active Inquiries", null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ALL_INQUIRIES_ITEM_ID, "All Inquiries", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.USER_PROFILE_ITEM_ID, "Your Profile", null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID, "Your Preferences", null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.LOGOUT_ITEM_ID, "Log Out", null, clickListener));
  
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


MenuPage.prototype._getPageForItem = function(itemId) {
  if (itemId == MenuPage.prototype.HOME_ITEM_ID) {
    if (this._homePage == null) {
      this._homePage = new HomePage();
    }
    return this._homePage;
  } else if (itemId == MenuPage.prototype.NEW_REQUEST_ITEM_ID) {
    if (this._newRequestPage == null) {
      this._newRequestPage = new NewRequestPage();
    }
    return this._newRequestPage;
  } else if (itemId == MenuPage.prototype.USER_PROFILE_ITEM_ID) {
    if (this._userProfilePage == null) {
      this._userProfilePage = new UserProfilePage();
    }
    return this._userProfilePage;
  } else {
    if (this._newRequestPage == null) {
      this._newRequestPage = new LoginPage();
    }
    return this._newRequestPage;
  }
}
