//
//  RequestManagement.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/6/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit;


typealias ObjectUpdateObserver = (finished: Bool) -> Void;
typealias ObjectCounterObserver = (requests: Int?, responses: Int?) -> Void;

protocol GenericObjectProvider {
    func getObjectId(index: Int!) -> String?;
    func count() -> Int?;
    func setChangeObserver(observer: ((index: Int?) -> Void)!);
    func setUpdateObserver(observer: ObjectUpdateObserver!);
}

protocol GenericObjectCounter {
    func getNumberOfRequests() -> Int?;
    func getNumberOfResponses() -> Int?;
    func start();
    func stop();
    func setChangeObserver(observer: ObjectCounterObserver);
}

protocol ObjectProviderFactory {
    func getObjectProvider(objectId: String!) -> GenericObjectProvider;
}


struct RequestResponseManagement {
    typealias ObjectSelectionObserver = (id: String) -> Void;

    private static var mapping: NSCache! = NSCache();
    
    
    class UIObjectTableDelegate: NSObject, UITableViewDelegate {
        private var dataModel: AbstractUIObjectDataModel!;
        private var selectionObserver: ObjectSelectionObserver?;
        
        init(dataModel: AbstractUIObjectDataModel, selectionObserver: ObjectSelectionObserver?) {
            self.dataModel = dataModel;
            self.selectionObserver = selectionObserver;
        }
        
        func getDataModel() -> AbstractUIObjectDataModel! {
            return dataModel;
        }
        
        func tableView(tableView: UITableView, shouldHighlightRowAtIndexPath indexPath: NSIndexPath) -> Bool {
            return true;
        }
        
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
            var objectId = dataModel.getObjectId(indexPath);
            selectionObserver?(id: objectId!);
        }
        
        

        
        func tableView(tableView: UITableView, editingStyleForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCellEditingStyle {
            
            return UITableViewCellEditingStyle.Delete;
        }
//        func tableView(tableView: UITableView, titleForDeleteConfirmationButtonForRowAtIndexPath indexPath: NSIndexPath) -> String! {
//            
//            return "Jopa";
//        }
        
        func tableView(tableView: UITableView, editActionsForRowAtIndexPath indexPath: NSIndexPath) -> [AnyObject]? {
            let ackAction:UITableViewRowAction = UITableViewRowAction(style: UITableViewRowActionStyle.Normal, title: "Ack", handler: {(action, path) in
                
            });
            ackAction.backgroundColor = UIColor.orangeColor()
            
            let closeAction:UITableViewRowAction = UITableViewRowAction(style: UITableViewRowActionStyle.Default, title: "Close", handler: {(action, path) in
                
            });
            closeAction.backgroundColor = UIColor.blackColor()
            
            return [closeAction, ackAction];
        }
    }
    
    class AbstractUIObjectDataModel: NSObject, UITableViewDataSource {
        private var dataProvider: GenericObjectProvider!
        
        init(dataProvider: GenericObjectProvider) {
            self.dataProvider = dataProvider;
        }
        
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            var count: Int? = dataProvider.count();
            return count != nil ? count! : 0;
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            var tableCell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier("cell") as? UITableViewCell;
            
            renderTableCell(tableCell, id: getObjectId(indexPath)!);
            
