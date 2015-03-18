//
//  ViewController.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class HomePage: UIViewController {

    @IBOutlet weak var outgoingRequestsTableView: UITableView!
    @IBOutlet weak var incomingRequestsTableView: UITableView!
    @IBOutlet weak var numOfOutgoingRequestsLabel: UILabel!
    @IBOutlet weak var numOfIncomingRequestsLabel: UILabel!
    
    var requestIdtoSend: String!;
    
    var updateListener: Backend.CacheChangeEventObserver!;
    
    private var outgoingRequestCounter: GenericObjectCounter!;
    private var incomingRequestCounter: GenericObjectCounter!;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true;

        var outgoingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.requestIdtoSend = id;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        var incomingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.performSegueWithIdentifier("showInquiryDetails", sender: self)
        }
        
        RequestResponseManagement.attachOutgoingRequestObjectProvider(outgoingRequestsTableView, requestObjectProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), outgoingRequestSelectionObserver);

        RequestResponseManagement.attachIncomingRequestObjectProvider(incomingRequestsTableView, requestObjectProvider: RequestResponseManagement.IncomingRequestWithResponsesObjectProvider(), incomingRequestSelectionObserver);
        
        outgoingRequestCounter = RequestResponseManagement.ActiveOutgoingRequestsAndResponsesCounter(requestProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.IncomingResponseProviderFactory(responseStatus: Backend.ResponseObject.STATUS_UNREAD));
        outgoingRequestCounter.setChangeObserver({(requests: Int!, responses: Int!) in
            self.numOfOutgoingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d unviewed responses for your %d requests", comment: "Home page - num of active requests"), responses, requests);
        });

        incomingRequestCounter = RequestResponseManagement.ActiveUnansweredIncomingRequestsCounter(requestProvider: RequestResponseManagement.IncomingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.OutgoingResponseProviderFactory(responseStatus: nil));
        incomingRequestCounter.setChangeObserver({(requests: Int!, responses: Int!) in
            self.numOfIncomingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d inquiries required your attention", comment: "Home page - num of unanswered inquiries"), requests);
        });

        
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

        outgoingRequestsTableView.reloadData();
        incomingRequestsTableView.reloadData();

        outgoingRequestCounter.start();
        incomingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        Backend.getInstance().removeCacheChangeListener(updateListener);
        
        outgoingRequestCounter.stop();
        incomingRequestCounter.stop();
    }
}

