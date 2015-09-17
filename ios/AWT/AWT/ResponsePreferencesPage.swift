//
//  ResponsePreferencesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ResponsePreferencesPage: AtwUIViewController, BackendCallback {

    @IBOutlet weak var amountOfInquiriesTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    
    @IBOutlet weak var bottomSpacing: NSLayoutConstraint!
    
    //BackendCallback
    func onError() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage(NSLocalizedString("Server Error", comment: "Response Preferences page error message"));
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
            self.showErrorMessage(NSLocalizedString("Failed to update contact info", comment: "Response Preferences page error message"));
        });
    }
    
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: 0);
        
        super.viewDidLoad()

        AtwUiUtils.setDataChooser(amountOfInquiriesTextField, items: Configuration.INQUIRY_LIMIT_PREFERENCE).setSelectedItem(Backend.getInstance().getUserPreferences().dailyInquiryLimit);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE).setSelectedItem(Backend.getInstance().getUserPreferences().inquiryAge);
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE).setSelectedItem(Backend.getInstance().getUserPreferences().inquiryGender);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        let limitItem = (amountOfInquiriesTextField.inputView as! SelectorView).getSelectedItems()[0];
        let ageItem = (ageTextField.inputView as! SelectorView).getSelectedItems()[0];
        let genderItem = (genderTextField.inputView as! SelectorView).getSelectedItems()[0];
        
        Backend.getInstance().updateUserPreferences(nil, requestTargetGender: nil, responseQuantity: nil, responseWaitTime: nil, dailyInquiryLimit: limitItem, inquiryAge: ageItem, inquiryGender: genderItem, expertises: nil, contactRequestable: nil, contactName: nil, contactDetails: nil, callback: self);
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
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Update Preferences", comment: "Response Preferences page message title"), popupError: popupMessage);
    }
}
