//
//  Backend.swift
//  AWT
//
//  Created by Anton Avtamonov on 2/27/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation


public struct Configuration {
    public struct Item {
        var display: String!;
        var data: AnyObject!;
        
        init(display: String!, data: AnyObject!) {
            self.display = display;
            self.data = data;
        }
        
        func getDisplay() -> String {
            return AtwUiUtils.getLocalizedString(display);
        }
    }
    
    
    static let LANGUAGES: [Item] = [Item(display: "LANGUAGE_ENGLISH", data: "eng"), Item(display: "LANGUAGE_RUSSIAN", data: "rus")];
    static let EXPERTISES: [Item] = [Item(display: "EXPERTISE_GENERAL", data: "general"), Item(display: "EXPERTISE_LAW", data: "law"), Item(display: "EXPERTISE_MEDICINE", data: "medicine"), Item(display: "EXPERTISE_CONSTRUCTION", data: "construction")];
    static let AGE_CATEGORIES: [Item] = [Item(display: "AGE_CHILD", data: "child"), Item(display: "AGE_TEENAGER", data: "teenager"), Item(display: "AGE_YOUNG", data: "young"), Item(display: "AGE_ADULT", data: "adult"), Item(display: "AGE_SENIOR", data: "senior")];
    static let RESPONSE_WAIT_TIME: [Item] = [Item(display: "WAIT_TIME_WEEK", data: 148), Item(display: "WAIT_TIME_DAY", data: 24), Item(display: "WAIT_TIME_HALFDAY", data: 12), Item(display: "WAIT_TIME_HOUR", data: 1)];
    static let RESPONSE_QUANTITY: [Item] = [Item(display: "QUANTITY_ALL", data: -1), Item(display: "QUANTITY_TEN", data: 10), Item(display: "QUANTITY_FIVE", data: 5), Item(display: "QUANTITY_THREE", data: 3), Item(display: "QUANTITY_ONE", data: 1)];
    static let GENDERS: [Item] = [Item(display: "GENDER_MALE", data: "male"), Item(display: "GENDER_FEMALE", data: "female")];
    static let AGE_CATEGORY_PREFERENCE: [Item] = [Item(display: "AGE_PREFERENCE_ALL", data: "all"), Item(display: "AGE_PREFERENCE_CHILDREN", data: "children"), Item(display: "AGE_PREFERENCE_TEENAGERS", data: "teenagers"), Item(display: "AGE_PREFERENCE_YOUNG", data: "youngs"), Item(display: "AGE_PREFERENCE_ADULTS", data: "adults"), Item(display: "AGE_PREFERENCE_SENIORS", data: "seniors")];
    static let GENDER_PREFERENCE: [Item] = [Item(display: "GENDER_PREFERENCE_ANY", data: "any"), Item(display: "GENDER_PREFERENCE_MALE", data: "male"), Item(display: "GENDER_PREFERENCE_FEMALE", data: "female")];
    static let INQUIRY_LIMIT_PREFERENCE: [Item] = [Item(display: "INCOMING_LIMIT_PREFERENCE_ALL", data: -1), Item(display: "INCOMING_LIMIT_PREFERENCE_TEN", data: 10), Item(display: "INCOMING_LIMIT_PREFERENCE_FIVE", data: 5), Item(display: "INCOMING_LIMIT_PREFERENCE_NONE", data: 0)];
    
    
    static func resolve(value: AnyObject?, predefinedList: [Configuration.Item]!) -> Configuration.Item? {
        if (value == nil) {
            return nil;
        }

        for (index, item) in enumerate(predefinedList) {
            if (item.data as NSObject == value as NSObject) {
                return item;
            }
        }
        
        return nil;
    }

    static func resolve(values: [AnyObject]?, predefinedList: [Configuration.Item]!) -> [Configuration.Item] {
        var result: [Configuration.Item]! = [];
        if (values == nil) {
            return result;
        }
        
        for (index, item) in enumerate(predefinedList) {
            for (i, value) in enumerate(values!) {
                if (item.data as NSObject == value as NSObject) {
                    result.append(item);
                }
            }
        }
        
        return result;
    }
}

public class UserContext {
    //Profile
    public var login: String!;
    public var password: String!;
    public var gender: Configuration.Item!;
    public var languages: [Configuration.Item]!;
    public var age: Configuration.Item!;
    public var name: String!;
    public var userId: Int!;
    
    //Preferences
    public var responseQuantity: Configuration.Item! = Configuration.RESPONSE_QUANTITY[0];
    public var responseWaitTime: Configuration.Item! = Configuration.RESPONSE_WAIT_TIME[0];
    public var requestTargetAge: Configuration.Item! = Configuration.AGE_CATEGORY_PREFERENCE[0];
    public var requestTargetGender: Configuration.Item! = Configuration.GENDER_PREFERENCE[0];

