//
//  ActiveRequestsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 11/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ActiveRequestsPage: UIViewController {
    @IBOutlet weak var outgoingRequestsTableView: UITableView!
    @IBOutlet weak var numOfOutgoingRequestsLabel: UILabel!
    
    private var outgoingRequestCounter: GenericObjectCounter!;
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var requestIdtoSend: String!;
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let outgoingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.requestIdtoSend = id;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        
        RequestResponseManagement.attachOutgoingRequestObjectProvider(outgoingRequestsTableView, requestObjectProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), outgoingRequestSelectionObserver);
        
        outgoingRequestCounter = RequestResponseManagement.RequestsResponsesCounter(requestProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.IncomingResponseProviderFactory(responseStatus: Backend.ResponseObject.STATUS_UNREAD));
        outgoingRequestCounter.setChangeObserver({(requests: Int?, responses: Int?) in
            self.numOfOutgoingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d unviewed responses for your %d requests", comment: "Home page - num of active requests"), (responses != nil ? responses : 0)!, (requests != nil ? requests : 0)!);
        });
        
        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_STARTED) {
                AtwUiUtils.showSpinner(self.view, disableInput: false);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_UPDATE_FINISHED) {
                AtwUiUtils.hideSpinner();
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    override func viewWillAppear(animated: Bool) {
        Backend.getInstance().addCacheChangeListener(updateListener);
        
        outgoingRequestsTableView.reloadData();
        
        outgoingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        Backend.getInstance().removeCacheChangeListener(updateListener);
        
        outgoingRequestCounter.stop();
    }
    

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showRequestDetails") {
            let destView = segue.destinationViewController as RequestDetailsPage;
            destView.requestId = requestIdtoSend;
        }
    }
}
