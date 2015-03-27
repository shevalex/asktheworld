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
            return display;
        }
    }
    
    
    static let LANGUAGES: [Item] = [Item(display: NSLocalizedString("English", comment: "Language - English"), data: "eng"), Item(display: NSLocalizedString("Russian", comment: "Language - Russian"), data: "rus")];
    
    static let EXPERTISES: [Item] = [Item(display: NSLocalizedString("General", comment: "Expertise - general"), data: "general"), Item(display: NSLocalizedString("Law", comment: "Expertise - law"), data: "law"), Item(display: NSLocalizedString("Medicicne", comment: "Expertise - medicicne"), data: "medicine"), Item(display: NSLocalizedString("Construction", comment: "Expertise - construction"), data: "construction")];

    static let AGE_CATEGORIES: [Item] = [Item(display: NSLocalizedString("Child", comment: "Age - child"), data: "child"), Item(display: NSLocalizedString("Teenager", comment: "Age - teenager"), data: "teenager"), Item(display: NSLocalizedString("Young Adult", comment: "Age - young"), data: "young"), Item(display: NSLocalizedString("Adult", comment: "Age - adult"), data: "adult"), Item(display: NSLocalizedString("Senior", comment: "Age - senior"), data: "senior")];
    
    static let RESPONSE_WAIT_TIME: [Item] = [Item(display: NSLocalizedString("1 week", comment: "Wait time - week"), data: 148), Item(display: NSLocalizedString("1 day", comment: "Wait time - day"), data: 24), Item(display: NSLocalizedString("Half-day", comment: "Wait time - halfday"), data: 12), Item(display: NSLocalizedString("1 hour", comment: "Wait time - hour"), data: 1)];
    
    static let RESPONSE_QUANTITY: [Item] = [Item(display: NSLocalizedString("As many as arrive", comment: "Quantity - all"), data: -1), Item(display: NSLocalizedString("Ten", comment: "Quantity - ten"), data: 10), Item(display: NSLocalizedString("Five", comment: "Quantity - five"), data: 5), Item(display: NSLocalizedString("Three", comment: "Quantity - three"), data: 3), Item(display: NSLocalizedString("Just the first one", comment: "Quantity - one"), data: 1)];
    
    static let GENDERS: [Item] = [Item(display: NSLocalizedString("Male", comment: "Gender - male"), data: "male"), Item(display: NSLocalizedString("Female", comment: "Gender - female"), data: "female")];
    
    static let AGE_CATEGORY_PREFERENCE: [Item] = [Item(display: NSLocalizedString("All", comment: "Age Preference - all"), data: "all"), Item(display: NSLocalizedString("Chidlren", comment: "Age Preference - chidlren"), data: "children"), Item(display: NSLocalizedString("Teenagers", comment: "Age Preference - teenagers"), data: "teenagers"), Item(display: NSLocalizedString("Young Adults", comment: "Age Preference - youngs"), data: "youngs"), Item(display: NSLocalizedString("Adults", comment: "Age Preference - adults"), data: "adults"), Item(display: NSLocalizedString("Seniors", comment: "Age Preference - seniors"), data: "seniors")];
    
    static let GENDER_PREFERENCE: [Item] = [Item(display: NSLocalizedString("Any", comment: "Gender Preference - any"), data: "any"), Item(display: NSLocalizedString("Men", comment: "Male - male"), data: "male"), Item(display: NSLocalizedString("Women", comment: "Gender Preference - female"), data: "female")];
    
    static let INQUIRY_LIMIT_PREFERENCE: [Item] = [Item(display: NSLocalizedString("As many as possible", comment: "Incoming limit Preference - any"), data: -1), Item(display: NSLocalizedString("No more than ten", comment: "Incoming limit Preference - ten"), data: 10), Item(display: NSLocalizedString("No more than five", comment: "Incoming limit Preference - five"), data: 5), Item(display: NSLocalizedString("I don't want to get any inquiries", comment: "Incoming limit Preference - none"), data: 0)];
    
    static let CONTACT_REQUESTABLE: [Item] = [Item(display: NSLocalizedString("No", comment: "Contact info requestable - no"), data: false), Item(display: NSLocalizedString("Yes", comment: "Contact info requestable - yes"), data: true)];
    
    
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

    static func resolve(values: [AnyObject]?, predefinedList: [Configuration.Item]!) -> [Configuration.Item]? {
        if (values == nil) {
            return nil;
        }
        
        var result: [Configuration.Item]! = [];
        
        for (index, item) in enumerate(predefinedList) {
            for (i, value) in enumerate(values!) {
                if (item.data as NSObject == value as NSObject) {
                    result.append(item);
                }
            }
        }
        
        return result;
    }
    
    
    static func toTargetGroupString(ageCategory: Item, gender: Item) -> String {
        if (ageCategory.data === AGE_CATEGORY_PREFERENCE[0].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all people", comment: "Target group - all");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all men", comment: "Target group - men");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all women", comment: "Target group - women");
            }
        } else if (ageCategory.data === AGE_CATEGORY_PREFERENCE[1].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all children", comment: "Target group - children");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all boys", comment: "Target group - boys");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all girls", comment: "Target group - girls");
            }
        } else if (ageCategory.data === AGE_CATEGORY_PREFERENCE[2].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all teenagers", comment: "Target group - teenagers");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all teen boys", comment: "Target group - teen boys");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all teen girls", comment: "Target group - teen girls");
            }
        } else if (ageCategory.data === AGE_CATEGORY_PREFERENCE[3].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all young people", comment: "Target group - youngs");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all young men", comment: "Target group - young men");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all young women", comment: "Target group - young women");
            }
        } else if (ageCategory.data === AGE_CATEGORY_PREFERENCE[4].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all adults", comment: "Target group - adults");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all adult men", comment: "Target group - adult men");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all adult women", comment: "Target group - adult women");
            }
        } else if (ageCategory.data === AGE_CATEGORY_PREFERENCE[5].data) {
            if (gender.data === GENDER_PREFERENCE[0].data) {
                return NSLocalizedString("all senior people", comment: "Target group - seniors");
            } else if (gender.data === GENDER_PREFERENCE[1].data) {
                return NSLocalizedString("all senior men", comment: "Target group - senior men");
            } else if (gender.data === GENDER_PREFERENCE[2].data) {
                return NSLocalizedString("all senior women", comment: "Target group - senior women");
            }
        }
        
        println("Unexpected target group params \(ageCategory.data), \(gender.data)");
        return "Unexpected target group params \(ageCategory.data), \(gender.data)";
    }
    
    static func toUserIdentityString(ageCategory: Item, gender: Item) -> String {
        if (ageCategory.data === AGE_CATEGORIES[0].data) {
            if (gender.data === GENDERS[0].data) {
                return NSLocalizedString("boy", comment: "User identity - boy");
            } else if (gender.data === GENDERS[1].data) {
                return NSLocalizedString("girl", comment: "User identity - girl");
            }
        } else if (ageCategory.data === AGE_CATEGORIES[1].data) {
            if (gender.data === GENDERS[0].data) {
                return NSLocalizedString("teen boy", comment: "User identity - teen boy");
            } else if (gender.data === GENDERS[1].data) {
                return NSLocalizedString("teen girl", comment: "User identity - teen girl");
            }
        } else if (ageCategory.data === AGE_CATEGORIES[2].data) {
            if (gender.data === GENDERS[0].data) {
                return NSLocalizedString("young man", comment: "User identity - young man");
            } else if (gender.data === GENDERS[1].data) {
                return NSLocalizedString("young woman", comment: "User identity - young woman");
            }
        } else if (ageCategory.data === AGE_CATEGORIES[3].data) {
            if (gender.data === GENDERS[0].data) {
                return NSLocalizedString("adult man", comment: "User identity - adult man");
            } else if (gender.data === GENDERS[1].data) {
                return NSLocalizedString("adult woman", comment: "User identity - adult woman");
            }
        } else if (ageCategory.data === AGE_CATEGORIES[4].data) {
            if (gender.data === GENDERS[0].data) {
                return NSLocalizedString("senior man", comment: "User identity - senior man");
            } else if (gender.data === GENDERS[1].data) {
                return NSLocalizedString("senior woman", comment: "User identity - senior woman");
            }
        }
        
        println("Unexpected identity params \(ageCategory.data), \(gender.data)");
        return "Unexpected identity params \(ageCategory.data), \(gender.data)";
    }
    
    static func toExpertiseString(expertiseCategory: Item) -> String {
        if (expertiseCategory.data === EXPERTISES[0].data) {
            return NSLocalizedString("general", comment: "Expertise category - general");
        } else if (expertiseCategory.data === EXPERTISES[1].data) {
            return NSLocalizedString("waw", comment: "Expertise category - law");
        } else if (expertiseCategory.data === EXPERTISES[2].data) {
            return NSLocalizedString("medicine", comment: "Expertise category - medicine");
        } else if (expertiseCategory.data === EXPERTISES[3].data) {
            return NSLocalizedString("construction", comment: "Expertise category - construction");
        }
        
        println("Unexpected expertise category \(expertiseCategory.data)");
        return "Unexpected expertise category \(expertiseCategory.data)";
    }
}



