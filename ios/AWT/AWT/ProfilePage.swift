//
//  ProfilePage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ProfilePage: UIViewController, BackendCallback {
    @IBOutlet weak var nicknameTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var languagesTextField: UITextField!
    @IBOutlet weak var newPasswordTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var currentPasswordTextField: UITextField!

    
    
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
            self.showErrorMessage("UPDATE_SUCCESSFUL_PROFILE_MESSAGE");
            currentPasswordTextField.text = "";
        });
    }
    func onFailure() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage("FAILED_TO_UPDATE_PROFILE_MESSAGE");
        });
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        nicknameTextField.text = Backend.getUserContext().name;
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDERS, multichoice: false).setSelectedItem(Backend.getUserContext().gender);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORIES, multichoice: false).setSelectedItem(Backend.getUserContext().age);
        AtwUiUtils.setDataChooser(languagesTextField, items: Configuration.LANGUAGES, multichoice: true).setSelectedItems(Backend.getUserContext().languages);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func newPasswordChangedAction(sender: UITextField) {
        confirmPasswordTextField.text = "";
    }
    
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        if (nicknameTextField.text == "") {
            showErrorMessage("NICKNAME_NOT_PROVIDED_MESSAGE");
            return;
        }
        
        if (genderTextField.text == "") {
            showErrorMessage("GENDER_NOT_PROVIDED_MESSAGE");
            return;
        }
        
        if (ageTextField.text == "") {
            showErrorMessage("AGE_NOT_PROVIDED_MESSAGE");
            return;
        }
        
        if (languagesTextField.text == "") {
            showErrorMessage("LANGUAGE_NOT_PROVIDED_MESSAGE");
            return;
        }
        
        if (newPasswordTextField.text != "") {
            if (newPasswordTextField.text != confirmPasswordTextField.text) {
                showErrorMessage("PASSWORD_NOT_MATCH_MESSAGE");
                return;
            } else if (!AtwUiUtils.isPasswordValid(newPasswordTextField.text)) {
                showErrorMessage("PASSWORD_NOT_VALID_MESSAGE");
                return;
            }
        } else if (confirmPasswordTextField.text != "") {
            showErrorMessage("PASSWORD_NOT_MATCH_MESSAGE");
            return;
        }
        
        if (currentPasswordTextField.text == "") {
            showErrorMessage("CURRENT_PASSWORD_NOT_PROVIDED_MESSAGE");
            return;
        }
        
        AtwUiUtils.showSpinner(self.view);
        
        var languageItems = (languagesTextField.inputView as SelectorView).getSelectedItems();
        var genderItem = (genderTextField.inputView as SelectorView).getSelectedItems()[0];
        var ageItem = (ageTextField.inputView as SelectorView).getSelectedItems()[0];
        
        Backend.updateUserProfile(newPasswordTextField.text, gender: genderItem, age: ageItem, nickname: nicknameTextField.text, languages: languageItems, currentPassword: currentPasswordTextField.text, callback: self);
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
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("PROFILE_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
    
}
