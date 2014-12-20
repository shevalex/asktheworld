
PisoftTabbedPane = ClassUtils.defineClass(PisoftComponent, function PisoftTabbedPane(uniqueId) {
  PisoftComponent.call(this, uniqueId, "pisoft-tabbedpane pisoft-rounded-border");
    
  this.pagePanelElement = document.createElement("div");

  this.tabs = [];
});


PisoftTabbedPane.prototype.buildComponentStructure = function() {
  var tabPanelElement = document.createElement("div");
  tabPanelElement.style.display = "block";
  tabPanelElement.style.cssFloat = "left";
    
  this.pagePanelElement.style.display = "block";
  this.pagePanelElement.style.cssFloat = "right";
    
    
  for (var index in this.tabs) {
    var tabElement = document.createElement("div");
    tabElement.setAttribute("class", "ps-tabbedpane-tab");
    tabElement.innerHTML = this.tabs[index].name;
    tabElement.onclick = this.selectTab.bind(this, parseInt(index));
    tabPanelElement.appendChild(tabElement);
  }

  this.getHtmlElement().appendChild(tabPanelElement);
  this.getHtmlElement().appendChild(this.pagePanelElement);
    
  if (this.tabs.length > 0) {
    this.selectTab(0);
  }
}


PisoftTabbedPane.prototype.addTab = function(tabName, pisoftComponent) {
  var pageElement = document.createElement("div");
  pageElement.setAttribute("class", "ps-tabbedpane-page");
  if (pisoftComponent != null) {
    pisoftComponent.attachToContainer(pageElement);
  }
  this.tabs.push({ name: tabName, pageElement: pageElement });
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
    if (this.pagePanelElement.firstChild != null) {
      this.pagePanelElement.removeChild(this.pagePanelElement.firstChild);
    }
    this.pagePanelElement.appendChild(this.tabs[selectedIndex].pageElement);
  } else {
    console.error("Incorrect tab name or index: " + + tabName);   
  }
}