    public var dailyInquiryLimit: Configuration.Item! = Configuration.INQUIRY_LIMIT_PREFERENCE[0];
    public var inquiryAge: Configuration.Item! = Configuration.AGE_CATEGORY_PREFERENCE[0];
    public var inquiryGender: Configuration.Item! = Configuration.GENDER_PREFERENCE[0];
    public var expertises: [Configuration.Item]! = [Configuration.EXPERTISES[0]];
    public var contactVisible: Bool! = false;
    public var contactName: String! = "";
    public var contactInfo: String! = "";
}

public protocol BackendCallback {
    func onError();
    func onSuccess();
    func onFailure();
}

public struct Backend {
    private static let SERVER_URL: String! = "https://hidden-taiga-8809.herokuapp.com";
    
    private static let LOCATION_HEADER_KEY: String! = "_location";
    
    
    private static let USER_PROPERTY_LOGIN: String! = "login";
    private static let USER_PROPERTY_PASSWORD: String! = "password";
    private static let USER_PROPERTY_GENDER: String! = "gender";
    private static let USER_PROPERTY_AGE: String! = "age_category";
    private static let USER_PROPERTY_NICKNAME: String! = "name";
    private static let USER_PROPERTY_LANGUAGES: String! = "languages";
    
    private static let USER_PREFERENCE_RESPONSE_QUANTITY: String! = "default_response_quantity";
    private static let USER_PREFERENCE_RESPONSE_WAITTIME: String! = "default_response_wait_time";
    private static let USER_PREFERENCE_REQUEST_TARGET_AGE: String! = "default_response_age_group_preference";
    private static let USER_PREFERENCE_REQUEST_TARGET_GENDER: String! = "default_gender_preference";
    private static let USER_PREFERENCE_INQUIRY_LIMIT: String! = "inquiry_quantity_per_day";
    private static let USER_PREFERENCE_INQUIRY_AGE: String! = "inquiry_age_group_preference";
    private static let USER_PREFERENCE_INQUIRY_GENDER: String! = "inquiry_gender_preference";
    private static let USER_PREFERENCE_EXPERTISES: String! = "expertises";
    private static let USER_PREFERENCE_CONTACT_REQUESTABLE: String! = "contact_info_requestable";
    private static let USER_PREFERENCE_CONTACT_NAME: String! = "contact_name";
    private static let USER_PREFERENCE_CONTACT_DETAILS: String! = "contact_info";
    

    private static var userContext: UserContext! = nil;
    
    public static func getUserContext() -> UserContext! {
        return userContext;
    }
    
    
    public static func logIn(login: String!, password: String!, callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                Backend.userContext = UserContext();
                Backend.userContext.userId = data?.valueForKey("userId") as Int;
                Backend.userContext.login = login;
                Backend.userContext.password = password;
                
                self.pullUserSettings(callback);
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };

