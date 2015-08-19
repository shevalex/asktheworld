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
    
    static let EXPERTISES: [Item] = [Item(display: NSLocalizedString("General", comment: "Expertise - general"), data: "general"), Item(display: NSLocalizedString("Law", comment: "Expertise - law"), data: "law"), Item(display: NSLocalizedString("Medicine", comment: "Expertise - medicicne"), data: "medicine"), Item(display: NSLocalizedString("Construction", comment: "Expertise - construction"), data: "construction")];

    static let AGE_CATEGORIES: [Item] = [Item(display: NSLocalizedString("Child", comment: "Age - child"), data: "child"), Item(display: NSLocalizedString("Teenager", comment: "Age - teenager"), data: "teenager"), Item(display: NSLocalizedString("Young Adult", comment: "Age - young"), data: "young"), Item(display: NSLocalizedString("Adult", comment: "Age - adult"), data: "adult"), Item(display: NSLocalizedString("Senior", comment: "Age - senior"), data: "senior")];
    
    static let RESPONSE_WAIT_TIME: [Item] = [Item(display: NSLocalizedString("1 week", comment: "Wait time - week"), data: 148), Item(display: NSLocalizedString("1 day", comment: "Wait time - day"), data: 24), Item(display: NSLocalizedString("Half-day", comment: "Wait time - halfday"), data: 12), Item(display: NSLocalizedString("1 hour", comment: "Wait time - hour"), data: 1)];
    
    static let RESPONSE_QUANTITY: [Item] = [Item(display: NSLocalizedString("As many as arrive", comment: "Quantity - all"), data: -1), Item(display: NSLocalizedString("Ten", comment: "Quantity - ten"), data: 10), Item(display: NSLocalizedString("Five", comment: "Quantity - five"), data: 5), Item(display: NSLocalizedString("Three", comment: "Quantity - three"), data: 3), Item(display: NSLocalizedString("Just the first one", comment: "Quantity - one"), data: 1)];
    
    static let GENDERS: [Item] = [Item(display: NSLocalizedString("Male", comment: "Gender - male"), data: "male"), Item(display: NSLocalizedString("Female", comment: "Gender - female"), data: "female")];
    
    static let AGE_CATEGORY_PREFERENCE: [Item] = [Item(display: NSLocalizedString("All", comment: "Age Preference - all"), data: "all"), Item(display: NSLocalizedString("Chidlren", comment: "Age Preference - chidlren"), data: "children"), Item(display: NSLocalizedString("Teenagers", comment: "Age Preference - teenagers"), data: "teenagers"), Item(display: NSLocalizedString("Young Adults", comment: "Age Preference - youngs"), data: "youngs"), Item(display: NSLocalizedString("Adults", comment: "Age Preference - adults"), data: "adults"), Item(display: NSLocalizedString("Seniors", comment: "Age Preference - seniors"), data: "seniors")];
    
    static let GENDER_PREFERENCE: [Item] = [Item(display: NSLocalizedString("Any", comment: "Gender Preference - any"), data: "all"), Item(display: NSLocalizedString("Men", comment: "Male - male"), data: "male"), Item(display: NSLocalizedString("Women", comment: "Gender Preference - female"), data: "female")];
    
    static let INQUIRY_LIMIT_PREFERENCE: [Item] = [Item(display: NSLocalizedString("As many as possible", comment: "Incoming limit Preference - any"), data: -1), Item(display: NSLocalizedString("No more than ten", comment: "Incoming limit Preference - ten"), data: 10), Item(display: NSLocalizedString("No more than five", comment: "Incoming limit Preference - five"), data: 5), Item(display: NSLocalizedString("I don't want to get any inquiries", comment: "Incoming limit Preference - none"), data: 0)];
    
    static let CONTACT_REQUESTABLE: [Item] = [Item(display: NSLocalizedString("No", comment: "Contact info requestable - no"), data: false), Item(display: NSLocalizedString("Yes", comment: "Contact info requestable - yes"), data: true)];
    
    
    static func resolve(value: AnyObject?, predefinedList: [Configuration.Item]!) -> Configuration.Item! {
        if (value == nil) {
            return nil;
        }

        for (index, item) in enumerate(predefinedList) {
            if (item.data as! NSObject == value as! NSObject) {
                return item;
            }
        }
        
        return nil;
    }

    static func resolve(values: [AnyObject]?, predefinedList: [Configuration.Item]!) -> [Configuration.Item]! {
        if (values == nil) {
            return nil;
        }
        
        var result: [Configuration.Item]! = [];
        
        for (index, item) in enumerate(predefinedList) {
            for (i, value) in enumerate(values!) {
                if (item.data as! NSObject == value as! NSObject) {
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
    public typealias CompletionObserver = (String) -> Void;
    typealias CacheChangeEventObserver = (CacheChangeEvent) -> Void;
    
    
    private static let SERVER_URL: String! = "https://hidden-taiga-8809.herokuapp.com";
    
    private static let LOCATION_HEADER_KEY: String! = "_location";
    
    
    private static var instance: Backend! = nil;
    
    private var userProfile: UserProfile! = nil;
    private var userPreferences: UserPreferences! = nil;
    
    private var cache: ObjectCache! = ObjectCache();

    
    
    public class UserProfile {
        private static let USER_PROPERTY_LOGIN: String! = "login";
        private static let USER_PROPERTY_PASSWORD: String! = "password";
        private static let USER_PROPERTY_GENDER: String! = "gender";
        private static let USER_PROPERTY_AGE: String! = "age_category";
        private static let USER_PROPERTY_NICKNAME: String! = "name";
        private static let USER_PROPERTY_LANGUAGES: String! = "languages";
        
        
        public var login: String!;
        public var password: String!;
        public var gender: Configuration.Item!;
        public var languages: [Configuration.Item]!;
        public var age: Configuration.Item!;
        public var name: String!;
        public var userId: Int!;
        
        public func updateFromParcel(parcel: NSDictionary) {
            name = parcel.valueForKey(UserProfile.USER_PROPERTY_NICKNAME) as? String;
            languages = Configuration.resolve(parcel.valueForKey(UserProfile.USER_PROPERTY_LANGUAGES) as? [String], predefinedList: Configuration.LANGUAGES);
            gender = Configuration.resolve(parcel.valueForKey(UserProfile.USER_PROPERTY_GENDER), predefinedList: Configuration.GENDERS);
            age = Configuration.resolve(parcel.valueForKey(UserProfile.USER_PROPERTY_AGE), predefinedList: Configuration.AGE_CATEGORIES);
            login = parcel.valueForKey(UserProfile.USER_PROPERTY_LOGIN) as? String;
            password = parcel.valueForKey(UserProfile.USER_PROPERTY_PASSWORD) as? String;
        }
        
        public func safeToParcel(parcel: NSDictionary) {
            parcel.setValue(login, forKey: UserProfile.USER_PROPERTY_LOGIN);
            parcel.setValue(password, forKey: UserProfile.USER_PROPERTY_PASSWORD);
            parcel.setValue(gender.data, forKey: UserProfile.USER_PROPERTY_GENDER);
            parcel.setValue(age.data, forKey: UserProfile.USER_PROPERTY_AGE);
            parcel.setValue(name, forKey: UserProfile.USER_PROPERTY_NICKNAME);
            
            var langData: [String] = [];
            for (index, item) in enumerate(languages) {
                langData.append(item.data as! String);
            }
            parcel.setValue(langData, forKey: UserProfile.USER_PROPERTY_LANGUAGES);
        }
    }
    
    public class UserPreferences {
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
        
        public func updateFromParcel(parcel: NSDictionary) {
            responseQuantity = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_RESPONSE_QUANTITY), predefinedList: Configuration.RESPONSE_QUANTITY);
            
            responseWaitTime = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_RESPONSE_WAITTIME), predefinedList: Configuration.RESPONSE_WAIT_TIME);
            
            requestTargetAge = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_REQUEST_TARGET_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
            
            requestTargetGender = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_REQUEST_TARGET_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
            
            dailyInquiryLimit = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_INQUIRY_LIMIT), predefinedList: Configuration.INQUIRY_LIMIT_PREFERENCE);
            
            inquiryAge = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_INQUIRY_AGE), predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
            
            inquiryGender = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_INQUIRY_GENDER), predefinedList: Configuration.GENDER_PREFERENCE);
            
            expertises = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_EXPERTISES) as? [String], predefinedList: Configuration.EXPERTISES);
            
            contactVisible = Configuration.resolve(parcel.valueForKey(UserPreferences.USER_PREFERENCE_CONTACT_REQUESTABLE), predefinedList: Configuration.CONTACT_REQUESTABLE);
            
            contactName = parcel.valueForKey(UserPreferences.USER_PREFERENCE_CONTACT_NAME) as? String;
            contactInfo = parcel.valueForKey(UserPreferences.USER_PREFERENCE_CONTACT_DETAILS) as? String;
        }
        
        public func safeToParcel(parcel: NSDictionary) {
            parcel.setValue(requestTargetAge?.data, forKey: UserPreferences.USER_PREFERENCE_REQUEST_TARGET_AGE);
            parcel.setValue(requestTargetGender?.data, forKey: UserPreferences.USER_PREFERENCE_REQUEST_TARGET_GENDER);
            parcel.setValue(responseQuantity?.data, forKey: UserPreferences.USER_PREFERENCE_RESPONSE_QUANTITY);
            parcel.setValue(responseWaitTime?.data, forKey: UserPreferences.USER_PREFERENCE_RESPONSE_WAITTIME);
            parcel.setValue(dailyInquiryLimit?.data, forKey: UserPreferences.USER_PREFERENCE_INQUIRY_LIMIT);
            parcel.setValue(inquiryAge?.data, forKey: UserPreferences.USER_PREFERENCE_INQUIRY_AGE);
            parcel.setValue(inquiryGender?.data, forKey: UserPreferences.USER_PREFERENCE_INQUIRY_GENDER);
            
            var expertisesData: [String]?;
            if (expertises != nil) {
                expertisesData = [];
                for (index, item) in enumerate(expertises!) {
                    expertisesData!.append(item.data as! String);
                }
            }
            parcel.setValue(expertisesData, forKey: UserPreferences.USER_PREFERENCE_EXPERTISES);
            
            parcel.setValue(contactVisible.data, forKey: UserPreferences.USER_PREFERENCE_CONTACT_REQUESTABLE);
            parcel.setValue(contactName, forKey: UserPreferences.USER_PREFERENCE_CONTACT_NAME);
            parcel.setValue(contactInfo, forKey: UserPreferences.USER_PREFERENCE_CONTACT_DETAILS);
        }
    }

    public struct Events {
        public static let OUTGOING_REQUESTS_CHANGED: String! = "OUTGOING_REQUESTS_CHANGED";
        public static let INCOMING_REQUESTS_CHANGED: String! = "INCOMING_REQUESTS_CHANGED";
        public static let OUTGOING_RESPONSES_CHANGED: String! = "OUTGOING_RESPONSES_CHANGED";
        public static let INCOMING_RESPONSES_CHANGED: String! = "INCOMING_RESPONSES_CHANGED";
        public static let REQUEST_CHANGED: String! = "REQUEST_CHANGED";
        public static let RESPONSE_CHANGED: String! = "RESPONSE_CHANGED";
        
        var timestamp: Int! = 0;
        var _pulling: Bool! = false;
    }
    
    public struct RequestIds {
        static let INACTIVE: String = "inactive";
        static let ACTIVE: String = "active";
        
        var all: [String]?;
        var active: [String]?;
        var inactive: [String]?;

        public mutating func updateFromParcel(parcel: NSDictionary) {
            self.active = parcel.valueForKey(Backend.RequestIds.ACTIVE) as? [String];
            self.inactive = parcel.valueForKey(Backend.RequestIds.INACTIVE) as? [String];
            
            if (self.active != nil && self.inactive != nil) {
                self.all = self.active! + self.inactive!;
            } else {
                self.all = nil;
            }
        }
        
        public func safeToParcel(parcel: NSDictionary) {
        }
    }
    
    
    public struct RequestObject {
        static let STATUS_ALL: String = "all";
        static let STATUS_ACTIVE: String = "active";
        static let STATUS_INACTIVE: String = "inactive";
        
        private static let TIME: String = "time";
        private static let USER_ID: String = "user_id";
        private static let TEXT: String = "text";
        private static let STATUS: String = "status";
        private static let ATTACHMENTS: String = "attachments";
        private static let RESPONSE_QUANTITY: String = "response_quantity";
        private static let RESPONSE_WAITTIME: String = "response_wait_time";
        private static let RESPONSE_AGE_GROUP: String = "response_age_group";
        private static let RESPONSE_GENDER: String = "response_gender";
        private static let EXPERTISE_CATEGORY: String = "expertise_category";
        
        init(userPreferences: UserPreferences) {
            responseQuantity = userPreferences.responseQuantity;
            responseWaitTime = userPreferences.responseWaitTime;
            responseAgeGroup = userPreferences.inquiryAge;
            responseGender = userPreferences.inquiryGender;
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
        
        public mutating func updateFromParcel(parcel: NSDictionary) {
            self.time = parcel.valueForKey(Backend.RequestObject.TIME) as? Double;
            self.text = parcel.valueForKey(Backend.RequestObject.TEXT) as? String;
            //                self.attachments
            self.responseQuantity = Configuration.resolve(parcel.valueForKey(Backend.RequestObject.RESPONSE_QUANTITY) as? Int, predefinedList: Configuration.RESPONSE_QUANTITY);
            self.responseWaitTime = Configuration.resolve(parcel.valueForKey(Backend.RequestObject.RESPONSE_WAITTIME) as? Int, predefinedList: Configuration.RESPONSE_WAIT_TIME);
            self.responseAgeGroup = Configuration.resolve(parcel.valueForKey(Backend.RequestObject.RESPONSE_AGE_GROUP) as? String, predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
            self.responseGender = Configuration.resolve(parcel.valueForKey(Backend.RequestObject.RESPONSE_AGE_GROUP) as? String, predefinedList: Configuration.GENDER_PREFERENCE);
            self.expertiseCategory = Configuration.resolve(parcel.valueForKey(Backend.RequestObject.RESPONSE_AGE_GROUP) as? String, predefinedList: Configuration.EXPERTISES);
            self.status = parcel.valueForKey(Backend.RequestObject.STATUS) as? String;
        }
        
        public func safeToParcel(parcel: NSDictionary) {
            //parcel.setValue(self.userContext.userId, forKey: Backend.RequestObject.USER_ID);
            parcel.setValue(self.text, forKey: Backend.RequestObject.TEXT);
            //parcel.setValue(self.attachments, forKey: Backend.RequestObject.ATTACHMENTS);
            parcel.setValue(self.responseQuantity.data, forKey: Backend.RequestObject.RESPONSE_QUANTITY);
            parcel.setValue(self.responseWaitTime.data, forKey: Backend.RequestObject.RESPONSE_WAITTIME);
            parcel.setValue(self.responseAgeGroup.data, forKey: Backend.RequestObject.RESPONSE_AGE_GROUP);
            parcel.setValue(self.responseGender.data, forKey: Backend.RequestObject.RESPONSE_GENDER);
            parcel.setValue(self.expertiseCategory.data, forKey: Backend.RequestObject.EXPERTISE_CATEGORY);
        }
    }
    
    public struct ResponseObject {
        static let STATUS_UNREAD = "unviewed";
        static let STATUS_READ = "viewed";
        static let CONTACT_INFO_STATUS_NOT_AVAILABLE = "no";
        static let CONTACT_INFO_STATUS_CAN_PROVIDE = "can_provide";
        static let CONTACT_INFO_STATUS_PROVIDED = "provided";
        
        public struct ContactInfo {
            var contactName: String;
            var contactInfo: String;
        }
        
        
        init() {
        }
        
        
        init(userProfile: UserProfile) {
            ageCategory = userProfile.age;
            gender = userProfile.gender;
        }

        var time: Double! = 0;
        var text: String! = "";
        var attachments: [String]!;
        var ageCategory: Configuration.Item!;
        var gender: Configuration.Item!;
        var status: String! = STATUS_UNREAD;
        var contactInfoStatus: String! = CONTACT_INFO_STATUS_NOT_AVAILABLE;
        var contactInfo: ContactInfo? = nil;
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
    
    
    
    public static func getInstance() -> Backend! {
        return instance;
    }
    
    
    
    public func getUserProfile() -> UserProfile! {
        return userProfile;
    }
    
    public func getUserPreferences() -> UserPreferences! {
        return userPreferences;
    }
    
    
    public static func logIn(login: String!, password: String!, callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                Backend.instance = Backend();
                
                Backend.instance.userProfile = UserProfile();
                Backend.instance.userProfile.userId = data?.valueForKey("user_id") as? Int;
                Backend.instance.userProfile.login = login;
                Backend.instance.userProfile.password = password;
                
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
        Backend.instance.userProfile = nil;
        Backend.instance.userPreferences = nil;
        Backend.instance.cache = nil;
        Backend.instance = nil;
    }
    
    public static func isLogged() -> Bool {
        return instance != nil && instance.getUserProfile() != nil;
    }

    
    public static func register(login: String!, password: String!, gender: Configuration.Item!, age: Configuration.Item!, nickname: String!, languages: [Configuration.Item]!, callback: BackendCallback?) {
        
        
        var userProfile = UserProfile();
        userProfile.login = login;
        userProfile.password = password;
        userProfile.gender = gender;
        userProfile.age = age;
        userProfile.name = nickname;
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            
            if (statusCode == 201) {
                Backend.instance = Backend();
                
                Backend.instance.userProfile = userProfile;
                let location = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as? String;
                if (location == nil) {
                    println("Error: server malformed response - no userid provided in Location header");
                    callback?.onError();
                    return;
                }
                
                Backend.instance.userProfile.userId = location!.toInt();
                
                Backend.instance.pullUserSettings(callback);
            } else if (statusCode == 409) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        userProfile.safeToParcel(params);
        
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
                self.userProfile.updateFromParcel(data!);
                
                if (password != nil) {
                    self.userProfile.password = password;
                }
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        if (password != nil) {
            self.userProfile.password = password;
        }
        self.userProfile.safeToParcel(params);
        self.userProfile.password = currentPassword;
        
        let url = "user/\(userProfile.userId)";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: currentPassword);
    }

    public func updateUserPreferences(requestTargetAge: Configuration.Item?, requestTargetGender: Configuration.Item?, responseQuantity: Configuration.Item?, responseWaitTime: Configuration.Item?, dailyInquiryLimit: Configuration.Item?, inquiryAge: Configuration.Item?, inquiryGender: Configuration.Item?, expertises: [Configuration.Item]?, contactRequestable: Configuration.Item?, contactName: String?, contactDetails: String?, callback: BackendCallback?) {
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                self.userPreferences.updateFromParcel(data!);

                callback?.onSuccess();
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        userPreferences.safeToParcel(params);

        
        let url = "user/\(userProfile.userId)/settings";
        Backend.communicate(url, method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    
    public func createRequest(request: RequestObject, callback: BackendCallback? = nil) {
        self.cache.markOutgoingRequestIdsInUpdate();
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 201) {
                let requestId: String = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as! String;
                
                var request = RequestObject(userPreferences: self.userPreferences);
                request.updateFromParcel(data!);
                
                self.cache.setRequest(requestId, request: request);
                
                callback?.onSuccess();
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        request.safeToParcel(params);
        
        
        Backend.communicate("request", method: HttpMethod.POST, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    public func updateRequest(requestId: String, request: RequestObject, callback: BackendCallback? = nil) {
        self.cache.markRequestInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var updatedRequest = request;
                updatedRequest.updateFromParcel(data!);
                
                self.cache.setRequest(requestId, request: updatedRequest);
                
                callback?.onSuccess();
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        request.safeToParcel(params);
        
        
        Backend.communicate("request/\(requestId)", method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    public func getRequest(requestId: String!) -> RequestObject? {
        var request: RequestObject? = cache.getRequest(requestId);
        if (request != nil || cache.isRequestInUpdate(requestId)) {
            return request;
        }
        
        
        pullRequest(requestId, callback: nil);
        return nil;
    }
    
    private func pullRequest(requestId: String, callback: BackendCallback?) {
        self.cache.markRequestInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var request = RequestObject(userPreferences: self.userPreferences);
                request.updateFromParcel(data!);
                
                self.cache.setRequest(requestId, request: request);
                
                callback?.onSuccess();
            } else if (statusCode == 401) {
                callback?.onFailure();
            } else {
                callback?.onError();
            }
        };
        
        Backend.communicate("request/\(requestId)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    
    
    public func getOutgoingRequestIds(requestStatus: String? = nil, sortRule: String? = nil, callback: BackendCallback? = nil) -> [String]? {
        
        var requestIds: RequestIds? = self.cache.getOutgoingRequestIds();
        
        var result: [String]? = nil;
        if (requestIds != nil) {
            if (requestStatus == nil || requestStatus == Backend.RequestObject.STATUS_ALL) {
                result = requestIds!.all;
            } else if (requestStatus == Backend.RequestObject.STATUS_ACTIVE) {
                result = requestIds!.active;
            } else if (requestStatus == Backend.RequestObject.STATUS_INACTIVE) {
                result = requestIds!.inactive;
            } else {
                println("Error: Invalid request status requested: \(requestStatus)");
            }
        }
        
        if (result != nil || self.cache.isOutgoingRequestIdsInUpdate()) {
            return result;
        } else {
            pullOutgoingRequestIds(requestStatus: requestStatus, sortRule: sortRule, callback: callback);
            
            return nil;
        }
    }
    
    private func pullOutgoingRequestIds(requestStatus: String? = nil, sortRule: String? = nil, callback: BackendCallback?) -> [String]? {
        
        self.cache.markOutgoingRequestIdsInUpdate();
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var requestIds: RequestIds? = self.cache.getOutgoingRequestIds();
                if (requestIds == nil) {
                    requestIds = RequestIds();
                }
                
                requestIds?.updateFromParcel(data!);

                self.cache.setOutgoingRequestIds(requestIds!);
                
                callback?.onSuccess();
            } else {
                self.cache.markOutgoingRequestIdsInUpdate(isInUpdate: false);
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
            }
        };
        
//        Backend.communicate("request/\(requestId)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userContext.login, password: userContext.password);
        

//        var communicationCallback = {
//            success: function(data, status, xhr) {
//                if (xhr.status == 200) {
//                    var requestIds = Backend.Cache.getOutgoingRequestIds();
//                    if (requestIds == null) {
//                        requestIds = {};
//                    }
//                    
//                    if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_ACTIVE) {
//                        requestIds.active = data.active;
//                    }
//                    if (requestStatus == Backend.Request.STATUS_ALL || requestStatus == Backend.Request.STATUS_INACTIVE) {
//                        requestIds.inactive = data.inactive;
//                    }
//                    
//                    if (requestStatus == Backend.Request.STATUS_ALL) {
//                        requestIds.all = data.active.concat(data.inactive);
//                    } else {
//                        requestIds.all = null;
//                    }
//                    
//                    Backend.Cache.setOutgoingRequestIds(requestIds);
//                    
//                    if (transactionCallback != null) {
//                        transactionCallback.success();
//                    }
//                }
//            },
//            error: function(xhr, status, error) {
//                if (transactionCallback != null) {
//                    if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 404) {
//                        transactionCallback.failure();
//                    } else {
//                        transactionCallback.error();
//                    }
//                }
//                Backend.Cache.markOutgoingRequestIdsInUpdate(false);
//            }
//        
//        
//        
//        
//        if (cache.isOutgoingRequestIdsInUpdate()) {
//            return nil;
//        }
        
//        var ids: Backend.ObjectCache.RequestIds? = cache.getOutgoingRequestIds();
//        if (ids == nil) {
//            //TODO: pull the list from the server here
//            self.cache.markOutgoingRequestIdsInUpdate();
//
//            var action:()->Void = {() in
//                self.cache.setOutgoingRequestIds(["req1", "req2", "req3", "req4", "req5", "req6", "req7", "req8", "req9", "req10"]);
//            };
//            
//            DelayedNotifier(action: action).schedule(5);
//            
//            return nil;
//        } else {
//            var requestIds: [String] = [];
//            for (index, id) in enumerate(ids!) {
//                var request = self.cache.getRequest(id);
//                if (requestStatus == nil
//                    || request != nil && request!.status == requestStatus
//                    || request == nil && (requestStatus == RequestObject.STATUS_ACTIVE && index < 4
//                        || requestStatus == RequestObject.STATUS_INACTIVE && index >= 4)) {
//                        
//                    requestIds.append(id);
//                }
//            }
//            
//            return requestIds;
//        }
        return nil;
    }

    public func getIncomingRequestIds(requestStatus: String? = nil) -> [String]? {
//        if (cache.isIncomingRequestIdsInUpdate()) {
//            return nil;
//        }
//
//        let ids: [String]? = cache.getIncomingRequestIds();
//        if (ids == nil) {
//            //TODO: pull the list from the server here
//            self.cache.markIncomingRequestIdsInUpdate();
//            
//            var action:()->Void = {() in
//                self.cache.setIncomingRequestIds(["req101", "req102", "req103", "req104", "req105", "req106", "req107", "req108", "req109", "req110"]);
//            };
//            
//            DelayedNotifier(action: action).schedule(5);
//            
//            return nil;
//        } else {
//            var requestIds: [String] = [];
//            for (index, id) in enumerate(ids!) {
//                var request = self.cache.getRequest(id);
//                if (requestStatus == nil
//                    || request != nil && request!.status == requestStatus
//                    || request == nil && (requestStatus == RequestObject.STATUS_ACTIVE && index < 4
//                        || requestStatus == RequestObject.STATUS_INACTIVE && index >= 4)) {
//                        
//                    requestIds.append(id);
//                }
//            }
//
//            return requestIds;
//        }
        return nil;
    }
    
    public func removeIncomingRequest(requestId: String, observer: CompletionObserver) {
//        var ids: [String]! = cache.getIncomingRequestIds();
//        if (ids == nil) {
//            return;
//        }
//
//        
//        self.cache.markIncomingRequestIdsInUpdate();
//        for (index, id) in enumerate(ids!) {
//            if (id == requestId) {
//                var action:()->Void = {() in
//                    ids.removeAtIndex(index);
//                    self.cache.setIncomingRequestIds(ids);
//                    
//                    observer(requestId);
//                };
//                
//                DelayedNotifier(action: action).schedule(2);
//                
//                return;
//            }
//        }
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
            
            DelayedNotifier(action: action).schedule(3);
            
            return nil;
        } else {
            var responseIds: [String] = [];
            for (index, id) in enumerate(ids!) {
                var response = self.cache.getResponse(requestId, responseId: id);
                if (responseStatus == nil
                    || response != nil && response!.status == responseStatus
                    || response == nil && (responseStatus == ResponseObject.STATUS_READ && index < 3
                                           || responseStatus == ResponseObject.STATUS_UNREAD && index >= 3)) {

                    responseIds.append(id);
                }
            }
            
            return responseIds;
        }
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
            
            DelayedNotifier(action: action).schedule(3);
            
            return nil;
        } else {
            var responseIds: [String] = [];
            for (index, id) in enumerate(ids!) {
                var response = self.cache.getResponse(requestId, responseId: id);
                if (responseStatus == nil
                    || response != nil && response!.status == responseStatus
                    || response == nil && (responseStatus == ResponseObject.STATUS_READ && index < 3
                                           || responseStatus == ResponseObject.STATUS_UNREAD && index >= 3)) {
                        
                    responseIds.append(id);
                }
            }
            
            return responseIds;
        }
    }
    
    public func getResponse(requestId: String!, responseId: String!) -> ResponseObject? {
        if (cache.isResponseInUpdate(requestId, responseId: responseId)) {
            return nil;
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
                response!.contactInfoStatus = ResponseObject.CONTACT_INFO_STATUS_CAN_PROVIDE;
                
                self.cache.setResponse(requestId, responseId: responseId, response: response!);
            };
            
            DelayedNotifier(action: action).schedule(2);
        }
        
        
        return response;
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
            observer(responseId);
        };
        
        DelayedNotifier(action: action).schedule(3);
    }
    
    public func updateResponse(requestId: String, responseId: String, response: ResponseObject, observer: CompletionObserver) {
        self.cache.markResponseInUpdate(requestId, responseId: responseId);
        
        var action:()->Void = {() in
            self.cache.setResponse(requestId, responseId: responseId, response: response);
            observer(responseId);
        };
        
        DelayedNotifier(action: action).schedule(2);
    }
    
    
    
    public func getContactInfo(requestId: String, responseId: String, observer: CompletionObserver) -> ResponseObject.ContactInfo? {
        var response = getResponse(requestId, responseId: responseId);
        if (response == nil) {
            return nil;
        }
        
        if (response!.contactInfoStatus == ResponseObject.CONTACT_INFO_STATUS_NOT_AVAILABLE) {
            observer(responseId);
            return nil;
        } else if (response!.contactInfoStatus == ResponseObject.CONTACT_INFO_STATUS_PROVIDED) {
            observer(responseId);
            return response!.contactInfo;
        } else {
//            self.cache.markContactInfoInUpdate(requestId, responseId: responseId);
//            
//            var action:()->Void = {() in
//                var contactInfo = ResponseObject.ContactInfo(contactName: "Anton", contactInfo: "(678) 967-3445");
//                self.cache.setContactInfo(requestId, responseId: responseId, contactInfo: contactInfo);
//                
//                observer(responseId);
//            };
            
//            DelayedNotifier(action: action).schedule(2);
            
            return nil;
        }
    }
    
    
    
    

    
    // Event Management
    
    func addCacheChangeListener(listener: CacheChangeEventObserver, listenerId: String!) -> String {
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
                self.userProfile.updateFromParcel(data!);

                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };

        let url = "user/\(userProfile.userId)";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    func pullUserPreferences(callback: BackendCallback?) {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                self.userProfile.updateFromParcel(data!);
                
                callback?.onSuccess();
            } else if (statusCode == 401 || statusCode == 404) {
                callback?.onFailure();
            } else {
                callback?.onError()
            }
        };
        
        let url = "user/\(userProfile.userId)/settings";
        Backend.communicate(url, method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
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
            if (Backend.getInstance() != nil) {
                action?();
            }
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
        private var outgoingRequestIds: RequestIds?;

        private var incomingRequestIdsInProgress: Bool! = false;
        private var incomingRequestIds: RequestIds?;
        
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
        
        
        func markOutgoingRequestIdsInUpdate(isInUpdate: Bool = true) {
            outgoingRequestIdsInProgress = isInUpdate;
            fireUpdateEvent();
//            println("marked outgoing request ids in progress");
        }
        func isOutgoingRequestIdsInUpdate() -> Bool {
            return outgoingRequestIdsInProgress;
        }
        func setOutgoingRequestIds(requestIds: RequestIds) {
            outgoingRequestIds = requestIds;
            notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, requestId: nil, responseId: nil);

            markOutgoingRequestIdsInUpdate(isInUpdate: false);
            //            println("!!! outgoing request ids updated");
        }
        func getOutgoingRequestIds() -> RequestIds? {
            return outgoingRequestIdsInProgress == false ? outgoingRequestIds : nil;
        }
        
        func markIncomingRequestIdsInUpdate(isInUpdate: Bool = true) {
            incomingRequestIdsInProgress = isInUpdate;
            fireUpdateEvent();
            //            println("marked incoming request ids in progress");
        }
        func isIncomingRequestIdsInUpdate() -> Bool {
            return incomingRequestIdsInProgress;
        }
        func setIncomingRequestIds(requestIds: RequestIds) {
            incomingRequestIds = requestIds;
            notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, requestId: nil, responseId: nil);

            markIncomingRequestIdsInUpdate(isInUpdate: false);
            //            println("!!! incoming request ids updated");
        }
        func getIncomingRequestIds() -> RequestIds? {
            return incomingRequestIdsInProgress == false ? incomingRequestIds : nil;
        }
        
        func markRequestInUpdate(requestId: String, isInUpdate: Bool = true) {
            requestsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                requestsInProgress.removeValueForKey(requestId);
            }
            
            fireUpdateEvent();
