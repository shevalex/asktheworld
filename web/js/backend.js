var Backend = {
};
Backend._FORCE_IMMEDIATE_UPDATE = true;

Backend._SERVER_BASE_URL = "https://hidden-taiga-8809.herokuapp.com/";
//Backend._SERVER_BASE_URL = "http://192.168.1.13:8080/";


// USER MANAGEMENT

Backend.Events = { timestamp: 0, _pulling: false };
Backend.Events.OUTGOING_REQUESTS_CHANGED = "OUTGOING_REQUESTS_CHANGED";
Backend.Events.INCOMING_REQUESTS_CHANGED = "INCOMING_REQUESTS_CHANGED";
Backend.Events.OUTGOING_RESPONSES_CHANGED = "OUTGOING_RESPONSES_CHANGED";
Backend.Events.INCOMING_RESPONSES_CHANGED = "INCOMING_RESPONSES_CHANGED";
Backend.Events.REQUEST_CHANGED = "REQUEST_CHANGED";
Backend.Events.RESPONSE_CHANGED = "RESPONSE_CHANGED";


Backend.UserProfile = {login: null, password: null, gender: null, languages: [], age_category: null, name: null, user_id: null};
Backend.UserPreferences = {
  default_response_quantity: null,
  default_response_wait_time: null,
  default_response_age_group_preference: null,
  default_gender_preference: null,
  inquiry_quantity_per_day: null,
  inquiry_age_group_preference: null,
  inquiry_gender_preference: null,
  expertises: [],
  
  paid_features: {
    hidden_text: {
      enabled: true,
      policy: Application.Configuration.PAID_FEATURE_POLICY_FREE,
      data: {}
    },
    
    contact_info: {
      enabled: false,
      policy: Application.Configuration.PAID_FEATURE_POLICY_FREE,
      data: {contact_name: null, contact_information: null}
    }
  }
};


Backend.UserSettings = {expertise_categories: []};


Backend.getUserProfile = function() {
  return this.UserProfile;
}

Backend.getUserPreferences = function() {
  return this.UserPreferences;
}

Backend.getUserSettings = function() {
  return this.UserSettings;
}

Backend.isPaidFeaturesEnabled = function() {
  return this.getUserPreferences().expertises.length == 1 && this.getUserPreferences().expertises[0] != Application.Configuration.GENERAL_EXPERTISE_CATEGORY || this.getUserPreferences().expertises.length > 1;
}

