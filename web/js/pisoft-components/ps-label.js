
PisoftLabel = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayText) {
  PisoftComponent.call(this, uniqueId);
  this.displayText = displayText;
});

PisoftLabel.prototype.CSS_CLASS = "pisoft-label";


PisoftLabel.prototype.getHtml = function() {
  return "<div id='" + this.uniqueId + "' class='" + PisoftLabel.prototype.CSS_CLASS + "'>" + this.displayText + "</div>";
}

PisoftLabel.prototype.setText = function(displayText) {
  this.displayText = displayText;
  this.update();
}
