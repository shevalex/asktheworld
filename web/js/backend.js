var Backend = {
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
  
  Backend.Cache.reset();
  
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
  Backend.Cache.markOutgoingRequestIdsInUpdate();
  var newRequestId = "request" + Backend.Cache.getOutgoingRequestIds().all.length;
  Backend.Cache.markRequestInUpdate(newRequestId);
  
  setTimeout(function() {
    var requestIds = Backend.Cache.getOutgoingRequestIds();
    requestIds.all.push(newRequestId);
    requestIds.active.push(newRequestId);
    Backend.Cache.setOutgoingRequestIds(requestIds);
    Backend.Cache.setIncomingResponseIds(newRequestId, []);
    
    request.time = Date.now();
    request.status = Backend.Request.STATUS_ACTIVE;
    
    Backend.Cache.setRequest(newRequestId, request);
    
    if (transactionCallback != null) {
      transactionCallback.success();
    }
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
  Backend.Cache.markRequestInUpdate(requestId);
  
  setTimeout(function() {
    var existingRequest = Backend.Cache.getRequest(requestId);
    for (var key in request) {
      if (key == "status" && existingRequest[key] != request[key] && request.status == Backend.Request.STATUS_INACTIVE) {
        var allRequestIds = Backend.Cache.getOutgoingRequestIds();
        for (var index in allRequestIds.active) {
          if (allRequestIds.active[index] == requestId) {
            allRequestIds.active.splice(index, 1);
            
            if (allRequestIds.inactive != null) {
              allRequestIds.inactive.push(requestId);
            }
            
            Backend.Cache.setOutgoingRequestIds(allRequestIds);
            break;
          }
        }
      }
      
      existingRequest[key] = request[key];
    }

    Backend.Cache.setRequest(requestId, existingRequest);
    
    if (transactionCallback != null) {
      transactionCallback.success();
    }
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
  Backend.Cache.markOutgoingResponseIdsInUpdate(requestId);
  var newResponseId = requestId + "-response" + Backend.Cache.getOutgoingResponseIds(requestId).all.length;
  Backend.Cache.markResponseInUpdate(requestId, newResponseId);
  
  setTimeout(function() {
    var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
    responseIds.all.push(newResponseId);
    responseIds.unviewed.push(newResponseId);
    
    response.time = Date.now();
    response.age_category = Backend.UserProfile.age;
    response.gender = Backend.UserProfile.gender;
    response.status = Backend.Response.STATUS_UNREAD;

    Backend.Cache.setResponse(requestId, newResponseId, response);
    Backend.Cache.setOutgoingResponseIds(requestId, responseIds);
    
    if (transactionCallback != null) {
      transactionCallback.success(newResponseId);
    }
  }.bind(this), 1000);
}




Backend.getOutgoingRequestIds = function(requestStatus) {
  var requestIds = Backend.Cache.getOutgoingRequestIds();

  var result = null;
  if (requestIds != null) {
    if (requestStatus == null) {
      result = requestIds.active != null && requestIds.inactive != null ? requestIds.all : null;
    } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
      result = requestIds.active;
    } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
      result = requestIds.inactive;
    } else {
      throw "Invalid request status requested: " + requestStatus;
    }
  }

  if (result != null || Backend.Cache.isOutgoingRequestIdsInUpdate()) {
    return result;
  } else {
    Backend.Cache.markOutgoingRequestIdsInUpdate();

    setTimeout(function() {
      var requestIds = Backend.Cache.getOutgoingRequestIds();
      if (requestIds == null) {
        requestIds = {};
      }
      

      var generateActive = false;
      var generateInactive = false;
      
      if (requestIds.all == null) {
        requestIds.all = [];
      }
      if (requestStatus == null) {
        if (requestIds.active == null) {
          requestIds.active = [];
          generateActive = true;
        }
        if (requestIds.inactive == null) {
          requestIds.inactive = [];
          generateInactive = true;
        }
      } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
        if (requestIds.active == null) {
          requestIds.active = [];
          generateActive = true;
        }
      } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
        if (requestIds.inactive == null) {
          requestIds.inactive = [];
          generateInactive = true;
        }
      }

      var numOfRequests = Math.floor(Math.random() * 50);
      for (var i = 0; i < numOfRequests; i++) {
        var isActive = Math.random() < 0.5;
        if (isActive) {
          if (generateActive) {
            var id = "request" + (50 + i);
            requestIds.all.push(id);
            requestIds.active.push(id);
          }
        } else {
          if (generateInactive) {
            var id = "request" + i;
            requestIds.all.push(id);
            requestIds.inactive.push(id);
          }
        }
      }
      
      Backend.Cache.setOutgoingRequestIds(requestIds);
    }.bind(this), 1000);
    
    return null;
  }
}

