//
//  Backend.swift
//  AWT
//
//  Created by Anton Avtamonov on 2/27/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation


public protocol BackendCallback {
    func onError();
    func onSuccess();
    func onFailure();
}

public class UserContext {
    //Profile
    private var login: String!;
    private var password: String!;
    private var gender: String!;
    private var languages: [String]!;
    private var age: String!;
    private var name: String!;
    public var userId: Int!;
    
    //Preferences
    private var responseQuantity: Int!;
    private var responseWaitTime: Int!;
    private var requestTargetAge: String!;
    private var requestTargetGender: String!;

    private var dailyInquiryLimit: Int!;
    private var inquiryAge: String!;
    private var inquiryGender: String!;
    private var expertises: [String]!;
    private var contactVisible: Bool!;
    private var contactName: String!;
    private var contactInfo: String!;
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
                //TBD: read data
                
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
