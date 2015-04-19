//
//  AtwUIViewController.swift
//  AWT
//
//  Created by Anton Avtamonov on 4/18/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class AtwUIViewController: UIViewController {
    private var keyboardSensitiveConstraint: NSLayoutConstraint!
    private var offset: CGFloat!
    private var initialContraintValue: CGFloat!
    
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String? = nil;
    private var spinnerEnabled: Bool = true;
    
    
    func setSensitiveConstraint(keyboardSensitiveConstraint: NSLayoutConstraint, offset: CGFloat) {
        self.keyboardSensitiveConstraint = keyboardSensitiveConstraint;
        self.offset = offset;
    }
    
    func enableSpinner(enable: Bool) {
        self.spinnerEnabled = enable;
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad();
        
        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
                AtwUiUtils.showSpinner(self.view, disableInput: false);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
                AtwUiUtils.hideSpinner();
            }
        }
    }
    
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        if (keyboardSensitiveConstraint != nil) {
            NSNotificationCenter.defaultCenter().removeObserver(self);
        }
        
        if (spinnerEnabled && Backend.getInstance() != nil) {
            Backend.getInstance().removeCacheChangeListener(updateListenerId!);
            AtwUiUtils.hideSpinner();
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);

        if (spinnerEnabled && Backend.getInstance() != nil) {
            updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener, listenerId: nil);
            
            if (Backend.getInstance().isCacheInUpdate()) {
                AtwUiUtils.showSpinner(self.view, disableInput: false);
            }
        }
        
        if (keyboardSensitiveConstraint != nil) {
            let notificationCenter = NSNotificationCenter.defaultCenter();
            notificationCenter.addObserver(self, selector: "keyboardWillShow:", name: UIKeyboardWillShowNotification, object: nil);
            notificationCenter.addObserver(self, selector: "keyboardWillHide:", name: UIKeyboardWillHideNotification, object: nil);
        }
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        self.view.endEditing(true);
        return false;
    }
    
    override func touchesBegan(touches: Set<NSObject>, withEvent event: UIEvent) {
        view.endEditing(true);
    }
    
    
    
    func keyboardWillShow(sender: NSNotification) {
        if (keyboardSensitiveConstraint == nil) {
            return;
        }
        
        let info: NSDictionary = sender.userInfo!
        let value: NSValue = info.valueForKey(UIKeyboardFrameEndUserInfoKey) as! NSValue;
        let keyboardSize: CGSize = value.CGRectValue().size;

        initialContraintValue = keyboardSensitiveConstraint.constant;
        keyboardSensitiveConstraint.constant = keyboardSize.height - offset;
        
        view.layoutSubviews();
    }
    
    func keyboardWillHide(sender: NSNotification) {
        if (keyboardSensitiveConstraint == nil) {
            return;
        }
        
        keyboardSensitiveConstraint.constant = initialContraintValue;
        
        view.layoutSubviews();
    }
}