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
    
    static let RESPONSE_WAIT_TIME: [Item] = [Item(display: NSLocalizedString("1 week", comment: "Wait time - week"), data: 168), Item(display: NSLocalizedString("1 day", comment: "Wait time - day"), data: 24), Item(display: NSLocalizedString("Half-day", comment: "Wait time - halfday"), data: 12), Item(display: NSLocalizedString("1 hour", comment: "Wait time - hour"), data: 1)];
    
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

public class Backend {
    typealias CacheChangeEventObserver = (CacheChangeEvent) -> Void;
    
    
    private static let SERVER_URL: String! = "https://hidden-taiga-8809.herokuapp.com";
//    private static let SERVER_URL: String! = "https://localhost:8080";
    
    private static let LOCATION_HEADER_KEY: String! = "_location";
    
    
    private static var instance: Backend! = nil;
    
    private var userProfile: UserProfile! = nil;
    private var userPreferences: UserPreferences! = nil;
    
    private var cache: ObjectCache! = ObjectCache();

    private var events: Events! = Events();
    
    
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
            //password = parcel.valueForKey(UserProfile.USER_PROPERTY_PASSWORD) as? String;
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

    public class Events {
        private struct Event {
            private static let TYPE: String = "type";
            private static let REQUEST_ID: String = "request_id";
            private static let RESPONSE_ID: String = "response_id";
            
            var type: String;
            var requestId: Int?;
            var responseId: Int?;
        }
        
        
        public static let OUTGOING_REQUESTS_CHANGED: String! = "OUTGOING_REQUESTS_CHANGED";
        public static let INCOMING_REQUESTS_CHANGED: String! = "INCOMING_REQUESTS_CHANGED";
        public static let OUTGOING_RESPONSES_CHANGED: String! = "OUTGOING_RESPONSES_CHANGED";
        public static let INCOMING_RESPONSES_CHANGED: String! = "INCOMING_RESPONSES_CHANGED";
        public static let REQUEST_CHANGED: String! = "REQUEST_CHANGED";
        public static let RESPONSE_CHANGED: String! = "RESPONSE_CHANGED";
        
        private static let TIMESTAMP: String = "timestamp";
        private static let EVENTS: String = "events";
        
        private var timestamp: Int! = 0;
        private var pulling: Bool! = false;
        
        private var events: [Event]! = nil;
        
        
        public func updateFromParcel(parcel: NSDictionary) {
            timestamp = parcel.valueForKey(Events.TIMESTAMP) as? Int;
            events = [];
            
            var eventDataArray: [NSDictionary]? = parcel.valueForKey(Events.EVENTS) as? [NSDictionary];
            if (eventDataArray != nil) {
                for (index, eventData) in enumerate(eventDataArray!) {
                    var type = eventData.valueForKey(Event.TYPE) as! String;
                    var requestId = eventData.valueForKey(Event.REQUEST_ID) as? Int;
                    var responseId = eventData.valueForKey(Event.RESPONSE_ID) as? Int;
                    events.append(Event(type: type, requestId: requestId, responseId: responseId));
                }
            }
        }
    }
    
    public class RequestIds {
        static let INACTIVE: String = "inactive";
        static let ACTIVE: String = "active";
        
        var all: [Int]?;
        var active: [Int]?;
        var inactive: [Int]?;

        public func updateFromParcel(parcel: NSDictionary) {
            self.active = parcel.valueForKey(RequestIds.ACTIVE) as? [Int];
            self.inactive = parcel.valueForKey(RequestIds.INACTIVE) as? [Int];
            
            if (self.active != nil && self.inactive != nil) {
                self.all = self.active! + self.inactive!;
            } else {
                self.all = nil;
            }
        }
        
        public func safeToParcel(parcel: NSDictionary) {
        }
    }
    
    public class RequestObject {
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
        
