//
//  RequestPreferencesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RequestPreferencesPage: AtwUIViewController, BackendCallback {

    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    @IBOutlet weak var waitTimeTextField: UITextField!

    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    
    //BackendCallback
    func onError() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage(NSLocalizedString("Server Error", comment: "Communication error message"));
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
            self.showErrorMessage(NSLocalizedString("Preferences weren't updated", comment: "Communication error message"));
        });
    }
    
    
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        var genderItem = (genderTextField.inputView as! SelectorView).getSelectedItems()[0];
        var ageItem = (ageTextField.inputView as! SelectorView).getSelectedItems()[0];
        var quantityItem = (numberOfResponsesTextField.inputView as! SelectorView).getSelectedItems()[0];
        var waitTimeItem = (waitTimeTextField.inputView as! SelectorView).getSelectedItems()[0];
        
        Backend.getInstance().updateUserPreferences(ageItem, requestTargetGender: genderItem, responseQuantity: quantityItem, responseWaitTime: waitTimeItem, dailyInquiryLimit: nil, inquiryAge: nil, inquiryGender: nil, expertises: nil, contactRequestable: nil, contactName: nil, contactDetails: nil, callback: self);
    }
    
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: 0);
        
        super.viewDidLoad()

        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE).setSelectedItem(Backend.getInstance().getUserContext().requestTargetGender);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE).setSelectedItem(Backend.getInstance().getUserContext().requestTargetAge);
        AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY).setSelectedItem(Backend.getInstance().getUserContext().responseQuantity);
        AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME).setSelectedItem(Backend.getInstance().getUserContext().responseWaitTime);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Preferences Update", comment: "Preferences message title"), popupError: popupMessage);
    }
}
