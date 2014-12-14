
var Backend = {};

Backend.SERVER_BASE_URL = "http://env-7303452.whelastic.net/asktheworld/";

Backend.UserProfile = {"email": null, "password": null, "gender": null, "age": null, "name": null, "userId": null};

Backend.verifyUserIdentity = function(email, password, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        this.UserProfile.userId = data.userId;
        callback.success();
      } else {
        callback.failure();
      }
    },
    error: function(xhr, status, error) {
      callback.error();
    }
  }
  this.communicate("user?login=" + email, "GET", null, communicationCallback);
}

Backend.registerUser = function(userProfile, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      this.UserProfile.email = userProfile.email;
      this.UserProfile.password = userProfile.password;
      this.UserProfile.gender = userProfile.gender;
      this.UserProfile.age = userProfile.age;
      this.UserProfile.name = userProfile.name;

      this.UserProfile.userId = xhr.getResponseHeader("Location");
      if (xhr.status == 201) {
        callback.success();
      } else {
        callback.conflict();
      }
    },
    error: function(xhr, status, error) {
      callback.error();
    }
  }
  this.communicate("user", "POST", { login: userProfile.email, password: userProfile.password }, communicationCallback);
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


Backend.communicate = function(resource, method, data, callback) {
  $.ajax({
    url: Backend.SERVER_BASE_URL + resource,
    type: method,
    data: data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: callback.success,
    error: callback.error
  });
}