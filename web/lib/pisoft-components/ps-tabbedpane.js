
PisoftTabbedPane = ClassUtils.defineClass(PisoftComponent, function PisoftTabbedPane(uniqueId, tabPadding) {
  PisoftComponent.call(this, uniqueId, "pisoft-tabbedpane");
    
  this.pagePanelElement = document.createElement("div");
  this.tabPadding = tabPadding;
  this.tabs = [];
});


PisoftTabbedPane.prototype.buildComponentStructure = function() {
  var tabPanelElement = document.createElement("div");
  tabPanelElement.setAttribute("class",  "pisoft-non-selectable");
  tabPanelElement.style.display = "block";
  tabPanelElement.style.cssFloat = "left";
    
  this.pagePanelElement.style.display = "block";
  this.pagePanelElement.style.cssFloat = "right";
    
  for (var index in this.tabs) {
    tabPanelElement.appendChild(this.tabs[index].tabElement);
    if (this.tabPadding != null) {
      this.tabs[index].tabElement.style.paddingTop = this.tabPadding;
      this.tabs[index].tabElement.style.paddingBottom = this.tabPadding;
    }
  }

  this.getHtmlElement().appendChild(tabPanelElement);
  this.getHtmlElement().appendChild(this.pagePanelElement);
    
  if (this.tabs.length > 0) {
    this.selectTab(0);
  }
}


PisoftTabbedPane.prototype.addTab = function(tabName, pisoftComponent) {
  var pageElement = document.createElement("div");
  pageElement.setAttribute("class", "pisoft-tabbedpane-page");
  if (pisoftComponent != null) {
    pisoftComponent.attachToContainer(pageElement);
  }

  var tabElement = document.createElement("div");
  tabElement.innerHTML = tabName;
  tabElement.onclick = this.selectTab.bind(this, parseInt(this.tabs.length));
    
  this.tabs.push({ name: tabName, tabElement: tabElement, pageElement: pageElement });
  this.update();
    
  return pageElement;
}

PisoftTabbedPane.prototype.getTab = function(tabName) {
  for (var index in this.tabs) {
    if (this.tabs[index].name === tabName) {
      return this.tabs.pageElement;
    }
  }
      
  return null;
}

PisoftTabbedPane.prototype.selectTab = function(tabName) {
  var selectedIndex = -1;
    
  if (typeof tabName === "string") {
    for (var index in this.tabs) {
      if (this.tabs[index].name === tabName) {
        selectedIndex = index;
      }
    }
  } else if (typeof tabName === "number") {
    selectedIndex = tabName;
  }

  if (selectedIndex >= 0 && selectedIndex < this.tabs.length) {
    for (var index in this.tabs) {
      if (index == selectedIndex) {
        this.tabs[index].tabElement.setAttribute("class", "pisoft-tabbedpane-tab  pisoft-rounded-border pisoft-tabbedpane-tab-selected");
      } else {
        this.tabs[index].tabElement.setAttribute("class", "pisoft-tabbedpane-tab pisoft-rounded-border");
      }
    }

    if (this.pagePanelElement.firstChild != null) {
      this.pagePanelElement.removeChild(this.pagePanelElement.firstChild);
    }
    this.pagePanelElement.appendChild(this.tabs[selectedIndex].pageElement);
  } else {
    console.error("Incorrect tab name or index: " + + tabName);   
  }
}

