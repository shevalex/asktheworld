//
//  UIUtils.swift
//  AWT
//
//  Created by Oleg Burakov on 26/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class Tools: UIViewController
{
    func displayPopup(popupTitle:String, popupError:String) {
        var popup = UIAlertController(title: popupTitle, message: popupError, preferredStyle: UIAlertControllerStyle.Alert)
        popup.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { action in }))
        //self.presentViewController(popup, animated: true, completion: nil)
    }
}
