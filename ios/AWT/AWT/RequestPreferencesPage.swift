//
//  RequestPreferencesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RequestPreferencesPage: UIViewController, BackendCallback {

    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    @IBOutlet weak var waitTimeTextField: UITextField!

    
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
    
    
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        AtwUiUtils.showSpinner(self.view);
        
        var genderItem = (genderTextField.inputView as SelectorView).getSelectedItems()[0];
        var ageItem = (ageTextField.inputView as SelectorView).getSelectedItems()[0];
        var quantityItem = (numberOfResponsesTextField.inputView as SelectorView).getSelectedItems()[0];
        var waitTimeItem = (waitTimeTextField.inputView as SelectorView).getSelectedItems()[0];
        
        Backend.updateUserPreferences(ageItem, requestTargetGender: genderItem, responseQuantity: quantityItem, responseWaitTime: waitTimeItem, dailyInquiryLimit: nil, inquiryAge: nil, inquiryGender: nil, expertises: nil, contactRequestable: nil, contactName: nil, contactDetails: nil, callback: self);
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE).setSelectedItem(Backend.getUserContext().requestTargetGender);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE).setSelectedItem(Backend.getUserContext().requestTargetAge);
        AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY).setSelectedItem(Backend.getUserContext().responseQuantity);
        AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME).setSelectedItem(Backend.getUserContext().responseWaitTime);
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

    private func showErrorMessage(popupErrorKey: String) {
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("PREFERENCES_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
}
