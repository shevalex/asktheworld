var ContentArea = {
  tabbedArea: null
};

ContentArea.initialize = function() {
  this.tabbedArea = new PisoftTabbedPane("ContentTabbedPane", "10px");
    
  this.tabbedArea.addTab("Active", new PisoftButton("TestBtn", "Some Long Text"));
  this.tabbedArea.addTab("Archived", new PisoftButton("TestBtn2", "Some Other Long Text"));

  this.tabbedArea.attachToContainer("ContentArea");
}

ContentArea.showRequestsPage = function() {
  
}