Backend.getIncomingRequestIds = function(requestStatus) {
  var requestIds = Backend.Cache.getIncomingRequestIds();
  
  var result = null;
  if (requestIds != null) {
    if (requestStatus == null) {
      result = requestIds.active != null && requestIds.inactive != null ? requestIds.all : null;
    } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
      result = requestIds.active;
    } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
      result = requestIds.inactive;
    } else {
      throw "Invalid request status requested: " + requestStatus;
    }
  }
  
  if (result != null || Backend.Cache.isIncomingRequestIdsInUpdate()) {
    return result;
  } else {
    Backend.Cache.markIncomingRequestIdsInUpdate();

    setTimeout(function() {
      var requestIds = Backend.Cache.getIncomingRequestIds();
      if (requestIds == null) {
        requestIds = {};
      }

      var generateActive = false;
      var generateInactive = false;

      if (requestIds.all == null) {
        requestIds.all = [];
      }
      if (requestStatus == null) {
        if (requestIds.active == null) {
          requestIds.active = [];
          generateActive = true;
        }
        if (requestIds.inactive == null) {
          requestIds.inactive = [];
          generateInactive = true;
        }
      } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
        if (requestIds.active == null) {
          requestIds.active = [];
          generateActive = true;
        }
      } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
        if (requestIds.inactive == null) {
          requestIds.inactive = [];
          generateInactive = true;
        }
      }

      var numOfRequests = Math.floor(Math.random() * 50);
      for (var i = 0; i < numOfRequests; i++) {
        var isActive = Math.random() < 0.5;

        if (isActive) {
          if (generateActive) {
            var id = "request" + (100 + 50 + i);
            requestIds.all.push(id);
            requestIds.active.push(id);
          }
        } else {
          if (generateInactive) {
            var id = "request" + (100 + i);
            requestIds.all.push(id);
            requestIds.inactive.push(id);
          }
        }
      }

      Backend.Cache.setIncomingRequestIds(requestIds);
    }.bind(this), 1000);

    return null;
  }
}

Backend.removeIncomingRequest = function(requestId, callback) {
  Backend.Cache.markIncomingRequestIdsInUpdate();
  
  setTimeout(function() {
    var removeFromArray = function(arr, element) {
      for (var index in arr) {
        if (arr[index] == element) {
          arr.splice(index, 1);
          break;
        }
      }
      
      return arr;
    }
    
    var requestIds = Backend.Cache.getIncomingRequestIds();
    requestIds.all = removeFromArray(requestId.all, requestId);
    requestIds.active = removeFromArray(requestId.active, requestId);
    requestIds.inactive = removeFromArray(requestId.inactive, requestId);
    
    Backend.Cache.setIncomingRequestIds(requestIds);

    if (callback != null) {
      callback.success();
    }
  }.bind(this), 1000);
}

Backend.getRequest = function(requestId) {
  var request = Backend.Cache.getRequest(requestId);
  if (request != null || Backend.Cache.isRequestInUpdate(requestId)) {
    return request;
  }
  
  Backend.Cache.markRequestInUpdate(requestId);
  setTimeout(function() {
    Backend.Cache.setRequest(requestId, this._createDummyRequest(requestId));
  }.bind(this), 1000);
  
  return null;
}

