var Backend = {
  _cache: {},
  _cacheChangeListeners: [],
  
  _contactInfo: {}
};

Backend.SERVER_BASE_URL = "https://hidden-taiga-8809.herokuapp.com/";


// USER MANAGEMENT

Backend.UserProfile = {login: null, password: null, gender: null, languages: [], age: null, name: null, userId: null};
Backend.UserPreferences = {
  responseQuantity: Application.Configuration.RESPONSE_QUANTITY[0].data,
  responseWaitTime: Application.Configuration.RESPONSE_WAIT_TIME[0].data,
  requestTargetAge: Application.Configuration.AGE_CATEGORY_PREFERENCE[0].data,
  requestTargetGender: Application.Configuration.GENDER_PREFERENCE[0].data,
  dailyInquiryLimit: Application.Configuration.INQUIRY_LIMIT_PREFERENCE[0].data,
  inquiryAge: Application.Configuration.AGE_CATEGORY_PREFERENCE[0].data,
  inquiryGender: Application.Configuration.GENDER_PREFERENCE[0].data,

  expertises: [Application.Configuration.EXPERTISES[0]],
  contactVisible: false,
  contactName: "",
  contactInfo: ""
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

      Backend._pullUserSettings(callback);
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
  
  
  this._cache = {};
  this._cacheChangeListeners = [];
  
  //We may need to inform the server maybe?
  if (callback != null) {
    callback();
  }
}

