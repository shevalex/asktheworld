//
//  ViewController.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class HomePage: UIViewController {

    @IBOutlet weak var requestTableView: UITableView!
    @IBOutlet weak var responseTableView: UITableView!
    @IBOutlet weak var numOfRequestsLabel: UILabel!
    
    var requestIdtoSend: String!;
    
    var updateListener: Backend.CacheChangeEventObserver!;
    
    private var outgoingRequestCounter: GenericObjectCounter!;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true;

        var selectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.requestIdtoSend = id;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        RequestResponseManagement.attachRequestObjectProvider(requestTableView, requestObjectProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), selectionObserver);
        
        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
                AtwUiUtils.showSpinner(self.view, disableInput: false);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
                AtwUiUtils.hideSpinner();
            }
        }
        
        outgoingRequestCounter = RequestResponseManagement.ActiveRequestsAndResponsesCounter(requestProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.ResponseProviderFactory(responseStatus: Backend.ResponseObject.STATUS_UNREAD));
        outgoingRequestCounter.setChangeObserver({(requests: Int!, responses: Int!) in
            self.numOfRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d unviewed responses for your %d requests", comment: "Home page - num of active requests"), responses, requests);
        });
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
        
        outgoingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        Backend.getInstance().removeCacheChangeListener(updateListener);
        
        outgoingRequestCounter.stop();
    }
}

