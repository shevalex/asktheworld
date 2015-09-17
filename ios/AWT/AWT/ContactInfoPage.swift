//
//  ContactInfoPage.swift
//  AWT
//
//  Created by Oleg Burakov on 05/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ContactInfoPage: AtwUIViewController, UITextFieldDelegate, BackendCallback {
    @IBOutlet weak var expertisesTextField: UITextField!
    @IBOutlet weak var contactVisibleTextField: UITextField!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var contactInfoTextField: UITextField!
    
    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    
    private let YES_NO: [String]! = ["Yes", "No"];
    
    //BackendCallback
    func onError() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage(NSLocalizedString("Server Error", comment: "Contact Info page error message"));
        });
    }
    func onSuccess() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.navigationController?.popViewControllerAnimated(true);
        });
    }
    func onFailure() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage(NSLocalizedString("Failed to update contact info", comment: "Contact Info page error message"));
        });
    }
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: 0);
        
        super.viewDidLoad()

        AtwUiUtils.setDataChooser(expertisesTextField, items: Configuration.EXPERTISES, multichoice: true).setSelectedItems(Backend.getInstance().getUserPreferences().expertises);
        AtwUiUtils.setDataChooser(contactVisibleTextField, items: Configuration.CONTACT_REQUESTABLE).setSelectedItem(Backend.getInstance().getUserPreferences().contactVisible);
        
        nameTextField.text = Backend.getInstance().getUserPreferences().contactName;
        contactInfoTextField.text = Backend.getInstance().getUserPreferences().contactInfo;
        
        nameTextField.delegate = self;
        contactInfoTextField.delegate = self;
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        let expertisesItems = (expertisesTextField.inputView as! SelectorView).getSelectedItems();
        let visibleItem = (contactVisibleTextField.inputView as! SelectorView).getSelectedItems()[0];
        
        Backend.getInstance().updateUserPreferences(nil, requestTargetGender: nil, responseQuantity: nil, responseWaitTime: nil, dailyInquiryLimit: nil, inquiryAge: nil, inquiryGender: nil, expertises: expertisesItems, contactRequestable: visibleItem, contactName: nameTextField.text, contactDetails: contactInfoTextField.text, callback: self);
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
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Update Preferences", comment: "Contact Info page message title"), popupError: popupMessage);
    }
}