Backend.isLogged = function() {
  return Backend.UserProfile.login != null;
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
        
        Backend._pullUserSettings(callback);
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

Backend.updateUserProfile = function(userProfile, currentPassword, callback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (userProfile.password != null) {
        Backend.UserProfile.password = userProfile.password;
      }
      Backend.pullUserProfile(callback);
    },
    error: function(xhr, status, error) {
      if (xhr.status == 401) {
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
    false, this._getAuthenticationHeader(Backend.UserProfile.login, currentPassword), communicationCallback);

  return true;
}

Backend.pullUserPreferences = function(callback) {
  if (Backend.UserProfile.userId == null) {
    throw "Must login or register first";
  }
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserPreferences.requestTargetAge = data.default_response_age_group_preference || Backend.UserPreferences.requestTargetAge;
      Backend.UserPreferences.requestTargetGender = data.default_gender_preference || Backend.UserPreferences.requestTargetGender;
      Backend.UserPreferences.responseQuantity = data.default_response_quantity || Backend.UserPreferences.responseQuantity;
      Backend.UserPreferences.responseWaitTime = data.default_response_wait_time || Backend.UserPreferences.responseWaitTime;
      Backend.UserPreferences.dailyInquiryLimit = data.inquiry_quantity_per_day || Backend.UserPreferences.dailyInquiryLimit;
      Backend.UserPreferences.inquiryAge = data.inquiry_age_group_preference || Backend.UserPreferences.inquiryAge;
      Backend.UserPreferences.inquiryGender = data.inquiry_gender_preference || Backend.UserPreferences.inquiryGender;

      Backend.UserPreferences.expertises = data.expertises || Backend.UserPreferences.expertises;
      Backend.UserPreferences.contactVisible = data.contact_info_requestable || Backend.UserPreferences.contactVisible;
      Backend.UserPreferences.contactName = data.contact_name || Backend.UserPreferences.contactName;
      Backend.UserPreferences.contactInfo = data.contact_info || Backend.UserPreferences.contactInfo;

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
  
  this._communicate("user/" + Backend.UserProfile.userId + "/settings", "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
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
      
      Backend.UserPreferences.expertises = userPreferences.expertises;
      Backend.UserPreferences.contactVisible = userPreferences.contactVisible;
      Backend.UserPreferences.contactName = userPreferences.contactName;
      Backend.UserPreferences.contactInfo = userPreferences.contactInfo;

      callback.success();
//      Backend.pullUserPreferences(callback);
    },
    error: function(xhr, status, error) {
      if (xhr.status == 401) {
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

Backend.resetUserPassword = function(login, callback) {
  //TODO
  setTimeout(function() {
    callback.success();
  }, 2000);
}


Backend._pullUserSettings = function(callback) {
  var callbackAdapter = {
    success: function() {
      Backend.pullUserPreferences(callback);
    },
    failure: function() {
      callback.failure();
    },
    error: function() {
      callback.error();
    }
  }
  
  Backend.pullUserProfile(callbackAdapter);
}





// REQUEST (and Response) management

Backend.Request = {};
Backend.Request.STATUS_ACTIVE = "active";
Backend.Request.STATUS_INACTIVE = "inactive";

Backend.Response = {};
Backend.Response.STATUS_UNREAD = "unread";
Backend.Response.STATUS_READ = "read";
Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE = "no";
Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE = "can_provide";
Backend.Response.CONTACT_INFO_STATUS_PROVIDED = "provided";



Backend.createRequest = function(request, transactionCallback) {
  setTimeout(function() {
    var newRequestId = "request" + (this._cache.outgoingRequestIds.active.length + this._cache.outgoingRequestIds.inactive.length);
    this._cache.outgoingRequestIds.active.push(newRequestId);
    
    request.time = Date.now();
    request.status = Backend.Request.STATUS_ACTIVE;
    
    if (this._cache.requests == null) {
      this._cache.requests = {};
    }
    this._cache.requests[newRequestId] = request;
    
    transactionCallback.success();
    
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, requestId: newRequestId});
  }.bind(this), 1000);
  
  
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
  setTimeout(function() {
    var existingRequest = this._cache.requests[requestId];
    for (var key in request) {
      if (key == "status" && existingRequest[key] != request[key] && request.status == Backend.Request.STATUS_INACTIVE) {
        for (var index in this._cache.outgoingRequestIds.active) {
          if (this._cache.outgoingRequestIds.active[index] == requestId) {
            this._cache.outgoingRequestIds.active.splice(index, 1);
            this._cache.outgoingRequestIds.inactive.push(requestId);
            break;
          }
        }
      }
      
      existingRequest[key] = request[key];
    }

    transactionCallback.success();

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId});
  }.bind(this), 1000);

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


Backend.createResponse = function(requestId, response, transactionCallback) {
  setTimeout(function() {
    var newResponseId = requestId + "-response" + this._cache.outgoingResponseIds[requestId].unviewed.length;

    this._cache.outgoingResponseIds[requestId].unviewed.push(newResponseId);
    
    response.time = Date.now();
    response.attachments = [];
    response.age_category = Backend.UserProfile.age;
    response.gender = Backend.UserProfile.gender;
    response.status = Backend.Response.STATUS_UNREAD;

    if (this._cache.responses == null) {
      this._cache.responses = {};
    }
    this._cache.responses[newResponseId] = response;
    
    transactionCallback.success(newResponseId);
    
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}




Backend.getOutgoingRequestIds = function(requestStatus) {
  if (this._cache.outgoingRequestIds != null) {
    var requestIds = [];
    
    if (requestStatus == Backend.Request.STATUS_ACTIVE || requestStatus == null) {
      for (var index in this._cache.outgoingRequestIds.active) {
        requestIds.push(this._cache.outgoingRequestIds.active[index]);
      }
    }
    if (requestStatus == Backend.Request.STATUS_INACTIVE || requestStatus == null) {
      for (var index in this._cache.outgoingRequestIds.inactive) {
        requestIds.push(this._cache.outgoingRequestIds.inactive[index]);
      }
    }
    
    return requestIds;
  } else {
    Backend._pullOutgoingRequestIds();
    return null;
  }
}

Backend.getIncomingRequestIds = function(requestStatus) {
  if (this._cache.incomingRequestIds != null) {
    var requestIds = [];

    if (requestStatus == Backend.Request.STATUS_ACTIVE || requestStatus == null) {
      for (var index in this._cache.incomingRequestIds.active) {
        requestIds.push(this._cache.incomingRequestIds.active[index]);
      }
    }
    if (requestStatus == Backend.Request.STATUS_INACTIVE || requestStatus == null) {
      for (var index in this._cache.incomingRequestIds.inactive) {
        requestIds.push(this._cache.incomingRequestIds.inactive[index]);
      }
    }
    
    return requestIds;
  } else {
    Backend._pullIncomingRequestIds();
    return null;
  }
}

Backend.removeIncomingRequest = function(requestId, callback) {
  setTimeout(function() {
    for (var index in this._cache.incomingRequestIds.active) {
      if (this._cache.incomingRequestIds.active[index] == requestId) {
        this._cache.incomingRequestIds.active.splice(index, 1);
        
        callback.success();
        
        this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED});
        
        break;
      }
    }
  }.bind(this), 1000);
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

Backend.updateResponse = function(requestId, responseId, response, transactionCallback) {
  setTimeout(function() {
    var existingResponse = this._cache.responses[responseId];
    for (var key in response) {
      if (key == "status" && existingResponse[key] != response[key] && response.status == Backend.Response.STATUS_READ) {
        for (var index in this._cache.incomingResponseIds[requestId].unviewed) {
          if (this._cache.incomingResponseIds[requestId].unviewed[index] == responseId) {
            this._cache.incomingResponseIds[requestId].unviewed.splice(index, 1);
            this._cache.incomingResponseIds[requestId].viewed.push(responseId);
            break;
          }
        }
      }
      existingResponse[key] = response[key];
    }

    if (transactionCallback != null) {
      transactionCallback.success();
    }

    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId: requestId, responseId: responseId});
  }.bind(this), 1000);
}

