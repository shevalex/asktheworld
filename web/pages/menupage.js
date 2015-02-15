MenuPage = ClassUtils.defineClass(AbstractPage, function MenuPage() {
  AbstractPage.call(this, "MenuPage");
  
  this._contentPanel = null;
  this._selectedMenuItemId = null;
  this._activePage = null;
  
  this._homePage = null;
  this._newRequestPage = null;
  this._activeRequestsPage = null;
  this._allRequestsPage = null;
  this._activeInquiriesPage = null;
  this._allInquiriesPage = null;
  this._requestDetailsPage = null;
  this._userProfilePage = null;
  this._userPreferencesPage = null;
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

MenuPage.prototype.REQUEST_DETAILS_PAGE_ID = "MenuPage-RequestDetailsPage";


MenuPage.prototype.definePageContent = function(root) {
  this._appendMenuPanel(root);
  
  this._contentPanel = UIUtils.appendBlock(root, "ContentPanel");
}

MenuPage.prototype.onShow = function(root) {
  this.showPage(MenuPage.prototype.HOME_ITEM_ID);
}

MenuPage.prototype.onHide = function() {
  this._selectedMenuItemId = null;
  this._activePage = null;
}


MenuPage.prototype.showPage = function(pageId, paramBundle, observer) {
  var newPage = this._getPageForItem(pageId);
  if (newPage == null) {
    newPage = this._getPageById(pageId);
  }
  if (newPage == null) {
    console.error("No page for id " + pageId);
    return;
  }
  
  if (this._activePage == newPage) {
    return;
  }
  
  var hasMenuItem = $("#" + pageId).length > 0;
  
  if (hasMenuItem && this._selectedMenuItemId != null) {
    $("#" + this._selectedMenuItemId).removeClass("menupage-menuitem-selected");
  }
  
  // Special processing for log-out
  if (pageId == MenuPage.prototype.LOGOUT_ITEM_ID) {
    Backend.logOut(function() {
      Application.reset();
      Application.showPage(Application.LOGIN_PAGE_ID);
    });
    return;
  }
  
  if (hasMenuItem) {
    this._selectedMenuItemId = pageId;
    $("#" + this._selectedMenuItemId).addClass("menupage-menuitem-selected");
  }
  
  
  if (this._activePage != null) {
    Application.hideSpinningWheel();
    this._activePage.hide();
  }
  
  this._activePage = newPage;
  this._activePage.showAnimated(this._contentPanel, paramBundle, observer);
}


MenuPage.prototype._appendMenuPanel = function(root) {
  var menuPanel = UIUtils.appendBlock(root, "MenuPanel");

  var clickListener = function(itemId) {
    Application.showMenuPage(itemId);
  };
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.HOME_ITEM_ID, this.getLocale().HomeMenuItem, null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.NEW_REQUEST_ITEM_ID, this.getLocale().CreateNewRequestItem, null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID, this.getLocale().ActiveOutgoingRequestsItem, null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ALL_REQUESTS_ITEM_ID, this.getLocale().AllOutgoingRequestsItem, null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID, this.getLocale().ActiveIncomingRequestsItem, null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.ALL_INQUIRIES_ITEM_ID, this.getLocale().AllIncomingRequestsItem, null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());
  
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.USER_PROFILE_ITEM_ID, this.getLocale().ProfileItem, null, clickListener));
  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.USER_PREFERENCES_ITEM_ID, this.getLocale().PreferencesItem, null, clickListener));
  menuPanel.appendChild(this._createMenuSeparator());

  menuPanel.appendChild(this._createMenuItem(MenuPage.prototype.LOGOUT_ITEM_ID, this.getLocale().LogOutItem, null, clickListener));
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
  } else if (itemId == MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID) {
    if (this._activeRequestsPage == null) {
      this._activeRequestsPage = new ActiveOutgoingRequestsPage();
    }
    return this._activeRequestsPage;
  } else if (itemId == MenuPage.prototype.ALL_REQUESTS_ITEM_ID) {
    if (this._allRequestsPage == null) {
      this._allRequestsPage = new AllOutgoingRequestsPage();
    }
    return this._allRequestsPage;
  } else if (itemId == MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID) {
    if (this._activeInquiriesPage == null) {
      this._activeInquiriesPage = new ActiveIncomingRequestsPage();
    }
    return this._activeInquiriesPage;
  } else if (itemId == MenuPage.prototype.ALL_INQUIRIES_ITEM_ID) {
    if (this._allInquiriesPage == null) {
      this._allInquiriesPage = new AllIncomingRequestsPage();
    }
    return this._allInquiriesPage;
  } else if (itemId == MenuPage.prototype.USER_PROFILE_ITEM_ID) {
    if (this._userProfilePage == null) {
      this._userProfilePage = new UserProfilePage();
    }
    return this._userProfilePage;
  } else if (itemId == MenuPage.prototype.USER_PREFERENCES_ITEM_ID) {
    if (this._userPreferencesPage == null) {
      this._userPreferencesPage = new UserPreferencesPage();
    }
    return this._userPreferencesPage;
  } else {
    return null;
  }
}

MenuPage.prototype._getPageById = function(pageId) {
  if (pageId == MenuPage.prototype.REQUEST_DETAILS_PAGE_ID) {
    if (this._requestDetailsPage == null) {
      this._requestDetailsPage = new RequestDetailsPage();
    }
    return this._requestDetailsPage;
  } else {
    return null;
  }
}