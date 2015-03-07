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
//        var selectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
//        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
//            if (selectedItem.data === selectedItems[i].data) {
//                return;
//            }
//        }
    }
    func tableView(tableView: UITableView, didDeselectRowAtIndexPath indexPath: NSIndexPath) {
//        var deselectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
//        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
//            if (deselectedItem.data === selectedItems[i].data) {
//                selectedItems.removeAtIndex(i);
//                break;
//            }
//        }
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
            tableCell = UITableViewCell(style: .Default, reuseIdentifier: "cell");
        }
        
        var request: Backend.RequestObject! = getRequest(indexPath);
        
        tableCell.textLabel?.text = request.text;
        tableCell.textLabel?.textAlignment = .Center;
        tableCell.textLabel?.textColor = UIColor(red: 0, green: 122/255, blue: 1, alpha: 1.0)
        
        return tableCell;
    }
    

    private func getRequest(indexPath: NSIndexPath) -> Backend.RequestObject {
        return dataProvider.getRequest(indexPath.row);
    }
}



struct RequestManagement {
    static private var mapping: NSCache! = NSCache();
    
    
    static func attachRequestObjectProvider(tableView: UITableView, requestObjectProvider: RequestObjectProvider) {

        tableView.rowHeight = CGFloat(30);
        
        var delegate: AnyObject? = mapping.objectForKey(tableView);
        if (delegate != nil) {
            tableView.delegate = (delegate as UITableViewDelegate);
            tableView.dataSource = delegate!.getDataModel();
            return;
        }

        var dataModel = UIRequestDataModel(dataProvider: requestObjectProvider);
        tableView.delegate = UIRequestTableDelegate(dataModel: dataModel);
        tableView.dataSource = dataModel;
        
        mapping.setObject(tableView.delegate!, forKey: tableView);
    }
}
