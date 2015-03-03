//
//  UIUtils.swift
//  AWT
//
//  Created by Oleg Burakov on 26/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

public struct AtwUiUtils {
    static let localizationBundles: NSMutableDictionary! = NSMutableDictionary();
    
    static var activityIndicator: UIActivityIndicatorView! = nil;
    
    static func loadLocalizationBundle(bundleName: String) -> NSDictionary! {
        var bundleData: AnyObject? = localizationBundles.valueForKey(bundleName);
        if (bundleData == nil) {
            let bundlePath = NSBundle.mainBundle().pathForResource(bundleName, ofType: "strings")!;
            bundleData = NSDictionary(contentsOfFile: bundlePath);
            localizationBundles.setValue(bundleData, forKey: bundleName);
        }
        
        return bundleData as NSDictionary;
    }
    
    static func getBundleLocalizedString(bundleName: String, keyName: String) -> String {
        let value: AnyObject? = loadLocalizationBundle(bundleName).valueForKey(keyName);
        if (value != nil) {
            return value as String;
        } else {
            return keyName + "--Not Found";
        }
    }
    
    static func getLocalizedString(keyName: String) -> String {
        return getBundleLocalizedString("uiutils", keyName: keyName);
    }
    
    
    static func showSpinner(anchor: UIView!) {
        if (activityIndicator == nil) {
            activityIndicator = UIActivityIndicatorView();
            
            activityIndicator.center = anchor.center;
            activityIndicator.hidesWhenStopped = true;
            activityIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray;
        } else {
            hideSpinner();
        }

        anchor.addSubview(activityIndicator);
        
        UIApplication.sharedApplication().beginIgnoringInteractionEvents();
        activityIndicator.startAnimating();
    }
    static func hideSpinner() {
        if (activityIndicator == nil) {
            return;
        }
        
        UIApplication.sharedApplication().endIgnoringInteractionEvents();
        activityIndicator.stopAnimating();
        
        activityIndicator.removeFromSuperview();
    }
    
    
    static func showPopup(anchor: UIViewController, popupTitle: String, popupError: String, okCallback: (() -> Void)? = nil) {
        var popup = UIAlertController(title: popupTitle, message: popupError, preferredStyle: UIAlertControllerStyle.Alert)
        popup.addAction(UIAlertAction(title: AtwUiUtils.getLocalizedString("OK_BUTTON"), style: .Default, handler: { action in }))
        anchor.presentViewController(popup, animated: true, completion: okCallback)
    }
    
    static func isEmailValid(email: String) -> Bool! {
        //TODO: implement
        return true;
    }
    
    static func isPasswordValid(password: String!) -> Bool! {
        //TODO: implement
        return countElements(password) >= 5;
    }
    
    static func runOnMainThread(block: dispatch_block_t!) {
        dispatch_async(dispatch_get_main_queue(), block);
    }
    

    
    
/*
    class PickerDelegate: NSObject, UIPickerViewDelegate, UIGestureRecognizerDelegate {
        private let items: [Configuration.Item]!;
        private let boundInputElement: UITextField!;
        
        init(items: [Configuration.Item], boundInputElement: UITextField) {
            self.items = items;
            self.boundInputElement = boundInputElement;
        }
        
        func numberOfComponentsInPickerView(pickerView: UIPickerView!) -> Int {
            return 1;
        }
        func pickerView(pickerView: UIPickerView!, numberOfRowsInComponent component: Int) -> Int {
            return items.count + 1;
        }
        func pickerView(pickerView: UIPickerView!, titleForRow row: Int, forComponent component: Int) -> String! {
            return row == 0 ? "<unset>" : items[row - 1].getDisplay();
        }
        func pickerView(pickerView: UIPickerView!, didSelectRow row: Int, inComponent component: Int)
        {
            boundInputElement.text = row == 0 ? "" : items[row - 1].getDisplay();
        }
        func pickerView(pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusingView view: UIView!) -> UIView {
            
            var renderView: UIButton!;
            if (renderView == nil) {
                renderView = UIButton();
                
                renderView.backgroundColor = UIColor.greenColor();
                renderView.setTitleColor(UIColor.blueColor(), forState: .Normal);
                renderView.setTitleColor(UIColor.redColor(), forState: UIControlState.Selected);
                
                renderView.addTarget(self, action: "Action:", forControlEvents: .TouchUpInside);
            } else {
                renderView = view as UIButton;
            }

            renderView.setTitle(self.pickerView(pickerView, titleForRow: row, forComponent: component), forState: .Normal);
            
            let image: UIImage! = UIImage(named: "close.png");
            renderView.setImage(image, forState: .Normal)
            
            return renderView;
        }
        
        func pickerTouched() {
            println("JOPA!");
        }
        
        func gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer) -> Bool {
            println("PIZDEC");
            return true;
        }
        
        func gestureRecognizer(gestureRecognizer: UIGestureRecognizer, shouldReceiveTouch touch: UITouch) -> Bool {
            
            println("PIZDEC2");
            return true;
        }

        
    }
    
    static func setDataPicker(boundTextField: UITextField!, items: [Configuration.Item]) -> UIPickerViewDelegate {

        var pickerDelegate = PickerDelegate(items: items, boundInputElement: boundTextField);
        var picker = UIPickerView();
        picker.backgroundColor = UIColor.whiteColor();
        picker.delegate = pickerDelegate;
        boundTextField.inputView = picker;
        
        
        let tap = UITapGestureRecognizer(target: pickerDelegate, action: "pickerTouched");
        tap.numberOfTouchesRequired = 1;
        tap.numberOfTapsRequired = 2;
        picker.addGestureRecognizer(tap);
        tap.delegate = pickerDelegate;
        
        return pickerDelegate;
    }
*/
    
