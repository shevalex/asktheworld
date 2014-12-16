
PisoftButton = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayName) {
  PisoftComponent.call(this, uniqueId);
  this.displayName = displayName;
});

PisoftButton.prototype.CSS_CLASS = "pisoft-button pisoft-rounded-border";


PisoftButton.prototype.getHtml = function() {
  return "<div id='" + this.uniqueId + "' class='" + PisoftButton.prototype.CSS_CLASS + "'>" + this.displayName + "</div>";
}