Backend.getResponse = function(requestId, responseId) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  if (response != null || Backend.Cache.isResponseInUpdate(requestId, responseId)) {
    return response;
  }
  
  Backend.Cache.markResponseInUpdate(requestId, responseId);
  setTimeout(function() {
    Backend.Cache.setResponse(requestId, responseId, this._createDummyResponse(requestId, responseId));
  }.bind(this), 1000);

  return null;
}

Backend.updateResponse = function(requestId, responseId, response, transactionCallback) {
  Backend.Cache.markResponseInUpdate(requestId, responseId);
  
  setTimeout(function() {
    var existingResponse = Backend.Cache.getResponse(requestId, responseId);
    for (var key in response) {
      if (key == "status" && existingResponse[key] != response[key] && response.status == Backend.Response.STATUS_READ) {
        var allResponseIds = Backend.Cache.getIncomingResponseIds(requestId);
        
        for (var index in allResponseIds.unviewed) {
          if (allResponseIds.unviewed[index] == responseId) {
            allResponseIds.unviewed.splice(index, 1);
            allResponseIds.viewed.push(requestId);
            Backend.Cache.setIncomingResponseIds(requestId, allResponseIds);
            break;
          }
        }
      }
      
      existingResponse[key] = response[key];
    }

    Backend.Cache.setResponse(requestId, responseId, existingResponse);
    
    if (transactionCallback != null) {
      transactionCallback.success();
    }
  }.bind(this), 1000);
}


Backend.getIncomingResponseIds = function(requestId, responseStatus) {
  var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
  
  var result = null;
  if (responseIds != null) {
    if (responseStatus == null) {
      result = responseIds.viewed != null && responseIds.unviewed != null ? responseIds.all : null;
    } else if (responseStatus == Backend.Response.STATUS_READ) {
      result = responseIds.viewed;
    } else if (responseStatus == Backend.Response.STATUS_UNREAD) {
      result = responseIds.unviewed;
    } else {
      throw "Invalid response status requested: " + responseStatus;
    }
  }

  if (result != null || Backend.Cache.isIncomingResponseIdsInUpdate(requestId)) {
    return result;
  } else {
    Backend.Cache.markIncomingResponseIdsInUpdate(requestId);

    setTimeout(function() {
      var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
      if (responseIds == null) {
        responseIds = {};
      }

      var generateViewed = false;
      var generateUnviewed = false;

      if (responseIds.all == null) {
        responseIds.all = [];
      }
      if (responseStatus == null) {
        if (responseIds.unviewed == null) {
          responseIds.unviewed = [];
          generateUnviewed = true;
        }
        if (responseIds.viewed == null) {
          responseIds.viewed = [];
          generateViewed = true;
        }
      } else if (responseStatus == Backend.Response.STATUS_READ) {
        if (responseIds.viewed == null) {
          responseIds.viewed = [];
          generateViewed = true;
        }
      } else if (responseStatus == Backend.Response.STATUS_UNREAD) {
        if (responseIds.unviewed == null) {
          responseIds.unviewed = [];
          generateUnviewed = true;
        }
      }

      var numOfResponses = Math.floor(Math.random() * 30);
      for (var i = 0; i < numOfResponses; i++) {
        if (Math.random() < 0.95) {
          if (generateViewed) {
            var responseId = requestId + "-response" + (50 + i);
            responseIds.all.push(responseId);
            responseIds.viewed.push(responseId);
          }
        } else {
          if (generateUnviewed) {
            var responseId = requestId + "-response" + i;
            responseIds.all.push(responseId);
            responseIds.unviewed.push(responseId);
          }
        }
      }

      Backend.Cache.setIncomingResponseIds(requestId, responseIds);
    }.bind(this), 1000);
    
    return null;
  }
}

Backend.removeIncomingResponse = function(requestId, responseId, callback) {
  Backend.Cache.markIncomingResponseIdsInUpdate(requestId);
  
  setTimeout(function() {
    var removeFromArray = function(arr, element) {
      for (var index in arr) {
        if (arr[index] == element) {
          arr.splice(index, 1);
          break;
        }
      }
      
      return arr;
    }
    
    var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
    responseIds.all = removeFromArray(responseIds.all, responseId);
    responseIds.viewed = removeFromArray(responseIds.viewed, responseId);
    responseIds.unviewed = removeFromArray(responseIds.unviewed, responseId);
    
    Backend.Cache.setIncomingResponseIds(requestId, responseIds);

    if (callback != null) {
      callback.success();
    }
  }.bind(this), 1000);
}


