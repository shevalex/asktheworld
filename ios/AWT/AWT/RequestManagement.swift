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

protocol GenericObjectProvider {
    func getObjectId(index: Int!) -> String;
    func count() -> Int;
    func setChangeObserver(observer: ((index: Int?) -> Void)!);
    func setUpdateObserver(observer: ObjectUpdateObserver!);
}

protocol GenericObjectCounter {
    func getNumberOfRequests() -> Int;
    func getNumberOfResponses() -> Int;
    func start();
    func stop();
    func setUpdateObserver(observer: ObjectUpdateObserver!);
}

protocol ObjectProviderFactory {
    func getObjectProvider(objectId: String!) -> GenericObjectProvider;
}


struct RequestManagement {
    typealias RequestSelectionObserver = (requestId: String) -> Void;

    private static var mapping: NSCache! = NSCache();
    
    
    class UIRequestTableDelegate: NSObject, UITableViewDelegate {
        private var dataModel: UIRequestDataModel!;
        private var selectionObserver: RequestSelectionObserver?;
        
        init(dataModel: UIRequestDataModel, selectionObserver: RequestSelectionObserver?) {
            self.dataModel = dataModel;
            self.selectionObserver = selectionObserver;
        }
        
        func getDataModel() -> UIRequestDataModel! {
            return dataModel;
        }
        
