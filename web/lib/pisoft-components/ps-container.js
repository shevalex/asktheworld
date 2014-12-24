
PisoftContainer = ClassUtils.defineClass(PisoftComponent, function PisoftContainer(uniqueId, cssClass) {
  cssClass = cssClass != null ? " " + cssClass : "";
  PisoftComponent.call(this, uniqueId, "pisoft-container pisoft-rounded-border" + cssClass);
  this.children = [];
});

PisoftContainer.prototype.buildComponentStructure = function() {
  for (var index in this.children) {
    var child = this.children[index];
    if (child instanceof PisoftComponent) {
      child.attachToContainer(this);
    } else {
      this.getHtmlElement().appendChild(child);
    }
  }
}


PisoftContainer.prototype.addChild = function(child) {
  this.children.push(child);
  this.update();
}

