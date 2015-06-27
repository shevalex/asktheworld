var Account = {
}


Account.canOpenFileController = function(file) {
  if (file.size > 5 * 1024000) {
    var learnMoreLinkId = "RemoveLimitationsLink";
    Application.showMessage(I18n.getLocale().literals.FileTooBigMessage(learnMoreLinkId));
    
    UIUtils.setClickListener(learnMoreLinkId, function() {
      Application.showPage(WelcomePage.name);
    });
    
    return false;
  }
  
  return true;
}