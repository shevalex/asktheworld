//
//  UIUtils.swift
//  AWT
//
//  Created by Oleg Burakov on 26/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

struct AwtUiUtils {
    static let localizationBundles: NSMutableDictionary! = NSMutableDictionary();
    
    static func loadLocalizationBundle(bundleName: String) -> NSDictionary! {
        var bundleData: AnyObject? = localizationBundles.valueForKey(bundleName);
        if (bundleData == nil) {
            let bundlePath = NSBundle.mainBundle().pathForResource(bundleName, ofType: "strings")!;
            bundleData = NSDictionary(contentsOfFile: bundlePath);
            localizationBundles.setValue(bundleData, forKey: bundleName);
        }
        
        return bundleData as NSDictionary;
    }
    
    static func getLocalizedString(bundleName: String, keyName: String) -> String {
        let value: AnyObject? = loadLocalizationBundle(bundleName).valueForKey(keyName);
        if (value != nil) {
            return value as String;
        } else {
            return keyName + "--Not Found";
        }
    }
    
    static func getUIUtilsLocalizedString(keyName: String) -> String {
        return getLocalizedString("uiutils", keyName: keyName);
    }
    
    
    
    
    
    static func showPopup(anchor: UIViewController, popupTitle: String, popupError: String, okCallback: (() -> Void)? = nil) {
        var popup = UIAlertController(title: popupTitle, message: popupError, preferredStyle: UIAlertControllerStyle.Alert)
        popup.addAction(UIAlertAction(title: AwtUiUtils.getUIUtilsLocalizedString("OK_BUTTON"), style: .Default, handler: { action in }))
        anchor.presentViewController(popup, animated: true, completion: okCallback)
    }
}
