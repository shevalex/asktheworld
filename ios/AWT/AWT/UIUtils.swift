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
    static let resourceBundles: NSMutableDictionary! = NSMutableDictionary();
    
    static var activityIndicator: UIActivityIndicatorView! = nil;
    
    
    // Resource management
    private static func loadBundle(bundleName: String, type: String, bundleCollection: NSMutableDictionary) -> NSDictionary! {
        var bundleData: AnyObject? = bundleCollection.valueForKey(bundleName);
        if (bundleData == nil) {
            let bundlePath = NSBundle.mainBundle().pathForResource(bundleName, ofType: type)!;
            bundleData = NSDictionary(contentsOfFile: bundlePath);
            bundleCollection.setValue(bundleData, forKey: bundleName);
        }
        
        return bundleData as NSDictionary;
    }
    
    static func loadLocalizationBundle(bundleName: String) -> NSDictionary! {
        return loadBundle(bundleName, type: "strings", bundleCollection: localizationBundles);
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
    

    
    static func loadResourceBundle(bundleName: String) -> NSDictionary! {
        return loadBundle(bundleName, type: "plist", bundleCollection: resourceBundles);
    }
    
    static func getResource(bundleName: String, keyName: String) -> AnyObject? {
        return loadResourceBundle(bundleName).valueForKey(keyName);
    }
    
    static func getStyleResource(keyName: String) -> AnyObject? {
        return loadResourceBundle("styles").valueForKey(keyName);
    }
    
    static func getColor(keyName: String) -> UIColor? {
        let value: AnyObject? = getStyleResource(keyName);
        if (value != nil) {
            let colorArray: Array<Int> = value as Array<Int>;
            let red: CGFloat = CGFloat(colorArray[0]) / 255;
            let green: CGFloat = CGFloat(colorArray[1]) / 255;
            let blue: CGFloat = CGFloat(colorArray[2]) / 255;
            let alpha: CGFloat = colorArray.count > 3 ? CGFloat(colorArray[3]) / 100 : 1;
            return UIColor(red: red, green: green, blue: blue, alpha: alpha);
        } else {
            return nil;
        }
    }
    

    // UI Management
    
    static func showSpinner(anchor: UIView!, disableInput: Bool! = true) {
        if (activityIndicator == nil) {
            activityIndicator = UIActivityIndicatorView();
            
            activityIndicator.center = anchor.center;
            activityIndicator.hidesWhenStopped = true;
            activityIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray;
        } else {
            hideSpinner();
        }

        anchor.addSubview(activityIndicator);
        
        if (disableInput == true) {
            UIApplication.sharedApplication().beginIgnoringInteractionEvents();
        }
        activityIndicator.startAnimating();
    }
    static func hideSpinner() {
        if (activityIndicator == nil) {
            return;
        }
        
        if (activityIndicator.superview == nil) {
            return;
        }
        
        if (UIApplication.sharedApplication().isIgnoringInteractionEvents()) {
            UIApplication.sharedApplication().endIgnoringInteractionEvents();
        }
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
    

    
    static func setDataChooser(boundTextField: UITextField!, items: [Configuration.Item], multichoice: Bool! = false) -> SelectorView! {
        
        var chooserView: SelectorView! = DataChooserFactory.createDataChooser(boundTextField, items: items, multichoice: multichoice);
        boundTextField.inputView = chooserView;
        
        return chooserView;
    }
}