            return tableCell;
        }
        
        
        func renderTableCell(cell: UITableViewCell, id: String) {
        }
        
        
        private func getObjectId(indexPath: NSIndexPath) -> String? {
            return dataProvider.getObjectId(indexPath.row);
        }
    }
    
    
    
    
    // Requests support
    
    class OutgoingRequestsDataModel: AbstractUIObjectDataModel {
        override func renderTableCell(cell: UITableViewCell, id: String) {
            let tableCell: OutgoingRequestTableCell = cell as OutgoingRequestTableCell;

            var request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                tableCell.targetLabel.text = String.localizedStringWithFormat(NSLocalizedString("To %@", comment: "To Target Group"), Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender));
                tableCell.requestTextLabel.text = request.text;
                
                let dateTime = NSDate(timeIntervalSince1970: request.time);
                let dateFormatter = NSDateFormatter();
                dateFormatter.dateStyle = NSDateFormatterStyle.ShortStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.NoStyle;
                tableCell.dateLabel.text = dateFormatter.stringFromDate(dateTime);

                dateFormatter.dateStyle = NSDateFormatterStyle.NoStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.ShortStyle;
                tableCell.timeLabel.text = dateFormatter.stringFromDate(dateTime);

                var numOfUnreadResponses: Int? = Backend.getInstance().getIncomingResponseIds(id, responseStatus: Backend.ResponseObject.STATUS_UNREAD)?.count;
                
                if (numOfUnreadResponses == nil) {
                    tableCell.counterLabel.text = "...";
                } else {
                    tableCell.counterLabel.text = "\(numOfUnreadResponses!)";
                }
                
                
                let responseIds = Backend.getInstance().getIncomingResponseIds(id, responseStatus: nil);
                if (responseIds == nil || responseIds!.count == 0) {
                    tableCell.backgroundColor = AtwUiUtils.getColor("OUTGOING_REQUEST_NO_RESPONSES_BACKGROUND_COLOR");
                } else {
                    tableCell.backgroundColor = AtwUiUtils.getColor("OUTGOING_REQUEST_WITH_RESPONSES_BACKGROUND_COLOR");
                }
            } else {
                tableCell.targetLabel.text = "";
                tableCell.dateLabel.text = "";
                tableCell.timeLabel.text = "";
                tableCell.counterLabel.text = "";
                tableCell.requestTextLabel.text = "...";
            }
        }
    }

    class IncomingRequestsDataModel: AbstractUIObjectDataModel {
        override func renderTableCell(cell: UITableViewCell, id: String) {
            
            let tableCell: IncomingRequestTableCell = cell as IncomingRequestTableCell;
            
            var request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                tableCell.sourceLabel.text = String.localizedStringWithFormat(NSLocalizedString("The World asked you a %@ question", comment: "Incoming inquiry source"), Configuration.toExpertiseString(request.expertiseCategory));
                tableCell.requestTextLabel.text = request.text;
                
                let dateTime = NSDate(timeIntervalSince1970: request.time);
                let dateFormatter = NSDateFormatter();
                dateFormatter.dateStyle = NSDateFormatterStyle.ShortStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.NoStyle;
                tableCell.dateLabel.text = dateFormatter.stringFromDate(dateTime);
                
                dateFormatter.dateStyle = NSDateFormatterStyle.NoStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.ShortStyle;
                tableCell.timeLabel.text = dateFormatter.stringFromDate(dateTime);

                let responseIds = Backend.getInstance().getOutgoingResponseIds(id, responseStatus: nil);
                if (responseIds == nil || responseIds!.count == 0) {
                    tableCell.backgroundColor = AtwUiUtils.getColor("INCOMING_REQUEST_NO_RESPONSE_BACKGROUND_COLOR");
                } else {
                    tableCell.backgroundColor = AtwUiUtils.getColor("INCOMING_REQUEST_WITH_RESPONSE_BACKGROUND_COLOR");
                }
            } else {
                tableCell.sourceLabel.text = "";
                tableCell.dateLabel.text = "";
                tableCell.timeLabel.text = "";
                tableCell.requestTextLabel.text = "...";
            }
        }
    }
    
    
    class AbstractObjectProvider: GenericObjectProvider {
        private var cacheChangeListenerId: String? = nil;
        private var updateObserver: ObjectUpdateObserver? = nil;
        
        func getObjectId(index: Int!) -> String? {
            var requestIds = getObjectIds();
            if (requestIds != nil) {
                return requestIds![index];
            } else {
                return nil;
            }
        }
        
        func count() -> Int? {
            var requestIds = getObjectIds();
            if (requestIds == nil) {
                self.updateObserver?(finished: false);
                return nil;
            }
            
            return requestIds!.count;
        }
        
        func setChangeObserver(observer: ((index: Int?) -> Void)!) {
            if (observer == nil) {
                if (cacheChangeListenerId != nil) {
                    Backend.getInstance().removeCacheChangeListener(cacheChangeListenerId!);
                    cacheChangeListenerId = nil;
                }
                
                return;
            }
            
            let cacheChangeListener: Backend.CacheChangeEventObserver = {(event) in
                if (self.isObjectIdsChangeEvent(event)) {
                    var objectIds: [String]? = self.getObjectIds();
                    if (objectIds != nil) {
                        self.updateObserver?(finished: true);
                        observer(index: -1);
                    }
                } else {
                    var eventObjectId: String? = self.getObjectIdForChangeEvent(event);
                    if (eventObjectId != nil) {
                        var objectIds: [String]? = self.getObjectIds();
                        if (objectIds != nil) {
                            for (index, objectId) in enumerate(objectIds!) {
                                if (objectId == eventObjectId) {
                                    self.updateObserver?(finished: true);
                                    observer(index: index);
                                    break;
                                }
                            }
                        }
                    }
                }
            };
            cacheChangeListenerId = Backend.getInstance().addCacheChangeListener(cacheChangeListener);
        }
        
        func setUpdateObserver(observer: ObjectUpdateObserver!) {
            self.updateObserver = observer;
            if (cacheChangeListenerId == nil) {
                // this is needed to trigger update notifications;
                setChangeObserver({(index: Int?) in /*intentionally do nothing*/});
            }
        }
        
        deinit {
            if (cacheChangeListenerId != nil) {
                Backend.getInstance().removeCacheChangeListener(cacheChangeListenerId!);
            }
        }
        
        func getObjectIds() -> [String]? {
            return nil;
        }

        func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return false;
        }

        func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            return nil;
        }
    }
    
    class AbstractResponseProviderFactory: ObjectProviderFactory {
        private var providers: Dictionary<String, GenericObjectProvider> = Dictionary();
        private var responseStatus: String?;
        
        init(responseStatus: String?) {
            self.responseStatus = responseStatus;
        }
        
        func getObjectProvider(objectId: String!) -> GenericObjectProvider {
            var provider: GenericObjectProvider? = providers[objectId];
            if (provider == nil) {
                provider = createObjectProvider(objectId, responseStatus: responseStatus);
                providers.updateValue(provider!, forKey: objectId);
            }
            
            return provider!;
        }
        
        func createObjectProvider(requestId: String, responseStatus: String?) -> GenericObjectProvider? {
            return nil;
        }
    }
    

    
    class OutgoingRequestObjectProvider: AbstractObjectProvider {
        override func getObjectIds() -> [String]? {
            return Backend.getInstance().getOutgoingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            return event.requestId;
        }
    }
    
    class OutgoingRequestWithResponsesObjectProvider: OutgoingRequestObjectProvider {
        private let responseProviderFactory: AbstractResponseProviderFactory;
        
        init(responseStatus: String) {
            responseProviderFactory = IncomingResponseProviderFactory(responseStatus: responseStatus);
        }
        
        
        override func getObjectIds() -> [String]? {
            let requestIds: [String]? = Backend.getInstance().getOutgoingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
            if (requestIds == nil) {
                return nil;
            }
            
            var matchingRequestIds: [String] = [];
            for (index, requestId) in enumerate(requestIds!) {
                var responseProvider = responseProviderFactory.getObjectProvider(requestId);
                var responseCount = responseProvider.count();

                if (responseCount == nil) {
                    //return nil;
                } else if (responseCount > 0) {
                    matchingRequestIds.append(requestId);
                }
            }
            
            return matchingRequestIds;
        }
    }
    
    
    class IncomingResponseObjectProvider: AbstractObjectProvider {
        private var requestId: String;
        private var responseStatus: String?;
        
        init(requestId: String, responseStatus: String?) {
            self.requestId = requestId;
            self.responseStatus = responseStatus;
        }
        
        override func getObjectIds() -> [String]? {
            return Backend.getInstance().getIncomingResponseIds(requestId, responseStatus: responseStatus);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            if (event.type != Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                return nil;
            }
            if (event.requestId != self.requestId) {
                return nil;
            }
            
            return event.responseId;
        }
    }
    
    class IncomingResponseProviderFactory: AbstractResponseProviderFactory {
        override func createObjectProvider(requestId: String, responseStatus: String?) -> GenericObjectProvider? {
            return IncomingResponseObjectProvider(requestId: requestId, responseStatus: responseStatus);
        }
    }
    
    
    class IncomingRequestObjectProvider: AbstractObjectProvider {
        override func getObjectIds() -> [String]? {
            return Backend.getInstance().getIncomingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
        }

        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            return event.requestId;
        }
    }
    
    
    class IncomingRequestWithoutResponsesObjectProvider: IncomingRequestObjectProvider {
        private let responseProviderFactory: AbstractResponseProviderFactory;
        
        override init() {
            responseProviderFactory = OutgoingResponseProviderFactory(responseStatus: nil);
        }
        

        override func getObjectIds() -> [String]? {
            let requestIds: [String]? = Backend.getInstance().getIncomingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
            if (requestIds == nil) {
                return nil;
            }
            
            
            var matchingRequestIds: [String] = [];
            for (index, requestId) in enumerate(requestIds!) {
                var responseProvider = responseProviderFactory.getObjectProvider(requestId);
                var responseCount = responseProvider.count();
                if (responseCount == nil) {
                    //return nil;
                } else if (responseCount == 0) {
                    matchingRequestIds.append(requestId);
                }
            }
            
            return matchingRequestIds;
        }
    }
    
    class OutgoingResponseObjectProvider: AbstractObjectProvider {
        private var requestId: String;
        private var responseStatus: String?;
        
        init(requestId: String, responseStatus: String?) {
            self.requestId = requestId;
            self.responseStatus = responseStatus;
        }
        
        override func getObjectIds() -> [String]? {
            return Backend.getInstance().getOutgoingResponseIds(requestId, responseStatus: responseStatus);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            if (event.type != Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                return nil;
            }
            if (event.requestId != self.requestId) {
                return nil;
            }
            
            return event.responseId;
        }
    }
    
    class OutgoingResponseProviderFactory: AbstractResponseProviderFactory {
        override func createObjectProvider(requestId: String, responseStatus: String?) -> GenericObjectProvider? {
            return OutgoingResponseObjectProvider(requestId: requestId, responseStatus: responseStatus);
        }
    }

    
    
    
    
    
    class RequestsResponsesCounter: GenericObjectCounter {
        private var requestProvider: GenericObjectProvider!;
        private var responseProviderFactory: ObjectProviderFactory!;

        private var requestUpdateObserver: ObjectUpdateObserver!;
        private var responseUpdateObserver: ObjectUpdateObserver!;
        
        private var counterChangeObserver: ObjectCounterObserver?;
        
        private var requestCount: Int?;
        private var responseCount: Int?;
        
        init(requestProvider: GenericObjectProvider!, responseProviderFactory: ObjectProviderFactory!) {
            self.requestProvider = requestProvider;
            self.responseProviderFactory = responseProviderFactory;
            
            self.responseUpdateObserver = {(finished: Bool) in
                if (finished) {
                    self.recalculate();
                }
            }
            
            self.requestUpdateObserver = {(finished: Bool) in
                if (finished) {
                    self.requestCount = requestProvider.count();
                    
                    for (var requestIndex = 0; requestIndex < self.requestCount; requestIndex++) {
                        var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestProvider.getObjectId(requestIndex));
                        
                        var responseCount = responseProvider.count();
                        for (var responseIndex = 0; responseIndex < self.requestCount; responseIndex++) {
                            responseProvider.setUpdateObserver(self.responseUpdateObserver);
                        }
                    }
                    
                    self.recalculate();
                }
            }
        }
        
        func getNumberOfRequests() -> Int? {
            return requestCount;
        }
        
        func getNumberOfResponses() -> Int? {
            return responseCount;
        }
        
        func start() {
            self.requestProvider.setUpdateObserver(requestUpdateObserver);
            
            recalculate();
        }
        
        func stop() {
            self.requestProvider.setUpdateObserver(nil);
            
            var requestCount = requestProvider.count();
            for (var requestIndex = 0; requestIndex < requestCount; requestIndex++) {
                var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestProvider.getObjectId(requestIndex));
                
                var responseCount = responseProvider.count();
                for (var responseIndex = 0; responseIndex < self.requestCount; responseIndex++) {
                    responseProvider.setUpdateObserver(nil);
                }
            }
        }
        
        func setChangeObserver(observer: ObjectCounterObserver) {
            counterChangeObserver = observer;
        }
        
        deinit {
            stop();
        }
        
        
        func calculate() -> (requestCount: Int?, responseCount: Int?) {
            var requestCount: Int? = nil;
            var responseCount: Int? = nil;
            
            var requests = requestProvider.count();
            
            if (requests != nil) {
                requestCount = requests;
                
                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
                    var requestId = requestProvider.getObjectId(reqIndex);
                    
                    var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
                    var responses = responseProvider.count();
                    if (responses != nil) {
                        responseCount = responseCount != nil ? responseCount! + responses! : responses!;
                    }
                }
            }
            
            return (requestCount, responseCount);
        }
        
        private func recalculate() {
            self.requestCount = nil;
            self.responseCount = nil;

            var result: (requestCount: Int?, responseCount: Int?) = calculate();
            requestCount = result.requestCount;
            responseCount = result.responseCount;

            if (requestCount != nil || responseCount != nil) {
                counterChangeObserver?(requests: requestCount, responses: responseCount);
            }
        }
    }
    
    
