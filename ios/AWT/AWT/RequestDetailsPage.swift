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
    
    @IBOutlet weak var requestTextField: UITextView!
    @IBOutlet weak var responseTextField: UITextView!
    
    @IBOutlet weak var requestAttachmentsView: AttachmentBarView!
    
    @IBOutlet weak var responseAttachmentsView: AttachmentBarView!
    
    
    @IBOutlet weak var nextResponseButton: UIButton!
    @IBOutlet weak var previousResponseButton: UIButton!
    @IBOutlet weak var markReadButton: UIButton!
    
    private var request: Backend.RequestObject!
    private var responseIds: [String]?
    private var currentResponseId: String?
    
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String!;
    
    override func viewDidLoad() {
        super.viewDidLoad()

        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_RESPONSES_CHANGED && event.requestId == self.requestId) {
                self.responseIds = Backend.getInstance().getIncomingResponseIds(self.requestId, responseStatus: nil);
                if (self.responseIds != nil && self.responseIds?.count > 0) {
                    var currentIndex = self.getCurrentResponseIdIndex();
                    if (currentIndex != -1) {
                        return;
                    }
                    self.currentResponseId = self.responseIds![0];
                } else {
                    self.currentResponseId = nil;
                }
                
                self.updateResponseFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED && event.requestId == self.requestId) {
                self.updateResponseFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_REQUESTS_CHANGED) {
                var requestIds = Backend.getInstance().getOutgoingRequestIds(requestStatus: nil);
                for (index, id) in enumerate(requestIds!) {
                    if (id == self.requestId) {
                        return;
                    }
                }
                
                // TBD - close the page - we have no this request any more
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
    
    @IBAction func markReadClickAction(sender: UIButton) {
    }
    
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener);

        updateRequestFields();
    }
    
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        Backend.getInstance().removeCacheChangeListener(updateListenerId);
    }

    private func updateRequestFields() {
        request = Backend.getInstance().getRequest(requestId);
        if (request == nil) {
            return;
        }
        
        requestTextField.text = request.text;
        
        responseIds = Backend.getInstance().getIncomingResponseIds(requestId, responseStatus: nil);
        if (responseIds != nil && responseIds?.count > 0) {
            currentResponseId = responseIds![0];
        } else {
            currentResponseId = nil;
        }
        
        updateResponseFields();
    }
    
    private func updateResponseFields() {
        if (currentResponseId != nil) {
            var response = Backend.getInstance().getResponse(requestId, responseId: currentResponseId);
            if (response != nil) {
                responseTextField.text = response!.text;
                
                var currentIndex = getCurrentResponseIdIndex();
                previousResponseButton.enabled = currentIndex > 0;
                nextResponseButton.enabled = currentIndex != -1 && currentIndex + 1 < responseIds?.count;
                markReadButton.enabled = true;
                
                return;
            }
        }
        
        responseTextField.text = NSLocalizedString("Retreiving...", comment: "Response text is not available - pulling");
        nextResponseButton.enabled = false;
        previousResponseButton.enabled = false;
        markReadButton.enabled = false;
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
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
