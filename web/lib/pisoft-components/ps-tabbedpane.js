
PisoftTabbedPane = ClassUtils.defineClass(PisoftComponent, function PisoftTabbedPane(uniqueId, tabPadding) {
  PisoftComponent.call(this, uniqueId, "pisoft-tabbedpane pisoft-rounded-border");
    
  this.pagePanelElement = document.createElement("div");
  this.tabPadding = tabPadding;
  this.tabs = [];
  
  this.selectedIndex = -1;
});


PisoftTabbedPane.prototype.buildComponentStructure = function() {
  var tabPanelElement = document.createElement("div");
  tabPanelElement.setAttribute("class",  "pisoft-non-selectable");
  tabPanelElement.style.display = "block";
  tabPanelElement.style.cssFloat = "left";
  tabPanelElement.style.width = "200px";
    
  this.pagePanelElement.style.display = "block";
  this.pagePanelElement.style.cssFloat = "right";
  this.pagePanelElement.style.width = "calc(100% - 200px)";
    
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

  var tabElement = document.createElement("div");
  tabElement.innerHTML = tabName;
  tabElement.onclick = this.selectTab.bind(this, parseInt(this.tabs.length));
    
  this.tabs.push({ name: tabName, tabElement: tabElement, pageElement: pageElement, pageContent: pisoftComponent });
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
  if (this.selectedIndex != -1) {
    this.tabs[this.selectedIndex].pageContent.detachFromContainer();
    if (this.pagePanelElement.firstChild != null) {
      this.pagePanelElement.removeChild(this.pagePanelElement.firstChild);
    }
  }
  
  this.selectedIndex = -1;
  if (typeof tabName === "string") {
    for (var index in this.tabs) {
      if (this.tabs[index].name === tabName) {
        this.selectedIndex = index;
      }
    }
  } else if (typeof tabName === "number") {
    this.selectedIndex = tabName;
  }

  if (this.selectedIndex >= 0 && this.selectedIndex < this.tabs.length) {
    for (var index in this.tabs) {
      if (index == this.selectedIndex) {
        this.tabs[index].tabElement.setAttribute("class", "pisoft-tabbedpane-tab  pisoft-rounded-border pisoft-tabbedpane-tab-selected");
      } else {
        this.tabs[index].tabElement.setAttribute("class", "pisoft-tabbedpane-tab pisoft-rounded-border");
      }
    }

    this.pagePanelElement.appendChild(this.tabs[this.selectedIndex].pageElement);
    this.tabs[this.selectedIndex].pageContent.attachToContainer(this.tabs[this.selectedIndex].pageElement);
  } else {
    console.error("Incorrect tab name or index: " + + tabName);   
  }
}