Backend.getOutgoingResponseIds = function(requestId, responseStatus) {
  var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);

  var result = null;
  if (responseIds != null) {
    if (responseStatus == null) {
      result = responseIds.viewed != null && responseIds.unviewed != null ? responseIds.all : null;
    } else if (responseStatus == Backend.Response.STATUS_READ) {
      result = responseIds.viewed;
    } else if (responseStatus == Backend.Request.STATUS_UNREAD) {
      result = responseIds.unviewed;
    } else {
      throw "Invalid response status requested: " + responseStatus;
    }
  }
  
  if (result != null || Backend.Cache.isOutgoingResponseIdsInUpdate(requestId)) {
    return result;
  } else {
    Backend.Cache.markOutgoingResponseIdsInUpdate(requestId);

    setTimeout(function() {
      var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
      if (responseIds == null) {
        responseIds = {};
      }

      var generateViewed = false;
      var generateUnviewed = false;

      if (responseIds.all == null) {
        responseIds.all = [];
      }
      if (responseStatus == null) {
        if (responseIds.unviewed == null) {
          responseIds.unviewed = [];
          generateUnviewed = true;
        }
        if (responseIds.viewed == null) {
          responseIds.viewed = [];
          generateViewed = true;
        }
      } else if (responseStatus == Backend.Response.STATUS_READ) {
        if (responseIds.viewed == null) {
          responseIds.viewed = [];
          generateViewed = true;
        }
      } else if (responseStatus == Backend.Reponse.STATUS_UNREAD) {
        if (responseIds.unviewed == null) {
          responseIds.unviewed = [];
          generateUnviewed = true;
        }
      }

      var numOfResponses = Math.floor(Math.random() * 5);
      for (var i = 0; i < numOfResponses; i++) {
        if (Math.random() < 0.95) {
          if (generateViewed) {
            var responseId = requestId + "-response" + (100 + 50 + i);
            responseIds.all.push(responseId);
            responseIds.viewed.push(responseId);
          }
        } else {
          if (generateUnviewed) {
            var responseId = requestId + "-response" + (100 + i);
            responseIds.all.push(responseId);
            responseIds.unviewed.push(responseId);
          }
        }
      }

      Backend.Cache.setOutgoingResponseIds(requestId, responseIds);
    }.bind(this), 1000);
    
    return null;
  }
}


Backend.getContactInfo = function(requestId, responseId, transactionCallback) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  
  if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_PROVIDED) {
    return response.contact_info;
  } else if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE) {
    return null;
  } else if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE) {
    Backend.Cache.markContactInfoInUpdate(requestId, responseId);

    setTimeout(function() {
      var contacts = [{contact_name: "Anton", contact_info: "(123) 456-78-90"}, {contact_name: "Oleg", contact_info: "(098) 765-43-21"}, {contact_name: "Leha", contact_info: "(456) 123-78-90"}, {contact_name: "Kosmonavtom", contact_info: "Call me to Baikanur!"}];

      var contactIndex = Math.round(Math.random() * (contacts.length - 1));
      var contactInfo = contacts[contactIndex];

      Backend.Cache.setContactInfo(requestId, responseId, contactInfo);
    }.bind(this), 2000);
  }
  
  return null;
}





