var Backend = {
};

Backend._SERVER_BASE_URL = "https://hidden-taiga-8809.herokuapp.com/";
//Backend._SERVER_BASE_URL = "http://127.0.0.1:8080/";


// USER MANAGEMENT

Backend.UserProfile = {login: null, password: null, gender: null, languages: [], age_category: null, name: null, user_id: null};
Backend.UserPreferences = {
  default_response_quantity: Application.Configuration.RESPONSE_QUANTITY[0].data,
  default_response_wait_time: Application.Configuration.RESPONSE_WAIT_TIME[0].data,
  default_response_age_group_preference: Application.Configuration.AGE_CATEGORY_PREFERENCE[0].data,
  default_gender_preference: Application.Configuration.GENDER_PREFERENCE[0].data,
  inquiry_quantity_per_day: Application.Configuration.INQUIRY_LIMIT_PREFERENCE[0].data,
  inquiry_age_group_preference: Application.Configuration.AGE_CATEGORY_PREFERENCE[0].data,
  inquiry_gender_preference: Application.Configuration.GENDER_PREFERENCE[0].data,

  expertises: [Application.Configuration.EXPERTISES[0]],
  contact_info_requestable: false,
  contact_name: "",
  contact_info: ""
};

Backend.getUserProfile = function() {
  return this.UserProfile;
}

Backend.getUserPreferences = function() {
  return this.UserPreferences;
}

Backend.logIn = function(login, password, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile.login = login;
      Backend.UserProfile.password = password;
      Backend.UserProfile.user_id = data.user_id;

      Backend._pullUserSettings(transactionCallback);
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 401 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  this._communicate("user?login=" + login, "GET", null, true, this._getAuthenticationHeader(login, password), communicationCallback);
}

Backend.logOut = function(transactionCallback) {
  Backend.UserProfile.login = null;
  Backend.UserProfile.password = null;
  Backend.UserProfile.name = null;
  Backend.UserProfile.user_id = null;
  
  Backend.Cache.reset();
  
  //We may need to inform the server maybe?
  if (transactionCallback != null) {
    transactionCallback.success();
  }
}

Backend.isLogged = function() {
  return Backend.getUserProfile().login != null;
}

