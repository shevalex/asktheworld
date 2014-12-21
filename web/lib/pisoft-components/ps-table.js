
PisoftTable = ClassUtils.defineClass(PisoftComponent, function PisoftPlainList(uniqueId, dataModel) {
  PisoftComponent.call(this, uniqueId, "pisoft-table display", "", "table");
  
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
  $("#" + this.getId()).dataTable({
    data: this.dataModel.getData(),
    columns: this.dataModel.getColumns()
  });
}

PisoftTable.prototype.setMargin = function() {
  //this.getHtmlElement().setAttribute();
}

