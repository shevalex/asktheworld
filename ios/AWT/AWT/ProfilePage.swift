//
//  ProfilePage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ProfilePage: AtwUIViewController, UITextFieldDelegate, BackendCallback {
    @IBOutlet weak var nicknameTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var languagesTextField: UITextField!
    @IBOutlet weak var newPasswordTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var currentPasswordTextField: UITextField!

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
            self.showErrorMessage(NSLocalizedString("Profile was not updated. Check your password", comment: "Profile cannot update error message"));
        });
    }
    
    override func viewDidLoad() {
        setSensitiveConstraint(bottomSpacing, offset: 0);
        
        super.viewDidLoad()

        nicknameTextField.text = Backend.getInstance().getUserProfile().name;
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDERS).setSelectedItem(Backend.getInstance().getUserProfile().gender);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORIES).setSelectedItem(Backend.getInstance().getUserProfile().age);
        AtwUiUtils.setDataChooser(languagesTextField, items: Configuration.LANGUAGES, multichoice: true).setSelectedItems(Backend.getInstance().getUserProfile().languages);
        
        nicknameTextField.delegate = self;
        newPasswordTextField.delegate = self;
        confirmPasswordTextField.delegate = self;
        currentPasswordTextField.delegate = self;
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
            showErrorMessage(NSLocalizedString("Nickname must be provided", comment: "Profile update error message"));
            return;
        }
        
        if (genderTextField.text == "") {
            showErrorMessage(NSLocalizedString("Gender must be provided", comment: "Profile update error message"));
            return;
        }
        
        if (ageTextField.text == "") {
            showErrorMessage(NSLocalizedString("Age must be provided", comment: "Profile update error message"));
            return;
        }
        
        if (languagesTextField.text == "") {
            showErrorMessage(NSLocalizedString("You must choose at least one language", comment: "Profile update error message"));
            return;
        }
        
        if (newPasswordTextField.text != "") {
            if (newPasswordTextField.text != confirmPasswordTextField.text) {
                showErrorMessage(NSLocalizedString("Password do not match. Please retype", comment: "Profile update error message"));
                return;
            } else if (!AtwUiUtils.isPasswordValid(newPasswordTextField.text)) {
                showErrorMessage(NSLocalizedString("Password should be 5 or more symbols", comment: "Profile update error message"));
                return;
            }
        } else if (confirmPasswordTextField.text != "") {
            showErrorMessage(NSLocalizedString("Password is not provided", comment: "Profile update error message"));
            return;
        }
        
        if (currentPasswordTextField.text == "") {
            showErrorMessage(NSLocalizedString("Please provide current password to confirm the change", comment: "Profile update error message"));
            return;
        }
        
        AtwUiUtils.showSpinner(self.view);
        
        let languageItems = (languagesTextField.inputView as! SelectorView).getSelectedItems();
        let genderItem = (genderTextField.inputView as! SelectorView).getSelectedItems()[0];
        let ageItem = (ageTextField.inputView as! SelectorView).getSelectedItems()[0];
        
        let newPassword = newPasswordTextField.text != "" ? newPasswordTextField.text : nil;
        
        Backend.getInstance().updateUserProfile(newPassword , gender: genderItem, age: ageItem, nickname: nicknameTextField.text, languages: languageItems, currentPassword: currentPasswordTextField.text, callback: self);
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
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Profile Update", comment: "Update profile dialog message title"), popupError: popupMessage)
    }
}
