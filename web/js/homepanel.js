var HomePanel = {};

HomePanel.show = function() {
  $("#ContentArea").html(this.getHomePanelHtml());
}


HomePanel.getHomePanelHtml = function() {
  return "<div id='HomePanel' class='ui-widget-content ui-corner-all'>Home Screen</div>";
}

