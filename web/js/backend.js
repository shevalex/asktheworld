
var Backend = {
  _cache: {},
  _cacheChangeListeners: [],
};

Backend.SERVER_BASE_URL = "https://hidden-taiga-8809.herokuapp.com/";


// USER MANAGEMENT

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




// REQUEST (and Response) management

Backend.Request = {};
Backend.Request.STATUS_ACTIVE = "active";
Backend.Request.STATUS_INACTIVE = "inactive";

Backend.Response = {};
Backend.Response.STATUS_UNREAD = "unread";
Backend.Response.STATUS_READ = "read";



Backend.createRequest = function(request, requestParams, transactionCallback) {
  /*
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        Backend._updateRequestCache();
        transactionCallback.success(xhr.getResponseHeader("Location"));
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        transactionCallback.failure();
      } else {
        transactionCallback.error();
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
    */
}

Backend.updateRequest = function(requestId, request, transactionCallback) {
  var existingRequest = this._requestsCache[requestId];

  for (var key in request) {
    existingRequest[key] = request[key];
  }

  Backend._updateRequestCache();
  transactionCallback.success();

  /*
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend._updateRequestCache();
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        transactionCallback.failure();
      } else {
        transactionCallback.error();
      }
    }
  }

  this._communicate("request/" + requestId, "PUT",
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
    */
}

//TODO: We may not need it
Backend.deleteRequest = function(requestId, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend._updateRequestCache();
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (xhr.status == 400 || xhr.status == 401) {
        transactionCallback.failure();
      } else {
        transactionCallback.error();
      }
    }
  }

  this._communicate("request/" + requestId, "DELETE", null, false, this._getAuthenticationHeader(), communicationCallback);
}

Backend.createResponse = function(requestId, response, transactionCallback) {
  var responseId = "response" + this._requestsCache[requestId].responseIds.length;
  
  var request = this._requestsCache[requestId];
  request.responseIds.push(responseId);
  
  response.time = Date.now();
  response.pictures = [];
  response.audios = [];
  response.age_category = Backend.UserProfile.age;
  response.gender = Backend.UserProfile.gender;
  response.status = Backend.Response.STATUS_UNREAD;

  request._responses[responseId] = response;
                   
  Backend._updateRequestCache();
  transactionCallback.success();
}

Backend.updateResponse = function(requestId, responseId, response, transactionCallback) {
  var existingResponse = this._requestsCache[requestId]._responses[responseId];
                   
  for (var key in response) {
    existingResponse[key] = response[key];
  }
                   
  Backend._updateRequestCache();
  transactionCallback.success();
}




Backend.addCacheChangeListener = function(listener) {
  this._cacheChangeListeners.push(listener);
}

Backend.removeCacheChangeListener = function(listener) {
  for (var index in this._cacheChangeListeners) {
    if (this._cacheChangeListeners[index] == listener) {
      this._cacheChangeListeners.splice(index, 1);
    }
  }
}

Backend.getOutgoingRequestIds = function(requestStatus) {
  if (this._cache.outgoingRequestIds != null) {
    var requestIds = [];
    for (var index in this._cache.outgoingRequestIds) {
      requestIds.push(this._cache.outgoingRequestIds[index]);
    }
    
    return requestIds;
  } else {
    Backend._pullOutgoingRequestIds();
    return null;
  }
}

Backend.getRequest = function(requestId) {
  if (this._cache.requests != null) {
    var request = this._cache.requests[requestId];
    
    if (request != null) {
      return request;
    }
  }
  
  Backend._pullRequest(requestId);
  return null;
}

Backend.getIncomingResponseIds = function(requestId, responseStatus) {
  if (this._cache.incomingResponseIds != null) {
    var responseIds = [];
    for (var index in this._cache.incomingResponseIds) {
      responseIds.push(this._cache.incomingResponseIds[index]);
    }
    
    return responseIds;
  } else {
    Backend._pullIncomingResponseIds(requestId);
    return null;
  }
}

Backend.getResponse = function(requestId, responseId) {
  if (this._cache.responses != null) {
    var response = this._cache.responses[responseId];
    
    if (response != null) {
      return response;
    }
  }
  
  Backend._pullResponse(requestId, responseId);
  return null;
}



Backend.CacheChangeEvent = {type: null, requestId: null, responseId: null};
Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED = "outgoing_requests_changed";
Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED = "request_changed";
Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED = "response_changed";
Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED = "incoming_responses_changed";

Backend._pullOutgoingRequestIds = function() {
  setTimeout(function() {
    this._cache.outgoingRequestIds = [];

    var numOfRequests = Math.random() * 10;
    for (var i = 0; i < numOfRequests; i++) {
      this._cache.outgoingRequestIds.push("request" + i);
    }

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, requestIds: this._cache.outgoingRequestIds});
  }.bind(this), 1000);
}

