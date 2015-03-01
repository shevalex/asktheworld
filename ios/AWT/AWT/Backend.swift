//
//  Backend.swift
//  AWT
//
//  Created by Anton Avtamonov on 2/27/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation


struct Configuration {
    struct Item {
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
    
    
    static let LANGUAGE: [Item] = [Item(display: "LANGUAGE_ENGLISH", data: "eng"), Item(display: "LANGUAGE_RUSSIAN", data: "rus")];
    static let EXPERTISES: [Item] = [Item(display: "EXPERTISE_GENERAL", data: "general"), Item(display: "EXPERTISE_LAW", data: "law"), Item(display: "EXPERTISE_MEDICINE", data: "medicine"), Item(display: "EXPERTISE_CONSTRUCTION", data: "construction")];
    static let AGE_CATEGORIES: [Item] = [Item(display: "AGE_CHILD", data: "child"), Item(display: "AGE_TEENAGER", data: "teenager"), Item(display: "AGE_YOUNG", data: "young"), Item(display: "AGE_ADULT", data: "adult"), Item(display: "AGE_ASENIOR", data: "senior")];
    static let RESPONSE_WAIT_TIME: [Item] = [Item(display: "WAIT_TIME_WEEK", data: 148), Item(display: "WAIT_TIME_DAY", data: 24), Item(display: "WAIT_TIME_HALFDAY", data: 12), Item(display: "WAIT_TIME_HOUR", data: 1)];
    static let RESPONSE_QUANTITY: [Item] = [Item(display: "QUANTITY_ALL", data: -1), Item(display: "QUANTITY_TEN", data: 10), Item(display: "QUANTITY_FIVE", data: 5), Item(display: "QUANTITY_THREE", data: 3), Item(display: "QUANTITY_ONE", data: 1)];
    static let GENDERS: [Item] = [Item(display: "GENDER_MALE", data: "male"), Item(display: "GENDER_FEMALE", data: "female")];
    static let AGE_CATEGORY_PREFERENCE: [Item] = [Item(display: "AGE_PREFERENCE_ALL", data: "all"), Item(display: "AGE_PREFERENCE_CHILDREN", data: "children"), Item(display: "AGE_PREFERENCE_TEENAGERS", data: "teenagers"), Item(display: "AGE_PREFERENCE_YOUNG", data: "youngs"), Item(display: "AGE_PREFERENCE_ADULTS", data: "adults"), Item(display: "AGE_PREFERENCE_SENIORS", data: "seniors")];
    static let GENDER_PREFERENCE: [Item] = [Item(display: "GENDER_PREFERENCE_ANY", data: "any"), Item(display: "GENDER_PREFERENCE_MALE", data: "male"), Item(display: "GENDER_PREFERENCE_FEMALE", data: "female")];
    static let INQUIRY_LIMIT_PREFERENCE: [Item] = [Item(display: "INCOMING_LIMIT_PREFERENCE_ALL", data: -1), Item(display: "INCOMING_LIMIT_PREFERENCE_TEN", data: 10), Item(display: "INCOMING_LIMIT_PREFERENCE_FIVE", data: 5), Item(display: "INCOMING_LIMIT_PREFERENCE_NONE", data: 0)];
}

public class UserContext {
    //Profile
    public var login: String!;
    public var password: String!;
    public var gender: String!;
    public var languages: [String]!;
    public var age: String!;
    public var name: String!;
    public var userId: Int!;
    
    //Preferences
    public var responseQuantity: Int! = Configuration.RESPONSE_QUANTITY[0].data as Int;
    public var responseWaitTime: Int! = Configuration.RESPONSE_WAIT_TIME[0].data as Int;
    public var requestTargetAge: String! = Configuration.AGE_CATEGORY_PREFERENCE[0].data as String;
    public var requestTargetGender: String! = Configuration.GENDER_PREFERENCE[0].data as String;

    public var dailyInquiryLimit: Int! = Configuration.INQUIRY_LIMIT_PREFERENCE[0].data as Int;
    public var inquiryAge: String! = Configuration.AGE_CATEGORY_PREFERENCE[0].data as String;
    public var inquiryGender: String! = Configuration.GENDER_PREFERENCE[0].data as String;
    public var expertises: [String]! = [Configuration.EXPERTISES[0].data as String];
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

    
    public static func register(login: String!, password: String!, gender: String!, age: String!, nickname: String!, languages: [String]!, callback: BackendCallback?) {
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
        params.setValue(login, forKey: "login");
        params.setValue(password, forKey: "password");
        params.setValue(gender, forKey: "gender");
        params.setValue(age, forKey: "age_category");
        params.setValue(nickname, forKey: "name");
        params.setValue(languages, forKey: "languages");
        
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
                Backend.userContext.languages = data?.valueForKey("languages") as [String];
                Backend.userContext.gender = data?.valueForKey("gender") as String;
                Backend.userContext.name = data?.valueForKey("name") as String;
                Backend.userContext.age = data?.valueForKey("age_category") as String;

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
                Backend.userContext.responseQuantity = data?.valueForKey("default_response_quantity") as Int?;
                Backend.userContext.responseWaitTime = data?.valueForKey("default_response_wait_time") as Int?;
                Backend.userContext.requestTargetAge = data?.valueForKey("default_response_age_group_preference") as String?;
                Backend.userContext.requestTargetGender = data?.valueForKey("default_gender_preference") as String?;
                
                Backend.userContext.dailyInquiryLimit = data?.valueForKey("inquiry_quantity_per_day") as Int?;
                Backend.userContext.inquiryAge = data?.valueForKey("inquiry_age_group_preference") as String?;
                Backend.userContext.inquiryGender = data?.valueForKey("inquiry_gender_preference") as String?;
                Backend.userContext.expertises = data?.valueForKey("expertises") as [String]?;
                Backend.userContext.contactVisible = data?.valueForKey("contact_info_requestable") as Bool?;
                Backend.userContext.contactName = data?.valueForKey("contact_name") as String?;
                Backend.userContext.contactInfo = data?.valueForKey("contact_info") as String?;
                
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
