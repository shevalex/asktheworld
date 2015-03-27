//
//  InquiryDetailsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 18/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class InquiryDetailsPage: UIViewControllerWithSpinner {
    var requestId: String! //this is set from the outside before the page is brought up
    
    @IBOutlet weak var inquiryTextField: UITextView!
    @IBOutlet weak var responseTextField: UITextView!
    @IBOutlet weak var inquiryAttachmentsView: AttachmentBarView!
    @IBOutlet weak var responseAttachmentsView: AttachmentBarView!
    
    @IBOutlet weak var sendButton: UIBarButtonItem!
    @IBOutlet weak var attachButton: UIBarButtonItem!
    
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String!;
    
    
    private var responseId: String?;

    override func viewDidLoad() {
        super.viewDidLoad()

        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
                var requestIds = Backend.getInstance().getIncomingRequestIds();
                for (index, id) in enumerate(requestIds!) {
                    if (id == self.requestId) {
                        return;
                    }
                }
                
                self.navigationController?.popViewControllerAnimated(true);
            } else if (event.type == Backend.CacheChangeEvent.TYPE_REQUEST_CHANGED && event.requestId == self.requestId) {
                self.updateInquiryFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_OUTGOING_RESPONSES_CHANGED && event.requestId == self.requestId) {

                self.updateInquiryFields();
            } else if (event.type == Backend.CacheChangeEvent.TYPE_RESPONSE_CHANGED && event.requestId == self.requestId && event.responseId == self.responseId) {

                self.updateInquiryFields();
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    

    @IBAction func sendButtonClickAction(sender: AnyObject) {
        var response = Backend.ResponseObject(userContext: Backend.getInstance().getUserContext());
        
        //        response.attachments;
        response.text = responseTextField.text;
        
        Backend.getInstance().createResponse(requestId, response: response, observer: {() -> Void in
            self.navigationController?.popViewControllerAnimated(true);
            return;
        });
    }
    
    @IBAction func attachButtonClickAction(sender: AnyObject) {
        AtwUiUtils.setImagePicker(self, {(image: UIImage) in
            self.responseAttachmentsView.addImage(image);
        });
    }
    

    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener);
        
        updateInquiryFields();
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewWillDisappear(animated);
        
        Backend.getInstance().removeCacheChangeListener(updateListenerId);
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    
    private func updateInquiryFields() {
        let request = Backend.getInstance().getRequest(requestId);
        if (request == nil) {
            inquiryTextField.text = NSLocalizedString("Retreiving...", comment: "Inquiry text is not available - pulling");

            responseId = nil;
            updateResponseFields();

            return;
        }
        
        inquiryTextField.text = request!.text;

        updateResponseFields();
    }
    
    private func updateResponseFields() {
        var request = Backend.getInstance().getRequest(requestId);
        
        if (request != nil) {
            var isActiveRequest = request!.status == Backend.RequestObject.STATUS_ACTIVE;

            responseTextField.editable = isActiveRequest;

            var responseIds = Backend.getInstance().getOutgoingResponseIds(requestId, responseStatus: nil);

            if (responseIds != nil) {
                if (responseIds?.count != 0) {
                    responseId = responseIds![0];

                    var response = Backend.getInstance().getResponse(requestId, responseId: responseId);
                    if (response != nil) {
                        responseTextField.text = response!.text;

                        sendButton.enabled = isActiveRequest;
                        attachButton.enabled = isActiveRequest;
                        
                        return;
                    }
                } else {
                    responseTextField.text = "";
                    sendButton.enabled = isActiveRequest;
                    attachButton.enabled = isActiveRequest;

                    return;
                }
            }
        }
    
        responseTextField.text = NSLocalizedString("Retreiving...", comment: "Response text is not available - pulling");
        responseTextField.editable = false;
        sendButton.enabled = false;
        attachButton.enabled = false;
    }
}