public protocol BackendCallback {
    func onError();
    func onSuccess();
    func onFailure();
}

public struct Backend {
    public typealias CompletionObserver = (id: String) -> Void;
    typealias CacheChangeEventObserver = (event: CacheChangeEvent) -> Void;
    
    
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
    

    private static var instance: Backend! = nil;
    
    private var userContext: UserContext! = nil;
    
    private var cache: ObjectCache = ObjectCache();

    
    
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
        public var contactVisible: Configuration.Item! = Configuration.CONTACT_REQUESTABLE[0];
        public var contactName: String! = "";
        public var contactInfo: String! = "";
    }
    
    
    public struct RequestObject {
        static let STATUS_ACTIVE: String = "active";
        static let STATUS_INACTIVE: String = "inactive";
        
        init() {
        }
        
        init(userContext: UserContext) {
            responseQuantity = userContext.responseQuantity;
            responseWaitTime = userContext.responseWaitTime;
            responseAgeGroup = userContext.inquiryAge;
            responseGender = userContext.inquiryGender;
            expertiseCategory = Configuration.EXPERTISES[0];
        }

        
        var time: Double! = NSDate().timeIntervalSince1970;
        var text: String! = "";
        var attachments: [String]! = [];
        var responseQuantity: Configuration.Item!;
        var responseWaitTime: Configuration.Item!;
        var responseAgeGroup: Configuration.Item!;
        var responseGender: Configuration.Item!;
        var expertiseCategory: Configuration.Item!;
        var status: String! = STATUS_ACTIVE;
    }
    
    public struct ResponseObject {
        static let STATUS_UNREAD = "unread";
        static let STATUS_READ = "read";
        static let CONTACT_INFO_STATUS_NOT_AVAILABLE = "no";
        static let CONTACT_INFO_STATUS_CAN_PROVIDE = "can_provide";
        static let CONTACT_INFO_STATUS_PROVIDED = "provided";
        
        init() {
        }
        
        
        init(userContext: UserContext) {
            ageCategory = userContext.age;
            gender = userContext.gender;
        }

        var time: Double! = 0;
        var text: String! = "";
        var attachments: [String]!;
        var ageCategory: Configuration.Item!;
        var gender: Configuration.Item!;
        var status: String! = STATUS_UNREAD;
        var contactInfoStatus: String! = CONTACT_INFO_STATUS_NOT_AVAILABLE;
    }

    
    public struct CacheChangeEvent {
        public static let TYPE_OUTGOING_REQUESTS_CHANGED: String = "outgoing_requests_changed";
        public static let TYPE_INCOMING_REQUESTS_CHANGED: String = "incoming_requests_changed";
        public static let TYPE_REQUEST_CHANGED: String = "request_changed";
        public static let TYPE_RESPONSE_CHANGED: String = "response_changed";
        public static let TYPE_OUTGOING_RESPONSES_CHANGED: String = "outgoing_responses_changed";
        public static let TYPE_INCOMING_RESPONSES_CHANGED: String = "incoming_responses_changed";

        public static let TYPE_UPDATE_STARTED: String = "update_started";
        public static let TYPE_UPDATE_FINISHED: String = "update_finished";

        var type: String!;
        var requestId: String!;
        var responseId: String!;
    }
    
    
    
    public static func getInstance() -> Backend {
        return instance;
    }
    
    
    
    public func getUserContext() -> UserContext! {
        return userContext;
    }
    
    
    public static func logIn(login: String!, password: String!, callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                Backend.instance = Backend();
                
                Backend.instance.userContext = UserContext();
                Backend.instance.userContext.userId = data?.valueForKey("userId") as Int;
                Backend.instance.userContext.login = login;
                Backend.instance.userContext.password = password;
                
                Backend.instance.pullUserSettings(callback);
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
                Backend.instance = Backend();
                
                Backend.instance.userContext = UserContext();
                let location = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as String?;
                if (location == nil) {
                    println("Error: server malformed response - no userid provided in Location header");
                    callback?.onError();
                    return;
                }
                
                Backend.instance.userContext.userId = location!.toInt();
                Backend.instance.userContext.login = login;
                Backend.instance.userContext.password = password;
                
                Backend.instance.pullUserSettings(callback);
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
    
    
    public func updateUserProfile(password: String?, gender: Configuration.Item!, age: Configuration.Item!, nickname: String!, languages: [Configuration.Item]!, currentPassword: String!, callback: BackendCallback?) {
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            
            if (statusCode == 200) {
                self.userContext.password = password != nil ? password : currentPassword;
                self.pullUserProfile(callback);
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        params.setValue(password, forKey: Backend.USER_PROPERTY_PASSWORD);
        params.setValue(gender.data, forKey: Backend.USER_PROPERTY_GENDER);
        params.setValue(age.data, forKey: Backend.USER_PROPERTY_AGE);
        params.setValue(nickname, forKey: Backend.USER_PROPERTY_NICKNAME);
        
        var langData: [String] = [];
        for (index, item) in enumerate(languages) {
            langData.append(item.data as String);
        }
        
        params.setValue(langData, forKey: Backend.USER_PROPERTY_LANGUAGES);
        
        let url = "user/\(userContext.userId)";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userContext.login, password: currentPassword);
    }

    public func updateUserPreferences(requestTargetAge: Configuration.Item?, requestTargetGender: Configuration.Item?, responseQuantity: Configuration.Item?, responseWaitTime: Configuration.Item?, dailyInquiryLimit: Configuration.Item?, inquiryAge: Configuration.Item?, inquiryGender: Configuration.Item?, expertises: [Configuration.Item]?, contactRequestable: Configuration.Item?, contactName: String?, contactDetails: String?, callback: BackendCallback?) {
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in

            if (statusCode == 200) {
//                Backend.userContext.responseQuantity = responseQuantity;
//                Backend.userContext.responseWaitTime = responseWaitTime;
//                Backend.userContext.requestTargetAge = requestTargetAge;
//                Backend.userContext.requestTargetGender = requestTargetGender;
//                Backend.userContext.dailyInquiryLimit = dailyInquiryLimit;
//                Backend.userContext.inquiryAge = inquiryAge;
//                Backend.userContext.inquiryGender = inquiryGender;
//                Backend.userContext.expertises = expertises;
//                Backend.userContext.contactVisible = contactRequestable;
//                Backend.userContext.contactName = contactName;
//                Backend.userContext.contactInfo = contactDetails;
//                
//                callback?.onSuccess();
                
                self.pullUserPreferences(callback);
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        params.setValue(requestTargetAge?.data, forKey: Backend.USER_PREFERENCE_REQUEST_TARGET_AGE);
        params.setValue(requestTargetGender?.data, forKey: Backend.USER_PREFERENCE_REQUEST_TARGET_GENDER);
        params.setValue(responseQuantity?.data, forKey: Backend.USER_PREFERENCE_RESPONSE_QUANTITY);
        params.setValue(responseWaitTime?.data, forKey: Backend.USER_PREFERENCE_RESPONSE_WAITTIME);
        params.setValue(dailyInquiryLimit?.data, forKey: Backend.USER_PREFERENCE_INQUIRY_LIMIT);
        params.setValue(inquiryAge?.data, forKey: Backend.USER_PREFERENCE_INQUIRY_AGE);
        params.setValue(inquiryGender?.data, forKey: Backend.USER_PREFERENCE_INQUIRY_GENDER);
        
        
        var expertisesData: [String]?;
        if (expertises != nil) {
            expertisesData = [];
            for (index, item) in enumerate(expertises!) {
                expertisesData!.append(item.data as String);
            }
        }
        params.setValue(expertisesData, forKey: Backend.USER_PREFERENCE_EXPERTISES);
        
        
        params.setValue(contactRequestable?.data, forKey: Backend.USER_PREFERENCE_CONTACT_REQUESTABLE);
        params.setValue(contactName, forKey: Backend.USER_PREFERENCE_CONTACT_NAME);
        params.setValue(contactDetails, forKey: Backend.USER_PREFERENCE_CONTACT_DETAILS);

        
        let url = "user/\(userContext.userId)/settings";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userContext.login, password: userContext.password);
    }
    

    
    public func getOutgoingRequestIds(requestStatus: String? = nil) -> [String]? {
        if (cache.isOutgoingRequestIdsInUpdate()) {
            return nil;
        }
        
        var ids: [String]? = cache.getOutgoingRequestIds();
        if (ids == nil) {
            //TODO: pull the list from the server here
            self.cache.markOutgoingRequestIdsInUpdate();

            var action:()->Void = {() in
                self.cache.setOutgoingRequestIds(["req1", "req2", "req3", "req4", "req5", "req6", "req7", "req8", "req9", "req10"]);
            };
            
            DelayedNotifier(action).schedule(5);
        }
        
        return ids;
    }

    public func getIncomingRequestIds(requestStatus: String? = nil) -> [String]? {
        if (cache.isIncomingRequestIdsInUpdate()) {
            return nil;
        }
        
        var ids: [String]? = cache.getIncomingRequestIds();
        if (ids == nil) {
            //TODO: pull the list from the server here
            self.cache.markIncomingRequestIdsInUpdate();
            
            var action:()->Void = {() in
                self.cache.setIncomingRequestIds(["req101", "req102", "req103", "req104", "req105", "req106", "req107", "req108", "req109", "req110"]);
            };
            
            DelayedNotifier(action).schedule(5);
        }
        
        return ids;
    }
    
    public func getRequest(requestId: String!) -> RequestObject? {
        if (cache.isRequestInUpdate(requestId)) {
            return nil;
        }
        
        var request: RequestObject? = cache.getRequest(requestId);
        if (request == nil) {
            self.cache.markRequestInUpdate(requestId);
            
            //TODO: pull request from the server here
            
            var action:()->Void = {() in
                request = RequestObject();
                request!.text = "Request \(requestId)";
                request!.responseAgeGroup = Configuration.AGE_CATEGORY_PREFERENCE[2];
                request!.responseGender = Configuration.GENDER_PREFERENCE[0];
                request!.expertiseCategory = Configuration.EXPERTISES[2];
                request!.time = NSDate().timeIntervalSince1970;

                self.cache.setRequest(requestId, request: request!);
            };
            
            DelayedNotifier(action).schedule(2);
        }
        

        return request;
    }

    public func getIncomingResponseIds(requestId: String, responseStatus: String? = nil) -> [String]? {
        if (cache.isIncomingResponseIdsInUpdate(requestId)) {
            return nil;
        }
        
        var ids: [String]? = cache.getIncomingResponseIds(requestId);
        if (ids == nil) {
            //TODO: pull the list from the server here
            self.cache.markIncomingResponseIdsInUpdate(requestId);
            
            var action:()->Void = {() in
                if (requestId == "req2" || requestId == "req6") {
                    self.cache.setIncomingResponseIds(requestId, responseIds: []);
                } else {
                    self.cache.setIncomingResponseIds(requestId, responseIds: ["\(requestId)-response1", "\(requestId)-response2", "\(requestId)-response3", "\(requestId)-response4", "\(requestId)-response5", "\(requestId)-response6"]);
                }
            };
            
            DelayedNotifier(action).schedule(3);
        }
        
        return ids;
    }
    
    public func getOutgoingResponseIds(requestId: String, responseStatus: String? = nil) -> [String]? {
        if (cache.isOutgoingResponseIdsInUpdate(requestId)) {
            return nil;
        }
        
        var ids: [String]? = cache.getOutgoingResponseIds(requestId);
        if (ids == nil) {
            //TODO: pull the list from the server here
            self.cache.markOutgoingResponseIdsInUpdate(requestId);
            
            var action:()->Void = {() in
                if (requestId == "req101" || requestId == "req103") {
                    self.cache.setOutgoingResponseIds(requestId, responseIds: ["\(requestId)-response100"]);
                } else {
                    self.cache.setOutgoingResponseIds(requestId, responseIds: []);
                }
            };
            
            DelayedNotifier(action).schedule(3);
        }
        
        return ids;
    }
    
    public func getResponse(requestId: String!, responseId: String!) -> ResponseObject? {
        if (cache.isResponseInUpdate(requestId, responseId: responseId)) {
            return nil
        }
        
        var response: ResponseObject? = cache.getResponse(requestId, responseId: responseId);
        if (response == nil) {
            self.cache.markResponseInUpdate(requestId, responseId: responseId);
            
            //TODO: pull request from the server here
            
            var action:()->Void = {() in
                response = ResponseObject();
                response!.text = "Response \(requestId)-\(responseId)";
                response!.time = NSDate().timeIntervalSince1970;
                response!.gender = Configuration.GENDERS[0];
                response!.ageCategory = Configuration.AGE_CATEGORIES[1];
                
                self.cache.setResponse(requestId, responseId: responseId, response: response!);
            };
            
            DelayedNotifier(action).schedule(2);
        }
        
        
        return response;
    }
    
    public func createRequest(request: RequestObject, observer: CompletionObserver) {
        var ids: [String]? = self.cache.getOutgoingRequestIds();
        if (ids == nil) {
            println("The list of requests hasn't yet been read - cannot create new");
            return;
        }
        
        var requestId = "req\(ids?.count)";
        self.cache.markRequestInUpdate(requestId);
        self.cache.markOutgoingRequestIdsInUpdate();
        
        var action:()->Void = {() in
            ids?.append(requestId);
            
            self.cache.setRequest(requestId, request: request);
            self.cache.setOutgoingRequestIds(ids!);
            self.cache.setIncomingResponseIds(requestId, responseIds: []);
            observer(id: requestId);
        };
        
        DelayedNotifier(action).schedule(2);
    }
    
    public func createResponse(requestId: String, response: ResponseObject, observer: CompletionObserver) {
        var ids: [String]? = self.cache.getOutgoingResponseIds(requestId);
        if (ids == nil) {
            println("The list of responses hasn't yet been read - cannot create new");
            return;
        }
        
        var responseId = "\(requestId)-response\(ids?.count)";
        self.cache.markResponseInUpdate(requestId, responseId: responseId);
        self.cache.markOutgoingResponseIdsInUpdate(requestId);
        
        var action:()->Void = {() in
            ids?.append(responseId);
            
            self.cache.setResponse(requestId, responseId: responseId, response: response);
            self.cache.setOutgoingResponseIds(requestId, responseIds: ids!);
            observer(id: responseId);
        };
        
        DelayedNotifier(action).schedule(3);
    }
    
    

    
    // Event Management
    
    func addCacheChangeListener(listener: CacheChangeEventObserver, listenerId: String? = nil) -> String {
        return cache.addCacheChangeListener(listener, listenerId: listenerId);
    }
    
    func removeCacheChangeListener(listenerId: String) {
        cache.removeCacheChangeListener(listenerId);
    }
    
    func isCacheInUpdate() -> Bool {
        return cache.isInUpdate();
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
            Backend.instance.pullUserPreferences(cb);
        }
        
        func onFailure() {
            cb?.onFailure();
        }
    }
    func pullUserSettings(callback: BackendCallback?) {
        pullUserProfile(ProfileCallback(callback: callback));
    }

    
    func pullUserProfile(callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                self.userContext.name = data?.valueForKey(Backend.USER_PROPERTY_NICKNAME) as? String;
                
                var languages: [Configuration.Item]? = Configuration.resolve(data?.valueForKey(Backend.USER_PROPERTY_LANGUAGES) as? [String], predefinedList: Configuration.LANGUAGES);
                if (languages != nil) {
                    self.userContext.languages = languages;
                }
                
                var gender: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PROPERTY_GENDER), predefinedList: Configuration.GENDERS);
                if (gender != nil) {
                    self.userContext.gender = gender;
                }
                
                var age: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PROPERTY_AGE), predefinedList: Configuration.AGE_CATEGORIES);
                if (age != nil) {
                    self.userContext.age = age;
                }

                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };

        let url = "user/\(userContext.userId)";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userContext.login, password: userContext.password);
    }
    
    func pullUserPreferences(callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var responseQuantity: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_RESPONSE_QUANTITY), predefinedList: Configuration.RESPONSE_QUANTITY);
                if (responseQuantity != nil) {
                    self.userContext.responseQuantity = responseQuantity;
                }

                var responseWaitTime: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_RESPONSE_WAITTIME), predefinedList: Configuration.RESPONSE_WAIT_TIME);
                if (responseWaitTime != nil) {
                    self.userContext.responseWaitTime = responseWaitTime;
                }
                
                var requestTargetAge: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_REQUEST_TARGET_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
                if (requestTargetAge != nil) {
                    self.userContext.requestTargetAge = requestTargetAge;
                }
                
                var requestTargetGender: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_REQUEST_TARGET_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
                if (requestTargetGender != nil) {
                    self.userContext.requestTargetGender = requestTargetGender;
                }

                var dailyInquiryLimit: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_INQUIRY_LIMIT), predefinedList: Configuration.INQUIRY_LIMIT_PREFERENCE);
                if (dailyInquiryLimit != nil) {
                    self.userContext.dailyInquiryLimit = dailyInquiryLimit;
                }
                
                var inquiryAge: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_INQUIRY_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
                if (inquiryAge != nil) {
                    self.userContext.inquiryAge = inquiryAge;
                }
                
                var inquiryGender: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_INQUIRY_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
                if (inquiryGender != nil) {
                    self.userContext.inquiryGender = inquiryGender;
                }
                
                var expertises: [Configuration.Item]? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_EXPERTISES) as? [String], predefinedList: Configuration.EXPERTISES);
                if (expertises != nil) {
                    self.userContext.expertises = expertises;
                }
                
                var contactVisible: Configuration.Item? = Configuration.resolve(data?.valueForKey(Backend.USER_PREFERENCE_CONTACT_REQUESTABLE), predefinedList: Configuration.CONTACT_REQUESTABLE);
                if (contactVisible != nil) {
                    self.userContext.contactVisible = contactVisible;
                }
                
                self.userContext.contactName = data?.valueForKey(Backend.USER_PREFERENCE_CONTACT_NAME) as? String;
                self.userContext.contactInfo = data?.valueForKey(Backend.USER_PREFERENCE_CONTACT_DETAILS) as? String;
                
                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };
        
        let url = "user/\(userContext.userId)/settings";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userContext.login, password: userContext.password);
    }

    
    
    
    // Cache Management
    
    private class DelayedNotifier: NSObject
    {
        private var action: (()->Void)?;
        
        init(action: (()->Void)? = nil) {
            super.init();
            
            self.action = action;
        }
        
        func schedule(delay: Double) {
            NSTimer.scheduledTimerWithTimeInterval(delay, target: self, selector: Selector("timerTick"), userInfo: nil, repeats: false);
        }
        
        @objc func timerTick() {
            action?();
        }
    }
    
    
    private class ObjectCache {
        private class EventListenerCollection {
            private var counter: Int! = 0;
            private var list: Dictionary<String, CacheChangeEventObserver> = Dictionary();
            
            func add(element: CacheChangeEventObserver, elementId: String?) -> String {
                counter = counter + 1;
                let id: String = elementId != nil ? elementId! : "listener-\(counter)";
                list.updateValue(element, forKey: id);
                
                return id;
            }
            
            func remove(elementId: String) {
                list.removeValueForKey(elementId);
            }
            
            func get() -> Dictionary<String, CacheChangeEventObserver> {
                return list;
            }
        }

        private var cacheChangeListeners: EventListenerCollection = EventListenerCollection();
        
        
        private var requestsInProgress: Dictionary<String, Bool> = Dictionary();
        private var requests: Dictionary<String, RequestObject> = Dictionary();

        private var responsesInProgress: Dictionary<String, Bool> = Dictionary();
        private var responses: Dictionary<String, ResponseObject> = Dictionary();
        
        private var outgoingRequestIdsInProgress: Bool! = false;
        private var outgoingRequestIds: [String]?;

        private var incomingRequestIdsInProgress: Bool! = false;
        private var incomingRequestIds: [String]?;
        
        private var incomingResponseIdsInProgress: Dictionary<String, Bool> = Dictionary();
        private var incomingResponseIds: Dictionary<String, [String]> = Dictionary();
        
        private var outgoingResponseIdsInProgress: Dictionary<String, Bool> = Dictionary();
        private var outgoingResponseIds: Dictionary<String, [String]> = Dictionary();
        
        private var updateInProgressNotified: Bool = false;
        
        func addCacheChangeListener(listener: CacheChangeEventObserver, listenerId: String?) -> String {
            return cacheChangeListeners.add(listener, elementId: listenerId);
        }
        
        func removeCacheChangeListener(listenerId: String) {
            cacheChangeListeners.remove(listenerId);
        }
        
        
        func markOutgoingRequestIdsInUpdate() {
            outgoingRequestIdsInProgress = true;
            fireUpdateEvent();
//            println("marked outgoing request ids in progress");
        }
        func isOutgoingRequestIdsInUpdate() -> Bool {
            return outgoingRequestIdsInProgress;
        }
        func setOutgoingRequestIds(requestIds: [String]) {
            outgoingRequestIds = requestIds;
            outgoingRequestIdsInProgress = false;

            notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, requestId: nil, responseId: nil);
            fireUpdateEvent();
//            println("!!! outgoing request ids updated");
        }
        func getOutgoingRequestIds() -> [String]? {
            return outgoingRequestIdsInProgress == false ? self.outgoingRequestIds : nil;
        }
        
        func markIncomingRequestIdsInUpdate() {
            incomingRequestIdsInProgress = true;
            fireUpdateEvent();
            //            println("marked incoming request ids in progress");
        }
        func isIncomingRequestIdsInUpdate() -> Bool {
            return incomingRequestIdsInProgress;
        }
        func setIncomingRequestIds(requestIds: [String]) {
            incomingRequestIds = requestIds;
            incomingRequestIdsInProgress = false;
            
            notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, requestId: nil, responseId: nil);
            fireUpdateEvent();
            //            println("!!! incoming request ids updated");
        }
        func getIncomingRequestIds() -> [String]? {
            return incomingRequestIdsInProgress == false ? self.incomingRequestIds : nil;
        }
        
        func markRequestInUpdate(requestId: String) {
            requestsInProgress.updateValue(true, forKey: requestId);
            
            fireUpdateEvent();
//            println("marked request \(requestId) in progress");
        }
        func isRequestInUpdate(requestId: String) -> Bool {
            return requestsInProgress[requestId] != nil;
        }
        func setRequest(requestId: String, request: RequestObject) {
            requests.updateValue(request, forKey: requestId);
            requestsInProgress.removeValueForKey(requestId);

            notifyCacheListeners(CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId, responseId: nil);
            fireUpdateEvent();
//            println("!!! request \(requestId) updated");
        }
        func getRequest(requestId: String) -> RequestObject? {
            return isRequestInUpdate(requestId) ? nil : requests[requestId];
        }

        func markIncomingResponseIdsInUpdate(requestId: String) {
            incomingResponseIdsInProgress.updateValue(true, forKey: requestId);

            fireUpdateEvent();
//            println("marked incoming response ids for \(requestId) in progress");
        }
        func isIncomingResponseIdsInUpdate(requestId: String) -> Bool {
            return incomingResponseIdsInProgress[requestId] != nil;
        }
        func setIncomingResponseIds(requestId: String, responseIds: [String]) {
            incomingResponseIds.updateValue(responseIds, forKey: requestId);
            incomingResponseIdsInProgress.removeValueForKey(requestId);

            self.notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);
            fireUpdateEvent();