        func tableView(tableView: UITableView, shouldHighlightRowAtIndexPath indexPath: NSIndexPath) -> Bool {
            return true;
        }
        
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
            var requestId = dataModel.getRequestId(indexPath);
            selectionObserver?(requestId: requestId);
        }
    }
    
    class UIRequestDataModel: NSObject, UITableViewDataSource {
        private var dataProvider: GenericObjectProvider!
        
        init(dataProvider: GenericObjectProvider) {
            self.dataProvider = dataProvider;
        }
        
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return dataProvider.count();
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            var tableCell: UITableViewCell! = tableView.dequeueReusableCellWithIdentifier("cell") as? UITableViewCell;
            if (tableCell == nil) {
                tableCell = UITableViewCell(style: UITableViewCellStyle.Subtitle, reuseIdentifier: "cell");
            }
            
            tableCell.backgroundColor = AtwUiUtils.getColor("OUTGOING_REQUEST_BACKGROUND_COLOR");
            
            var request: Backend.RequestObject! = Backend.getInstance().getRequest(getRequestId(indexPath));
            if (request != nil) {
                var targetPrefix = AtwUiUtils.getLocalizedString("OUTGOING_REQUEST_TARGET_PREFIX");
                tableCell.textLabel!.text = "\(targetPrefix) \(Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender))";
                tableCell.detailTextLabel!.text = request.text;
                tableCell.detailTextLabel!.textColor = AtwUiUtils.getColor("OUTGOING_REQUEST_TEXT_COLOR");
                tableCell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator;
                //        tableCell.imageView?.image = UIImage(named: "outgoing_arrow.png");
                //        tableCell.selectionStyle = UITableViewCellSelectionStyle.Gray;
            } else {
                tableCell.textLabel!.text = "";
                tableCell.detailTextLabel!.text = "...";
            }
            
            return tableCell;
        }
        
        
        private func getRequestId(indexPath: NSIndexPath) -> String {
            return dataProvider.getObjectId(indexPath.row);
        }
    }
    
    
    class ActiveOutgoingRequestObjectProvider: GenericObjectProvider {
        private var cacheChangeListener: Backend.CacheChangeEventObserver? = nil;
        private var updateObserver: ObjectUpdateObserver? = nil;
        
        func getObjectId(index: Int!) -> String {
            return Backend.getInstance().getOutgoingRequestIds()![index];
        }
        
        func count() -> Int {
            var requestIds = Backend.getInstance().getOutgoingRequestIds();
            if (requestIds == nil) {
                self.updateObserver?(finished: false);
                return 0;
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
                if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
                    self.updateObserver?(finished: true);
                    observer(index: -1);
                } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                    if (event.requestId != nil) {
                        for (index, requestId) in enumerate(Backend.getInstance().getOutgoingRequestIds()!) {
                            if (requestId == event.requestId) {
                                observer(index: index);
                                break;
                            }
                        }
                    } else {
                        observer(index: -1);
                    }
                }
            };
            Backend.getInstance().addCacheChangeListener(cacheChangeListener!);
        }
        
        func setUpdateObserver(observer: ObjectUpdateObserver!) {
            self.updateObserver = observer;
        }
        
        deinit {
            if (cacheChangeListener != nil) {
                Backend.getInstance().removeCacheChangeListener(cacheChangeListener!);
            }
        }
    }
    
    class ActiveIncomingResponseObjectProvider: GenericObjectProvider {
        private var requestId: String!;
        private var cacheChangeListener: Backend.CacheChangeEventObserver? = nil;
        private var updateObserver: ObjectUpdateObserver? = nil;
        
        init(requestId: String!) {
            self.requestId = requestId;
        }
        
        func getObjectId(index: Int!) -> String {
            return getResponseIds()![index];
        }
        
        func count() -> Int {
            var responseIds = getResponseIds();
            if (responseIds == nil) {
                self.updateObserver?(finished: false);
                return 0;
            }
            
            return responseIds!.count;
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
                if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED && event.requestId == self.requestId) {
                    self.updateObserver?(finished: true);
                    observer(index: -1);
                } else if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED) {
                    if (event.requestId == self.requestId && event.responseId != nil) {
                        for (index, responseId) in enumerate(self.getResponseIds()!) {
                            if (responseId == event.responseId) {
                                observer(index: index);
                                break;
                            }
                        }
                    } else {
                        observer(index: -1);
                    }
                }
            };
            Backend.getInstance().addCacheChangeListener(cacheChangeListener!);
        }
        
        func setUpdateObserver(observer: ObjectUpdateObserver!) {
            self.updateObserver = observer;
        }
        
        deinit {
            if (cacheChangeListener != nil) {
                Backend.getInstance().removeCacheChangeListener(cacheChangeListener!);
            }
        }
        
        private func getResponseIds() -> [String]? {
            return Backend.getInstance().getIncomingResponseIds(requestId, responseStatus: Backend.ResponseObject.STATUS_UNREAD);
        }
    }
    
    class ActiveResponseProviderFactory: ObjectProviderFactory {
        private var providers: Dictionary<String, GenericObjectProvider> = Dictionary();
        
        func getObjectProvider(objectId: String!) -> GenericObjectProvider {
            var provider: GenericObjectProvider? = providers[objectId];
            if (provider == nil) {
                provider = ActiveIncomingResponseObjectProvider(requestId: objectId);
                providers.updateValue(provider!, forKey: objectId);
            }
            
            return provider!;
        }
    }
    
    
    
    class ActiveRequestsAndResponsesCounter {
        private var requestProvider: GenericObjectProvider!;
        private var responseProviderFactory: ObjectProviderFactory!;

        private var requestUpdateObserver: ObjectUpdateObserver!;
        private var responseUpdateObserver: ObjectUpdateObserver!;
        
        private var counterUpdateObserver: ObjectUpdateObserver?;
        
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
        
        func setUpdateObserver(observer: ObjectUpdateObserver!) {
            counterUpdateObserver = observer;
        }
        
        
        private func recalculate() {
            var requestCount = requestProvider.count();
            for (var reqIndex: Int = 0; reqIndex < requestCount; reqIndex++) {
                var requestId = requestProvider.getObjectId(reqIndex);
                
                var responseProvider: GenericObjectProvider = responseProviderFactory.getObjectProvider(requestId);
                
                var responseCount = responseProvider.count();
                for (var responseIndex = 0; responseIndex < self.requestCount; responseIndex++) {
                    responseProvider.setUpdateObserver(nil);
                }
            }
            
            counterUpdateObserver?(finished: false);
        }
    }
    
    
    
    static func attachRequestObjectProvider(tableView: UITableView, requestObjectProvider: GenericObjectProvider, selectionObserver: RequestSelectionObserver? = nil) {

//        tableView.rowHeight = CGFloat(30);
        
        var delegate: AnyObject? = mapping.objectForKey(tableView);
        if (delegate != nil) {
            tableView.delegate = (delegate as UITableViewDelegate);
            tableView.dataSource = delegate!.getDataModel();
            return;
        }

        var dataModel = UIRequestDataModel(dataProvider: requestObjectProvider);
        delegate = UIRequestTableDelegate(dataModel: dataModel, selectionObserver);
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