        public func updateFromParcel(parcel: NSDictionary) {
            self.time = parcel.valueForKey(RequestObject.TIME) as? Double;
            self.text = parcel.valueForKey(RequestObject.TEXT) as? String;
            //                self.attachments
            self.responseQuantity = Configuration.resolve(parcel.valueForKey(RequestObject.RESPONSE_QUANTITY) as? Int, predefinedList: Configuration.RESPONSE_QUANTITY);
            self.responseWaitTime = Configuration.resolve(parcel.valueForKey(RequestObject.RESPONSE_WAITTIME) as? Int, predefinedList: Configuration.RESPONSE_WAIT_TIME);
            self.responseAgeGroup = Configuration.resolve(parcel.valueForKey(RequestObject.RESPONSE_AGE_GROUP) as? String, predefinedList: Configuration.AGE_CATEGORY_PREFERENCE);
            self.responseGender = Configuration.resolve(parcel.valueForKey(RequestObject.RESPONSE_GENDER) as? String, predefinedList: Configuration.GENDER_PREFERENCE);
            self.expertiseCategory = Configuration.resolve(parcel.valueForKey(RequestObject.EXPERTISE_CATEGORY) as? String, predefinedList: Configuration.EXPERTISES);
            self.status = parcel.valueForKey(RequestObject.STATUS) as? String;
        }
        
        public func safeToParcel(parcel: NSDictionary) {
            //parcel.setValue(self.userContext.userId, forKey: RequestObject.USER_ID);
            parcel.setValue(self.text, forKey: RequestObject.TEXT);
            parcel.setValue(self.time, forKey: RequestObject.TIME);
            //parcel.setValue(self.attachments, forKey: RequestObject.ATTACHMENTS);
            parcel.setValue(self.responseQuantity.data, forKey: RequestObject.RESPONSE_QUANTITY);
            parcel.setValue(self.responseWaitTime.data, forKey: RequestObject.RESPONSE_WAITTIME);
            parcel.setValue(self.responseAgeGroup.data, forKey: RequestObject.RESPONSE_AGE_GROUP);
            parcel.setValue(self.responseGender.data, forKey: RequestObject.RESPONSE_GENDER);
            parcel.setValue(self.expertiseCategory.data, forKey: RequestObject.EXPERTISE_CATEGORY);
        }
    }
    
    
    
    public class ResponseIds {
        static let VIEWED: String = "viewed";
        static let UNVIEWED: String = "unviewed";
        
        var all: [Int]?;
        var unviewed: [Int]?;
        var viewed: [Int]?;
        
        public func updateFromParcel(parcel: NSDictionary) {
            self.unviewed = parcel.valueForKey(ResponseIds.UNVIEWED) as? [Int];
            self.viewed = parcel.valueForKey(ResponseIds.VIEWED) as? [Int];

            if (self.unviewed != nil && self.viewed != nil) {
                self.all = self.unviewed! + self.viewed!;
            } else {
                self.all = nil;
            }
        }
        
        public func safeToParcel(parcel: NSDictionary) {
        }
    }
    
    
    public class ResponseObject {
        static let STATUS_ALL = "all";
        static let STATUS_UNVIEWED = "unviewed";
        static let STATUS_VIEWED = "viewed";
        static let CONTACT_INFO_STATUS_NOT_AVAILABLE = "no";
        static let CONTACT_INFO_STATUS_CAN_PROVIDE = "can_provide";
        static let CONTACT_INFO_STATUS_PROVIDED = "provided";
        
        
        private static let USER_ID: String = "userId";
        private static let REQUEST_ID: String = "requestId";
        private static let TIME: String = "time";
        private static let TEXT: String = "text";
        private static let AGE_CATEGORY: String = "age_category";
        private static let GENDER: String = "gender";
        private static let STATUS: String = "status";
        private static let ATTACHMENTS: String = "attachments";
        private static let CONTACT_INFO_STATUS: String = "contact_info_status";
        private static let CONTACT_NAME: String = "contact_name";
        private static let CONTACT_INFO: String = "contact_info";
        
        public struct ContactInfo {
            var contactName: String;
            var contactInfo: String;
        }
        
        
        init(requestId: Int, userProfile: UserProfile) {
            self.requestId = requestId;
            
            userId = userProfile.userId;
            ageCategory = userProfile.age;
            gender = userProfile.gender;
        }