//            println("!!! incoming response ids for \(requestId) updated");
        }
        func getIncomingResponseIds(requestId: String) -> [String]? {
            return isIncomingResponseIdsInUpdate(requestId) ? nil : incomingResponseIds[requestId];
        }

        func markOutgoingResponseIdsInUpdate(requestId: String) {
            outgoingResponseIdsInProgress.updateValue(true, forKey: requestId);
            
            fireUpdateEvent();
            //            println("marked outgoing response ids for \(requestId) in progress");
        }
        func isOutgoingResponseIdsInUpdate(requestId: String) -> Bool {
            return outgoingResponseIdsInProgress[requestId] != nil;
        }
        func setOutgoingResponseIds(requestId: String, responseIds: [String]) {
            outgoingResponseIds.updateValue(responseIds, forKey: requestId);
            outgoingResponseIdsInProgress.removeValueForKey(requestId);
            
            self.notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);
            fireUpdateEvent();
            //            println("!!! outgoing response ids for \(requestId) updated");
        }
        func getOutgoingResponseIds(requestId: String) -> [String]? {
            return isOutgoingResponseIdsInUpdate(requestId) ? nil : outgoingResponseIds[requestId];
        }
        
        func markResponseInUpdate(requestId: String, responseId: String) {
            responsesInProgress.updateValue(true, forKey: responseId);

            fireUpdateEvent();
//            println("marked response \(responseId) in progress");
        }
        func isResponseInUpdate(requestId: String, responseId: String) -> Bool {
            return responsesInProgress[responseId] != nil;
        }
        func setResponse(requestId: String, responseId: String, response: ResponseObject) {
            responses.updateValue(response, forKey: responseId);
            responsesInProgress.removeValueForKey(responseId);

            self.notifyCacheListeners(CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId: requestId, responseId: responseId);
            fireUpdateEvent();
//            println("!!! response \(responseId) updated");
        }
        func getResponse(requestId: String, responseId: String) -> ResponseObject? {
            return isResponseInUpdate(requestId, responseId: responseId) ? nil : responses[responseId];
        }
        

        
        private func isInUpdate() -> Bool {
            return (outgoingRequestIdsInProgress == true)
                || !incomingResponseIdsInProgress.isEmpty
                || (incomingRequestIdsInProgress == true)
                || !outgoingResponseIdsInProgress.isEmpty
                || !requestsInProgress.isEmpty
                || !responsesInProgress.isEmpty;
        }
        
        private func fireUpdateEvent() {
            var isCurrentlyInUpdate = isInUpdate();
            
            if (!updateInProgressNotified && isCurrentlyInUpdate) {
                updateInProgressNotified = true;
                notifyCacheListeners(CacheChangeEvent.TYPE_UPDATE_STARTED, requestId: nil, responseId: nil);
            } else if (updateInProgressNotified && !isCurrentlyInUpdate) {
                updateInProgressNotified = false;
                notifyCacheListeners(CacheChangeEvent.TYPE_UPDATE_FINISHED, requestId: nil, responseId: nil);
            }
        }
        
        private func notifyCacheListeners(type: String!, requestId: String!, responseId: String!) {
            var event: CacheChangeEvent = CacheChangeEvent(type: type, requestId: requestId, responseId: responseId);

            for (key, listener) in cacheChangeListeners.get() {
                listener(event: event);
            }
        }
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
