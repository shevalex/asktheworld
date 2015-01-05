
var Backend = {};

Backend.SERVER_BASE_URL = "https://hidden-taiga-8809.herokuapp.com/";


Backend.Request = {};
Backend.Request.STATUS_ACTIVE = "active";
Backend.Request.STATUS_INACTIVE = "inactive";

Backend.Response = {};
Backend.Response.STATUS_UNREAD = "unread";
Backend.Response.STATUS_READ = "read";


Backend.UserProfile = {login: null, password: null, gender: null, languages: [], age: null, name: null, userId: null};
Backend.UserPreferences = {
  responseQuantity: Application.Configuration.RESPONSE_QUANTITY[0],
  responseWaitTime: Application.Configuration.RESPONSE_WAIT_TIME[0],
  requestTargetAge: Application.Configuration.AGE_CATEGORY_PREFERENCE[0],
  requestTargetGender: Application.Configuration.GENDER_PREFERENCE[0],
  dailyInquiryLimit: Application.Configuration.INQUIRY_LIMIT_PREFERENCE[0],
  inquiryAge: Application.Configuration.AGE_CATEGORY_PREFERENCE[0], 
  inquiryGender: Application.Configuration.GENDER_PREFERENCE[0]
};

Backend.getUserProfile = function() {
  return this.UserProfile;
}

Backend.getUserPreferences = function() {
  return this.UserPreferences;
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
      if (xhr.status == 401 || xhr.status == 404) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }
  this._communicate("user?login=" + login, "GET", null, true, this._getAuthenticationHeader(login, password), communicationCallback);
}

Backend.logOut = function(callback) {
  Backend.UserProfile.login = null;
  Backend.UserProfile.password = null;
  Backend.UserProfile.name = null;
  Backend.UserProfile.userId = null;
  
  //We may need to inform the server maybe?
  
  callback();
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
      Backend.UserProfile.age = data.age_category;
      Backend.UserProfile.languages = data.languages;

      callback.success();
    },
    error: function(xhr, status, error) {
      if (xhr.status == 401 || xhr.status == 404) {
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
      age_category: userProfile.age,
      name: userProfile.name,
      languages: userProfile.languages
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
      if (xhr.status == 400 || xhr.status == 401) {
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
      age_category: userProfile.age,
      name: userProfile.name,
      languages: userProfile.languages
    },
    false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.updateUserPreferences = function(userPreferences, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserPreferences.requestTargetAge = userPreferences.requestTargetAge;
      Backend.UserPreferences.requestTargetGender = userPreferences.requestTargetGender;
      Backend.UserPreferences.responseQuantity = userPreferences.responseQuantity;
      Backend.UserPreferences.responseWaitTime = userPreferences.responseWaitTime;
      Backend.UserPreferences.dailyInquiryLimit = userPreferences.dailyInquiryLimit;
      Backend.UserPreferences.inquiryAge = userPreferences.inquiryAge;
      Backend.UserPreferences.inquiryGender = userPreferences.inquiryGender;

      callback.success();
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }

  this._communicate("user/" + Backend.UserProfile.userId + "/settings", "PUT",
    { 
      default_response_quantity: userPreferences.responseQuantity,
      default_response_wait_time: userPreferences.responseWaitTime,
      default_response_age_group_preference: userPreferences.requestTargetAge,
      default_gender_preference: userPreferences.requestTargetGender,
      inquiry_quantity_per_day: userPreferences.dailyInquiryLimit,
      inquiry_gender_preference: userPreferences.inquiryGender,
      inquiry_age_group_preference: userPreferences.inquiryAge
    },
    false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.createRequest = function(request, requestParams, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        callback.success(xhr.getResponseHeader("Location"));
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }

  this._communicate("request", "POST",
    { 
      user_id: Backend.UserProfile.userId,
      text: request.text,
      pictures: request.pictures,
      audios: request.audios,
      response_quantity: requestParams.quantity,
      response_wait_time: requestParams.waitTime,
      response_age_group: requestParams.age,
      response_gender: requestParams.gender
    },
    false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.updateRequest = function(request, requestParams, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        callback.success(xhr.getResponseHeader("Location"));
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        callback.failure();
      } else {
        callback.error();
      }
    }
  }

  this._communicate("request/" + request.id, "PUT",
    { 
      user_id: Backend.UserProfile.userId,
      text: request.text,
      pictures: request.pictures,
      audios: request.audios,
      response_quantity: requestParams.quantity,
      response_wait_time: requestParams.waitTime,
      response_age_group: requestParams.age,
      response_gender: requestParams.gender,
      status: requestParams.status
    },
    false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.getRequestIds = function(requestType, callback) {
  //TBD
  
  var numOfRequests = Math.random() * 100;
  var requestIds = [];
  for (var i = 0; i < numOfRequests; i++) {
    requestIds.push("request" + i);
  }
  
  setTimeout(function() {
    callback.success(requestIds);  
  }, 3000);
}

Backend.getRequest = function(requestId, callback) {
  //TBD
  var numOfResponses = Math.random() * 100;
  var responseIds = [];
  for (var i = 0; i < numOfResponses; i++) {
    responseIds.push("response" + i);
  }
  
  var quantity = Math.round(Math.random() * 3);
  var waitTime = Math.round(Math.random() * 4);
  var age = Math.round(Math.random() * 5);
  var gender = Math.round(Math.random() * 2);
  
  var request = {
    time: Date.now(),
    text: "This is the request with the id " + requestId,
    pictures: [],
    audios: [],
    response_quantity: Application.Configuration.RESPONSE_QUANTITY[quantity],
    response_wait_time: Application.Configuration.RESPONSE_WAIT_TIME[waitTime],
    response_age_group: Application.Configuration.AGE_CATEGORY_PREFERENCE[age],
    response_gender: Application.Configuration.GENDER_PREFERENCE[gender],
    status: Backend.Request.STATUS_ACTIVE,
    responses: responseIds
  };

  setTimeout(function() {
    callback.success(request);
  }, 1000);
}

Backend.deleteRequest = function(requestId, callback) {
  //TBD
  callback.success();
}


Backend.getResponse = function(requestId, responseId, callback) {
  //TBD
  var age = Math.round(Math.random() * 4);
  var gender = Math.round(Math.random());
  var unread = Math.random() < 0.1;
    
  var response = {
    time: Date.now(),
    text: "This is the response " + responseId + " to the request " + requestId,
    pictures: [],
    audios: [],
    age_category: Application.Configuration.AGE_CATEGORIES[age],
    gender: Application.Configuration.GENDERS[gender],
    status: unread ? Backend.Response.STATUS_UNREAD : Backend.Response.STATUS_READ
  }
  
  setTimeout(function() {
    callback.success(response);
  }, 1000);
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
