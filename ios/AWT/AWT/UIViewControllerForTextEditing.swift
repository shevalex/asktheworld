//
//  UIViewControllerForTextEditing.swift
//  AWT
//
//  Created by Anton Avtamonov on 4/18/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class UIViewControllerForTextEditing: UIViewController {
    private var keyboardSensitiveConstraint: NSLayoutConstraint!
    private var offset: CGFloat!
    
    private var initialContraintValue: CGFloat!

    
    func setSensitiveConstraint(keyboardSensitiveConstraint: NSLayoutConstraint, offset: CGFloat) {
        self.keyboardSensitiveConstraint = keyboardSensitiveConstraint;
        self.offset = offset;
    }
    
    override func viewWillAppear(animated: Bool) {
        let notificationCenter = NSNotificationCenter.defaultCenter();
        notificationCenter.addObserver(self, selector: "keyboardWillShow:", name: UIKeyboardWillShowNotification, object: nil);
        notificationCenter.addObserver(self, selector: "keyboardWillHide:", name: UIKeyboardWillHideNotification, object: nil);
    }
    
    override func viewWillDisappear(animated: Bool) {
        NSNotificationCenter.defaultCenter().removeObserver(self);
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        self.view.endEditing(true);
        return false;
    }
    
    override func touchesBegan(touches: Set<NSObject>, withEvent event: UIEvent) {
        view.endEditing(true);
    }
    
    
    
    func keyboardWillShow(sender: NSNotification) {
        let info: NSDictionary = sender.userInfo!
        let value: NSValue = info.valueForKey(UIKeyboardFrameEndUserInfoKey) as! NSValue;
        let keyboardSize: CGSize = value.CGRectValue().size;

        initialContraintValue = keyboardSensitiveConstraint.constant;
        keyboardSensitiveConstraint.constant = keyboardSize.height - offset;
    }
    
    func keyboardWillHide(sender: NSNotification) {
        keyboardSensitiveConstraint.constant = initialContraintValue;
    }
}