Backend.getContactInfo = function(requestId, responseId, transactionCallback) {
  if (this._contactInfo[responseId] != null) {
    if (transactionCallback != null) {
      transactionCallback.success(this._contactInfo[responseId]);
    }
    
    return this._contactInfo[responseId];
  }
  
  setTimeout(function() {
    var contacts = [{contact_name: "Anton", contact_info: "(123) 456-78-90"}, {contact_name: "Oleg", contact_info: "(098) 765-43-21"}, {contact_name: "Leha", contact_info: "(456) 123-78-90"}, {contact_name: "Kosmonavtom", contact_info: "Call me to Baikanur!"}];
    
    var contactIndex = Math.round(Math.random() * (contacts.length - 1));
    
    var contactInfo = contacts[contactIndex];
    
    this._contactInfo[responseId] = contactInfo;
    
    
    var callback = null;
    if (transactionCallback != null) {
      callback = {
        success: function() {
          transactionCallback.success(contactInfo);        
        },
        failure: function() {
          transactionCallback.failure()
        },
        error: function() {
          transactionCallback.error();
        }
      };
    }
    
    Backend.updateResponse(requestId, responseId, {contact_info_status: Backend.Response.CONTACT_INFO_STATUS_PROVIDED}, callback);
  }.bind(this), 2000);
  
  return null;
}



Backend.getIncomingResponseIds = function(requestId, responseStatus) {
  if (this._cache.incomingResponseIds != null && this._cache.incomingResponseIds[requestId] != null) {
    var responseIds = [];

    if (responseStatus == Backend.Response.STATUS_READ) {
      responseIds = this._cache.incomingResponseIds[requestId].viewed.slice(0);
    } else if (responseStatus == Backend.Response.STATUS_UNREAD) {
      responseIds = this._cache.incomingResponseIds[requestId].unviewed.slice(0);
    } else {
      responseIds = this._cache.incomingResponseIds[requestId].unviewed.slice(0);
      for (var index in this._cache.incomingResponseIds[requestId].viewed) {
        responseIds.push(this._cache.incomingResponseIds[requestId].viewed[index]);
      }
    }

    return responseIds;
  } else {
    Backend._pullIncomingResponseIds(requestId);
    return null;
  }
}

Backend.removeIncomingResponse = function(requestId, responseId, callback) {
  setTimeout(function() {
    var response = Backend.getResponse(requestId, responseId);
    if (response != null) {
      var responseList;
      if (response.status == Backend.Response.STATUS_READ) {
        responseList = this._cache.incomingResponseIds[requestId].viewed;
      } else if (response.status == Backend.Response.STATUS_UNREAD) {
        responseList = this._cache.incomingResponseIds[requestId].unviewed;
      } else {
        throw "Incorrect situation";
      }
      
      for (var index in responseList) {
        if (responseList[index] == responseId) {
          responseList.splice(index, 1);
          
          if (callback != null) {
            callback.success();
          }
          
          this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId});
          break;
        }
      }
    }
  }.bind(this), 1000);
}



Backend.getOutgoingResponseIds = function(requestId, responseStatus) {
  if (this._cache.outgoingResponseIds != null && this._cache.outgoingResponseIds[requestId] != null) {
    var responseIds = [];
  
    if (responseStatus == Backend.Response.STATUS_READ) {
      responseIds = this._cache.outgoingResponseIds[requestId].viewed.slice(0);
    } else if (responseStatus == Backend.Response.STATUS_UNREAD) {
      responseIds = this._cache.outgoingResponseIds[requestId].unviewed.slice(0);
    } else {
      responseIds = this._cache.outgoingResponseIds[requestId].unviewed.slice(0);
      for (var index in this._cache.outgoingResponseIds[requestId].viewed) {
        responseIds.push(this._cache.outgoingResponseIds[requestId].viewed[index]);
      }
    }

    return responseIds;
  } else {
    Backend._pullOutgoingResponseIds(requestId);
    return null;
  }
}