//    class ActiveOutgoingRequestsAndResponsesCounter: AbstractRequestsAndResponsesCounter {
//        override func calculate() -> (requestCount: Int?, responseCount: Int?) {
//            var requestCount: Int? = nil;
//            var responseCount: Int? = nil;
//            
//            var requests = requestProvider.count();
//            
//            if (requests != nil) {
//                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
//                    var requestId = requestProvider.getObjectId(reqIndex);
//                    
//                    var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
//                    
//                    var responses = responseProvider.count();
//                    if (responses > 0) {
//                        requestCount = requestCount != nil ? requestCount! + 1 : 1;
//                        responseCount = responseCount != nil ? responseCount! + responses! : responses!;
//                    }
//                }
//            }
//            
//            return (requestCount, responseCount);
//        }
//    }
//
//    class ActiveUnansweredIncomingRequestsCounter: AbstractRequestsAndResponsesCounter {
//        override func calculate() -> (requestCount: Int?, responseCount: Int?) {
//            var requestCount: Int? = nil;
//
//            var requests = requestProvider.count();
//
//            if (requests != nil) {
//                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
//                    var requestId = requestProvider.getObjectId(reqIndex);
//                    
//                    var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
//                    var responses = responseProvider.count();
//                    if (responses == 0) {
//                        requestCount = requestCount != nil ? requestCount! + 1 : 1;
//                    }
//                }
//            }
//            
//            return (requestCount, nil);
//        }
//    }
    
    
    
    static func attachOutgoingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        attachRequestObjectProvider(tableView, dataModel: OutgoingRequestsDataModel(dataProvider: requestObjectProvider), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }

    static func attachIncomingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        attachRequestObjectProvider(tableView, dataModel: IncomingRequestsDataModel(dataProvider: requestObjectProvider), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }
    
    
    
    private static func attachRequestObjectProvider(tableView: UITableView, dataModel: AbstractUIObjectDataModel, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        var delegate: AnyObject? = mapping.objectForKey(tableView);
        if (delegate != nil) {
            tableView.delegate = (delegate as UITableViewDelegate);
            tableView.dataSource = delegate!.getDataModel();
            return;
        }
        
        delegate = UIObjectTableDelegate(dataModel: dataModel, selectionObserver);
        tableView.delegate = delegate as? UITableViewDelegate;
        tableView.dataSource = dataModel;
        
        requestObjectProvider.setChangeObserver({(index) -> Void in
            tableView.reloadData();
        });
        
        requestObjectProvider.setUpdateObserver({(finished) -> Void in
            tableView.alpha = finished ? 1 : 0;
        });
        
        tableView.setEditing(true, animated: false);
        
        mapping.setObject(delegate!, forKey: tableView);
    }
}
