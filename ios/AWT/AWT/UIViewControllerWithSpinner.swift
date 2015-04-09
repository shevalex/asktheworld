//
//  UIViewControllerWithSpinner.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/24/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class UIViewControllerWithSpinner: UIViewController {
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String? = nil;
    
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
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener, listenerId: nil);
        
        if (Backend.getInstance().isCacheInUpdate()) {
            AtwUiUtils.showSpinner(self.view, disableInput: false);
        }
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        Backend.getInstance().removeCacheChangeListener(updateListenerId!);
        AtwUiUtils.hideSpinner();
    }
}