Backend.CacheChangeEvent = {type: null, requestId: null, responseId: null};
Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED = "outgoing_requests_changed";
Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED = "incoming_requests_changed";
Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED = "request_changed";
Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED = "response_changed";
Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED = "outgoing_responses_changed";
Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED = "incoming_responses_changed";


Backend.addCacheChangeListener = function(listener) {
  if (listener != null) {
    this._cacheChangeListeners.push(listener);
  }
}

Backend.removeCacheChangeListener = function(listener) {
  for (var index in this._cacheChangeListeners) {
    if (this._cacheChangeListeners[index] == listener) {
      this._cacheChangeListeners.splice(index, 1);
    }
  }
}



Backend._pullOutgoingRequestIds = function() {
  if (this._cache.outgoingRequestIds_pulling != null) {
    return;
  }
  this._cache.outgoingRequestIds_pulling = "";
  
  setTimeout(function() {
    this._cache.outgoingRequestIds = {active: [], inactive: []};

    var numOfRequests = Math.random() * 100;
    for (var i = 0; i < numOfRequests; i++) {
      var isActive = Math.random() < 0.5;
      
      var id = "request" + i;
      if (isActive) {
        this._cache.outgoingRequestIds.active.push(id);
      } else {
        this._cache.outgoingRequestIds.inactive.push(id);
      }
    }

    this._cache.outgoingRequestIds_pulling = null;
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED});
  }.bind(this), 1000);
}

Backend._pullIncomingRequestIds = function() {
  if (this._cache.incomingRequestIds_pulling != null) {
    return;
  }
  this._cache.incomingRequestIds_pulling = "";
  
  setTimeout(function() {
    this._cache.incomingRequestIds = {active: [], inactive: []};

    var numOfRequests = Math.random() * 10;
    for (var i = 0; i < numOfRequests; i++) {
      var isActive = Math.random() < 0.5;
      
      var id = "request" + (100 + i);
      if (isActive) {
        this._cache.incomingRequestIds.active.push(id);
      } else {
        this._cache.incomingRequestIds.inactive.push(id);
      }
    }

    this._cache.incomingRequestIds_pulling = null;
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED});
  }.bind(this), 1000);
}

