//
//  ActiveRequestsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 11/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ActiveRequestsPage: AtwUIViewController {
    @IBOutlet weak var outgoingRequestsTableView: UITableView!
    @IBOutlet weak var numOfOutgoingRequestsLabel: UILabel!
    
    private var outgoingRequestCounter: GenericObjectCounter!;
    private var requestIdtoSend: Int!;
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let outgoingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.requestIdtoSend = id;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        
        RequestResponseManagement.attachOutgoingRequestObjectProvider(outgoingRequestsTableView, requestObjectProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), selectionObserver: outgoingRequestSelectionObserver);
        
        outgoingRequestCounter = RequestResponseManagement.RequestsResponsesCounter(requestProvider: RequestResponseManagement.OutgoingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.IncomingResponseProviderFactory(responseStatus: Backend.ResponseObject.STATUS_UNVIEWED));
        outgoingRequestCounter.setChangeObserver({(requests: Int?, responses: Int?) in
            self.numOfOutgoingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d unviewed responses for your %d requests", comment: "Active requests page - num of active requests"), (responses != nil ? responses : 0)!, (requests != nil ? requests : 0)!);
        });
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        outgoingRequestsTableView.reloadData();
        
        outgoingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        outgoingRequestCounter.stop();
    }
    

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showRequestDetails") {
            let destView = segue.destinationViewController as! RequestDetailsPage;
            destView.requestId = requestIdtoSend;
            destView.responseStatus = nil;
        }
    }
}
