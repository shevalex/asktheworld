HomePage = ClassUtils.defineClass(AbstractPage, function HomePage() {
  AbstractPage.call(this, "HomePage");
});

HomePage.prototype.definePageContent = function(root) {
  root.appendChild(UIUtils.createBlock("HomePage-GeneralPanel"));
  $("#HomePage-GeneralPanel").html("Welcome " + Backend.getUserProfile().name + ".");

  root.appendChild(UIUtils.createBlock("HomePage-RequestPanel"));
  $("#HomePage-RequestPanel").html("You have unviewed responses for your <a href='#' id='HomePage-RequestLink'>requests</a>.");
  $("#HomePage-RequestLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_REQUESTS_ITEM_ID);
  });

  root.appendChild(UIUtils.createBlock("HomePage-InquiryPanel"));
  $("#HomePage-InquiryPanel").html("You have (so many) <a href='#' id='HomePage-InquirtyLink'>new inquiries</a> which you haven't responded yet.");
  $("#HomePage-InquirtyLink").click(function() {
    Application.getMenuPage().selectMenuItem(MenuPage.prototype.ACTIVE_INQUIRIES_ITEM_ID);
  });
}

