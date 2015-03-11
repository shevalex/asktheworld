//
//  RequestManagement.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/6/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit;


protocol GenericObjectProvider {
    func getObjectId(index: Int!) -> String;
    func count() -> Int;
    func setChangeObserver(observer: ((index: Int?) -> Void)!);
    func setUpdateObserver(observer: ((finished: Bool) -> Void)!);
}


struct RequestManagement {
    private static var mapping: NSCache! = NSCache();
    
    typealias RequestSelectionObserver = (requestId: String) -> Void;
    
    
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
        private var updateObserver: ((finished: Bool) -> Void)? = nil;
        
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
        
        func setUpdateObserver(observer: ((finished: Bool) -> Void)!) {
            self.updateObserver = observer;
        }
        
        deinit {
            if (cacheChangeListener != nil) {
                Backend.getInstance().removeCacheChangeListener(cacheChangeListener!);
            }
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