        var userId: Int!;
        var requestId: Int!;
        var time: Double! = 0;
        var text: String! = "";
        var attachments: [String]!;
        var ageCategory: Configuration.Item!;
        var gender: Configuration.Item!;
        var status: String! = STATUS_UNVIEWED;
        var contactInfoStatus: String! = CONTACT_INFO_STATUS_NOT_AVAILABLE;
        var contactInfo: ContactInfo? = nil;
        
        
        public func updateFromParcel(parcel: NSDictionary) {
            self.time = parcel.valueForKey(ResponseObject.TIME) as? Double;
            self.text = parcel.valueForKey(ResponseObject.TEXT) as? String;
            //                self.attachments
            self.ageCategory = Configuration.resolve(parcel.valueForKey(ResponseObject.AGE_CATEGORY) as? String, predefinedList: Configuration.AGE_CATEGORIES);
            self.gender = Configuration.resolve(parcel.valueForKey(ResponseObject.GENDER) as? String, predefinedList: Configuration.GENDERS);
            self.status = parcel.valueForKey(ResponseObject.STATUS) as? String;
            self.contactInfoStatus = parcel.valueForKey(ResponseObject.CONTACT_INFO_STATUS) as? String;
            
            var contactName: String? = parcel.valueForKey(ResponseObject.CONTACT_NAME) as? String;
            if (contactName != nil) {
                contactInfo = ContactInfo(contactName: contactName!, contactInfo: parcel.valueForKey(ResponseObject.CONTACT_INFO) as! String);
            }
        }
        
        public func safeToParcel(parcel: NSDictionary) {
            parcel.setValue(self.userId, forKey: ResponseObject.USER_ID);
            parcel.setValue(self.requestId, forKey: ResponseObject.REQUEST_ID);
            parcel.setValue(self.text, forKey: ResponseObject.TEXT);
            parcel.setValue(self.time, forKey: ResponseObject.TIME);
            //parcel.setValue(self.attachments, forKey: ResponseObject.ATTACHMENTS);
            parcel.setValue(self.ageCategory.data, forKey: ResponseObject.AGE_CATEGORY);
            parcel.setValue(self.gender.data, forKey: ResponseObject.GENDER);
            parcel.setValue(self.status, forKey: ResponseObject.STATUS);
            parcel.setValue(self.contactInfoStatus, forKey: ResponseObject.CONTACT_INFO_STATUS);
        }
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
        var requestId: Int!;
        var responseId: Int!;
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
                
                Backend.instance.userPreferences = UserPreferences();
                
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
        userProfile.languages = languages;
        
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
                
