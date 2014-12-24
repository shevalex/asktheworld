
PisoftTable = ClassUtils.defineClass(PisoftContainer, function PisoftPlainList(uniqueId, dataModel) {
  PisoftContainer.call(this, uniqueId, "pisoft-table");
  this.getHtmlElement().setAttribute("width", "100%");
  
  //this.setMargin(margin);
  this.dataModel = dataModel;
  this.selectionListener = null;
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
    result.push({ title: columnNames[index].title, width: columnNames[index].width });
  }
  
  return result;
}


PisoftTable.prototype.buildComponentStructure = function() {
  var tableElement = document.createElement("table");
  tableElement.setAttribute("class", "display");
  var tableElementId = this.getId() + "-Table";
  tableElement.setAttribute("id", tableElementId);
  
  this.getHtmlElement().appendChild(tableElement);
  
  var dataTableObject = $("#" + tableElementId).DataTable({
    data: this.dataModel.getData(),
    columns: this.dataModel.getColumns()
  });
  
  var pisoftTable = this;
  dataTableObject.on("click", "tr", function() {
    dataTableObject.$("tr.selected").removeClass("selected");
    $(this).addClass("selected");

    if (pisoftTable.selectionListener != null) {
      pisoftTable.selectionListener(dataTableObject.row(this).index());
    }
  });
}

PisoftTable.prototype.setMargin = function() {
  //this.getHtmlElement().setAttribute();
}

PisoftTable.prototype.setSelectionListener = function(listener) {
  this.selectionListener = listener;
}
