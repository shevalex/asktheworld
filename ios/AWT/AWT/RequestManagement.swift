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
typealias ObjectCounterObserver = (requests: Int!, responses: Int!) -> Void;

protocol GenericObjectProvider {
    func getObjectId(index: Int!) -> String?;
    func count() -> Int?;
    func setChangeObserver(observer: ((index: Int?) -> Void)!);
    func setUpdateObserver(observer: ObjectUpdateObserver!);
}

protocol GenericObjectCounter {
    func getNumberOfRequests() -> Int;
    func getNumberOfResponses() -> Int;
    func start();
    func stop();
    func setChangeObserver(observer: ObjectCounterObserver!);
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
            if (tableCell == nil) {
                tableCell = UITableViewCell(style: UITableViewCellStyle.Subtitle, reuseIdentifier: "cell");
            }
            
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

            tableCell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator;
            
            var request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                tableCell.targetLabel.text = String.localizedStringWithFormat(NSLocalizedString("To %@", comment: "To Target Group"), Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender));
                tableCell.requestTextLabel.text = request.text;
                
                tableCell.dateLabel.text = "3/17/15";
                tableCell.timeLabel.text = "14:55";

                tableCell.counterLabel.text = "18";
                
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
            cell.backgroundColor = AtwUiUtils.getColor("INCOMING_REQUEST_BACKGROUND_COLOR");
            
            var request: Backend.RequestObject! = Backend.getInstance().getRequest(id);
            if (request != nil) {
                cell.textLabel!.text = String.localizedStringWithFormat(NSLocalizedString("To %@", comment: "To Target Group"), Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender));
                cell.detailTextLabel!.text = request.text;
                cell.detailTextLabel!.textColor = AtwUiUtils.getColor("INCOMING_REQUEST_TEXT_COLOR");
                cell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator;
            } else {
                cell.textLabel!.text = "";
                cell.detailTextLabel!.text = "...";
            }
        }
    }
    
    
    class AbstractObjectProvider: GenericObjectProvider {
        private var cacheChangeListener: Backend.CacheChangeEventObserver? = nil;
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
                if (cacheChangeListener != nil) {
                    Backend.getInstance().removeCacheChangeListener(cacheChangeListener!);
                    cacheChangeListener = nil;
                }
                
                return;
            }
            
            cacheChangeListener = {(event) in
                if (self.isObjectIdsChangeEvent(event)) {
                    self.updateObserver?(finished: true);
                    observer(index: -1);
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
            Backend.getInstance().addCacheChangeListener(cacheChangeListener!);
        }
        
        func setUpdateObserver(observer: ObjectUpdateObserver!) {
            self.updateObserver = observer;
            if (cacheChangeListener == nil) {
                // this is needed to trigger update notifications;
                setChangeObserver({(index: Int?) in /*intentionally do nothing*/});
            }
        }
        
        deinit {
            if (cacheChangeListener != nil) {
                Backend.getInstance().removeCacheChangeListener(cacheChangeListener!);
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
            return Backend.getInstance().getOutgoingRequestIds();
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            if (event.type != Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                return nil;
            }
            
            return event.requestId;
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
            return Backend.getInstance().getIncomingRequestIds();
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            if (event.type != Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                return nil;
            }
            
            return event.requestId;
        }
    }

    class IncomingRequestWithResponsesObjectProvider: AbstractObjectProvider {
        private let responseProviderFactory: AbstractResponseProviderFactory;
        
        override init() {
            responseProviderFactory = OutgoingResponseProviderFactory(responseStatus: nil);
        }
        
        override func getObjectIds() -> [String]? {
            let requestIds: [String]? = Backend.getInstance().getIncomingRequestIds();
            if (requestIds == nil) {
                return nil;
            }
            
            
            var matchingRequestIds: [String] = [];
            for (index, requestId) in enumerate(requestIds!) {
                var responseProvider = responseProviderFactory.getObjectProvider(requestId);
                var responseCount = responseProvider.count();
                if (responseCount == nil) {
                    return nil;
                } else if (responseCount == 0) {
                    matchingRequestIds.append(requestId);
                }
            }
            
            return matchingRequestIds;
        }
        
        override func isObjectIdsChangeEvent(event: Backend.CacheChangeEvent) -> Bool {
            return event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED
                   || event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED;
        }
        
        override func getObjectIdForChangeEvent(event: Backend.CacheChangeEvent) -> String? {
            if (event.type != Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                return nil;
            }
            
            return event.requestId;
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

    
    
    
    
    
    class AbstractRequestsAndResponsesCounter: GenericObjectCounter {
        private var requestProvider: GenericObjectProvider!;
        private var responseProviderFactory: ObjectProviderFactory!;

        private var requestUpdateObserver: ObjectUpdateObserver!;
        private var responseUpdateObserver: ObjectUpdateObserver!;
        
        private var counterChangeObserver: ObjectCounterObserver?;
        
        private var requestCount: Int! = 0;
        private var responseCount: Int! = 0;
        
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
        
        func getNumberOfRequests() -> Int {
            return requestCount;
        }
        
        func getNumberOfResponses() -> Int {
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
        
        func setChangeObserver(observer: ObjectCounterObserver!) {
            counterChangeObserver = observer;
        }
        
        deinit {
            stop();
        }
        
        
        func calculate() -> (requestCount: Int?, responseCount: Int?) {
            return (nil, nil);
        }
        
        private func recalculate() {
            self.requestCount = 0;
            self.responseCount = 0;

            var result: (requestCount: Int?, responseCount: Int?) = calculate();

            if (result.requestCount != nil || result.responseCount != nil) {
                self.requestCount = result.requestCount;
                self.responseCount = result.responseCount;
                counterChangeObserver?(requests: self.requestCount, responses: self.responseCount);
            }
        }
    }
    
    
    class ActiveOutgoingRequestsAndResponsesCounter: AbstractRequestsAndResponsesCounter {
        override func calculate() -> (requestCount: Int?, responseCount: Int?) {
            var requestCount: Int? = nil;
            var responseCount: Int? = nil;
            
            var requests = requestProvider.count();
            
            if (requests != nil) {
                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
                    var requestId = requestProvider.getObjectId(reqIndex);
                    
                    var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
                    
                    var responses = responseProvider.count();
                    if (responses > 0) {
                        requestCount = requestCount != nil ? requestCount! + 1 : 1;
                        responseCount = responseCount != nil ? responseCount! + responses! : responses!;
                    }
                }
            }
            
            return (requestCount, responseCount);
        }
    }

    class ActiveUnansweredIncomingRequestsCounter: AbstractRequestsAndResponsesCounter {
        override func calculate() -> (requestCount: Int?, responseCount: Int?) {
            var requestCount: Int? = nil;

            var requests = requestProvider.count();

            if (requests != nil) {
                for (var reqIndex: Int = 0; reqIndex < requests; reqIndex++) {
                    var requestId = requestProvider.getObjectId(reqIndex);
                    
                    var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
                    var responses = responseProvider.count();
                    if (responses == 0) {
                        requestCount = requestCount != nil ? requestCount! + 1 : 1;
                    }
                }
            }
            
            return (requestCount, nil);
        }
    }
    
    
    
    static func attachOutgoingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        attachRequestObjectProvider(tableView, dataModel: OutgoingRequestsDataModel(dataProvider: requestObjectProvider), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }

    static func attachIncomingRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        attachRequestObjectProvider(tableView, dataModel: IncomingRequestsDataModel(dataProvider: requestObjectProvider), requestObjectProvider: requestObjectProvider, selectionObserver: selectionObserver);
    }
    
    
    
    private static func attachRequestObjectProvider(tableView: UITableView, dataModel: AbstractUIObjectDataModel, requestObjectProvider: GenericObjectProvider, selectionObserver: ObjectSelectionObserver? = nil) {
        
        //        tableView.rowHeight = CGFloat(30);
        
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
        
        
        mapping.setObject(delegate!, forKey: tableView);
    }
}