Backend.pullUserProfile = function(transactionCallback) {
  if (Backend.getUserProfile().user_id == null) {
    throw "Must login or register first";
  }

  var communicationCallback = {
    success: function(data, status, xhr) {
      var password = Backend.UserProfile.password; // temporary
      Backend.UserProfile = GeneralUtils.merge(Backend.getUserProfile(), data);
      Backend.UserProfile.password = password; // temporary
      
      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 401 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  
  this._communicate("user/" + Backend.getUserProfile().user_id, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.registerUser = function(userProfile, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        Backend.UserProfile = data;
        Backend.UserProfile.password = userProfile.password;
        Backend.UserProfile.user_id = xhr.getResponseHeader("Location");

        Backend._pullUserSettings(transactionCallback);
      } else if (transactionCallback != null) {
        transactionCallback.error();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 409) {
          transactionCallback.conflict();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  this._communicate("user", "POST", userProfile, true, {}, communicationCallback);
}

Backend.updateUserProfile = function(userProfile, currentPassword, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile = data;
      if (userProfile.password != null) {
        Backend.UserProfile.password = userProfile.password;
      }
      
//      Backend.pullUserProfile(transactionCallback);
      
      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 401) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id, "PUT", GeneralUtils.merge(Backend.getUserProfile(), userProfile), true, this._getAuthenticationHeader(Backend.getUserProfile().login, currentPassword), communicationCallback);

  return true;
}

Backend.pullUserPreferences = function(transactionCallback) {
  if (Backend.getUserProfile().user_id == null) {
    throw "Must login or register first";
  }
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserPreferences = GeneralUtils.merge(Backend.getUserPreferences(), data);

      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) { 
        if (xhr.status == 401 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  
  this._communicate("user/" + Backend.getUserProfile().user_id + "/settings", "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.updateUserPreferences = function(userPreferences, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserPreferences = userPreferences; // Temporary. To be replaced
      //Backend.UserPreferences = data;

      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 401) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/settings", "PUT", GeneralUtils.merge(Backend.getUserPreferences(), userPreferences), false, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.resetUserPassword = function(login, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) { 
        if (xhr.status == 401 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  
  this._communicate("user/" + Backend.getUserProfile().user_id + "?reset_password", "GET", null, false, this._getAuthenticationHeader(), communicationCallback);
}


Backend._pullUserSettings = function(transactionCallback) {
  var callbackAdapter = {
    success: function() {
      Backend.pullUserPreferences(transactionCallback);
    },
    failure: function() {
      if (transactionCallback != null) {
        transactionCallback.failure();
      }
    },
    error: function() {
      if (transactionCallback != null) {
        transactionCallback.error();
      }
    }
  }
  
  Backend.pullUserProfile(callbackAdapter);
}





// REQUEST (and Response) management

Backend.REQUEST_IDS_SORT_BY_DATE = "sort_by_date";
Backend.REQUEST_IDS_SORT_BY_RATE = "sort_by_rate";
Backend.REQUEST_IDS_SORT_BY_CATEGORY = "sort_by_category";


Backend.Request = {};
Backend.Request.STATUS_ALL = "all";
Backend.Request.STATUS_ACTIVE = "active";
Backend.Request.STATUS_INACTIVE = "inactive";

Backend.Response = {};
Backend.Response.STATUS_ALL = "all";
Backend.Response.STATUS_UNREAD = "unviewed";
Backend.Response.STATUS_READ = "viewed";
Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE = "no";
Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE = "can_provide";
Backend.Response.CONTACT_INFO_STATUS_PROVIDED = "provided";



Backend.createRequest = function(request, transactionCallback) {
  Backend.Cache.markOutgoingRequestIdsInUpdate();

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        var newRequestId = xhr.getResponseHeader("Location");
        Backend.Cache.setRequest(newRequestId, data);
        
        Backend._pullOutgoingRequestIds(); //TODO: remove, this is temporary. It should be replaced with events
        
//        Backend._pullRequest(newRequestId, {
//          success: function() {
//            transactionCallback.success(newRequestId);
//          },
//          failure: function() {
//            transactionCallback.failure();
//          },
//          error: function() {
//            transactionCallback.error();
//          }
//        }); //TODO: remove, this is temporary. It should be replaced with data reported back from the call
        
        
        if (transactionCallback != null) {
          transactionCallback.success(newRequestId);
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markOutgoingRequestIdsInUpdate(false);
    }
  }

  this._communicate("request", "POST",
    { 
      user_id: Backend.getUserProfile().user_id,
      text: request.text,
      attachments: request.attachments, // each attachment: {name, url, data, type}
      response_quantity: request.response_quantity,
      response_wait_time: request.response_wait_time,
      response_age_group: request.response_age_group,
      response_gender: request.response_gender,
      expertise_category: request.expertise_category
    },
  true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.updateRequest = function(requestId, request, transactionCallback) {
  Backend.Cache.markRequestInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
//        Backend._pullRequest(requestId, {
//          success: function() {
//            transactionCallback.success();
//          },
//          failure: function() {
//            transactionCallback.failure();
//          },
//          error: function() {
//            transactionCallback.error();
//          }
//        }); //TODO: remove, this is temporary. It should be replaced with data reported back from the call

        Backend.Cache.setRequest(requestId, data);
        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markRequestInUpdate(requestId, false);
    }
  }

  this._communicate("request/" + requestId, "PUT", GeneralUtils.merge(Backend.Cache.getRequest(requestId), request), true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getRequest = function(requestId) {
  var request = Backend.Cache.getRequest(requestId);
  if (request != null || Backend.Cache.isRequestInUpdate(requestId)) {
    //TO BE REMOVED
    if (request != null && request.status == Backend.Request.STATUS_ACTIVE) {
      var timeToLive = (request.time + request.response_wait_time * 1000 * 60 * 60) - Date.now();
      if (timeToLive < 0) {
        request.status = Backend.Request.STATUS_INACTIVE;
      }
    }
    
    return request;
  }
  
  Backend._pullRequest(requestId);
  return null;
}

Backend._pullRequest = function(requestId, transactionCallback) {
  Backend.Cache.markRequestInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend.Cache.setRequest(requestId, data);
        
        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markRequestInUpdate(requestId, false);
    }
  }

  this._communicate("request/" + requestId, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.getOutgoingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  var requestIds = Backend.Cache.getOutgoingRequestIds();

  var result = null;
  if (requestIds != null) {
    if (requestStatus == null || requestStatus == Backend.Request.STATUS_ALL) {
      result = requestIds.all;
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
    Backend._pullOutgoingRequestIds(requestStatus, sortRule, transactionCallback);
    
    return null;
  }
}

Backend._pullOutgoingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  Backend.Cache.markOutgoingRequestIdsInUpdate();

  if (requestStatus == null) {
    requestStatus = Backend.Request.STATUS_ALL;
  }

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var requestIds = Backend.Cache.getOutgoingRequestIds();
        if (requestIds == null) {
          requestIds = {};
        }
        
        if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_ACTIVE) {
          requestIds.active = data.active;
        }
        if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_INACTIVE) {
          requestIds.inactive = data.inactive;
        }
        
        if (requestStatus == Backend.Request.STATUS_ALL) {
          requestIds.all = data.active.concat(data.inactive);
        } else {
          requestIds.all = null;
        }

        Backend.Cache.setOutgoingRequestIds(requestIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markOutgoingRequestIdsInUpdate(false);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/requests/outgoing?status=" + requestStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getIncomingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  var requestIds = Backend.Cache.getIncomingRequestIds();
  
  var result = null;
  if (requestIds != null) {
    if (requestStatus == null || requestStatus == Backend.Request.STATUS_ALL) {
      result = requestIds.all;
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
    Backend._pullIncomingRequestIds(requestStatus, sortRule, transactionCallback);

    return null;
  }
}

Backend._pullIncomingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  Backend.Cache.markIncomingRequestIdsInUpdate();

  if (requestStatus == null) {
    requestStatus = Backend.Request.STATUS_ALL;
  }
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var requestIds = Backend.Cache.getIncomingRequestIds();
        if (requestIds == null) {
          requestIds = {};
        }
        
        if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_ACTIVE) {
          requestIds.active = data.active;
        }
        if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_INACTIVE) {
          requestIds.inactive = data.inactive;
        }
        
        if (requestStatus == Backend.Request.STATUS_ALL) {
          requestIds.all = data.active.concat(data.inactive);
        } else {
          requestIds.all = null;
        }

        Backend.Cache.setIncomingRequestIds(requestIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markIncomingRequestIdsInUpdate(false);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/requests/incoming?status=" + requestStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.removeIncomingRequest = function(requestId, transactionCallback) {
  Backend.Cache.markIncomingRequestIdsInUpdate();
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var requestIds = Backend.Cache.getIncomingRequestIds();

        //TODO: This needs to be cleaned to repull from the server
        requestIds.all = GeneralUtils.removeFromArray(requestIds.all, requestId);
        requestIds.active = GeneralUtils.removeFromArray(requestIds.active, requestId);
        requestIds.inactive = GeneralUtils.removeFromArray(requestIds.inactive, requestId);

        Backend.Cache.setIncomingRequestIds(requestIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markIncomingRequestIdsInUpdate(false);
    }
  }
  
  this._communicate("user/" + Backend.getUserProfile().user_id + "/requests/incoming/" + requestId, "DELETE", null, false, this._getAuthenticationHeader(), communicationCallback);
}




Backend.createResponse = function(requestId, response, transactionCallback) {
  Backend.Cache.markOutgoingResponseIdsInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        var newResponseId = xhr.getResponseHeader("Location");
        Backend.Cache.setResponse(requestId, newResponseId, data);
        
        Backend._pullOutgoingResponseIds(requestId); //TODO: remove, this is temporary. It should be replaced with events
//        Backend._pullResponse(requestId, newResponseId, {
//          success: function() {
//            transactionCallback.success(newResponseId);
//          },
//          failure: function() {
//            transactionCallback.failure();
//          },
//          error: function() {
//            transactionCallback.error();
//          }
//        }); //TODO: remove, this is temporary. It should be replaced with data reported back from the call
        
        if (transactionCallback != null) {
          transactionCallback.success(newResponseId);
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markOutgoingResponseIdsInUpdate(requestId, false);
    }
  }

  this._communicate("response", "POST",
    { 
      user_id: Backend.getUserProfile().user_id,
      requestId: requestId,
      text: response.text,
      age_category: Backend.getUserProfile().age_category,
      gender: Backend.getUserProfile().gender,
      attachments: response.attachments, // each attachment: {name, url, data, type}
      contact_info_status: Backend.getUserPreferences().contact_info_requestable ? Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE : Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE
    },
  true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getResponse = function(requestId, responseId) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  if (response != null || Backend.Cache.isResponseInUpdate(requestId, responseId)) {
    return response;
  }
  
  Backend._pullResponse(requestId, responseId);
  return null;
}

Backend._pullResponse = function(requestId, responseId, transactionCallback) {
   Backend.Cache.markResponseInUpdate(requestId, responseId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend.Cache.setResponse(requestId, responseId, data);
        
        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markResponseInUpdate(requestId, responseId, false);
    }
  }

  this._communicate("response/" + responseId, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getResponseWithContactInfo = function(requestId, responseId, transactionCallback) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  
  if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_PROVIDED) {
    if (transactionCallback != null) {
      transactionCallback.success();
    }
    return response;
  } else if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_NOT_AVAILABLE) {
    if (transactionCallback != null) {
      transactionCallback.failure();
    }
    return null;
  } else if (response.contact_info_status == Backend.Response.CONTACT_INFO_STATUS_CAN_PROVIDE) {
    Backend._pullResponseWithContactInfo(requestId, responseId, transactionCallback)
    return null;
  } else {
    debug.error("Unsupported contact_info_status");
  }
}