//            println("marked request \(requestId) in progress");
        }
        func isRequestInUpdate(requestId: String) -> Bool {
            return requestsInProgress[requestId] != nil;
        }
        func setRequest(requestId: String, request: RequestObject) {
            requests.updateValue(request, forKey: requestId);
            notifyCacheListeners(CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId, responseId: nil);

            markRequestInUpdate(requestId, isInUpdate: false);
//            println("!!! request \(requestId) updated");
        }
        func getRequest(requestId: String) -> RequestObject? {
            return isRequestInUpdate(requestId) ? nil : requests[requestId];
        }

        func markIncomingResponseIdsInUpdate(requestId: String, isInUpdate: Bool = true) {
            incomingResponseIdsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                incomingResponseIdsInProgress.removeValueForKey(requestId);
            }

            fireUpdateEvent();
//            println("marked incoming response ids for \(requestId) in progress");
        }
        func isIncomingResponseIdsInUpdate(requestId: String) -> Bool {
            return incomingResponseIdsInProgress[requestId] != nil;
        }
        func setIncomingResponseIds(requestId: String, responseIds: [String]) {
            incomingResponseIds.updateValue(responseIds, forKey: requestId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);
            
            markIncomingResponseIdsInUpdate(requestId, isInUpdate: false);
            //            println("!!! incoming response ids for \(requestId) updated");
        }
        func getIncomingResponseIds(requestId: String) -> [String]? {
            return isIncomingResponseIdsInUpdate(requestId) ? nil : incomingResponseIds[requestId];
        }

        func markOutgoingResponseIdsInUpdate(requestId: String, isInUpdate: Bool = true) {
            outgoingResponseIdsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                outgoingResponseIdsInProgress.removeValueForKey(requestId);
            }
            
            fireUpdateEvent();
            //            println("marked outgoing response ids for \(requestId) in progress");
        }
        func isOutgoingResponseIdsInUpdate(requestId: String) -> Bool {
            return outgoingResponseIdsInProgress[requestId] != nil;
        }
        func setOutgoingResponseIds(requestId: String, responseIds: [String]) {
            outgoingResponseIds.updateValue(responseIds, forKey: requestId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);

            markOutgoingResponseIdsInUpdate(requestId, isInUpdate: false);
            //            println("!!! outgoing response ids for \(requestId) updated");
        }
        func getOutgoingResponseIds(requestId: String) -> [String]? {
            return isOutgoingResponseIdsInUpdate(requestId) ? nil : outgoingResponseIds[requestId];
        }
        
        func markResponseInUpdate(requestId: String, responseId: String, isInUpdate: Bool = true) {
            responsesInProgress.updateValue(isInUpdate, forKey: responseId);
            if (!isInUpdate) {
                responsesInProgress.removeValueForKey(responseId);
            }

            fireUpdateEvent();
//            println("marked response \(responseId) in progress");
        }
        func isResponseInUpdate(requestId: String, responseId: String) -> Bool {
            return responsesInProgress[responseId] != nil;
        }
        func setResponse(requestId: String, responseId: String, response: ResponseObject) {
            responses.updateValue(response, forKey: responseId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId: requestId, responseId: responseId);

            markResponseInUpdate(requestId, responseId: responseId, isInUpdate: false);
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
                listener(event);
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
                let res = response as! NSHTTPURLResponse
                
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
