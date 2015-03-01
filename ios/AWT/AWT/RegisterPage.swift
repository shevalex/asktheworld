//
//  RegisterPage.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RegisterPage: UIViewController, BackendCallback {
    @IBOutlet weak var languagesTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var nicknameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    

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
            self.performSegueWithIdentifier("showHomeScreen", sender: self);
        });
    }
    func onFailure() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage("FAILED_TO_REGISTER_MESSAGE");
        });
    }
    
    @IBAction func registerButtonAction(sender: UIButton) {
        if (emailTextField.text == "") {
            showErrorMessage("EMAIL_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AtwUiUtils.isEmailValid(emailTextField.text)) {
            showErrorMessage("EMAIL_NOT_VALID_MESSAGE");
            return;
        }

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
        
        if (passwordTextField.text == "") {
            showErrorMessage("PASSWORD_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AtwUiUtils.isPasswordValid(passwordTextField.text)) {
            showErrorMessage("PASSWORD_NOT_VALID_MESSAGE");
            return;
        } else if (passwordTextField.text != confirmPasswordTextField.text) {
            showErrorMessage("PASSWORD_NOT_MATCH_MESSAGE");
            return;
        }
        
        AtwUiUtils.showSpinner(self.view);
        
        //TODO: perform proper parsing
        let languages: [String] = split(languagesTextField.text) {$0 == " "};
        
        Backend.register(emailTextField.text, password: passwordTextField.text, gender: genderTextField.text, age: ageTextField.text, nickname: nicknameTextField.text, languages: languages, callback: self)
    }
    
    @IBAction func passwordChangedAction(sender: UITextField) {
        confirmPasswordTextField.text = "";
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
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

    func showErrorMessage(popupErrorKey: String) {
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("REGISTRATION_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
    

}
