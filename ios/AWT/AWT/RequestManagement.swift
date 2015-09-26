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
    func getObjectId(index: Int!) -> Int?;
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
    func getObjectProvider(objectId: Int) -> GenericObjectProvider;
}


struct RequestResponseManagement {
    typealias ObjectSelectionObserver = (id: Int) -> Void

    private static var mapping: NSCache! = NSCache()
    
    
    class UIObjectTableDelegate: NSObject, UITableViewDelegate {
        private let dataModel: AbstractUIObjectDataModel!
        private let selectionObserver: ObjectSelectionObserver?

        
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
            let objectId = dataModel.getObjectId(indexPath);
            selectionObserver?(id: objectId!);
        }
        
        func tableView(tableView: UITableView, editActionsForRowAtIndexPath indexPath: NSIndexPath) -> [UITableViewRowAction]? {
            return dataModel.getRowActions();
        }
    }
    
    class AbstractUIObjectDataModel: NSObject, UITableViewDataSource {
        private var dataProvider: GenericObjectProvider!
        private let rowActions: [UITableViewRowAction]?
        
        init(dataProvider: GenericObjectProvider, actions: [UITableViewRowAction]?) {
            self.dataProvider = dataProvider;
            self.rowActions = actions;
        }
        
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            let count: Int? = dataProvider.count();
            return count != nil ? count! : 0;
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            let tableCell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell?;
            
            renderTableCell(tableCell, id: getObjectId(indexPath)!);
            
            return tableCell;
        }
        
        func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        }
        
        
        func getRowActions() -> [UITableViewRowAction]? {
            return rowActions;
        }

        //To be overriden
        func renderTableCell(cell: UITableViewCell, id: Int) {
        }
        
        private func getObjectId(indexPath: NSIndexPath) -> Int? {
            return dataProvider.getObjectId(indexPath.row);
        }
    }
    
    
    
    
    // Requests support
    
    class OutgoingRequestsDataModel: AbstractUIObjectDataModel {
        override func renderTableCell(cell: UITableViewCell, id: Int) {
            let tableCell: OutgoingRequestTableCell = cell as! OutgoingRequestTableCell;

            let request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                tableCell.targetLabel.text = String.localizedStringWithFormat(NSLocalizedString("To %@", comment: "To Target Group"), Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender));
                tableCell.requestTextLabel.text = request.text;
                
                let dateTime = NSDate(timeIntervalSince1970: request.time / 1000);
                let dateFormatter = NSDateFormatter();
                dateFormatter.dateStyle = NSDateFormatterStyle.ShortStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.NoStyle;
                tableCell.dateLabel.text = dateFormatter.stringFromDate(dateTime);
                
                dateFormatter.dateStyle = NSDateFormatterStyle.NoStyle;
                dateFormatter.timeStyle = NSDateFormatterStyle.ShortStyle;
                tableCell.timeLabel.text = dateFormatter.stringFromDate(dateTime);

                let numOfUnreadResponses: Int? = Backend.getInstance().getIncomingResponseIds(id, responseStatus: Backend.ResponseObject.STATUS_UNVIEWED)?.count;
                
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
        override func renderTableCell(cell: UITableViewCell, id: Int) {
            
            let tableCell: IncomingRequestTableCell = cell as! IncomingRequestTableCell;
            
            let request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                tableCell.sourceLabel.text = String.localizedStringWithFormat(NSLocalizedString("The World asked you a %@ question", comment: "Incoming inquiry source"), Configuration.toExpertiseString(request.expertiseCategory));
                tableCell.requestTextLabel.text = request.text;
                
                let dateTime = NSDate(timeIntervalSince1970: request.time / 1000);
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
        
        func getObjectId(index: Int!) -> Int? {
            var requestIds = getObjectIds();
            if (requestIds != nil) {
                return requestIds![index];
            } else {
                return nil;
            }
        }
        
        func count() -> Int? {
            let requestIds = getObjectIds();
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
                    let objectIds: [Int]? = self.getObjectIds();
                    if (objectIds != nil) {
                        self.updateObserver?(finished: true);
                        observer(index: -1);
                    }
                } else {
                    let eventObjectId: Int? = self.getObjectIdForChangeEvent(event);
                    if (eventObjectId != nil) {
                        let objectIds: [Int]? = self.getObjectIds();
                        if (objectIds != nil) {
                            for (index, objectId) in objectIds!.enumerate() {
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
            cacheChangeListenerId = Backend.getInstance().addCacheChangeListener(cacheChangeListener, listenerId: nil);
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
        
        func getObjectIds() -> [Int]? {
            return nil;
        }

        func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return false;
        }

        func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> Int? {
            return nil;
        }
    }
    
    class AbstractResponseProviderFactory: ObjectProviderFactory {
        private var providers: Dictionary<Int, GenericObjectProvider> = Dictionary();
        private var responseStatus: String?;
        
        init(responseStatus: String?) {
            self.responseStatus = responseStatus;
        }
        
        func getObjectProvider(objectId: Int) -> GenericObjectProvider {
            var provider: GenericObjectProvider? = providers[objectId];
            if (provider == nil) {
                provider = createObjectProvider(objectId, responseStatus: responseStatus);
                providers.updateValue(provider!, forKey: objectId);
            }
            
            return provider!;
        }
        
        func createObjectProvider(requestId: Int, responseStatus: String?) -> GenericObjectProvider? {
            return nil;
        }
    }
    

    
    class OutgoingRequestObjectProvider: AbstractObjectProvider {
        override func getObjectIds() -> [Int]? {
            return Backend.getInstance().getOutgoingRequestIds(Backend.RequestObject.STATUS_ACTIVE);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> Int? {
            return event.requestId;
        }
    }
    
    class OutgoingRequestWithResponsesObjectProvider: OutgoingRequestObjectProvider {
        private let responseProviderFactory: AbstractResponseProviderFactory;
        
        init(responseStatus: String) {
            responseProviderFactory = IncomingResponseProviderFactory(responseStatus: responseStatus);
        }
        
        
        override func getObjectIds() -> [Int]? {
            let requestIds: [Int]? = Backend.getInstance().getOutgoingRequestIds(Backend.RequestObject.STATUS_ACTIVE);
            if (requestIds == nil) {
                return nil;
            }
            
            var matchingRequestIds: [Int] = [];
            for (_, requestId) in requestIds!.enumerate() {
                let responseProvider = responseProviderFactory.getObjectProvider(requestId);
                let responseCount = responseProvider.count();

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
        private var requestId: Int;
        private var responseStatus: String?;
        
        init(requestId: Int, responseStatus: String?) {
            self.requestId = requestId;
            self.responseStatus = responseStatus;
        }
        
        override func getObjectIds() -> [Int]? {
            return Backend.getInstance().getIncomingResponseIds(requestId, responseStatus: responseStatus);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> Int? {
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
        override func createObjectProvider(requestId: Int, responseStatus: String?) -> GenericObjectProvider? {
            return IncomingResponseObjectProvider(requestId: requestId, responseStatus: responseStatus);
        }
    }
    
    
    class IncomingRequestObjectProvider: AbstractObjectProvider {
        override func getObjectIds() -> [Int]? {
            return Backend.getInstance().getIncomingRequestIds(Backend.RequestObject.STATUS_ACTIVE);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
        }

        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> Int? {
            return event.requestId;
        }
    }
    
    
    class IncomingRequestWithoutResponsesObjectProvider: IncomingRequestObjectProvider {
        private let responseProviderFactory: AbstractResponseProviderFactory;
        
        override init() {
            responseProviderFactory = OutgoingResponseProviderFactory(responseStatus: nil);
        }
        

        override func getObjectIds() -> [Int]? {
            let requestIds: [Int]? = Backend.getInstance().getIncomingRequestIds(Backend.RequestObject.STATUS_ACTIVE);
            if (requestIds == nil) {
                return nil;
            }
            
            
            var matchingRequestIds: [Int] = [];
            for (_, requestId) in requestIds!.enumerate() {
                let responseProvider = responseProviderFactory.getObjectProvider(requestId);
                let responseCount = responseProvider.count();
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
        private var requestId: Int;
        private var responseStatus: String?;
        
        init(requestId: Int, responseStatus: String?) {
            self.requestId = requestId;
            self.responseStatus = responseStatus;
        }
        
        override func getObjectIds() -> [Int]? {
            return Backend.getInstance().getOutgoingResponseIds(requestId, responseStatus: responseStatus);
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> Int? {
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
        override func createObjectProvider(requestId: Int, responseStatus: String?) -> GenericObjectProvider? {
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
                        let responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestProvider.getObjectId(requestIndex)!);
                        
                        responseProvider.count();
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
            
            let requestCount = requestProvider.count();
            for (var requestIndex = 0; requestIndex < requestCount; requestIndex++) {
                let responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestProvider.getObjectId(requestIndex)!);
                
                responseProvider.count();
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
            
            let requests = requestProvider.count();
            
            if (requests != nil) {
                requestCount = requests;
                
                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
                    let requestId = requestProvider.getObjectId(reqIndex);
                    
                    let responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId!);
                    let responses = responseProvider.count();
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

            let result: (requestCount: Int?, responseCount: Int?) = calculate();
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
    
    
    private class UpdateRequestCallback: BackendCallback {
        private let tableView: UITableView;
        
        init(tableView: UITableView) {
            self.tableView = tableView;
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                //self.showErrorMessage(NSLocalizedString("Server Error", comment: "Error message"));
            });
        }
        func onSuccess() {
            AtwUiUtils.runOnMainThread({
                self.tableView.reloadData();
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                //self.showErrorMessage(NSLocalizedString("Failed to update a request", comment: "Failed to update request"));
            });
        }
    }
    
    static func attachOutgoingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {

        
        let deactivateAction = UITableViewRowAction(style: UITableViewRowActionStyle.Normal, title: NSLocalizedString("Deactivate", comment: "Deactivate outgoing request action"), handler: {(action, path) in

            let requestId = requestObjectProvider.getObjectId(path.row);
            if (requestId != nil) {
                let request = Backend.getInstance().getRequest(requestId!);
                if (request != nil) {
                    request!.status = Backend.RequestObject.STATUS_INACTIVE;
                    Backend.getInstance().updateRequest(requestId!, request: request!, callback: UpdateRequestCallback(tableView: tableView));
                }
            }
        });
        deactivateAction.backgroundColor = UIColor.redColor();
        
        attachRequestObjectProvider(tableView, dataModel: OutgoingRequestsDataModel(dataProvider: requestObjectProvider, actions: [deactivateAction]), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }

    static func attachIncomingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        let ignoreAction = UITableViewRowAction(style: UITableViewRowActionStyle.Normal, title: NSLocalizedString("Ignore", comment: "Ignore incoming request action"), handler: {(action, path) in
            
            let requestId = requestObjectProvider.getObjectId(path.row);
            if (requestId != nil) {
                Backend.getInstance().removeIncomingRequest(requestId!, callback: nil);
            }
        });
        ignoreAction.backgroundColor = UIColor.orangeColor();

        attachRequestObjectProvider(tableView, dataModel: IncomingRequestsDataModel(dataProvider: requestObjectProvider, actions: [ignoreAction]), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }
    
    
    
    private static func attachRequestObjectProvider(tableView: UITableView, dataModel: AbstractUIObjectDataModel, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        var delegate: AnyObject? = mapping.objectForKey(tableView);
        if (delegate != nil) {
            tableView.delegate = (delegate as! UITableViewDelegate);
            tableView.dataSource = delegate!.getDataModel();
            return;
        }
        
        delegate = UIObjectTableDelegate(dataModel: dataModel, selectionObserver: selectionObserver);
        tableView.delegate = delegate as? UITableViewDelegate;
        tableView.dataSource = dataModel;
        
        requestObjectProvider.setChangeObserver({(index) -> Void in
            tableView.reloadData();
        });
        
        requestObjectProvider.setUpdateObserver({(finished) -> Void in
            tableView.alpha = finished ? 1 : 0;
        });
        
        mapping.setObject(delegate!, forKey: tableView);
    }
}