Backend._createDummyRequest = function(requestId) {
  var quantity = Math.round(Math.random() * 3);
  var waitTime = Math.round(Math.random() * 3);
  var age = Math.round(Math.random() * 5);
  var gender = Math.round(Math.random() * 2);
  var numOfExtraLines = Math.round(Math.random() * 5);

  var status = Backend.Request.STATUS_INACTIVE;
  var requestIds = Backend.Cache.getIncomingRequestIds();
  if (requestIds != null) {
    for (var index in requestIds.active) {
      if (requestIds.active[index] == requestId) {
        status = Backend.Request.STATUS_ACTIVE;
        break;
      }
    }
  }
  
  requestIds = Backend.Cache.getOutgoingRequestIds();
  if (requestIds != null) {
    for (var index in requestIds.active) {
      if (requestIds.active[index] == requestId) {
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
  
  var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
  if (responseIds == null) {
    responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
  }
  for (var index in responseIds.unviewed) {
    if (responseIds.unviewed[index] == responseId) {
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




// Cache managememnt

Backend.CacheChangeEvent = {type: null, requestId: null, responseId: null};
Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED = "outgoing_requests_changed";
Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED = "incoming_requests_changed";
Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED = "request_changed";
Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED = "response_changed";
Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED = "outgoing_responses_changed";
Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED = "incoming_responses_changed";
Backend.CacheChangeEvent.TYPE_UPDATE_STARTED = "update_started";
Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED = "update_finished";


Backend.addCacheChangeListener = function(listener) {
  Backend.Cache.addCacheChangeListener(listener);
}

Backend.removeCacheChangeListener = function(listener) {
  Backend.Cache.removeCacheChangeListener(listener);
}


Backend.Cache = {
  cacheChangeListeners: [],
  
  outgoingRequestIdsInProgress: false,
  outgoingRequestIds: null,
  incomingRequestIdsInProgress: false,
  incomingRequestIds: null,
  requestsInProgress: {},
  requests: {},
  incomingResponseIdsInProgress: {},
  incomingResponseIds: {},
  outgoingResponseIdsInProgress: {},
  outgoingResponseIds: {},
  responsesInProgress: {},
  responses: {},
  contactInfosInProgress: {},
  updateInProgressNotified: false
};

Backend.Cache.reset = function() {
  this.cacheChangeListeners = [];
  
  this.outgoingRequestIdsInProgress = false;
  this.outgoingRequestIds = null;
  this.incomingRequestIdsInProgress = false;
  this.incomingRequestIds = null;
  this.requestsInProgress = {};
  this.requests = {};
  this.incomingResponseIdsInProgress = {},
  this.incomingResponseIds = {};
  this.outgoingResponseIdsInProgress = {};
  this.outgoingResponseIds = {};
  this.responsesInProgress = {};
  this.responses = {};
  this.contactInfosInProgress = {};
  this.updateInProgressNotified = false;
}

Backend.Cache.addCacheChangeListener = function(listener) {
  if (listener != null) {
    this.cacheChangeListeners.push(listener);
  }
}

Backend.Cache.removeCacheChangeListener = function(listener) {
  for (var index in this.cacheChangeListeners) {
    if (this.cacheChangeListeners[index] == listener) {
      this.cacheChangeListeners.splice(index, 1);
    }
  }
}

Backend.Cache.markOutgoingRequestIdsInUpdate = function() {
  this.outgoingRequestIdsInProgress = true;
  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingRequestIdsInUpdate = function() {
  return this.outgoingRequestIdsInProgress;
}
Backend.Cache.setOutgoingRequestIds = function(requestIds) {
  this.outgoingRequestIds = requestIds;
  this.outgoingRequestIdsInProgress = false;

  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, null, null);
  this._fireUpdateEvent();
}
Backend.Cache.getOutgoingRequestIds = function() {
  return this.outgoingRequestIds;
}
Backend.Cache.markIncomingRequestIdsInUpdate = function() {
  this._incomingRequestIdsInProgress = true;
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingRequestIdsInUpdate = function() {
  return this.incomingRequestIdsInProgress;
}
Backend.Cache.setIncomingRequestIds = function(requestIds) {
  this.incomingRequestIds = requestIds;
  this.incomingRequestIdsInProgress = false;
            
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, null, null);
  this._fireUpdateEvent();
}
Backend.Cache.getIncomingRequestIds = function() {
  return this.incomingRequestIds;
}
Backend.Cache.markRequestInUpdate = function(requestId) {
  this.requestsInProgress[requestId] = true;
  this._fireUpdateEvent();
}
Backend.Cache.isRequestInUpdate = function(requestId) {
  return this.requestsInProgress[requestId] != null;
}
Backend.Cache.setRequest = function(requestId, request) {
  this.requests[requestId] = request;
  delete this.requestsInProgress[requestId];
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId, null);
  this._fireUpdateEvent();
}
Backend.Cache.getRequest = function(requestId) {
  return this.requests[requestId];
}
Backend.Cache.markIncomingResponseIdsInUpdate = function(requestId) {
  this.incomingResponseIdsInProgress[requestId] = true;
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingResponseIdsInUpdate= function(requestId) {
  return this.incomingResponseIdsInProgress[requestId] != null;
}
Backend.Cache.setIncomingResponseIds = function(requestId, responseIds) {
  this.incomingResponseIds[requestId] = responseIds;
  delete this.incomingResponseIdsInProgress[requestId];

  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId, null);
  this._fireUpdateEvent();
}

Backend.Cache.getIncomingResponseIds = function(requestId) {
  return this.incomingResponseIds[requestId];
}
Backend.Cache.markOutgoingResponseIdsInUpdate = function(requestId) {
  this.outgoingResponseIdsInProgress[requestId] = true;
  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingResponseIdsInUpdate = function(requestId) {
  return this.outgoingResponseIdsInProgress[requestId] != null;
}
Backend.Cache.setOutgoingResponseIds = function(requestId, responseIds) {
  this.outgoingResponseIds[requestId] = responseIds;
  delete this.outgoingResponseIdsInProgress[requestId];
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId, null);
  this._fireUpdateEvent();
}
Backend.Cache.getOutgoingResponseIds = function(requestId) {
  return this.outgoingResponseIds[requestId];
}
Backend.Cache.markResponseInUpdate = function(requestId, responseId) {
  this.responsesInProgress[responseId] = true;
  this._fireUpdateEvent();
}
Backend.Cache.isResponseInUpdate = function(requestId, responseId) {
  return this.responsesInProgress[responseId] != null;
}
Backend.Cache.setResponse = function(requestId, responseId, response) {
  this.responses[responseId] = response;
  delete this.responsesInProgress[responseId];
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId, responseId);
  this._fireUpdateEvent();
}
Backend.Cache.getResponse = function(requestId, responseId) {
  return this.responses[responseId];
}
Backend.Cache.markContactInfoInUpdate = function(requestId, responseId) {
  this.contactInfosInProgress[responseId] = true;
  this._fireUpdateEvent();
}
Backend.Cache.isContactInfoInUpdate = function(requestId, responseId) {
  return this.contactInfosInProgress[responseId] != null;
}
Backend.Cache.setContactInfo = function(requestId, responseId, contactInfo) {
  var response = this.getResponse(requestId, responseId);
  response.contact_info = contactInfo;
  response.contact_info_status = Backend.Response.CONTACT_INFO_STATUS_PROVIDED;
  delete this.contactInfosInProgress[responseId];
  this.setResponse(requestId, responseId, response);
}

Backend.Cache.isInUpdate = function() {
  return this.outgoingRequestIdsInProgress == true
         || !GeneralUtils.isEmpty(this.incomingResponseIdsInProgress)
         || this.incomingRequestIdsInProgress == true
         || !GeneralUtils.isEmpty(this.outgoingResponseIdsInProgress)
         || !GeneralUtils.isEmpty(this.requestsInProgress)
         || !GeneralUtils.isEmpty(this.responsesInProgress)
         || !GeneralUtils.isEmpty(this.contactInfosInProgress);
}

Backend.Cache._fireUpdateEvent = function() {
  var isCurrentlyInUpdate = this.isInUpdate();
  
  if (!this.updateInProgressNotified && isCurrentlyInUpdate) {
    this.updateInProgressNotified = true;
    this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_UPDATE_STARTED, null, null);
  } else if (this.updateInProgressNotified && !isCurrentlyInUpdate) {
    this.updateInProgressNotified = false;
    this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED, null, null);
  }
}
Backend.Cache._notifyCacheListeners = function(type, requestId, responseId) {
  var event = {type: type, requestId: requestId, responseId: responseId};
  for (var index in this.cacheChangeListeners) {
    this.cacheChangeListeners[index](event);
  }
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