    class UIDataSelectorDelegate: NSObject, UITableViewDelegate {
        private var dataModel: UIDataSelectorDataModel!;
        private var boundTextField: UITextField!;
        
        private var selectedItems: [Configuration.Item] = [];
        
        init(anchor: UITextField!, dataModel: UIDataSelectorDataModel) {
            self.boundTextField = anchor;
            self.dataModel = dataModel;
        }
        
        func tableView(tableView: UITableView, shouldHighlightRowAtIndexPath indexPath: NSIndexPath) -> Bool {
            return true;
        }
        
        func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
            
            selectedItems.append(dataModel.getDataItem(indexPath));
            
            updateSelection();
        }
        func tableView(tableView: UITableView, didDeselectRowAtIndexPath indexPath: NSIndexPath) {
            
            var deselectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
            for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
                if (deselectedItem.data === selectedItems[i].data) {
                    selectedItems.removeAtIndex(i);
                    break;
                }
            }
            
            
            updateSelection();
        }
        
        
        private func updateSelection() {
            var text: String! = "";
            if (selectedItems.count > 0) {
                text = selectedItems[0].getDisplay();
            }
            
            for (var i: Int! = 1; i < selectedItems.count; i = i.successor()) {
                text = "\(text), \(selectedItems[i].getDisplay())";
            }
            
            boundTextField.text = text;
        }
    }
    
    class UIDataSelectorDataModel: NSObject, UITableViewDataSource {
        private var data: [Configuration.Item]!
        
        init(data: [Configuration.Item]) {
            self.data = data;
        }
        
        func getDataItem(indexPath: NSIndexPath) -> Configuration.Item {
            return getDataItem(indexPath.row);
        }
        
        func getDataItem(index: Int) -> Configuration.Item {
            return data[index];
        }
        
        func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return data.count;
        }
        
        func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
            
            var tableCell: UITableViewCell! = UITableViewCell();
            tableCell.backgroundColor = UIColor.blueColor();
            
            tableCell.textLabel?.text = getDataItem(indexPath).getDisplay();
            tableCell.textLabel?.textAlignment = .Center;
            
            tableCell.textLabel?.backgroundColor = UIColor.greenColor();
            
            return tableCell;
        }
    }
    
    static func setDataChooser(boundTextField: UITextField!, items: [Configuration.Item]) -> UIDataSelectorDelegate {
        
        var numOfRowsToShow = items.count > 5 ? 5: items.count;
        var height = 45 * numOfRowsToShow;
        
        var tableView: UITableView! = UITableView(frame: CGRect(x: 0, y: 0, width: 0, height: height));
        
        var toolbar = UIToolbar()
        toolbar.barStyle = UIBarStyle.Default
        toolbar.sizeToFit()
        var toolbarButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: tableView, action: nil) //need to add some action and right view
        toolbar.setItems([toolbarButton], animated: true)
        boundTextField.inputAccessoryView = toolbar
        
        var dataModel = UIDataSelectorDataModel(data: items);
        var dataSelectorDelegate: UIDataSelectorDelegate! = UIDataSelectorDelegate(anchor: boundTextField, dataModel: dataModel);
        tableView.delegate = dataSelectorDelegate;
        tableView.dataSource = dataSelectorDelegate.dataModel;
        boundTextField.inputView = tableView;
        
        tableView.backgroundColor = UIColor.redColor();
        
        return dataSelectorDelegate;
    }

}
