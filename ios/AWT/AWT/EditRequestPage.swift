//
//  EditRequestPage.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/27/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class EditRequestPage: AtwUIViewController {
    var requestId: String!
    
    @IBOutlet weak var expertiseTextField: UITextField!
    var expertiseSelector: SelectorView!
    
    @IBOutlet weak var genderTextField: UITextField!
    var genderSelector: SelectorView!
    
    @IBOutlet weak var ageTextField: UITextField!
    var ageSelector: SelectorView!
    
    @IBOutlet weak var waitTimeTextField: UITextField!
    var waitTimeSelector: SelectorView!
    
    @IBOutlet weak var numOfResponsesTextField: UITextField!
    var numOfResponsesSelector: SelectorView!
    
    @IBOutlet weak var requestTextField: UITextView!
    @IBOutlet weak var attachmentsView: AttachmentBarView!
    
    @IBOutlet weak var toolbar: UIToolbar!
    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: toolbar.frame.height);
        
        super.viewDidLoad();
        
        attachmentsView.setHostingViewController(self);
        
        expertiseSelector = AtwUiUtils.setDataChooser(expertiseTextField, items: Configuration.EXPERTISES, multichoice: false);
        genderSelector = AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE, multichoice: false);
        ageSelector = AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE, multichoice: false);
        waitTimeSelector = AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME, multichoice: false);
        numOfResponsesSelector = AtwUiUtils.setDataChooser(numOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY, multichoice: false);
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        var request = Backend.getInstance().getRequest(requestId);
        if (request == nil) {
            println("Erronious situation: request for provided id \(requestId) does not exist");
            
            self.navigationController?.popViewControllerAnimated(true);
            return;
        }
        
        
        expertiseSelector.setSelectedItem(request!.expertiseCategory);
        genderSelector.setSelectedItem(request!.responseGender);
        ageSelector.setSelectedItem(request!.responseAgeGroup);
        waitTimeSelector.setSelectedItem(request!.responseWaitTime);
        numOfResponsesSelector.setSelectedItem(request!.responseQuantity);
        
        requestTextField.text = request!.text;
    }
    
    private class UpdateRequestCallback: BackendCallback {
        private let page: EditRequestPage;
        
        init(page: EditRequestPage) {
            self.page = page;
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                self.showErrorMessage(NSLocalizedString("Server Error", comment: "Error message"));
            });
        }
        func onSuccess() {
            AtwUiUtils.runOnMainThread({
                self.page.navigationController?.popViewControllerAnimated(true);
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                self.showErrorMessage(NSLocalizedString("Failed to update a request", comment: "Failed to update request"));
            });
        }
        
        
        private func showErrorMessage(popupMessage: String) {
            AtwUiUtils.showPopup(self.page, popupTitle: NSLocalizedString("Signing In", comment: "Login page error message title"), popupError: popupMessage);
        }
    }
    
    
    @IBAction func deactivateButtonClickAction(sender: AnyObject) {
        var request = Backend.getInstance().getRequest(requestId);
        if (request != nil) {
            request!.status = Backend.RequestObject.STATUS_INACTIVE;
            Backend.getInstance().updateRequest(requestId!, request: request!, callback: UpdateRequestCallback(page: self));
        }
        
    }
    
    @IBAction func attachButtonClickAction(sender: AnyObject) {
        attachmentsView.showAttachAction();
    }
    
    @IBAction func sendButtonClickAction(sender: AnyObject) {
        if (requestTextField.text == "") {
            AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Error", comment: "Error title"), popupError: NSLocalizedString("Please enter a message", comment: "Cannot send empty request"), okCallback: { () -> Void in
            });
            
            return;
        }
        
        var request = Backend.getInstance().getRequest(requestId);
        if (request == nil) {
            println("Erronious situation: request for provided id \(requestId) does not exist");
            
            self.navigationController?.popViewControllerAnimated(true);
            return;
        }
        
        //        request.attachments;
        request!.expertiseCategory = expertiseSelector.getSelectedItem();
        request!.responseAgeGroup = ageSelector.getSelectedItem();
        request!.responseGender = genderSelector.getSelectedItem();
        request!.responseQuantity = numOfResponsesSelector.getSelectedItem();
        request!.responseWaitTime = waitTimeSelector.getSelectedItem();
        request!.text = requestTextField.text;
        
        Backend.getInstance().updateRequest(requestId!, request: request!, callback: UpdateRequestCallback(page: self));
    }
    
}