Backend.logIn = function(login, password, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserProfile.login = login;
      Backend.UserProfile.password = password;
      Backend.UserProfile.user_id = data.user_id;

      Backend._pullUserData(transactionCallback);
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) {
        if (xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
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
  Backend.stopPullingEvents();
  
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

        Backend._pullUserData(transactionCallback);
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
  
  this._communicate("user/" + Backend.getUserProfile().user_id + "/preferences", "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.updateUserPreferences = function(userPreferences, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserPreferences = data;

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

  this._communicate("user/" + Backend.getUserProfile().user_id + "/preferences", "PUT", GeneralUtils.merge(Backend.getUserPreferences(), userPreferences), true, this._getAuthenticationHeader(), communicationCallback);

  return true;
}

Backend.pullUserSettings = function(transactionCallback) {
  if (Backend.getUserProfile().user_id == null) {
    throw "Must login or register first";
  }
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.UserSettings = GeneralUtils.merge(Backend.getUserSettings(), data);

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


Backend.resetUserPassword = function(login, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) { 
        if (xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  
  this._communicate("reset?login=" + login, "GET", null, false, {}, communicationCallback);
}

Backend.setUserPassword = function(login, password, recoveryToken, transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (transactionCallback != null) {
        transactionCallback.success();
      }
    },
    error: function(xhr, status, error) {
      if (transactionCallback != null) { 
        if (xhr.status == 403 || xhr.status == 404) {
          transactionCallback.failure();
        } else {
          transactionCallback.error();
        }
      }
    }
  }
  
  this._communicate("reset?token=" + recoveryToken + "&login=" + login, "PUT", {
    password: password  
  }, false, {}, communicationCallback);
}


Backend._pullUserData = function(transactionCallback) {
  var settingsCallbackAdapter = {
    success: function() {
      var profileCallbackAdapter = {
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
      
      
      Backend.pullUserProfile(profileCallbackAdapter);
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
  
  Backend.pullUserSettings(settingsCallbackAdapter);
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
Backend.Response.STATUS_UNVIEWED = "unviewed";
Backend.Response.STATUS_VIEWED = "viewed";
Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE = "not_available";
Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE = "can_provide";
Backend.Response.PAID_INFO_STATUS_PROVIDED = "provided";
Backend.Response.PAID_INFO_PAY_POLICY_FREE = "free";
Backend.Response.PAID_INFO_PAY_POLICY_PAID = "paid";



Backend.createRequest = function(request, transactionCallback) {
  Backend.Cache.markOutgoingRequestIdsInUpdate();

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 201) {
        var newRequestId = xhr.getResponseHeader("Location");
        
        if (Backend._FORCE_IMMEDIATE_UPDATE) {
          Backend.Cache.setRequest(newRequestId, data);

          var requestIds = Backend.Cache.getOutgoingRequestIds();
          if (requestIds.all == null) {
            requestIds.all = [];
          }
          requestIds.all.push(newRequestId);

          if (requestIds.active == null) {
            requestIds.active = [];
          }
          requestIds.active.push(newRequestId);

          Backend.Cache.setOutgoingRequestIds(requestIds);
        }
        
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

  request.user_id = Backend.getUserProfile().user_id;
  this._communicate("request", "POST", request, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.updateRequest = function(requestId, request, transactionCallback) {
  Backend.Cache.markRequestInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        if (Backend._FORCE_IMMEDIATE_UPDATE) {
          var originalStatus = Backend.Cache.getRequest(requestId);
          Backend.Cache.setRequest(requestId, data);
          if (data.status != originalStatus) {
            var requestIds = Backend.Cache.getOutgoingRequestIds();
            requestIds.active = GeneralUtils.removeFromArray(requestIds.active, requestId);
            if (requestIds.inactive == null) {
              requestIds.inactive = [requestId];
            } else {
              requestIds.inactive.push(requestId);
            }
            Backend.Cache.setOutgoingRequestIds(requestIds);
          }
        }
        
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

Backend.getRequest = function(requestId, transactionCallback) {
  var request = Backend.Cache.getRequest(requestId);
  if (request != null || Backend.Cache.isRequestInUpdate(requestId)) {
    if (transactionCallback != null) {
      transactionCallback.success();
    }
    return request;
  }
  
  Backend._pullRequest(requestId, transactionCallback);
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

  requestStatus = requestStatus || Backend.Request.STATUS_ALL;
  
  var result = null;
  if (requestIds != null) {
    if (requestStatus == Backend.Request.STATUS_ALL) {
      result = requestIds.all;
    } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
      result = requestIds.active;
    } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
      result = requestIds.inactive;
    } else {
      throw "Invalid request status requested: " + requestStatus;
    }
  }

  if (result != null || Backend.Cache.isOutgoingRequestIdsInUpdate(requestStatus) || Backend.Cache.isOutgoingRequestIdsInUpdate(Backend.Request.STATUS_ALL)) {
    return result;
  } else {
    Backend._pullOutgoingRequestIds(requestStatus, sortRule, transactionCallback);
    
    return null;
  }
}

Backend._pullOutgoingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  Backend.Cache.markOutgoingRequestIdsInUpdate(requestStatus, requestStatus);

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var requestIds = Backend.Cache.getOutgoingRequestIds();
        
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

        Backend.Cache.setOutgoingRequestIds(requestIds, requestStatus);

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
      Backend.Cache.markOutgoingRequestIdsInUpdate(false, requestStatus);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/requests/outgoing?status=" + requestStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getIncomingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  var requestIds = Backend.Cache.getIncomingRequestIds();
  
  requestStatus = requestStatus || Backend.Request.STATUS_ALL;
  var result = null;
  if (requestIds != null) {
    if (requestStatus == Backend.Request.STATUS_ALL) {
      result = requestIds.all;
    } else if (requestStatus == Backend.Request.STATUS_ACTIVE) {
      result = requestIds.active;
    } else if (requestStatus == Backend.Request.STATUS_INACTIVE) {
      result = requestIds.inactive;
    } else {
      throw "Invalid request status requested: " + requestStatus;
    }
  }

  if (result != null || Backend.Cache.isIncomingRequestIdsInUpdate(requestStatus) || Backend.Cache.isIncomingRequestIdsInUpdate(Backend.Request.STATUS_ALL)) {
    return result;
  } else {
    Backend._pullIncomingRequestIds(requestStatus, sortRule, transactionCallback);

    return null;
  }
}

Backend._pullIncomingRequestIds = function(requestStatus, sortRule, transactionCallback) {
  Backend.Cache.markIncomingRequestIdsInUpdate();

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

        Backend.Cache.setIncomingRequestIds(requestIds, requestStatus);

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
      Backend.Cache.markIncomingRequestIdsInUpdate(false, requestStatus);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/requests/incoming?status=" + requestStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.removeIncomingRequest = function(requestId, transactionCallback) {
  Backend.Cache.markIncomingRequestIdsInUpdate();
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      Backend.Cache.markIncomingRequestIdsInUpdate(false);
      
      if (Backend._FORCE_IMMEDIATE_UPDATE) {
        var requestIds = Backend.Cache.getIncomingRequestIds();
        requestIds.all = GeneralUtils.removeFromArray(requestIds.all, requestId);
        requestIds.active = GeneralUtils.removeFromArray(requestIds.active, requestId);
        requestIds.inactive = GeneralUtils.removeFromArray(requestIds.inactive, requestId);
        Backend.Cache.setIncomingRequestIds(requestIds);
      }
      
      if (xhr.status == 200) {
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
        
        if (Backend._FORCE_IMMEDIATE_UPDATE) {
          Backend.Cache.setResponse(newResponseId, data);

          var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
          if (responseIds.all == null) {
            responseIds.all = [];
          }
          responseIds.all.push(newResponseId);

          if (responseIds.active == null) {
            responseIds.active = [];
          }
          responseIds.active.push(newResponseId);

          Backend.Cache.setOutgoingResponseIds(requestId, responseIds);
        }

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

  response.user_id = Backend.getUserProfile().user_id;
  response.request_id = parseInt(requestId);
  response.age_category = Backend.getUserProfile().age_category;
  response.gender = Backend.getUserProfile().gender;
  
  this._communicate("response", "POST", response, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.getResponse = function(requestId, responseId, transactionCallback) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  if (response != null || Backend.Cache.isResponseInUpdate(requestId, responseId)) {
    if (transactionCallback != null) {
      transactionCallback.success();
    }
    return response;
  }
  
  Backend._pullResponse(requestId, responseId, transactionCallback);
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
  return this._getResponseWithPaidInfo(requestId, responseId, "contact_info_status", "contact_info", transactionCallback);
}

Backend.getResponseWithHiddenText = function(requestId, responseId, transactionCallback) {
  return this._getResponseWithPaidInfo(requestId, responseId, "hidden_text_status", "hidden_text", transactionCallback);
}

Backend._getResponseWithPaidInfo = function(requestId, responseId, infoStatusField, dataField, transactionCallback) {
  var response = Backend.Cache.getResponse(requestId, responseId);
  
  if (response[infoStatusField] == Backend.Response.PAID_INFO_STATUS_PROVIDED) {
    if (transactionCallback != null) {
      transactionCallback.success();
    }
    return response;
  } else if (response[infoStatusField] == Backend.Response.PAID_INFO_STATUS_NOT_AVAILABLE) {
    if (transactionCallback != null) {
      transactionCallback.failure();
    }
    return null;
  } else if (response[infoStatusField] == Backend.Response.PAID_INFO_STATUS_CAN_PROVIDE) {
    Backend._pullResponsePaidInfo(requestId, responseId, infoStatusField, dataField, transactionCallback)
    return null;
  } else {
    debug.error("Unsupported status " + infoStatusField);
  }
}

Backend._pullResponsePaidInfo = function(requestId, responseId, infoStatusField, dataField, transactionCallback) {
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

  this._communicate("response/" + responseId + "?paid=" + dataField, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.updateResponse = function(requestId, responseId, response, transactionCallback) {
  Backend.Cache.markResponseInUpdate(requestId, responseId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        if (Backend._FORCE_IMMEDIATE_UPDATE) {
          var originalStatus = Backend.Cache.getResponse(requestId, responseId);
          Backend.Cache.setResponse(requestId, responseId, data);
          if (data.status != originalStatus) {
            var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
            if (Backend._isResponsePresent(responseIds)) {
              responseIds.unviewed = GeneralUtils.removeFromArray(responseIds.unviewed, responseId);
              if (responseIds.viewed == null) {
                responseIds.viewed = [responseId];
              } else {
                responseIds.viewed.push(responseId);
              }
              Backend.Cache.setOutgoingResponseIds(requestId, responseIds);
            } else {
              responseIds = Backend.Cache.getIncomingResponseIds(requestId);
              if (Backend._isResponsePresent(responseIds)) {
                responseIds.unviewed = GeneralUtils.removeFromArray(responseIds.unviewed, responseId);
                if (responseIds.viewed == null) {
                  responseIds.viewed = [responseId];
                } else {
                  responseIds.viewed.push(responseId);
                }
                Backend.Cache.setIncomingResponseIds(requestId, responseIds);
              }
            }
          }
        }
        
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

Backend._isResponsePresent = function(responseList, responseId) {
  if (responseList == null) {
    return false;
  }
  
  for (var index in responseList.viewed) {
    if (responseList.viewed[index] == responseId) {
      return true;
    }
  }
  for (var index in responseList.unviewed) {
    if (responseList.unviewed[index] == responseId) {
      return true;
    }
  }
  
  return false;
}


Backend.getIncomingResponseIds = function(requestId, responseStatus) {
  var responseIds = Backend.Cache.getIncomingResponseIds(requestId, responseStatus);
  
  responseStatus = responseStatus || Backend.Response.STATUS_ALL;
  var result = null;
  if (responseIds != null) {
    if (responseStatus == Backend.Response.STATUS_ALL) {
      result = responseIds.all;
    } else if (responseStatus == Backend.Response.STATUS_VIEWED) {
      result = responseIds.viewed;
    } else if (responseStatus == Backend.Response.STATUS_UNVIEWED) {
      result = responseIds.unviewed;
    } else {
      throw "Invalid response status requested: " + responseStatus;
    }
  }

  if (result != null || Backend.Cache.isIncomingResponseIdsInUpdate(requestId, responseStatus) || Backend.Cache.isIncomingResponseIdsInUpdate(requestId, Backend.Response.STATUS_ALL)) {
    return result;
  } else {
    Backend._pullIncomingResponseIds(requestId, responseStatus);
    return null;
  }
}

Backend._pullIncomingResponseIds = function(requestId, responseStatus, transactionCallback) {
  Backend.Cache.markIncomingResponseIdsInUpdate(requestId, responseStatus);

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
        if (responseIds == null) {
          responseIds = {};
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_VIEWED) {
          responseIds.viewed = data.viewed;
        }
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_UNVIEWED) {
          responseIds.unviewed = data.unviewed;
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL) {
          responseIds.all = data.viewed.concat(data.unviewed);
        } else {
          responseIds.all = null;
        }

        Backend.Cache.setIncomingResponseIds(requestId, responseIds, responseStatus);

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
      Backend.Cache.markIncomingResponseIdsInUpdate(requestId, false, responseStatus);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/responses/incoming/" + requestId + "?status=" + responseStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}

Backend.removeIncomingResponse = function(requestId, responseId, transactionCallback) {
  Backend.Cache.markIncomingResponseIdsInUpdate(requestId);
  
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        if (Backend._FORCE_IMMEDIATE_UPDATE) {
          var responseIds = Backend.Cache.getIncomingResponseIds(requestId);
          responseIds.all = GeneralUtils.removeFromArray(responseIds.all, responseId);
          responseIds.viewed = GeneralUtils.removeFromArray(responseIds.active, responseId);
          responseIds.unviewed = GeneralUtils.removeFromArray(responseIds.inactive, responseId);
          Backend.Cache.setIncomingResponseIds(requestId, responseIds);
        }

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

  responseStatus = responseStatus || Backend.Response.STATUS_ALL;
  var result = null;
  if (responseIds != null) {
    if (responseStatus == Backend.Response.STATUS_ALL) {
      result = responseIds.all;
    } else if (responseStatus == Backend.Response.STATUS_VIEWED) {
      result = responseIds.viewed;
    } else if (responseStatus == Backend.Response.STATUS_UNVIEWED) {
      result = responseIds.unviewed;
    } else {
      throw "Invalid response status requested: " + responseStatus;
    }
  }
  
  if (result != null || Backend.Cache.isOutgoingResponseIdsInUpdate(requestId, responseStatus) || Backend.Cache.isOutgoingResponseIdsInUpdate(requestId, Backend.Response.STATUS_ALL)) {
    return result;
  } else {
    Backend._pullOutgoingResponseIds(requestId, responseStatus);
    return null;
  }
}

Backend._pullOutgoingResponseIds = function(requestId, responseStatus, transactionCallback) {
  Backend.Cache.markOutgoingResponseIdsInUpdate(requestId);

  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        var responseIds = Backend.Cache.getOutgoingResponseIds(requestId);
        if (responseIds == null) {
          responseIds = {};
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_VIEWED) {
          responseIds.viewed = data.viewed;
        }
        if (responseStatus == Backend.Response.STATUS_ALL || responseStatus == Backend.Response.STATUS_UNVIEWED) {
          responseIds.unviewed = data.unviewed;
        }
        
        if (responseStatus == Backend.Response.STATUS_ALL) {
          responseIds.all = data.viewed.concat(data.unviewed);
        } else {
          responseIds.all = null;
        }

        Backend.Cache.setOutgoingResponseIds(requestId, responseIds, responseStatus);

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
      Backend.Cache.markOutgoingResponseIdsInUpdate(requestId, false, responseStatus);
    }
  }

  this._communicate("user/" + Backend.getUserProfile().user_id + "/responses/outgoing/" + requestId + "?status=" + responseStatus, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
}


Backend.startPullingEvents = function() {
  if (Backend.Events._pulling) {
    return;
  }
  
  Backend.Events.timestamp = 0;
  
  var transactionCallback = {
    success: function() {
      if (Backend.Events._pulling) {
        setTimeout(function() { Backend._pullEvents(transactionCallback); }, 1000);
      }
    },
    failure: function() {
      console.warn("Event retrieval programming error");
      
      if (Backend.Events._pulling) {
        setTimeout(function() { Backend._pullEvents(transactionCallback); }, 5000);
      }
    },
    error: function() {
      console.warn("Event retrieval failed");
      
      if (Backend.Events._pulling) {
        setTimeout(function() { Backend._pullEvents(transactionCallback); }, 5000);
      }
    }
  }

  Backend.Events._pulling = true;
  Backend._pullEvents(transactionCallback);
}

Backend.stopPullingEvents = function() {
  if (!Backend.Events._pulling) {
    return;
  }
  
  Backend.Events._pulling = false;
}

Backend._pullEvents = function(transactionCallback) {
  var communicationCallback = {
    success: function(data, status, xhr) {
      if (xhr.status == 200) {
        Backend.Events.timestamp = data.timestamp;

        for (var index in data.events) {
          var event = data.events[index];
          
          if (event.type == Backend.Events.INCOMING_REQUESTS_CHANGED) {
            Backend._pullIncomingRequestIds(Backend.Request.STATUS_ALL);
          } else if (event.type == Backend.Events.OUTGOING_REQUESTS_CHANGED) {
            Backend._pullOutgoingRequestIds(Backend.Request.STATUS_ALL);
          } else if (event.type == Backend.Events.OUTGOING_RESPONSES_CHANGED) {
            Backend._pullOutgoingResponseIds(event.request_id, Backend.Response.STATUS_ALL);
          } else if (event.type == Backend.Events.INCOMING_RESPONSES_CHANGED) {
            Backend._pullIncomingResponseIds(event.request_id, Backend.Response.STATUS_ALL);
          } else if (event.type == Backend.Events.REQUEST_CHANGED) {
            Backend._pullRequest(event.request_id);
          } else if (event.type == Backend.Events.RESPONSE_CHANGED) {
            Backend._pullResponse(event.request_id, event.response_id);
          } else {
            console.error("Unrecognized event type " + event.type);
          }
        }

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
    }
  }

  this._communicate("events/user/" + Backend.getUserProfile().user_id + "?timestamp=" + Backend.Events.timestamp, "GET", null, true, this._getAuthenticationHeader(), communicationCallback);
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
  
  Backend.startPullingEvents();
}

Backend.removeCacheChangeListener = function(listener) {
  Backend.Cache.removeCacheChangeListener(listener);
}


Backend.Cache = {
  cacheChangeListeners: [],
  
  outgoingRequestIdsInProgress: {},
  outgoingRequestIds: {},
  incomingRequestIdsInProgress: {},
  incomingRequestIds: {},
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
  
  this.outgoingRequestIdsInProgress = {};
  this.outgoingRequestIds = {};
  this.incomingRequestIdsInProgress = {};
  this.incomingRequestIds = {};
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

Backend.Cache.markOutgoingRequestIdsInUpdate = function(isInUpdate, conditions) {
  this.outgoingRequestIdsInProgress.inUpdate = isInUpdate != null ? isInUpdate : true;
  this.outgoingRequestIdsInProgress.conditions = conditions;
  
  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingRequestIdsInUpdate = function(conditions) {
  if (!this.outgoingRequestIdsInProgress.inUpdate) {
    return false;
  }
  return this.outgoingRequestIdsInProgress.conditions == conditions;
}
Backend.Cache.setOutgoingRequestIds = function(requestIds, conditions) {
  this.outgoingRequestIds = requestIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, null, null);
  
  this.markOutgoingRequestIdsInUpdate(false, conditions);
}
Backend.Cache.getOutgoingRequestIds = function() {
  return this.outgoingRequestIds;
}

Backend.Cache.markIncomingRequestIdsInUpdate = function(isInUpdate, conditions) {
  this.incomingRequestIdsInProgress.inUpdate = isInUpdate != null ? isInUpdate : true;
  this.incomingRequestIdsInProgress.conditions = conditions;
  
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingRequestIdsInUpdate = function(conditions) {
  if (!this.incomingRequestIdsInProgress.inUpdate) {
    return false;
  }
  
  return this.incomingRequestIdsInProgress.conditions == conditions;
}
Backend.Cache.setIncomingRequestIds = function(requestIds, conditions) {
  this.incomingRequestIds = requestIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, null, null);
  
  this.markIncomingRequestIdsInUpdate(false, conditions);
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

Backend.Cache.markIncomingResponseIdsInUpdate = function(requestId, isInUpdate, conditions) {
  var inUpdate = isInUpdate != null ? isInUpdate : true;
  if (inUpdate) {
    this.incomingResponseIdsInProgress[requestId] = {};
    this.incomingResponseIdsInProgress[requestId].inUpdate = inUpdate;
    this.incomingResponseIdsInProgress[requestId].conditions = conditions;
  } else {
    delete this.incomingResponseIdsInProgress[requestId];
  }
  
  this._fireUpdateEvent();
}
Backend.Cache.isIncomingResponseIdsInUpdate = function(requestId, conditions) {
  if (this.incomingResponseIdsInProgress[requestId] == null || !this.incomingResponseIdsInProgress[requestId].inUpdate) {
    return false;
  }
  
  return this.incomingResponseIdsInProgress[requestId].conditions == conditions;
}
Backend.Cache.setIncomingResponseIds = function(requestId, responseIds, conditions) {
  this.incomingResponseIds[requestId] = responseIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId, null);
  
  this.markIncomingResponseIdsInUpdate(requestId, false, conditions);
}
Backend.Cache.getIncomingResponseIds = function(requestId) {
  return this.incomingResponseIds[requestId];
}

Backend.Cache.markOutgoingResponseIdsInUpdate = function(requestId, isInUpdate, conditions) {
  var inUpdate = isInUpdate != null ? isInUpdate : true;
  if (inUpdate) {
    this.outgoingResponseIdsInProgress[requestId] = {};
    this.outgoingResponseIdsInProgress[requestId].inUpdate = inUpdate;
    this.outgoingResponseIdsInProgress[requestId].conditions = conditions;
  } else {
    delete this.outgoingResponseIdsInProgress[requestId];
  }

  this._fireUpdateEvent();
}
Backend.Cache.isOutgoingResponseIdsInUpdate = function(requestId, conditions) {
  if (this.outgoingResponseIdsInProgress[requestId] == null || !this.outgoingResponseIdsInProgress[requestId].inUpdate) {
    return false;
  }
  
  return this.outgoingResponseIdsInProgress[requestId].conditions == conditions;
}
Backend.Cache.setOutgoingResponseIds = function(requestId, responseIds, conditions) {
  this.outgoingResponseIds[requestId] = responseIds;
  this._notifyCacheListeners(Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId, null);
  
  this.markOutgoingResponseIdsInUpdate(requestId, false, conditions);
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
  return this.outgoingRequestIdsInProgress.inUpdate
         || !GeneralUtils.isEmpty(this.incomingResponseIdsInProgress)
         || this.incomingRequestIdsInProgress.inUpdate
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
        var text = request.responseText;
        if (isJsonResponse) {
          try {
            text = JSON.parse(request.responseText);
          } catch (e) {
            callback.error(request, request.status, request.responseText);
          }
        }
        callback.success(text, request.status, request);
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
