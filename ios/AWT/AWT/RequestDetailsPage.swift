//
//  RequestDetailsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 10/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RequestDetailsPage: UIViewControllerWithSpinner {
    var requestId: String! //this is set from the outside before the page is brought up
    var responseStatus: String! //this is set from the outside before the page is brought up
    
    @IBOutlet weak var requestTextField: UITextView!
    @IBOutlet weak var responseTextField: UITextView!
    
    @IBOutlet weak var requestAttachmentsView: AttachmentBarView!
    @IBOutlet weak var responseAttachmentsView: AttachmentBarView!
    
    @IBOutlet weak var nextResponseButton: UIButton!
    @IBOutlet weak var previousResponseButton: UIButton!
    
    @IBOutlet weak var requestContactInfoButton: UIBarButtonItem!
    @IBOutlet weak var editRequestButton: UIBarButtonItem!
    
    
    private var responseIds: [String]?
    private var currentResponseId: String?
    
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String!;
    
    override func viewDidLoad() {
        super.viewDidLoad()

        requestAttachmentsView.setHostingViewController(self);
        requestAttachmentsView.setMutable(false);
        
        responseAttachmentsView.setHostingViewController(self);
        responseAttachmentsView.setMutable(false);
        
        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED && event.requestId == self.requestId) {
                self.responseIds = Backend.getInstance().getIncomingResponseIds(self.requestId, responseStatus: self.responseStatus);
                if (self.responseIds != nil && self.responseIds?.count > 0) {
                    var currentIndex = self.getCurrentResponseIdIndex();
                    if (currentIndex != -1) {
                        return;
                    }
                    self.currentResponseId = self.responseIds![0];
                } else if (self.responseIds?.count == 0) {
                    self.currentResponseId = "";
                } else {
                    self.currentResponseId = nil;
                }
                
                self.updateResponseFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED && event.requestId == self.requestId) {
                self.updateResponseFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
                var requestIds = Backend.getInstance().getOutgoingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
                for (index, id) in enumerate(requestIds!) {
                    if (id == self.requestId) {
                        return;
                    }
                }
                
                self.navigationController?.popViewControllerAnimated(true);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED && event.requestId == self.requestId) {
                self.updateRequestFields();
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func nextResponseClickAction(sender: UIButton) {
        var currentIndex = getCurrentResponseIdIndex();
        currentResponseId = responseIds![currentIndex + 1];
        
        updateResponseFields();
    }
    
    @IBAction func previousResponseClickAction(sender: UIButton) {
        var currentIndex = getCurrentResponseIdIndex();
        currentResponseId = responseIds![currentIndex - 1];
        
        updateResponseFields();
    }
    
    @IBAction func requestContactInfoButtonClickAction(sender: UIBarButtonItem) {
        if (currentResponseId == nil) {
            return;
        }
        
        var response = Backend.getInstance().getResponse(requestId, responseId: currentResponseId);
        if (response == nil) {
            return;
        }
        
        if (response!.contactInfo != nil) {
            updateResponseFields();
        } else if (response!.contactInfoStatus == Backend.ResponseObject.CONTACT_INFO_STATUS_NOT_AVAILABLE) {
            return;
        } else {
            Backend.getInstance().getContactInfo(requestId, responseId: currentResponseId!, observer: { (id) -> Void in
                self.updateResponseFields();
            })
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        let request = Backend.getInstance().getRequest(requestId);
        editRequestButton.enabled = request != nil && request?.status == Backend.RequestObject.STATUS_ACTIVE;
        
        updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener, listenerId: nil);

        updateRequestFields();
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        Backend.getInstance().removeCacheChangeListener(updateListenerId);
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if (segue.identifier == "showEditRequestPage") {
            let destView = segue.destinationViewController as! EditRequestPage;
            destView.requestId = requestId;
        }
    }
    

    private func updateRequestFields() {
        let request = Backend.getInstance().getRequest(requestId);
        if (request == nil) {
            requestTextField.text = NSLocalizedString("Retreiving...", comment: "Request text is not available - pulling");

            currentResponseId = nil;
            updateResponseFields();
            
            return;
        }
        
        requestTextField.text = request!.text;
        
        responseIds = Backend.getInstance().getIncomingResponseIds(requestId, responseStatus: responseStatus);
        if (responseIds != nil && responseIds?.count > 0) {
            currentResponseId = responseIds![0];
        } else if (responseIds?.count == 0) {
            currentResponseId = "";
        } else {
            currentResponseId = nil;
        }
        
        updateResponseFields();
    }
    
    private func updateResponseFields() {
        if (currentResponseId != nil && currentResponseId != "") {
            var response = Backend.getInstance().getResponse(requestId, responseId: currentResponseId);
            if (response != nil) {
                if (response?.contactInfo != nil) {
                    responseTextField.text = "\(response!.contactInfo!.contactName)\n\(response!.contactInfo!.contactInfo)\n---\n\(response!.text)";
                } else {
                    responseTextField.text = response!.text;
                }
                
                var currentIndex = getCurrentResponseIdIndex();
                previousResponseButton.enabled = currentIndex > 0;
                nextResponseButton.enabled = currentIndex != -1 && currentIndex + 1 < responseIds?.count;
                requestContactInfoButton.enabled = response?.contactInfoStatus == Backend.ResponseObject.CONTACT_INFO_STATUS_CAN_PROVIDE;

                if (response!.status == Backend.ResponseObject.STATUS_UNREAD) {
                    response!.status = Backend.ResponseObject.STATUS_READ;
                    
                    Backend.getInstance().updateResponse(requestId, responseId: currentResponseId!, response: response!, observer: { (id) -> Void in
                    });
                }
                
                return;
            }
        } else if (currentResponseId == "") {
            responseTextField.text = "";
        } else {
            responseTextField.text = NSLocalizedString("Retreiving...", comment: "Response text is not available - pulling");
        }
        
        nextResponseButton.enabled = false;
        previousResponseButton.enabled = false;
        requestContactInfoButton.enabled = false;
    }
    
    
    private func getCurrentResponseIdIndex() -> Int {
        if (self.currentResponseId != nil) {
            for (index, id) in enumerate(self.responseIds!) {
                if (id == self.currentResponseId) {
                    return index;
                }
            }
        }
        
        return -1;
    }
}