        Backend.communicate("user?login=" + login, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: login, password: password);
    }
    
    public static func logOut() {
        println("Clear Backend here")
    }

    
    public static func register(login: String!, password: String!, gender: Configuration.Item!, age: Configuration.Item!, nickname: String!, languages: [Configuration.Item]!, callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            
            if (statusCode == 201) {
                Backend.userContext = UserContext();
                let location = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as String?;
                if (location == nil) {
                    println("Error: server malformed response - no userid provided in Location header");
                    callback?.onError();
                    return;
                }
                
                Backend.userContext.userId = location!.toInt();
                Backend.userContext.login = login;
                Backend.userContext.password = password;
                
                self.pullUserSettings(callback);
            } else if (statusCode == 409) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        params.setValue(login, forKey: USER_PROPERTY_LOGIN);
        params.setValue(password, forKey: USER_PROPERTY_PASSWORD);
        params.setValue(gender.data, forKey: USER_PROPERTY_GENDER);
        params.setValue(age.data, forKey: USER_PROPERTY_AGE);
        params.setValue(nickname, forKey: USER_PROPERTY_NICKNAME);
        
        var langData: [String] = [];
        for (index, item) in enumerate(languages) {
            langData.append(item.data as String);
        }
        
        params.setValue(langData, forKey: USER_PROPERTY_LANGUAGES);
        
        Backend.communicate("user", method: HttpMethod.POST, params: params, communicationCallback: communicationCallback, login: login, password: password);
    }
    
    
    public static func resetUserPassword(login: String!, callback: BackendCallback?) {
        callback?.onSuccess();
//        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data in
//            if (statusCode == 200) {
//                callback?.onSuccess();
//            } else if (statusCode == 404) {
//                callback?.onFailure();
//            } else {
//                callback?.onError();
//            }
//        };
//        
//        Backend.communicate("user", method: HttpMethod.POST, params: nil, communicationCallback: communicationCallback, login: nil, password: nil);
    }
    
    
    public static func updateUserProfile(password: String?, gender: Configuration.Item!, age: Configuration.Item!, nickname: String!, languages: [Configuration.Item]!, currentPassword: String!, callback: BackendCallback?) {
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            
            if (statusCode == 200) {
                Backend.userContext.password = password != nil ? password : currentPassword;
                self.pullUserProfile(callback);
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        params.setValue(password, forKey: USER_PROPERTY_PASSWORD);
        params.setValue(gender.data, forKey: USER_PROPERTY_GENDER);
        params.setValue(age.data, forKey: USER_PROPERTY_AGE);
        params.setValue(nickname, forKey: USER_PROPERTY_NICKNAME);
        
        var langData: [String] = [];
        for (index, item) in enumerate(languages) {
            langData.append(item.data as String);
        }
        
        params.setValue(langData, forKey: USER_PROPERTY_LANGUAGES);
        
        let url = "user/\(Backend.userContext.userId)";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: Backend.userContext.login, password: currentPassword);
    }

    public static func updateUserPreferences(requestTargetAge: Configuration.Item?, requestTargetGender: Configuration.Item?, responseQuantity: Configuration.Item?, responseWaitTime: Configuration.Item?, dailyInquiryLimit: Configuration.Item?, inquiryAge: Configuration.Item?, inquiryGender: Configuration.Item?, expertises: [Configuration.Item]?, contactRequestable: Bool?, contactName: String?, contactDetails: String?, callback: BackendCallback?) {
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in

            if (statusCode == 200) {
                Backend.userContext.responseQuantity = responseQuantity;
                Backend.userContext.responseWaitTime = responseWaitTime;
                Backend.userContext.requestTargetAge = requestTargetAge;
                Backend.userContext.requestTargetGender = requestTargetGender;
                Backend.userContext.dailyInquiryLimit = dailyInquiryLimit;
                Backend.userContext.inquiryAge = inquiryAge;
                Backend.userContext.inquiryGender = inquiryGender;
                Backend.userContext.expertises = expertises;
                Backend.userContext.contactVisible = contactRequestable;
                Backend.userContext.contactName = contactName;
                Backend.userContext.contactInfo = contactDetails;
                
                callback?.onSuccess();
                
                //self.pullUserPreferences(callback);
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        params.setValue(requestTargetAge?.data, forKey: USER_PREFERENCE_REQUEST_TARGET_AGE);
        params.setValue(requestTargetGender?.data, forKey: USER_PREFERENCE_REQUEST_TARGET_GENDER);
        params.setValue(responseQuantity?.data, forKey: USER_PREFERENCE_RESPONSE_QUANTITY);
        params.setValue(responseWaitTime?.data, forKey: USER_PREFERENCE_RESPONSE_WAITTIME);
        params.setValue(dailyInquiryLimit?.data, forKey: USER_PREFERENCE_INQUIRY_LIMIT);
        params.setValue(inquiryAge?.data, forKey: USER_PREFERENCE_INQUIRY_AGE);
        params.setValue(inquiryGender?.data, forKey: USER_PREFERENCE_INQUIRY_GENDER);
        
        
        var expertisesData: [String]?;
        if (expertises != nil) {
            expertisesData = [];
            for (index, item) in enumerate(expertises!) {
                expertisesData!.append(item.data as String);
            }
        }
        params.setValue(expertisesData, forKey: USER_PREFERENCE_EXPERTISES);
        
        
        params.setValue(contactRequestable, forKey: USER_PREFERENCE_CONTACT_REQUESTABLE);
        params.setValue(contactName, forKey: USER_PREFERENCE_CONTACT_NAME);
        params.setValue(contactDetails, forKey: USER_PREFERENCE_CONTACT_DETAILS);

        
        let url = "user/\(Backend.userContext.userId)/settings";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: Backend.userContext.login, password: Backend.userContext.password);
    }
    
    
    
    
    // private part
    
    class ProfileCallback: BackendCallback {
        private var cb: BackendCallback?;
        
        init(callback: BackendCallback?) {
            cb = callback;
        }
        
        func onError() {
            cb?.onError();
        }
        
        func onSuccess() {
            Backend.pullUserPreferences(cb);
        }
        
        func onFailure() {
            cb?.onFailure();
        }
    }
    static func pullUserSettings(callback: BackendCallback?) {
        pullUserProfile(ProfileCallback(callback: callback));
    }

    
    static func pullUserProfile(callback: BackendCallback?) {
        if (Backend.userContext == nil) {
            println("Error: cannot pull user profile before logged in");
            return;
        }
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                Backend.userContext.name = data?.valueForKey(self.USER_PROPERTY_NICKNAME) as? String;
                Backend.userContext.languages = Configuration.resolve(data?.valueForKey(self.USER_PROPERTY_LANGUAGES) as? [String], predefinedList: Configuration.LANGUAGES);
                Backend.userContext.gender = Configuration.resolve(data?.valueForKey(self.USER_PROPERTY_GENDER), predefinedList: Configuration.GENDERS);
                Backend.userContext.age = Configuration.resolve(data?.valueForKey(self.USER_PROPERTY_AGE), predefinedList: Configuration.AGE_CATEGORIES);

                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };

        let url = "user/\(Backend.userContext.userId)";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: Backend.userContext.login, password: Backend.userContext.password);
    }
    
    static func pullUserPreferences(callback: BackendCallback?) {
        if (Backend.userContext == nil) {
            println("Error: cannot pull user preferences before logged in");
            return;
        }
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                Backend.userContext.responseQuantity = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_RESPONSE_QUANTITY), predefinedList: Configuration.RESPONSE_QUANTITY);
                Backend.userContext.responseWaitTime = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_RESPONSE_WAITTIME), predefinedList: Configuration.RESPONSE_WAIT_TIME);
                Backend.userContext.requestTargetAge = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_REQUEST_TARGET_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
                Backend.userContext.requestTargetGender = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_REQUEST_TARGET_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
                Backend.userContext.dailyInquiryLimit = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_INQUIRY_LIMIT), predefinedList: Configuration.INQUIRY_LIMIT_PREFERENCE);
                Backend.userContext.inquiryAge = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_INQUIRY_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
                Backend.userContext.inquiryGender = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_INQUIRY_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
                Backend.userContext.expertises = Configuration.resolve(data?.valueForKey(self.USER_PREFERENCE_EXPERTISES) as? [String], predefinedList: Configuration.EXPERTISES);
                Backend.userContext.contactVisible = data?.valueForKey(self.USER_PREFERENCE_CONTACT_REQUESTABLE) as? Bool;
                Backend.userContext.contactName = data?.valueForKey(self.USER_PREFERENCE_CONTACT_NAME) as? String;
                Backend.userContext.contactInfo = data?.valueForKey(self.USER_PREFERENCE_CONTACT_DETAILS) as? String;
                
                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };
        
        let url = "user/\(Backend.userContext.userId)/settings";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: Backend.userContext.login, password: Backend.userContext.password);
    }

    
    
    
    
    
    private enum HttpMethod {
        case GET
        case PUT
        case POST
        case DELETE
        
        static func toString(method: HttpMethod!) -> String! {
            if (method == HttpMethod.GET) {
                return "GET";
            } else if (method == HttpMethod.PUT) {
                return "PUT";
            } else if (method == HttpMethod.POST) {
                return "POST";
            } else if (method == HttpMethod.DELETE) {
                return "DELETE";
            }
            
            return "";
        }
    }

    
    private static func communicate(url: String, method: HttpMethod, params: NSDictionary?, communicationCallback: ((Int!, NSDictionary?) -> Void)!, login: String?, password: String?) {
        var request = NSMutableURLRequest(URL: NSURL(string: SERVER_URL + "/" + url)!);
        var session = NSURLSession.sharedSession();
        request.HTTPMethod = HttpMethod.toString(method);


        var err: NSError?
        if (params != nil) {
            request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params!, options: nil, error: &err);
        }
        request.addValue("application/json", forHTTPHeaderField: "Content-Type");
        request.addValue("application/json", forHTTPHeaderField: "Accept");
        
        if (login != nil && password != nil) {
            request.addValue(login! + ":" + password!, forHTTPHeaderField: "Token");
        }

        
        let completionHandler: ((NSData!, NSURLResponse!, NSError!) -> Void)? = {data, response, error -> Void in
            if (error != nil) {
                communicationCallback(-1, nil);
            } else {
                let res = response as NSHTTPURLResponse
                
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    var jsonData: NSMutableDictionary?;
                    if (data != nil) {
                        var err: NSError?
                        jsonData = NSJSONSerialization.JSONObjectWithData(data, options: nil, error: &err) as? NSMutableDictionary;
                    }
                    
                    let location: AnyObject? = res.allHeaderFields["Location"];
                    if (location != nil) {
                        jsonData = NSMutableDictionary();
                        jsonData!.setValue(location, forKey: Backend.LOCATION_HEADER_KEY);
                    }

                    communicationCallback(res.statusCode, jsonData);
                } else {
                    communicationCallback(res.statusCode, nil);
                }
            }
        };
        
        var task = session.dataTaskWithRequest(request, completionHandler: completionHandler);
        task.resume();
    }
}
