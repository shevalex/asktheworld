
var Backend = {};

Backend.UserProfile = {"email": null, "password": null, "gender": null, "age": null, "name": null};

Backend.verifyUserIdentity = function(email, password) {
  return true;
}

Backend.registerUser = function(userProfile) {
  this.UserProfile.email = userProfile.email;
  this.UserProfile.password = userProfile.password;
  this.UserProfile.gender = userProfile.gender;
  this.UserProfile.age = userProfile.age;
  this.UserProfile.name = userProfile.name;
  return true;
}

Backend.updateUser = function(userProfile) {
  this.UserProfile.password = userProfile.password;
  this.UserProfile.gender = userProfile.gender;
  this.UserProfile.age = userProfile.age;
  this.UserProfile.name = userProfile.name;
  return true;
}


Backend.getUserProfile = function() {
  if (true) {
    return this.UserProfile;
  } else {
    return null;
  }
}

