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
  var requestArea = new PisoftTabbedPane("RequestManagementPage", "10px");
    
  var dataModel = new PisoftTable.DataModel(function() {
    return [ {title: "A", width: "20%"}, {title: "B", width: "20%"}, {title: "C", width: "60%"} ];
  }, function() {
    return [ ["A1", "B1", "C1" ], ["A2", "B2", "C2" ] ];
  });
  
  
  var requestManagementContainer = new PisoftContainer("RequestManagementContainer");
  
  var requestTable = new PisoftTable("RequestTable", dataModel);
  requestTable.setSelectionListener(function(index) {
    //console.debug("Request table row " + index + " selected");
    var edditingPane = this.createRequestEdittingPane();
  });
  requestManagementContainer.addChild(requestTable);

  var edditingPane = this.createRequestEdittingPane();
  requestManagementContainer.addChild(edditingPane);
  
  requestArea.addTab("Active", requestManagementContainer);
  requestArea.addTab("Archived", new PisoftButton("TestBtn2", "Some Other Long Text"));
  
  return requestArea;
}

ContentArea.createRequestEdittingPane = function() {
  var panel = document.createElement("div");
  panel.setAttribute("id", "RequestEdditingPane");
  
  var textArea = document.createElement("textarea");
  textArea.setAttribute("id", "RequestEdditingPane-TextArea");
  textArea.setAttribute("rows", "5");
  panel.appendChild(textArea);
  
  return panel;
}
