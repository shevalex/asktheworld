//
//  ViewController.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class HomePage: UIViewController {

    @IBOutlet weak var activeRequestsLabel: UILabel!
    @IBOutlet weak var requestTableView: UITableView!
    @IBOutlet weak var activeResponsesLabel: UILabel!
    @IBOutlet weak var responseTableView: UITableView!
    
    var requestIdtoSend: String!;
    
    var updateListener: Backend.CacheChangeEventObserver!;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true;

        var selectionObserver: RequestManagement.RequestSelectionObserver = { (requestId) in
            self.requestIdtoSend = requestId;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        RequestManagement.attachRequestObjectProvider(requestTableView, requestObjectProvider: RequestManagement.ActiveOutgoingRequestObjectProvider(), selectionObserver);
        
        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
                AtwUiUtils.showSpinner(self.view, disableInput: false);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
                AtwUiUtils.hideSpinner();
            }
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showRequestDetails") {
            let destView = segue.destinationViewController as RequestDetailsPage
            destView.requestId = requestIdtoSend
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillAppear(animated: Bool) {
        Backend.getInstance().addCacheChangeListener(updateListener);
        requestTableView.reloadData();
    }
    
    override func viewWillDisappear(animated: Bool) {
        Backend.getInstance().removeCacheChangeListener(updateListener);
    }
}