Backend._pullIncomingResponseIds = function(requestId) {
  if (this._cache.incomingResponseIds_pulling != null) {
    if (this._cache.incomingResponseIds_pulling[requestId] != null) {
      return;
    }
  } else {
    this._cache.incomingResponseIds_pulling = {};
  }
  this._cache.incomingResponseIds_pulling[requestId] = "";

  setTimeout(function() {
    if (this._cache.incomingResponseIds == null) {
      this._cache.incomingResponseIds = {};
    }

    this._cache.incomingResponseIds[requestId] = {viewed: [], unviewed: []};
    var numOfResponses = Math.random() * 100;
    for (var i = 0; i < numOfResponses; i++) {
      var responseId = requestId + "-response" + i;
      if (Math.random() < 0.95) {
        this._cache.incomingResponseIds[requestId].viewed.push(responseId);
      } else {
        this._cache.incomingResponseIds[requestId].unviewed.push(responseId);
      }
    }

    this._cache.incomingResponseIds_pulling[requestId] = null;
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}

Backend._pullOutgoingResponseIds = function(requestId) {
  if (this._cache.outgoingResponseIds_pulling != null) {
    if (this._cache.outgoingResponseIds_pulling[requestId] != null) {
      return;
    }
  } else {
    this._cache.outgoingResponseIds_pulling = {};
  }
  this._cache.outgoingResponseIds_pulling[requestId] = "";

  setTimeout(function() {
    if (this._cache.outgoingResponseIds == null) {
      this._cache.outgoingResponseIds = {};
    }

    this._cache.outgoingResponseIds[requestId] = {viewed: [], unviewed: []};
    var numOfResponses = Math.random() * 10;
    if (numOfResponses > 4) {
      numOfResponses = 0;
    }
    for (var i = 0; i < numOfResponses; i++) {
      var responseId = requestId + "-response" + (100 + i);
      if (Math.random() < 0.5) {
        this._cache.outgoingResponseIds[requestId].viewed.push(responseId);
      } else {
        this._cache.outgoingResponseIds[requestId].unviewed.push(responseId);
      }
    }

    this._cache.outgoingResponseIds_pulling[requestId] = null;
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}

Backend._pullRequest = function(requestId) {
  if (this._cache.requests_pulling != null) {
    if (this._cache.requests_pulling[requestId] != null) {
      return;
    }
  } else {
    this._cache.requests_pulling = {};
  }
  this._cache.requests_pulling[requestId] = "";
  
  setTimeout(function() {
    if (this._cache.requests == null) {
      this._cache.requests = {};
    }

    this._cache.requests[requestId] = this._createDummyRequest(requestId);

    this._cache.requests_pulling[requestId] = null;
    this._notifyCacheUpdateListeners({type: Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId});
  }.bind(this), 1000);
}

Backend._pullResponse = function(requestId, responseId) {
  if (this._cache.responses_pulling != null) {
    if (this._cache.responses_pulling[responseId] != null) {
      return;
    }
  } else {
    this._cache.responses_pulling = {};
  }
  this._cache.responses_pulling[responseId] = "";

  setTimeout(function() {
    if (this._cache.responses == null) {
      this._cache.responses = {};
    }

    this._cache.responses[responseId] = this._createDummyResponse(requestId, responseId);

    this._cache.responses_pulling[responseId] = null;
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
  var waitTime = Math.round(Math.random() * 3);
  var age = Math.round(Math.random() * 5);
  var gender = Math.round(Math.random() * 2);
  var numOfExtraLines = Math.round(Math.random() * 5);

  var status = Backend.Request.STATUS_INACTIVE;
  if (this._cache.incomingRequestIds != null) {
    for (var index in this._cache.incomingRequestIds.active) {
      if (this._cache.incomingRequestIds.active[index] == requestId) {
        status = Backend.Request.STATUS_ACTIVE;
        break;
      }
    }
  }
  if (this._cache.outgoingRequestIds != null) {
    for (var index in this._cache.outgoingRequestIds.active) {
      if (this._cache.outgoingRequestIds.active[index] == requestId) {
        status = Backend.Request.STATUS_ACTIVE;
        break;
      }
    }
  }

  var text = "This is the request with the id " + requestId;
  for (var i = 0; i < numOfExtraLines; i++) {
    text += "<br>line " + (i + 2);
  }
  
  var request = {
    time: Date.now(),
    text: text,
    attachments: [],
    response_quantity: Application.Configuration.RESPONSE_QUANTITY[quantity].data,
    response_wait_time: Application.Configuration.RESPONSE_WAIT_TIME[waitTime].data,
    response_age_group: Application.Configuration.AGE_CATEGORY_PREFERENCE[age].data,
    response_gender: Application.Configuration.GENDER_PREFERENCE[gender].data,
    expertise_category: Application.Configuration.EXPERTISES[0].data,
    status: status
  };
    
  return request;
}

Backend._createDummyResponse = function(requestId, responseId) {
  var age = Math.round(Math.random() * 4);
  var gender = Math.round(Math.random());
  var contactStatus = Math.round(Math.random() * 2);
  var statusUnread = false;
  var numOfExtraLines = Math.round(Math.random() * 5);
  var starRating = Math.round(Math.random() * 5);
  
  var responses = null;
  if (this._cache.incomingResponseIds != null && this._cache.incomingResponseIds[requestId] != null) {
    responses = this._cache.incomingResponseIds[requestId];
  } else {
    responses = this._cache.outgoingResponseIds[requestId];
  }
  for (var index in responses.unviewed) {
    if (responses.unviewed[index] == responseId) {
      statusUnread = true;
      break;
    }
  }
  
  if (contactStatus == 0) {
    contactInfoStatus = Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE;
  } else if (contactStatus == 1) {
    contactInfoStatus = Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE;
  } else if (contactStatus == 2) {
    contactInfoStatus = Backend.Response.CONTACT_INFO_STATUS_PROVIDED;
  }
  
  var text = "This is the response " + responseId + " to the request " + requestId;
  for (var i = 0; i < numOfExtraLines; i++) {
    text += "<br>line " + (i + 2);
  }
  
  var response = {
    time: Date.now(),
    text:  text,
    attachments: [],
    age_category: Application.Configuration.AGE_CATEGORIES[age].data,
    gender: Application.Configuration.GENDERS[gender].data,
    status: statusUnread ? Backend.Response.STATUS_UNREAD : Backend.Response.STATUS_READ,
    contact_info_status: contactInfoStatus,
    star_rating: starRating
  }

  return response;
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