Backend._pullIncomingResponseIds = function(requestId) {
  setTimeout(function() {
    this._cache.incomingResponseIds = [];

    var numOfResponses = Math.random() * 100;
    for (var i = 0; i < numOfResponses; i++) {
      this._cache.incomingResponseIds.push(requestId + "-response" + i);
    }

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}

Backend._pullRequest = function(requestId) {
  setTimeout(function() {
    if (this._cache.requests == null) {
      this._cache.requests = {};
    }

    this._cache.requests[requestId] = this._createDummyRequest(requestId);

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}

Backend._pullResponse = function(requestId, responseId) {
  setTimeout(function() {
    if (this._cache.responses == null) {
      this._cache.responses = {};
    }

    this._cache.responses[responseId] = this._createDummyResponse(responseId);

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId: requestId, responseId: responseId});
  }.bind(this), 1000);
}


Backend._notifyCacheUpdateListeners = function(event) {
  for (var index in this._cacheChangeListeners) {
    this._cacheChangeListeners[index](event);
  }
}



Backend._createDummyRequest = function(requestId) {
  var quantity = Math.round(Math.random() * 3);
  var waitTime = Math.round(Math.random() * 4);
  var age = Math.round(Math.random() * 5);
  var gender = Math.round(Math.random() * 2);
  var activeStatus = Math.random() < 0.1;

  var request = {
    time: Date.now(),
    text: "This is the request with the id " + requestId,
    pictures: [],
    audios: [],
    response_quantity: Application.Configuration.RESPONSE_QUANTITY[quantity],
    response_wait_time: Application.Configuration.RESPONSE_WAIT_TIME[waitTime],
    response_age_group: Application.Configuration.AGE_CATEGORY_PREFERENCE[age],
    response_gender: Application.Configuration.GENDER_PREFERENCE[gender],
    status: activeStatus ? Backend.Request.STATUS_ACTIVE : Backend.Request.STATUS_INACTIVE,
    responseIds: [],
  };
    
  var numOfResponses = Math.random() * 100;
  for (var i = 0; i < numOfResponses; i++) {
    request.responseIds.push("response" + i);
  }
  
  return request;
}

Backend._createDummyResponse = function(requestId, responseId) {
  var age = Math.round(Math.random() * 4);
  var gender = Math.round(Math.random());
  var statusUnread = Math.random() < 0.1;

  var response = {
    time: Date.now(),
    text: "This is the response " + responseId + " to the request " + requestId,
    pictures: [],
    audios: [],
    age_category: Application.Configuration.AGE_CATEGORIES[age],
    gender: Application.Configuration.GENDERS[gender],
    status: statusUnread ? Backend.Response.STATUS_UNREAD : Backend.Response.STATUS_READ
  }

  return response;
}



Backend.isRequestCacheInitialized = function() {
  return this._requestCacheInitialized;
}





Backend.getCachedOutgoingRequestIds = function(requestStatus) {
  var requestIds = [];
  for (var id in this._requestsCache) {
    if ((requestStatus == null || this._requestsCache[id].status == requestStatus)
        && this._requestsCache[id]._owned) {
      requestIds.push(id);
    }
  }
  
  return requestIds;
}

Backend.getCachedIncomingRequestIds = function(requestStatus) {
  var requestIds = [];
  for (var id in this._requestsCache) {
    if ((requestStatus == null || this._requestsCache[id].status == requestStatus)
        && !this._requestsCache[id]._owned) {
      requestIds.push(id);
    }
  }
  
  return requestIds;
}

Backend.getCachedRequest = function(requestId) {
  return this._requestsCache[requestId];
}

Backend.getCachedResponse = function(requestId, responseId) {
  var request = this._requestsCache[requestId];
  if (request != null) {
    return request._responses[responseId];
  }
  
  return null;
}
  

Backend._updateRequestCache = function() {
  //TBD
  
  if (!this._requestCacheInitialized) {
    // This is all one-time fake data
    var numOfRequests = Math.random() * 100;
    for (var requestCounter = 0; requestCounter < numOfRequests; requestCounter++) {
      var quantity = Math.round(Math.random() * 3);
      var waitTime = Math.round(Math.random() * 4);
      var age = Math.round(Math.random() * 5);
      var gender = Math.round(Math.random() * 2);
      var activeStatus = Math.random() < 0.1;
      var owned = Math.random() < 0.3;
  
      var requestId = "request" + requestCounter;
      
      var request = {
        time: Date.now(),
        text: "This is the request with the id " + requestId,
        pictures: [],
        audios: [],
        response_quantity: Application.Configuration.RESPONSE_QUANTITY[quantity],
        response_wait_time: Application.Configuration.RESPONSE_WAIT_TIME[waitTime],
        response_age_group: Application.Configuration.AGE_CATEGORY_PREFERENCE[age],
        response_gender: Application.Configuration.GENDER_PREFERENCE[gender],
        status: activeStatus ? Backend.Request.STATUS_ACTIVE : Backend.Request.STATUS_INACTIVE,
        responseIds: [],
        _owned: owned,
        _responses: {}
      };
    
      var numOfResponses = 0;;//Math.random() * 100;
      for (var responseCounter = 0; responseCounter < numOfResponses; responseCounter++) {
        var age = Math.round(Math.random() * 4);
        var gender = Math.round(Math.random());
        var statusUnread = Math.random() < 0.1;
    
        var response = {
          time: Date.now(),
          text: "This is the response " + responseId + " to the request " + requestId,
          pictures: [],
          audios: [],
          age_category: Application.Configuration.AGE_CATEGORIES[age],
          gender: Application.Configuration.GENDERS[gender],
          status: statusUnread ? Backend.Response.STATUS_UNREAD : Backend.Response.STATUS_READ
        }
      
        var responseId = "response" + responseCounter;
        request.responseIds.push(responseId);
        request._responses[responseId] = response;
      }
    
      this._requestsCache[requestId] = request;
    }
    
    this._requestCacheInitialized = true;
  }
  
  // This is a temporary behavior until we pull data from the server.
  setTimeout(function() {
    for (var index in this._requestsChangeListeners) {
      this._requestsChangeListeners[index]();
    }
  }.bind(this), 3000);
}




// GENERAL UTILS


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
