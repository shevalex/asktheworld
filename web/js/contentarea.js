var ContentArea = {
  requestArea: null,
  inquiryArea: null,
  contactUsArea: null
};

ContentArea.initialize = function() {
  this.requestArea = this.createRequestArea();
}

ContentArea.showRequestsPage = function() {
//  this.inquiryArea.removeFromContainer();
//  this.contactUsArea.removeFromContainer();
  this.requestArea.attachToContainer("ContentArea");
}



ContentArea.createRequestArea = function() {
  var requestArea = new PisoftTabbedPane("RequestManagementPane", "10px");
    
  var dataModel = new PisoftTable.DataModel(function() {
    return [ "A", "B", "C" ];
  }, function() {
    return [ ["A1", "B1", "C1" ], ["A2", "B2", "C2" ] ];
  });
  requestArea.addTab("Active", new PisoftTable("RequestTable", dataModel));
  requestArea.addTab("Archived", new PisoftButton("TestBtn2", "Some Other Long Text"));
  
  return requestArea;
}