Backend._pullResponseWithContactInfo = function(requestId, responseId, transactionCallback) {
  Backend.Cache.markResponseInUpdate(requestId, responseId);
  
    setTimeout(function() {
      var contacts = [{contact_name: "Anton", contact_info: "(123) 456-78-90"}, {contact_name: "Oleg", contact_info: "(098) 765-43-21"}, {contact_name: "Leha", contact_info: "(456) 123-78-90"}, {contact_name: "Kosmonavtom", contact_info: "Call me to Baikanur!"}];

      var contactIndex = Math.round(Math.random() * (contacts.length - 1));
      var contactInfo = contacts[contactIndex];
      
      var response = Backend.Cache.getResponse(requestId, responseId);
      response.contact_info_status = Backend.Response.CONTACT_INFO_STATUS_PROVIDED;
      response.contact_info = contactInfo;

      Backend.Cache.setResponse(requestId, responseId, response);
    }.bind(this), 2000);
  
/*  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend.Cache.setResponse(requestId, responseId, data);
        
        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markResponseInUpdate(requestId, responseId, false);
    }
  }

  this._communicate("response/" + responseId + "?contactinfo", "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
  */
}


Backend.updateResponse = function(requestId, responseId, response, transactionCallback) {
  Backend.Cache.markResponseInUpdate(requestId, responseId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
//        Backend._pullResponse(requestId, responseId, {
//          success: function() {
//            transactionCallback.success();
//          },
//          failure: function() {
//            transactionCallback.failure();
//          },
//          error: function() {
//            transactionCallback.error();
//          }
//        }); //TODO: remove, this is temporary. It should be replaced with data reported back from the call

        Backend.Cache.setResponse(requestId, responseId, data);
        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markResponseInUpdate(requestId, responseId, false);
    }
  }

  this._communicate("response/" + responseId, "PUT", GeneralUtils.merge(Backend.Cache.getResponse(requestId, responseId), response), true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.getIncomingResponseIds = function(requestId, responseStatus) {
  var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
  
  var result = null;
  if (responseIds != null) {
    if (responseStatus == null || responseStatus == Backend.Response.STATUS_ALL) {
      result = responseIds.all;
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
    Backend._pullIncomingResponseIds(requestId, responseStatus);
    return null;
  }
}

Backend._pullIncomingResponseIds = function(requestId, responseStatus, transactionCallback) {
  Backend.Cache.markIncomingResponseIdsInUpdate(requestId);

  if (responseStatus == null) {
    responseStatus = Backend.Response.STATUS_ALL;
  }

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
        if (responseIds == null) {
          responseIds = {};
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_READ) {
          responseIds.viewed = data.viewed;
        }
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_UNREAD) {
          responseIds.unviewed = data.unviewed;
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL) {
          responseIds.all = data.viewed.concat(data.unviewed);
        } else {
          responseIds.all = null;
        }

        Backend.Cache.setIncomingResponseIds(requestId, responseIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markIncomingResponseIdsInUpdate(requestId, false);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/responses/incoming/" + requestId + "?status=" + responseStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.removeIncomingResponse = function(requestId, responseId, callback) {
  Backend.Cache.markIncomingResponseIdsInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var responseIds = Backend.Cache.getIncomingResponseIds(requestId);

        //TODO: This needs to be cleaned to repull from the server
        responseIds.all = GeneralUtils.removeFromArray(responseIds.all, responseId);
        responseIds.viewed = GeneralUtils.removeFromArray(responseIds.active, responseId);
        responseIds.unviewed = GeneralUtils.removeFromArray(responseIds.inactive, responseId);

        Backend.Cache.setIncomingResponseIds(requestId, responseIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markIncomingResponseIdsInUpdate(requestId, false);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/responses/incoming/" + responseId, "DELETE", null, false, this._getAuthenticationHeader(), communicationCallback);
}


Backend.getOutgoingResponseIds = function(requestId, responseStatus) {
  var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);

  var result = null;
  if (responseIds != null) {
    if (responseStatus == null || responseStatus == Backend.Response.STATUS_ALL) {
      result = responseIds.all;
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
    Backend._pullOutgoingResponseIds(requestId, responseStatus);
    return null;
  }
}

Backend._pullOutgoingResponseIds = function(requestId, responseStatus, transactionCallback) {
  Backend.Cache.markOutgoingResponseIdsInUpdate(requestId);

  if (responseStatus == null) {
    responseStatus = Backend.Response.STATUS_ALL;
  }

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
        if (responseIds == null) {
          responseIds = {};
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_READ) {
          responseIds.viewed = data.viewed;
        }
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_UNREAD) {
          responseIds.unviewed = data.unviewed;
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL) {
          responseIds.all = data.viewed.concat(data.unviewed);
        } else {
          responseIds.all = null;
        }

        Backend.Cache.setOutgoingResponseIds(requestId, responseIds);

        if (transactionCallback != null) {
          transactionCallback.success();
        }
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
      Backend.Cache.markOutgoingResponseIdsInUpdate(requestId, false);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/responses/outgoing/" + requestId + "?status=" + responseStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
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
  this.updateInProgressNotified = false;
}

Backend.Cache.addCacheChangeListener = function(listener) {
  if (listener != null) {
    this.cacheChangeListeners.push(listener);
    
    if (Backend.Cache.isInUpdate()) {
      listener({type: Backend.CacheChangeEvent.TYPE_UPDATE_STARTED});
    }
  }
}

Backend.Cache.removeCacheChangeListener = function(listener) {
  for (var index in this.cacheChangeListeners) {
    if (this.cacheChangeListeners[index] == listener) {
      this.cacheChangeListeners.splice(index, 1);
    }
  }
}

Backend.Cache.markOutgoingRequestIdsInUpdate = function(isInUpdate) {
  this.outgoingRequestIdsInProgress = isInUpdate != null ? isInUpdate : true;
  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingRequestIdsInUpdate = function() {
  return this.outgoingRequestIdsInProgress;
}
Backend.Cache.setOutgoingRequestIds = function(requestIds) {
  this.outgoingRequestIds = requestIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, null, null);
  
  this.markOutgoingRequestIdsInUpdate(false);
}
Backend.Cache.getOutgoingRequestIds = function() {
  return this.outgoingRequestIds;
}

Backend.Cache.markIncomingRequestIdsInUpdate = function(isInUpdate) {
  this.incomingRequestIdsInProgress = isInUpdate != null ? isInUpdate : true;
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingRequestIdsInUpdate = function() {
  return this.incomingRequestIdsInProgress;
}
Backend.Cache.setIncomingRequestIds = function(requestIds) {
  this.incomingRequestIds = requestIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, null, null);
  
  this.markIncomingRequestIdsInUpdate(false);
}
Backend.Cache.getIncomingRequestIds = function() {
  return this.incomingRequestIds;
}

Backend.Cache.markRequestInUpdate = function(requestId, isInUpdate) {
  this.requestsInProgress[requestId] = isInUpdate != null ? isInUpdate : true;
  if (!this.requestsInProgress[requestId]) {
    delete this.requestsInProgress[requestId];
  }
  this._fireUpdateEvent();
}
Backend.Cache.isRequestInUpdate = function(requestId) {
  return this.requestsInProgress[requestId] != null;
}
Backend.Cache.setRequest = function(requestId, request) {
  this.requests[requestId] = request;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId, null);
  
  this.markRequestInUpdate(requestId, false);
}
Backend.Cache.getRequest = function(requestId) {
  return this.requests[requestId];
}

Backend.Cache.markIncomingResponseIdsInUpdate = function(requestId, isInUpdate) {
  this.incomingResponseIdsInProgress[requestId] = isInUpdate != null ? isInUpdate : true;
  if (!this.incomingResponseIdsInProgress[requestId]) {
    delete this.incomingResponseIdsInProgress[requestId];
  }
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingResponseIdsInUpdate= function(requestId) {
  return this.incomingResponseIdsInProgress[requestId] != null;
}
Backend.Cache.setIncomingResponseIds = function(requestId, responseIds) {
  this.incomingResponseIds[requestId] = responseIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId, null);
  
  this.markIncomingResponseIdsInUpdate(requestId, false);
}
Backend.Cache.getIncomingResponseIds = function(requestId) {
  return this.incomingResponseIds[requestId];
}

Backend.Cache.markOutgoingResponseIdsInUpdate = function(requestId, isInUpdate) {
  this.outgoingResponseIdsInProgress[requestId] = isInUpdate != null ? isInUpdate : true;
  if (!this.outgoingResponseIdsInProgress[requestId]) {
    delete this.outgoingResponseIdsInProgress[requestId];
  }
  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingResponseIdsInUpdate = function(requestId) {
  return this.outgoingResponseIdsInProgress[requestId] != null;
}
Backend.Cache.setOutgoingResponseIds = function(requestId, responseIds) {
  this.outgoingResponseIds[requestId] = responseIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId, null);
  
  this.markOutgoingResponseIdsInUpdate(requestId, false);
}
Backend.Cache.getOutgoingResponseIds = function(requestId) {
  return this.outgoingResponseIds[requestId];
}

Backend.Cache.markResponseInUpdate = function(requestId, responseId, isInUpdate) {
  this.responsesInProgress[responseId] = isInUpdate != null ? isInUpdate : true;
  if (!this.responsesInProgress[responseId]) {
    delete this.responsesInProgress[responseId];
  }
  this._fireUpdateEvent();
}
Backend.Cache.isResponseInUpdate = function(requestId, responseId) {
  return this.responsesInProgress[responseId] != null;
}
Backend.Cache.setResponse = function(requestId, responseId, response) {
  this.responses[responseId] = response;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId, responseId);
  
  this.markResponseInUpdate(requestId, responseId, false);
}
Backend.Cache.getResponse = function(requestId, responseId) {
  return this.responses[responseId];
}

