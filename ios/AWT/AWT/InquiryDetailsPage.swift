//
//  InquiryDetailsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 18/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class InquiryDetailsPage: AtwUIViewController {
    var requestId: String! //this is set from the outside before the page is brought up
    
    @IBOutlet weak var inquiryTextField: UITextView!
    @IBOutlet weak var responseTextField: UITextView!
    @IBOutlet weak var inquiryAttachmentsView: AttachmentBarView!
    @IBOutlet weak var responseAttachmentsView: AttachmentBarView!
    
    @IBOutlet weak var sendButton: UIBarButtonItem!
    @IBOutlet weak var attachButton: UIBarButtonItem!
    
    @IBOutlet weak var toolbar: UIToolbar!
    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    
    private var updateListener: Backend.CacheChangeEventObserver!;
    private var updateListenerId: String!;
    
    
    private var responseId: String?;

    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: toolbar.frame.height);
        
        super.viewDidLoad();
        
        inquiryAttachmentsView.setHostingViewController(self);
        inquiryAttachmentsView.setMutable(false);
        
        responseAttachmentsView.setHostingViewController(self);

        updateListener = { (event: Backend.CacheChangeEvent) in
            if (event.type == Backend.CacheChangeEvent.TYPE_INCOMING_REQUESTS_CHANGED) {
                var requestIds = Backend.getInstance().getIncomingRequestIds(requestStatus: Backend.RequestObject.STATUS_ACTIVE);
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
    
    
    
    private class CreateResponseCallback: BackendCallback {
        private var page: InquiryDetailsPage!;
        
        init(page: InquiryDetailsPage) {
            self.page = page;
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Server Error", comment: "Inquiry Details page error message"));
            });
        }
        func onSuccess() {
            AtwUiUtils.runOnMainThread({
                self.page.navigationController?.popViewControllerAnimated(true);
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Cannot log in", comment: "Inquiry Details page error message"));
            });
        }
    }

    @IBAction func sendButtonClickAction(sender: AnyObject) {
        if (responseTextField.text == "") {
            AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Error", comment: "Error title"), popupError: NSLocalizedString("Please enter a message", comment: "Cannot send empty response"), okCallback: { () -> Void in
            });
            
            return;
        }
        
        
        var response = Backend.ResponseObject(requestId: requestId, userProfile: Backend.getInstance().getUserProfile());
        
        //        response.attachments;
        response.text = responseTextField.text;
        
        Backend.getInstance().createResponse(requestId, response: response, callback: CreateResponseCallback(page: self));
    }
    
    @IBAction func attachButtonClickAction(sender: AnyObject) {
        responseAttachmentsView.showAttachAction();
    }
    
    @IBAction func ignoreButtonClickAction(sender: AnyObject) {
        Backend.getInstance().removeIncomingRequest(requestId!, callback: nil);
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        updateListenerId = Backend.getInstance().addCacheChangeListener(updateListener, listenerId: nil);
        
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
    
    private func showErrorMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Reponse Creation", comment: "Inquiry Details page error message title"), popupError: popupMessage);
    }
    
    
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
