//
//  ContactInfoPage.swift
//  AWT
//
//  Created by Oleg Burakov on 05/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ContactInfoPage: UIViewController, BackendCallback {
    @IBOutlet weak var expertisesTextField: UITextField!
    @IBOutlet weak var contactVisibleTextField: UITextField!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var contactInfoTextField: UITextField!
    
    private let YES_NO: [String]! = ["Yes", "No"];
    
    //BackendCallback
    func onError() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage("SERVER_ERROR_MESSSAGE");
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
            self.showErrorMessage("FAILED_TO_UPDATE_PREFERENECS_MESSAGE");
        });
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        AtwUiUtils.setDataChooser(expertisesTextField, items: Configuration.EXPERTISES, multichoice: true).setSelectedItems(Backend.getUserContext().expertises);
        AtwUiUtils.setDataChooser(contactVisibleTextField, items: Configuration.CONTACT_REQUESTABLE).setSelectedItem(Backend.getUserContext().contactVisible);
        
        nameTextField.text = Backend.getUserContext().contactName;
        contactInfoTextField.text = Backend.getUserContext().contactInfo;
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        var expertisesItems = (expertisesTextField.inputView as SelectorView).getSelectedItems();
        var visibleItem = (contactVisibleTextField.inputView as SelectorView).getSelectedItems()[0];
        
        Backend.updateUserPreferences(nil, requestTargetGender: nil, responseQuantity: nil, responseWaitTime: nil, dailyInquiryLimit: nil, inquiryAge: nil, inquiryGender: nil, expertises: expertisesItems, contactRequestable: visibleItem, contactName: nameTextField.text, contactDetails: contactInfoTextField.text, callback: self);
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

    private func showErrorMessage(popupErrorKey: String) {
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("PREFERENCES_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
}
