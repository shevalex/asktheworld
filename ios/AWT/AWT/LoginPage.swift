//
//  LoginScreen.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class LoginPage: UIViewController {

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
    
    override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
        view.endEditing(true)
    }
    
    
    private class LoginCallback: BackendCallback {
        private var page: LoginPage!;
        
        init(page: LoginPage) {
            self.page = page;
            
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Server Error", comment: "Login page error message"));
            });
        }
        func onSuccess() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.performSegueWithIdentifier("showHomeScreen", sender: self);
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Cannot log in", comment: "Login page error message"));
            });
        }
    }
    @IBAction func loginButtonClicked(sender: UIButton) {
        if (emailTextField.text == "") {
            showErrorMessage(NSLocalizedString("Email must be provided", comment: "Login page error message"));
            return;
        } else if (!AtwUiUtils.isEmailValid(emailTextField.text)) {
            showErrorMessage(NSLocalizedString("Email does not look like a valid email address", comment: "Login page error message"));
            return;
        }
        
        if (passwordTextField.text == "") {
            showErrorMessage(NSLocalizedString("Password must be provided", comment: "Login page error message"));
            return;
        } else if (!AtwUiUtils.isPasswordValid(passwordTextField.text)) {
            showErrorMessage(NSLocalizedString("Password is not valid", comment: "Login page error message"));
            return;
        }

        AtwUiUtils.showSpinner(self.view);
        Backend.logIn(emailTextField.text, password: passwordTextField.text, callback: LoginCallback(page: self));
    }
    
    
    
    private class PasswordRecoveryCallback: BackendCallback {
        private var page: LoginPage!;
        
        init(page: LoginPage) {
            self.page = page;
        }
        
        func onError() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Server Error", comment: "Password recovery message"));
            });
        }
        func onSuccess() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("The message was sent to your email. You may disregard it if you do not need to change your password", comment: "Password recovery message"));
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Password recovery failed. Make sure the email you provided is correct", comment: "Password recovery message"));
            });
        }
    }
    @IBAction func forgotPasswordClicked() {
        if (emailTextField.text == "") {
            showErrorMessage(NSLocalizedString("Email must be provided", comment: "Login page error message"));
            return;
        } else if (!AtwUiUtils.isEmailValid(emailTextField.text)) {
            showErrorMessage(NSLocalizedString("Email does not look like a valid email address", comment: "Login page error message"));
            return;
        }
        
        Backend.resetUserPassword(emailTextField.text, callback: PasswordRecoveryCallback(page: self));
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
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Signing In", comment: "Login page error message title"), popupError: popupMessage);
    }
    
    private func showPasswordRecoveryMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Password recovery failed. Please check if your email is valid", comment: "Password recovery error message title"), popupError: popupMessage);
    }
    
}