                Backend.instance.userPreferences = UserPreferences();
                
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
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 201) {
                let requestId: String = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as! String;
                
                var request = RequestObject(userPreferences: self.userPreferences);
                request.updateFromParcel(data!);
                
                self.cache.setRequest(requestId.toInt()!, request: request);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        request.safeToParcel(params);
        
        Backend.communicate("request", method: HttpMethod.POST, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    public func updateRequest(requestId: Int, request: RequestObject, callback: BackendCallback? = nil) {
        self.cache.markRequestInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                request.updateFromParcel(data!);
                
                self.cache.setRequest(requestId, request: request);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markRequestInUpdate(requestId, isInUpdate: false);
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        request.safeToParcel(params);
        
        
        Backend.communicate("request/\(requestId)", method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    public func getRequest(requestId: Int, callback: BackendCallback? = nil) -> RequestObject? {
        var request: RequestObject? = cache.getRequest(requestId);
        if (request != nil || cache.isRequestInUpdate(requestId)) {
            callback?.onSuccess();
            return request;
        }
        
        
        pullRequest(requestId, callback: callback);
        return nil;
    }
    
    private func pullRequest(requestId: Int, callback: BackendCallback?) {
        self.cache.markRequestInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var request = RequestObject(userPreferences: self.userPreferences);
                request.updateFromParcel(data!);
                
                self.cache.setRequest(requestId, request: request);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markRequestInUpdate(requestId, isInUpdate: false);
            }
        };
        
        Backend.communicate("request/\(requestId)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    
    
    public func getOutgoingRequestIds(requestStatus: String? = nil, sortRule: String? = nil, callback: BackendCallback? = nil) -> [Int]? {
        
        var reqStatus = requestStatus != nil ? requestStatus : Backend.RequestObject.STATUS_ALL;
        
        var requestIds: RequestIds? = self.cache.getOutgoingRequestIds();
        
        var result: [Int]? = nil;
        if (requestIds != nil) {
            if (reqStatus == Backend.RequestObject.STATUS_ALL) {
                result = requestIds!.all;
            } else if (reqStatus == Backend.RequestObject.STATUS_ACTIVE) {
                result = requestIds!.active;
            } else if (reqStatus == Backend.RequestObject.STATUS_INACTIVE) {
                result = requestIds!.inactive;
            } else {
                println("Error: Invalid request status requested: \(requestStatus)");
            }
        }
        
        if (result != nil || self.cache.isOutgoingRequestIdsInUpdate()) {
            return result;
        } else {
            pullOutgoingRequestIds(requestStatus: reqStatus, sortRule: sortRule, callback: callback);
            
            return nil;
        }
    }
    
    private func pullOutgoingRequestIds(requestStatus: String! = nil, sortRule: String? = nil, callback: BackendCallback?) {
        self.cache.markOutgoingRequestIdsInUpdate();
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var requestIds: RequestIds? = self.cache.getOutgoingRequestIds();
                if (requestIds == nil) {
                    requestIds = RequestIds();
                }
                //println("Request ids = \(data?.debugDescription)");
                
                requestIds?.updateFromParcel(data!);

                self.cache.setOutgoingRequestIds(requestIds!);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markOutgoingRequestIdsInUpdate(isInUpdate: false);
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/requests/outgoing?status=\(requestStatus)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }


    public func getIncomingRequestIds(requestStatus: String? = nil, sortRule: String? = nil, callback: BackendCallback? = nil) -> [Int]? {
        
        var reqStatus = requestStatus != nil ? requestStatus : Backend.RequestObject.STATUS_ALL;
        
        var requestIds: RequestIds? = self.cache.getIncomingRequestIds();
        
        var result: [Int]? = nil;
        if (requestIds != nil) {
            if (reqStatus == Backend.RequestObject.STATUS_ALL) {
                result = requestIds!.all;
            } else if (reqStatus == Backend.RequestObject.STATUS_ACTIVE) {
                result = requestIds!.active;
            } else if (reqStatus == Backend.RequestObject.STATUS_INACTIVE) {
                result = requestIds!.inactive;
            } else {
                println("Error: Invalid request status requested: \(requestStatus)");
            }
        }
        
        if (result != nil || self.cache.isIncomingRequestIdsInUpdate()) {
            return result;
        } else {
            pullIncomingRequestIds(requestStatus: reqStatus, sortRule: sortRule, callback: callback);
            
            return nil;
        }
    }
    
    private func pullIncomingRequestIds(requestStatus: String! = nil, sortRule: String? = nil, callback: BackendCallback?) {
        self.cache.markIncomingRequestIdsInUpdate();
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var requestIds: RequestIds? = self.cache.getIncomingRequestIds();
                if (requestIds == nil) {
                    requestIds = RequestIds();
                }
                
                requestIds?.updateFromParcel(data!);
                self.cache.setIncomingRequestIds(requestIds!);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markIncomingRequestIdsInUpdate(isInUpdate: false);
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/requests/incoming?status=\(requestStatus)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    public func removeIncomingRequest(requestId: Int, callback: BackendCallback? = nil) {
        self.cache.markIncomingRequestIdsInUpdate();
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            self.cache.markIncomingRequestIdsInUpdate(isInUpdate: false);
            if (statusCode == 200) {
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/requests/incoming/\(requestId)", method: HttpMethod.DELETE, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    
    public func createResponse(requestId: Int, response: ResponseObject, callback: BackendCallback? = nil) {
        self.cache.markOutgoingResponseIdsInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 201) {
                let responseId: String = data?.valueForKey(Backend.LOCATION_HEADER_KEY) as! String;
                
                var response = ResponseObject(requestId: requestId, userProfile: self.userProfile);
                response.updateFromParcel(data!);
                
                self.cache.setResponse(requestId, responseId: responseId.toInt()!, response: response);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markOutgoingResponseIdsInUpdate(requestId, isInUpdate: false);
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        response.safeToParcel(params);
        
        Backend.communicate("response", method: HttpMethod.POST, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    public func getResponse(requestId: Int, responseId: Int, callback: BackendCallback? = nil) -> ResponseObject? {
        var response: ResponseObject? = cache.getResponse(requestId, responseId: responseId);
        if (response != nil || cache.isResponseInUpdate(requestId, responseId: responseId)) {
            callback?.onSuccess();
            return response;
        }
        
        
        pullResponse(requestId, responseId: responseId, callback: callback);
        return nil;
    }
    
    private func pullResponse(requestId: Int, responseId: Int, callback: BackendCallback?) {
        self.cache.markResponseInUpdate(requestId, responseId: responseId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var response = ResponseObject(requestId: requestId, userProfile: self.userProfile);
                response.updateFromParcel(data!);
                
                self.cache.setResponse(requestId, responseId: responseId, response: response);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markResponseInUpdate(requestId, responseId: responseId, isInUpdate: false);
            }
        };
        
        Backend.communicate("response/\(responseId)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }

    public func getResponseWithContactInfo(requestId: Int, responseId: Int, callback: BackendCallback? = nil) -> ResponseObject? {
        var response = self.cache.getResponse(requestId, responseId: responseId);
        if (response == nil || response!.contactInfoStatus == ResponseObject.CONTACT_INFO_STATUS_CAN_PROVIDE) {
            pullResponseWithContactInfo(requestId, responseId: responseId, callback: callback);
            return nil;
        }
        
        if (response!.contactInfoStatus == ResponseObject.CONTACT_INFO_STATUS_PROVIDED) {
            callback?.onSuccess();
            return response;
        } else if (response!.contactInfoStatus == ResponseObject.CONTACT_INFO_STATUS_NOT_AVAILABLE) {
            callback?.onFailure();
            return nil;
        } else {
            println("Error: Unsupported contact_info_status \(response!.contactInfoStatus)");
            return nil;
        }
    }

    private func pullResponseWithContactInfo(requestId: Int, responseId: Int, callback: BackendCallback?) {
        self.cache.markRequestInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var response = ResponseObject(requestId: requestId, userProfile: self.userProfile);
                response.updateFromParcel(data!);
                
                self.cache.setResponse(requestId, responseId: responseId, response: response);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markRequestInUpdate(requestId, isInUpdate: false);
            }
        };
        
        Backend.communicate("response/\(responseId)?contactinfo", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    public func updateResponse(requestId: Int, responseId: Int, response: ResponseObject, callback: BackendCallback? = nil) {
        self.cache.markResponseInUpdate(requestId, responseId: responseId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                response.updateFromParcel(data!);
                
                self.cache.setResponse(requestId, responseId: responseId, response: response);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markResponseInUpdate(requestId, responseId: responseId, isInUpdate: false);
            }
        };
        
        var params: NSDictionary! = NSMutableDictionary();
        response.safeToParcel(params);
        
        
        Backend.communicate("response/\(responseId)", method: HttpMethod.PUT, params: params, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    

    public func getIncomingResponseIds(requestId: Int, responseStatus: String? = nil, callback: BackendCallback? = nil) -> [Int]? {
        var respStatus = responseStatus != nil ? responseStatus : Backend.ResponseObject.STATUS_ALL;
        
        var responseIds: ResponseIds? = self.cache.getIncomingResponseIds(requestId);
        
        var result: [Int]? = nil;
        if (responseIds != nil) {
            if (respStatus == ResponseObject.STATUS_ALL) {
                result = responseIds!.all;
            } else if (respStatus == ResponseObject.STATUS_UNVIEWED) {
                result = responseIds!.unviewed;
            } else if (respStatus == ResponseObject.STATUS_VIEWED) {
                result = responseIds!.viewed;
            } else {
                println("Error: Invalid response status requested: \(responseStatus)");
            }
        }
        
        if (result != nil || self.cache.isIncomingResponseIdsInUpdate(requestId)) {
            return result;
        } else {
            pullIncomingResponseIds(requestId, responseStatus: respStatus, callback: callback);
            
            return nil;
        }
    }
    
    private func pullIncomingResponseIds(requestId: Int, responseStatus: String! = nil, callback: BackendCallback?) {
        self.cache.markIncomingResponseIdsInUpdate(requestId);

        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var responseIds: ResponseIds? = self.cache.getIncomingResponseIds(requestId);
                if (responseIds == nil) {
                    responseIds = ResponseIds();
                }
                
                responseIds?.updateFromParcel(data!);
                
                self.cache.setIncomingResponseIds(requestId, responseIds: responseIds!);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markIncomingResponseIdsInUpdate(requestId, isInUpdate: false);
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/responses/incoming/\(requestId)?status=\(responseStatus)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    public func removeIncomingResponse(requestId: Int, responseId: String, callback: BackendCallback? = nil) {
        self.cache.markIncomingResponseIdsInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            self.cache.markIncomingResponseIdsInUpdate(requestId, isInUpdate: false);
            if (statusCode == 200) {
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                
                self.cache.markIncomingResponseIdsInUpdate(requestId, isInUpdate: false);
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/responses/incoming/\(responseId)", method: HttpMethod.DELETE, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    public func getOutgoingResponseIds(requestId: Int, responseStatus: String? = nil, callback: BackendCallback? = nil) -> [Int]? {
        var respStatus = responseStatus != nil ? responseStatus : Backend.ResponseObject.STATUS_ALL;
        
        var responseIds: ResponseIds? = self.cache.getOutgoingResponseIds(requestId);
        
        var result: [Int]? = nil;
        if (responseIds != nil) {
            if (respStatus == ResponseObject.STATUS_ALL) {
                result = responseIds!.all;
            } else if (respStatus == ResponseObject.STATUS_UNVIEWED) {
                result = responseIds!.unviewed;
            } else if (respStatus == ResponseObject.STATUS_VIEWED) {
                result = responseIds!.viewed;
            } else {
                println("Error: Invalid response status requested: \(responseStatus)");
            }
        }
        
        if (result != nil || self.cache.isOutgoingResponseIdsInUpdate(requestId)) {
            return result;
        } else {
            pullOutgoingResponseIds(requestId, responseStatus: respStatus, callback: callback);
            
            return nil;
        }
    }
    
    private func pullOutgoingResponseIds(requestId: Int, responseStatus: String! = nil, callback: BackendCallback?) {
        self.cache.markOutgoingResponseIdsInUpdate(requestId);
        
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            if (statusCode == 200) {
                var responseIds: ResponseIds? = self.cache.getIncomingResponseIds(requestId);
                if (responseIds == nil) {
                    responseIds = ResponseIds();
                }
                
                responseIds?.updateFromParcel(data!);
                
                self.cache.setOutgoingResponseIds(requestId, responseIds: responseIds!);
                
                callback?.onSuccess();
            } else {
                if (statusCode == 401) {
                    callback?.onFailure();
                } else {
                    callback?.onError();
                }
                self.cache.markOutgoingResponseIdsInUpdate(requestId, isInUpdate: false);
            }
        };
        
        Backend.communicate("user/\(userProfile.userId)/responses/outgoing/\(requestId)?status=\(responseStatus)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
    }
    
    
    
    
    // Event Management
    
    public func startPullingEvents() {
        if (events.pulling == true) {
            return;
        }
        
        events.timestamp = 0;
        events.pulling = true;
        pullEvents();
    }
    
    public func stopPullingEvents() {
        if (events.pulling == false) {
            return;
        }
        
        events.pulling = false;
    }
    
    private func pullEvents() {
        let communicationCallback: ((Int!, NSDictionary?) -> Void)? = {statusCode, data -> Void in
            var action:()->Void = {() in
                self.pullEvents();
            };

            if (statusCode == 200) {
                self.events.updateFromParcel(data!);

                for (index, event) in enumerate(self.events.events) {
                    if (event.type == Events.INCOMING_REQUESTS_CHANGED) {
                        self.pullIncomingRequestIds(requestStatus: RequestObject.STATUS_ALL, sortRule: nil, callback: nil);
                    } else if (event.type == Events.OUTGOING_REQUESTS_CHANGED) {
                        self.pullOutgoingRequestIds(requestStatus: RequestObject.STATUS_ALL, sortRule: nil, callback: nil);
                    } else if (event.type == Events.OUTGOING_RESPONSES_CHANGED) {
                        self.pullOutgoingResponseIds(event.requestId!, responseStatus: ResponseObject.STATUS_ALL, callback: nil);
                    } else if (event.type == Events.INCOMING_RESPONSES_CHANGED) {
                        self.pullIncomingResponseIds(event.requestId!, responseStatus: ResponseObject.STATUS_ALL, callback: nil);
                    } else if (event.type == Events.REQUEST_CHANGED) {
                        self.pullRequest(event.requestId!, callback: nil);
                    } else if (event.type == Events.RESPONSE_CHANGED) {
                        self.pullResponse(event.requestId!, responseId: event.responseId!, callback: nil);
                    } else {
                        println("Error: unrecognized event type \(event.type)");
                    }
                }
                
                DelayedNotifier(action: action).schedule(5);
            } else {
                println("Event retrieval failed. Retrying in 10 seconds");
                
                DelayedNotifier(action: action).schedule(10);
            }
        };
        
        Backend.communicate("events/user/\(userProfile.userId)?timestamp=\(events.timestamp)", method: HttpMethod.GET, params: nil, communicationCallback: communicationCallback, login: userProfile.login, password: userProfile.password);
        
    }
    
    
    
    // Cache management
    
    func addCacheChangeListener(listener: CacheChangeEventObserver, listenerId: String!) -> String {
        var listId = cache.addCacheChangeListener(listener, listenerId: listenerId);
        
        startPullingEvents();
        
        return listId;
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
            Backend.getInstance().pullUserPreferences(cb);
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
                self.userPreferences.updateFromParcel(data!);
                
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
            dispatch_async(dispatch_get_main_queue(), {
                NSTimer.scheduledTimerWithTimeInterval(delay, target: self, selector: Selector("timerTick"), userInfo: nil, repeats: false);
            });
        }
        
        @objc func timerTick() {
            if (Backend.getInstance() != nil) {
//                dispatch_async(dispatch_get_main_queue(), {
                    self.action?();
//                });
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
        
        
        private var requestsInProgress: Dictionary<Int, Bool> = Dictionary();
        private var requests: Dictionary<Int, RequestObject> = Dictionary();

        private var responsesInProgress: Dictionary<Int, Bool> = Dictionary();
        private var responses: Dictionary<Int, ResponseObject> = Dictionary();
        
        private var outgoingRequestIdsInProgress: Bool! = false;
        private var outgoingRequestIds: RequestIds?;

        private var incomingRequestIdsInProgress: Bool! = false;
        private var incomingRequestIds: RequestIds?;
        
        private var incomingResponseIdsInProgress: Dictionary<Int, Bool> = Dictionary();
        private var incomingResponseIds: Dictionary<Int, ResponseIds> = Dictionary();
        
        private var outgoingResponseIdsInProgress: Dictionary<Int, Bool> = Dictionary();
        private var outgoingResponseIds: Dictionary<Int, ResponseIds> = Dictionary();
        
        
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
//            println("marked outgoing request ids in progress: \(isInUpdate)");
        }
        func isOutgoingRequestIdsInUpdate() -> Bool {
            return outgoingRequestIdsInProgress;
        }
        func setOutgoingRequestIds(requestIds: RequestIds) {
            outgoingRequestIds = requestIds;
            notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED, requestId: nil, responseId: nil);

            markOutgoingRequestIdsInUpdate(isInUpdate: false);
        }
        func getOutgoingRequestIds() -> RequestIds? {
            return outgoingRequestIds;
        }
        
        func markIncomingRequestIdsInUpdate(isInUpdate: Bool = true) {
            incomingRequestIdsInProgress = isInUpdate;
            fireUpdateEvent();
//            println("marked incoming request ids in progress: \(isInUpdate)");
        }
        func isIncomingRequestIdsInUpdate() -> Bool {
            return incomingRequestIdsInProgress;
        }
        func setIncomingRequestIds(requestIds: RequestIds) {
            incomingRequestIds = requestIds;
            notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED, requestId: nil, responseId: nil);

            markIncomingRequestIdsInUpdate(isInUpdate: false);
        }
        func getIncomingRequestIds() -> RequestIds? {
            return incomingRequestIds;
        }
        
        func markRequestInUpdate(requestId: Int, isInUpdate: Bool = true) {
            requestsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                requestsInProgress.removeValueForKey(requestId);
            }
            
            fireUpdateEvent();
//            println("marked request \(requestId) in progress: \(isInUpdate)");
        }
        func isRequestInUpdate(requestId: Int) -> Bool {
            return requestsInProgress[requestId] != nil;
        }
        func setRequest(requestId: Int, request: RequestObject) {
            requests.updateValue(request, forKey: requestId);
            notifyCacheListeners(CacheChangeEvent.TYPE_REQUEST_CHANGED, requestId: requestId, responseId: nil);

            markRequestInUpdate(requestId, isInUpdate: false);
        }
        func getRequest(requestId: Int) -> RequestObject? {
            return requests[requestId];
        }

        func markIncomingResponseIdsInUpdate(requestId: Int, isInUpdate: Bool = true) {
            incomingResponseIdsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                incomingResponseIdsInProgress.removeValueForKey(requestId);
            }

            fireUpdateEvent();
//            println("marked incoming response ids for \(requestId) in progress: \(isInUpdate)");
        }
        func isIncomingResponseIdsInUpdate(requestId: Int) -> Bool {
            return incomingResponseIdsInProgress[requestId] != nil;
        }
        func setIncomingResponseIds(requestId: Int, responseIds: ResponseIds) {
            incomingResponseIds.updateValue(responseIds, forKey: requestId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);
            
            markIncomingResponseIdsInUpdate(requestId, isInUpdate: false);
        }
        func getIncomingResponseIds(requestId: Int) -> ResponseIds? {
            return incomingResponseIds[requestId];
        }

        func markOutgoingResponseIdsInUpdate(requestId: Int, isInUpdate: Bool = true) {
            outgoingResponseIdsInProgress.updateValue(isInUpdate, forKey: requestId);
            if (!isInUpdate) {
                outgoingResponseIdsInProgress.removeValueForKey(requestId);
            }
            
            fireUpdateEvent();
//            println("marked outgoing response ids for \(requestId) in progress: \(isInUpdate)");
        }
        func isOutgoingResponseIdsInUpdate(requestId: Int) -> Bool {
            return outgoingResponseIdsInProgress[requestId] != nil;
        }
        func setOutgoingResponseIds(requestId: Int, responseIds: ResponseIds) {
            outgoingResponseIds.updateValue(responseIds, forKey: requestId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED, requestId: requestId, responseId: nil);

            markOutgoingResponseIdsInUpdate(requestId, isInUpdate: false);
        }
        func getOutgoingResponseIds(requestId: Int) -> ResponseIds? {
            return outgoingResponseIds[requestId];
        }
        
        func markResponseInUpdate(requestId: Int, responseId: Int, isInUpdate: Bool = true) {
            responsesInProgress.updateValue(isInUpdate, forKey: responseId);
            if (!isInUpdate) {
                responsesInProgress.removeValueForKey(responseId);
            }

            fireUpdateEvent();
//            println("marked response \(responseId) in progress: \(isInUpdate)");
        }
        func isResponseInUpdate(requestId: Int, responseId: Int) -> Bool {
            return responsesInProgress[responseId] != nil;
        }
        func setResponse(requestId: Int, responseId: Int, response: ResponseObject) {
            responses.updateValue(response, forKey: responseId);
            self.notifyCacheListeners(CacheChangeEvent.TYPE_RESPONSE_CHANGED, requestId: requestId, responseId: responseId);

            markResponseInUpdate(requestId, responseId: responseId, isInUpdate: false);
        }
        func getResponse(requestId: Int, responseId: Int) -> ResponseObject? {
            return responses[responseId];
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
        
        private func notifyCacheListeners(type: String!, requestId: Int!, responseId: Int!) {
            dispatch_async(dispatch_get_main_queue(), {
                var event: CacheChangeEvent = CacheChangeEvent(type: type, requestId: requestId, responseId: responseId);
                //            println("Event: type=\(type), request=\(requestId), response=\(responseId)");
                for (key, listener) in self.cacheChangeListeners.get() {
                    listener(event);
                }
            });
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
