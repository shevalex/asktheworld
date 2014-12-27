
var Backend = {};

Backend.SERVER_BASE_URL = "http://env-7303452.whelastic.net/asktheworld2/";

Backend.UserProfile = {"login": null, "password": null, "gender": null, "languages": [], "age": null, "name": null, "userId": null};

Backend.getUserProfile = function() {
  return this.UserProfile;
}

Backend.logIn = function(login, password, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile.login = login;
      Backend.UserProfile.password = password;
      Backend.UserProfile.userId = data.userId;

      Backend.pullUserProfile(callback);
    },
    error: function(xhr, status, error) {
      if (xhr.status == 404) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }
  this.communicate("user?login=" + login, "GET", null, true, communicationCallback);
}

Backend.pullUserProfile = function(callback) {
  if (Backend.UserProfile.userId == null) {
    throw "Must login or register first";
  }
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile.languages = data.languages;
      Backend.UserProfile.gender = data.gender;
      Backend.UserProfile.name = data.name;
      Backend.UserProfile.age = data.birth_year;
      Backend.UserProfile.languages = data.languages;

      callback.success();
    },
    error: function(xhr, status, error) {
      if (xhr.status == 404) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }
  this.communicate("user/" + Backend.UserProfile.userId, "GET", null, true, communicationCallback);
}

Backend.registerUser = function(userProfile, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        Backend.UserProfile.userId = xhr.getResponseHeader("Location");
        
        Backend.pullUserProfile(callback);
      } else {
        callback.error();
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 409) {
        callback.conflict();
      } else {
        callback.error();
      }
    }
  }
  this.communicate("user", "POST",
    {
      login: userProfile.login,
      password: userProfile.password,
      gender: userProfile.gender,
//      age: userProfile.age,
      name: userProfile.name
//      languages: userProfile.languages
    }, 
    false, communicationCallback);
}

Backend.updateUser = function(userProfile, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile.password = userProfile.password;
      Backend.UserProfile.gender = userProfile.gender;
      Backend.UserProfile.age = userProfile.age;
      Backend.UserProfile.name = userProfile.name;
      Backend.UserProfile.languages = userProfile.languages;

      callback.success();
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }

  this.communicate("user/" + Backend.UserProfile.userId, "PUT",
    { 
      password: userProfile.password,
      gender: userProfile.gender,
//      age: userProfile.age,
//      name: userProfile.name,
      languages: userProfile.languages
    },
    false, communicationCallback);

  return true;
}



Backend.communicate = function(resource, method, data, isJsonResponse, callback) {
  $.ajax({
    url: Backend.SERVER_BASE_URL + resource,
    type: method,
    data: data != null ? JSON.stringify(data) : "",
    contentType: "application/json; charset=utf-8",
    dataType: isJsonResponse ? "json" : "text",
    success: callback.success,
    error: callback.error
  });
}
