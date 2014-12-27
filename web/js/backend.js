
var Backend = {};

Backend.SERVER_BASE_URL = "http://env-7303452.whelastic.net/asktheworld3s/";

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
  this._communicate("user?login=" + login, "GET", null, true, this._getAuthenticationHeader(login, password), communicationCallback);
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
  this._communicate("user/" + Backend.UserProfile.userId, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.registerUser = function(userProfile, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        Backend.UserProfile.login = userProfile.login;
        Backend.UserProfile.password = userProfile.password;
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
  this._communicate("user", "POST",
    {
      login: userProfile.login,
      password: userProfile.password,
      gender: userProfile.gender,
//      age: userProfile.age,
      name: userProfile.name
//      languages: userProfile.languages
    }, 
    false, {}, communicationCallback);
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

  this._communicate("user/" + Backend.UserProfile.userId, "PUT",
    { 
      password: userProfile.password,
      gender: userProfile.gender,
//      age: userProfile.age,
//      name: userProfile.name,
      languages: userProfile.languages
    },
    false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}



Backend._communicate = function(resource, method, data, isJsonResponse, headers, callback) {
  $.ajax({
    url: Backend.SERVER_BASE_URL + resource,
    type: method,
    data: data != null ? JSON.stringify(data) : "",
    headers: headers != null ? headers : {},
    contentType: "application/json; charset=utf-8",
    dataType: isJsonResponse ? "json" : "text",
    success: callback.success,
    error: callback.error
  });
}

Backend._getAuthenticationHeader = function(login, password) {
  var value = null;
  if (login != null && password != null) {
    value = login + ":" + password;
  } else if (Backend.UserProfile.login != null && Backend.UserProfile.password != null) {
    value = Backend.UserProfile.login + ":" + Backend.UserProfile.password;
  }
  
  return value != null ? {Token: value} : {};
}