Backend.Cache.isInUpdate = function() {
  return this.outgoingRequestIdsInProgress == true
         || !GeneralUtils.isEmpty(this.incomingResponseIdsInProgress)
         || this.incomingRequestIdsInProgress == true
         || !GeneralUtils.isEmpty(this.outgoingResponseIdsInProgress)
         || !GeneralUtils.isEmpty(this.requestsInProgress)
         || !GeneralUtils.isEmpty(this.responsesInProgress);
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
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status >= 200 && request.status < 300) {
        callback.success(isJsonResponse ? JSON.parse(request.responseText) : request.responseText, request.status, request);
      } else {
        callback.error(request, request.status, request.responseText);
      }
    }
  }
  
  request.open(method, Backend._SERVER_BASE_URL + resource, true);
  request.setRequestHeader("content-type", "application/json");
  for (var name in headers) {
    request.setRequestHeader(name, headers[name]);
  }

  request.send(data != null ? JSON.stringify(data) : "");  
  
//  $.ajax({
//    url: Backend._SERVER_BASE_URL + resource,
//    type: method,
//    data: data != null ? JSON.stringify(data) : "",
//    headers: headers != null ? headers : {},
//    contentType: "application/json; charset=utf-8",
//    dataType: isJsonResponse ? "json" : "text",
//    success: callback.success,
//    error: callback.error
//  });
}

Backend._getAuthenticationHeader = function(login, password) {
  var value = null;
  if (login != null && password != null) {
    value = login + ":" + password;
  } else if (Backend.getUserProfile().login != null && Backend.getUserProfile().password != null) {
    value = Backend.getUserProfile().login + ":" + Backend.getUserProfile().password;
  }
  
  return value != null ? {Token: value} : {};
}
