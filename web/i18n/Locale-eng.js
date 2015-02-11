var Locale_eng = {
  "images": {
  },
  "literals": {
    "ServerErrorMessage": "Server communication error",
    "FileTooBigMessage": "File is too big",
    
    
    "TargetGenderLabel": "Target gender",
    "TargetAgeGroupLabel": "Target age group",
    "WaitTimeLabel": "How long do you want to wait",
    "NumOfResponsesLabel": "Maximum # of responses you want"
    
  },
  "pages": {
    "LoginPage": {
      "EmailLoginLabel": "Email (login)",
      "PasswordLabel": "Password",
      "RememberLoginLabel": "Remember You?",
      "SignInButton": "Sign In",
      "ForgotPassowrdLink": "Forgot your password?",
      "RegisterLink": "Register",
      
      "InvalidCredentialsMessage": "Invalid login/password combination",
      "InvalidLoginMessage": "Please provide a valid email for your login",
      "ProvideLoginPasswordMessage": "Please provide login and password",
      "PasswordResetMessage": "You will receive an email shortly with a link to reset the password. You may ignore the email if you do not need to reset your password.",
      "PasswordResetRequestMessage": "The request is being sent...",
      "IncorrectEmailMessage": "Your login does not look like a valid email",
      
      "ProjectDescriptionHtml": "Here is where we will place our logo as well as the text which will describe what this project is",
      "DownloadMobileAppsHtml": "Download the mobile app and stay connected whenever you are!<p><center><a href='https://play.google.com/store' target='_blank'>AskTheWorld for Android</a><p><a href='http://store.apple.com/us' target='_blank'>AskTheWorld for iOS</a><center>"
    },
    "RegisterPage": {
      "ProjectDescriptionHtml": "By registering you will get an instant access to the secret technology that we provide",
      "SignInProvider": function(signInLinkId) { return "Already have an account?<br>Click <a href='#' id='" + signInLinkId + "'>Sign In</a>."; },
      "YourEmailLabel": "Your Email",
      "YourNicknameLabel": "Your Nickname",
      "YourGenderLabel": "Your Gender",
      "YourAgeCategoryLabel": "Your Age Category",
      "YourLanguagesLabel": "Languages that you speak",
      "PasswordLabel": "Password",
      "RetypePasswordLabel": "Re-type Password",
      "AcceptTermsProvider": function(linkId) { return "Please accept <a href='#' id='" + linkId + "'>Terms And Conditions</a>"; },
      "RegisterButton": "Register",
      
      "ProvideLoginMessage": "The email is not provided or does not look like a valid email address",
      "ProvideNicknameMessage": "You must provide a nickname",
      "ProvideLanguageMessage": "One or more languages must be set",
      "ProvideCorrectPasswordMessage": "Password should be at least 5 symbols long",
      "PasswordsDoNotMatchMessage": "Passwords do not match. Please retype.",
      "MustAcceptTermsMessageProvider": function(linkId) { return "You must accept<p><a href='#' id='" + linkId + "'><b>Terms And Conditions<b></a>"; },
      "AccountCreationFailedMessage": "Failed to create an account",
      "AccountAlreadyExistsMessage": "This login (email) was already used"
    },
    "WelcomePage": {
      "WelcomeProvider": function(name) { return "Welcome, " + name + "<p> We are gald to see you in here. This super site gives you access to an absolutely unique abilities and experiences. Here is how you should use it"; },
      "GoBackLinkProvider": function(linkId) { return "Click <a href='#' id='" + linkId + "'>Home</a> to start!"; }
    },
    "HomePage": {
      "WelcomeProvider": function(name) { return "Welcome, " + name + "."; },
      "ActiveOutgoingRequestsLinkProvider": function(linkId) { return "You can always find all your active requests in the <a href='#' id='" + linkId + "'>Active Requests</a> section."; },
      "OutgoingRequestsStatisticProvider": function(numOfRequests, numOfResponses) { return "You have " + numOfResponses + " unviewed responses for " + numOfRequests + " your requests"},
      "ActiveIncomingRequestsLinkProvider": function(linkId) { return "See all incoming inquiries in <a href='#' id='" + linkId + "'>Active Inquiries</a> section."; },
      "IncomingRequestsStatisticProvider": function(numOfRequests) { return "You have " + numOfRequests + " unanswered requests"; }
    },
    "NewRequestPage": {
      "OutlineText": "Asking The World is just that easy. You are only three steps away.",
      "StepOneLabel": "1. Type in the text of your request first...",
      "StepTwoLabel": "2. Choose who will see your question",
      "ModifySettingsLinkProvider": function(linkId) { return "Note: You can always modify your defaut settings in <a href='#' id='" + linkId + "'>Your Preferences</a>"; },
      "StepThreeLabel": "3. And finally send it out!",
      "SendButton": "Ask The World!",
      "ResetButton": "Reset",
      "RequestEmptyMessage": "Please create a message",
      "RequestSentMessage": "New request was successfully sent",
      "RequestFailedMessage": "Failed to send a request. Try again later",
    }
  }
}