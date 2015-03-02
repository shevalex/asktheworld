//
//  UIUtils.swift
//  AWT
//
//  Created by Oleg Burakov on 26/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

struct AtwUiUtils {
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
        if (activityIndicator != nil) {
            self.hideSpinner();
        }
        
        activityIndicator = UIActivityIndicatorView();
        
        activityIndicator.center = anchor.center;
        activityIndicator.hidesWhenStopped = true;
        activityIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray;
        anchor.addSubview(activityIndicator);
        
        UIApplication.sharedApplication().beginIgnoringInteractionEvents();
        activityIndicator.startAnimating();
    }
    static func hideSpinner() {
        if (activityIndicator != nil) {
            UIApplication.sharedApplication().endIgnoringInteractionEvents();
            activityIndicator.stopAnimating();
            
            activityIndicator = nil;
        }
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
    
    

    class PickerDelegate: NSObject, UIPickerViewDelegate {
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
    }

    
    static func setDataPicker(boundTextField: UITextField!, items: [Configuration.Item]) -> UIPickerViewDelegate {

        var pickerDelegate = PickerDelegate(items: items, boundInputElement: boundTextField);
        var picker = UIPickerView();
        picker.delegate = pickerDelegate;
        boundTextField.inputView = picker;
        
        return pickerDelegate;
    }
}
