
PisoftTable = ClassUtils.defineClass(PisoftComponent, function PisoftPlainList(uniqueId, dataModel) {
  PisoftComponent.call(this, uniqueId, "pisoft-table pisoft-rounded-border");
  this.getHtmlElement().setAttribute("width", "100%");
  
  //this.setMargin(margin);
  this.dataModel = dataModel;
});

PisoftTable.DataModel = ClassUtils.defineClass(Object, function DataModel(columnProvider, dataProvider) {
  this.columnProvider = columnProvider;
  this.dataProvider = dataProvider;
});
PisoftTable.DataModel.prototype.getData = function() {
  return this.dataProvider();
}
PisoftTable.DataModel.prototype.getColumns = function() {
  var result = [];
  var columnNames = this.columnProvider();
  for (var index in columnNames) {
    result.push({ title: columnNames[index] });
  }
  
  return result;
}


PisoftTable.prototype.buildComponentStructure = function() {
  var tableElement = document.createElement("table");
  tableElement.setAttribute("class", "display");
  var tableElementId = this.getId() + "-Table";
  tableElement.setAttribute("id", tableElementId);
  
  this.getHtmlElement().appendChild(tableElement);
  
  $("#" + tableElementId).dataTable({
    data: this.dataModel.getData(),
    columns: this.dataModel.getColumns()
  });
}

PisoftTable.prototype.setMargin = function() {
  //this.getHtmlElement().setAttribute();
}

