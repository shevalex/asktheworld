//
//  ResponsePreferencesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ResponsePreferencesPage: UIViewController, BackendCallback {

    @IBOutlet weak var amountOfInquiriesTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    
    
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

        AtwUiUtils.setDataChooser(amountOfInquiriesTextField, items: Configuration.INQUIRY_LIMIT_PREFERENCE).setSelectedItem(Backend.getInstance().getUserContext().dailyInquiryLimit);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE).setSelectedItem(Backend.getInstance().getUserContext().inquiryAge);
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE).setSelectedItem(Backend.getInstance().getUserContext().inquiryGender);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        var limitItem = (amountOfInquiriesTextField.inputView as SelectorView).getSelectedItems()[0];
        var ageItem = (ageTextField.inputView as SelectorView).getSelectedItems()[0];
        var genderItem = (genderTextField.inputView as SelectorView).getSelectedItems()[0];
        
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
    
    private func showErrorMessage(popupErrorKey: String) {
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("PREFERENCES_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
}
