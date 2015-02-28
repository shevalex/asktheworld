//
//  LoginScreen.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class LoginPage: UIViewController, BackendCallback {

    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
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
            self.showErrorMessage("FAILED_TO_LOGIN_MESSAGE");
        });
    }
    
    
    @IBAction func loginButtonClicked(sender: UIButton) {
        if (emailTextField.text == "") {
            showErrorMessage("EMAIL_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AtwUiUtils.isEmailValid(emailTextField.text)) {
            showErrorMessage("EMAIL_NOT_VALID_MESSAGE");
            return;
        }
        
        if (passwordTextField.text == "") {
            showErrorMessage("PASSWORD_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AtwUiUtils.isPasswordValid(passwordTextField.text)) {
            showErrorMessage("PASSWORD_NOT_VALID_MESSAGE");
            return;
        }

        AtwUiUtils.showSpinner(self.view);
        Backend.logIn(emailTextField.text, password: passwordTextField.text, callback: self);
        
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
        AtwUiUtils.showPopup(self, popupTitle: AtwUiUtils.getLocalizedString("LOGIN_ERROR_MESSAGE_TTILE"), popupError: AtwUiUtils.getLocalizedString(popupErrorKey))
    }
    
    
}
