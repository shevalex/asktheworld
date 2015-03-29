//
//  ViewController.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class HomePage: UIViewControllerWithSpinner {

    @IBOutlet weak var outgoingRequestsTableView: UITableView!
    @IBOutlet weak var incomingRequestsTableView: UITableView!
    @IBOutlet weak var numOfOutgoingRequestsLabel: UILabel!
    @IBOutlet weak var numOfIncomingRequestsLabel: UILabel!
    
    private var selectedRequestId: String!;
    private var outgoingRequestCounter: GenericObjectCounter!;
    private var incomingRequestCounter: GenericObjectCounter!;
    
    override func viewDidLoad() {
        super.viewDidLoad();
        self.navigationItem.hidesBackButton = true;

        let outgoingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.selectedRequestId = id;
            self.performSegueWithIdentifier("showRequestDetails", sender: self);
        }
        
        var incomingRequestSelectionObserver: RequestResponseManagement.ObjectSelectionObserver = { (id) in
            self.selectedRequestId = id;
            self.performSegueWithIdentifier("showInquiryDetails", sender: self)
        }
        
        
        
        RequestResponseManagement.attachOutgoingRequestObjectProvider(outgoingRequestsTableView, requestObjectProvider: RequestResponseManagement.OutgoingRequestWithResponsesObjectProvider(responseStatus: Backend.ResponseObject.STATUS_UNREAD), outgoingRequestSelectionObserver);

        RequestResponseManagement.attachIncomingRequestObjectProvider(incomingRequestsTableView, requestObjectProvider: RequestResponseManagement.IncomingRequestWithoutResponsesObjectProvider(), incomingRequestSelectionObserver);
        
        outgoingRequestCounter = RequestResponseManagement.RequestsResponsesCounter(requestProvider: RequestResponseManagement.OutgoingRequestWithResponsesObjectProvider(responseStatus: Backend.ResponseObject.STATUS_UNREAD), responseProviderFactory: RequestResponseManagement.IncomingResponseProviderFactory(responseStatus: Backend.ResponseObject.STATUS_UNREAD));
        outgoingRequestCounter.setChangeObserver({(requests: Int?, responses: Int?) in
            self.numOfOutgoingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d unviewed responses for your %d requests", comment: "Home page - num of active requests"), (responses != nil ? responses : 0)!, (requests != nil ? requests : 0)!);
        });

        incomingRequestCounter = RequestResponseManagement.RequestsResponsesCounter(requestProvider: RequestResponseManagement.IncomingRequestWithoutResponsesObjectProvider(), responseProviderFactory: RequestResponseManagement.OutgoingResponseProviderFactory(responseStatus: nil));
        incomingRequestCounter.setChangeObserver({(requests: Int?, responses: Int?) in
            self.numOfIncomingRequestsLabel.text = String.localizedStringWithFormat(NSLocalizedString("You have %d inquiries required your attention", comment: "Home page - num of unanswered inquiries"), (requests != nil ? requests : 0)!);
        });
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showRequestDetails") {
            let destView = segue.destinationViewController as RequestDetailsPage;
            destView.requestId = selectedRequestId;
            destView.responseStatus = Backend.ResponseObject.STATUS_UNREAD;
        } else if (segue.identifier == "showInquiryDetails") {
            let destView = segue.destinationViewController as InquiryDetailsPage;
            destView.requestId = selectedRequestId;
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);

        outgoingRequestsTableView.reloadData();
        incomingRequestsTableView.reloadData();

        outgoingRequestCounter.start();
        incomingRequestCounter.start();
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        outgoingRequestCounter.stop();
        incomingRequestCounter.stop();
    }
}

