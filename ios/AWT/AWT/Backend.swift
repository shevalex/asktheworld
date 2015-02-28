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

public struct Backend {
    private static let SERVER_URL: String! = "https://hidden-taiga-8809.herokuapp.com";
    
    
    public static func logIn(login: String!, password: String!, callback: BackendCallback?) {
        let completionHandler: ((NSData!, NSURLResponse!, NSError!) -> Void)? = {data, response, error -> Void in
            if (error != nil) {
                callback?.onError();
            } else {
                let res = response as NSHTTPURLResponse
                if (res.statusCode == 200) {
                    callback?.onSuccess();
                } else if (res.statusCode == 401 || res.statusCode == 404) {
                    callback?.onFailure();
                } else {
                    callback?.onError()
                }
            }
        };

        Backend.communicate("user?login=" + login, method: HttpMethod.GET, params: nil, completionHandler: completionHandler, login: nil, password: nil);
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

    
    private static func communicate(url: String, method: HttpMethod, params: NSDictionary?, completionHandler: ((NSData!, NSURLResponse!, NSError!) -> Void)?, login: String?, password: String?) {
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
        
        var task = session.dataTaskWithRequest(request, completionHandler: completionHandler);
        task.resume();
    }
}
