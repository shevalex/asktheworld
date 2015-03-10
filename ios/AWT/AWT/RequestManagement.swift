//
//  RequestManagement.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/6/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit;


protocol RequestObjectProvider {
    func getRequest(index: Int!) -> Backend.RequestObject;
    func count() -> Int;
    func setChangeObserver(observer: ((index: Int?) -> Void)!);
}


class UIRequestTableDelegate: NSObject, UITableViewDelegate {
    private var dataModel: UIRequestDataModel!;
    
    init(dataModel: UIRequestDataModel) {
        self.dataModel = dataModel;
    }
    
    func getDataModel() -> UIRequestDataModel! {
        return dataModel;
    }
    
    func tableView(tableView: UITableView, shouldHighlightRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true;
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        var request = dataModel.getRequest(indexPath);
        //TODO: open details page with the request
    }
}

class UIRequestDataModel: NSObject, UITableViewDataSource {
    private var dataProvider: RequestObjectProvider!
    
    init(dataProvider: RequestObjectProvider) {
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
        
        var request: Backend.RequestObject! = getRequest(indexPath);

        tableCell.backgroundColor = UIColor(red: 135/255, green: 225/255, blue: 200/255, alpha: 1);
        
        var targetPrefix = AtwUiUtils.getLocalizedString("OUTGOING_REQUEST_TARGET_PREFIX");
        tableCell.textLabel!.text = "\(targetPrefix) \(Configuration.toTargetGroupString(request.responseAgeGroup, gender: request.responseGender))";
        tableCell.detailTextLabel!.text = request.text;
        tableCell.detailTextLabel!.textColor = UIColor(red: 0, green: 122/255, blue: 1, alpha: 1.0)
        tableCell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator;
//        tableCell.imageView?.image = UIImage(named: "outgoing_arrow.png");
//        tableCell.selectionStyle = UITableViewCellSelectionStyle.Gray;
        
        return tableCell;
    }
    

    private func getRequest(indexPath: NSIndexPath) -> Backend.RequestObject {
        return dataProvider.getRequest(indexPath.row);
    }
}



struct RequestManagement {
    private static var mapping: NSCache! = NSCache();
    
    class ActiveOutgoingRequestObjectProvider: RequestObjectProvider {
        private var listener: ((event: Backend.CacheChangeEvent) -> Void)! = nil;
        
        func getRequest(index: Int!) -> Backend.RequestObject {
            var requestId = Backend.getInstance().getOutgoingRequestIds()[index];
            return Backend.getInstance().getRequest(requestId);
        }
        
        func count() -> Int {
            return Backend.getInstance().getOutgoingRequestIds().count;
        }
        
        func setChangeObserver(observer: ((index: Int?) -> Void)!) {
            listener = {(event) -> Void in
                if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
                    observer(index: -1);
                } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED) {
                    if (event.requestId != nil) {
                        for (index, requestId) in enumerate(Backend.getInstance().getOutgoingRequestIds()) {
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
            
            Backend.getInstance().addCacheChangeListener(listener!);
        }
        
        deinit {
            if (listener != nil) {
                Backend.getInstance().removeCacheChangeListener(listener);
            }
        }
    }
    
    
    static func attachRequestObjectProvider(tableView: UITableView, requestObjectProvider: RequestObjectProvider) {

//        tableView.rowHeight = CGFloat(30);
        
        var delegate: AnyObject? = mapping.objectForKey(tableView);
        if (delegate != nil) {
            tableView.delegate = (delegate as UITableViewDelegate);
            tableView.dataSource = delegate!.getDataModel();
            return;
        }

        var dataModel = UIRequestDataModel(dataProvider: requestObjectProvider);
        delegate = UIRequestTableDelegate(dataModel: dataModel);
        tableView.delegate = delegate as? UITableViewDelegate;
        tableView.dataSource = dataModel;
        
        requestObjectProvider.setChangeObserver({(index) -> Void in
            tableView.reloadData();
        });
        
        mapping.setObject(delegate!, forKey: tableView);
    }
    
}
