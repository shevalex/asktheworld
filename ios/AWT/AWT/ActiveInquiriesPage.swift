//
//  ActiveInquiriesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 18/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ActiveInquiriesPage: UIViewController {
    @IBOutlet weak var incomingRequestsTableView: UITableView!
    @IBOutlet weak var numOfIncomingRequestsLabel: UILabel!

    private var selectedRequestId: String!;
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var incomingRequestCounter: GenericObjectCounter!;

    override func viewDidLoad() {
        super.viewDidLoad()

        var incomingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.selectedRequestId = id;
            self.performSegueWithIdentifier("showInquiryDetails", sender: self)
        }
        
        
        RequestResponseManagement.attachIncomingRequestObjectProvider(incomingRequestsTableView, requestObjectProvider: RequestResponseManagement.IncomingRequestObjectProvider(), incomingRequestSelectionObserver);
        
        
        incomingRequestCounter = RequestResponseManagement.RequestsResponsesCounter(requestProvider: RequestResponseManagement.IncomingRequestObjectProvider(), responseProviderFactory: RequestResponseManagement.OutgoingResponseProviderFactory(responseStatus: nil));
        incomingRequestCounter.setChangeObserver({(requests: Int?, responses: Int?) in
            self.numOfIncomingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d active inquiries", comment: "Active Inquiries page - num of active inquiries"), (requests != nil ? requests : 0)!);
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
    

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showInquiryDetails") {
            let destView = segue.destinationViewController as InquiryDetailsPage;
            destView.requestId = selectedRequestId;
        }
    }

    override func viewWillAppear(animated: Bool) {
        Backend.getInstance().addCacheChangeListener(updateListener);
        
        incomingRequestsTableView.reloadData();
        
        incomingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        Backend.getInstance().removeCacheChangeListener(updateListener);
        
        incomingRequestCounter.stop();
    }
}
