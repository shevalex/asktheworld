//
//  CreateNewRequestPage.swift
//  AWT
//
//  Created by Oleg Burakov on 11/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class CreateNewRequestPage: AtwUIViewController {
    @IBOutlet weak var expertiseTextField: UITextField!
    var expertiseSelector: SelectorView!
    
    @IBOutlet weak var genderTextField: UITextField!
    var genderSelector: SelectorView!
    
    @IBOutlet weak var ageTextField: UITextField!
    var ageSelector: SelectorView!
    
    @IBOutlet weak var waitTimeTextField: UITextField!
    var waitTimeSelector: SelectorView!
    
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    var numOfResponsesSelector: SelectorView!
    
    @IBOutlet weak var imageScrollView: AttachmentBarView!
    @IBOutlet weak var requestTextField: UITextView!
    
    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    @IBOutlet weak var toolbar: UIToolbar!
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: toolbar.frame.height);
        
        super.viewDidLoad()
        
        imageScrollView.setHostingViewController(self);
        
        expertiseSelector = AtwUiUtils.setDataChooser(expertiseTextField, items: Configuration.EXPERTISES, multichoice: false);
        genderSelector = AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE, multichoice: false);
        ageSelector = AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE, multichoice: false);
        waitTimeSelector = AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME, multichoice: false);
        numOfResponsesSelector = AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY, multichoice: false);
    }

    @IBAction func attachButtonPressed(sender: AnyObject) {
        imageScrollView.showAttachAction();
    }
    
    
    
    private class CreateRequestCallback: BackendCallback {
        private var page: CreateNewRequestPage!;
        
        init(page: CreateNewRequestPage) {
            self.page = page;
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Server Error", comment: "Create Request error message"));
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
                self.page.showErrorMessage(NSLocalizedString("Failed to create a request", comment: "Request creation failed"));
            });
        }
    }
    
    @IBAction func sendButtonClickedAction(sender: UIBarButtonItem) {
        if (requestTextField.text == "") {
            AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Error", comment: "Error title"), popupError: NSLocalizedString("Please enter a message", comment: "Cannot send empty request"), okCallback: { () -> Void in
            });
            
            return;
        }
        
        
        var request = Backend.RequestObject(userPreferences: Backend.getInstance().getUserPreferences());
        
//        request.attachments;
        request.expertiseCategory = expertiseSelector.getSelectedItem();
        request.responseAgeGroup = ageSelector.getSelectedItem();
        request.responseGender = genderSelector.getSelectedItem();
        request.responseQuantity = numOfResponsesSelector.getSelectedItem();
        request.responseWaitTime = waitTimeSelector.getSelectedItem();
        request.text = requestTextField.text;
        
        Backend.getInstance().createRequest(request, callback: CreateRequestCallback(page: self));
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);

        expertiseSelector.setSelectedItem(Configuration.EXPERTISES[0]);
        genderSelector.setSelectedItem(Backend.getInstance().getUserPreferences().requestTargetGender);
        ageSelector.setSelectedItem(Backend.getInstance().getUserPreferences().requestTargetAge);
        waitTimeSelector.setSelectedItem(Backend.getInstance().getUserPreferences().responseWaitTime);
        numOfResponsesSelector.setSelectedItem(Backend.getInstance().getUserPreferences().responseQuantity);
        
        requestTextField.text = "";
    }
    

    
    private func showErrorMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Request Creation", comment: "Create Request Page error message title"), popupError: popupMessage);
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
