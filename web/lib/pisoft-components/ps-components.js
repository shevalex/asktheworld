
// Label

PisoftLabel = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayText) {
  PisoftComponent.call(this, uniqueId, "pisoft-label", displayText);
});



// Button

PisoftButton = ClassUtils.defineClass(PisoftComponent, function PisoftButton(uniqueId, displayName) {
  PisoftComponent.call(this, uniqueId, "pisoft-solidbutton pisoft-button pisoft-rounded-border", displayName);
});

PisoftLinkButton = ClassUtils.defineClass(PisoftComponent, function PisoftLinkButton(uniqueId, displayName) {
  PisoftComponent.call(this, uniqueId, "pisoft-linkbutton pisoft-button pisoft-rounded-border-active", displayName);
});




// Input components

PisoftInputComponent = ClassUtils.defineClass(PisoftComponent, function PisoftInputComponent(uniqueId, type, cssClasses) {
  PisoftComponent.call(this, uniqueId, "pisoft-inputcomponent " + cssClasses, "", "input type=" + type);
});

PisoftInputField = ClassUtils.defineClass(PisoftInputComponent, function PisoftInputField(uniqueId) {
  PisoftInputComponent.call(this, uniqueId, "text", "pisoft-inputfield");
});

PisoftInputPassword = ClassUtils.defineClass(PisoftInputComponent, function PisoftInputPassword(uniqueId) {
  PisoftInputComponent.call(this, uniqueId, "password", "pisoft-inputpassword");
});
