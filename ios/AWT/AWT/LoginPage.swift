//
//  LoginScreen.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class LoginPage: UIViewController {
    let SHOW_HOME_SCREEN_SEGUE = "showHomeScreen";
    
    var autoLogin: Bool = true; //this is modified externally
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    
    override func viewDidLoad() {
        super.viewDidLoad();

        if (Backend.getInstance() != nil && Backend.getInstance().getUserContext() != nil) {
            performSegueWithIdentifier(SHOW_HOME_SCREEN_SEGUE, sender: self);
        } else {
            restoreEmailAndPassword();
            if (autoLogin && emailTextField.text != "" && passwordTextField.text != "") {
                logIn();
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    @IBAction func loginButtonClicked(sender: UIButton) {
        logIn();
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

                self.page.saveEmailAndPassword();
                self.page.performSegueWithIdentifier(self.page.SHOW_HOME_SCREEN_SEGUE, sender: self);
            });
        }
        func onFailure() {
            AtwUiUtils.runOnMainThread({
                AtwUiUtils.hideSpinner();
                self.page.showErrorMessage(NSLocalizedString("Cannot log in", comment: "Login page error message"));
            });
        }
    }
    
    private func logIn() {
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
    
    private func saveEmailAndPassword() {
        var email: NSData = emailTextField.text.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!
        var emailQuery: NSMutableDictionary = NSMutableDictionary(objects: [kSecClassGenericPassword, email], forKeys: [kSecClass, kSecValueData]);
        SecItemDelete(emailQuery);
        SecItemAdd(emailQuery, nil);
        
        var password: NSData = passwordTextField.text.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!
        var passwordQuery: NSMutableDictionary = NSMutableDictionary(objects: [kSecClassInternetPassword, password], forKeys: [kSecClass, kSecValueData]);
        SecItemDelete(passwordQuery);
        SecItemAdd(passwordQuery, nil);
    }
    
    private func restoreEmailAndPassword() {
        var emailQuery: NSMutableDictionary = NSMutableDictionary(objects: [kSecClassGenericPassword, kCFBooleanTrue, kSecMatchLimitOne], forKeys: [kSecClass, kSecReturnData, kSecMatchLimit]);
        
        var dataTypeRef: Unmanaged<AnyObject>?;
        SecItemCopyMatching(emailQuery, &dataTypeRef);
        
        var opaque = dataTypeRef?.toOpaque();
        if (opaque != nil) {
            let retrievedData = Unmanaged<NSData>.fromOpaque(opaque!).takeUnretainedValue();
            emailTextField.text = NSString(data: retrievedData, encoding: NSUTF8StringEncoding) as! String;
        }
        
        
        var passwordQuery: NSMutableDictionary = NSMutableDictionary(objects: [kSecClassInternetPassword, kCFBooleanTrue, kSecMatchLimitOne], forKeys: [kSecClass, kSecReturnData, kSecMatchLimit]);

        SecItemCopyMatching(passwordQuery, &dataTypeRef);
        
        opaque = dataTypeRef?.toOpaque();
        if (opaque != nil) {
            let retrievedData = Unmanaged<NSData>.fromOpaque(opaque!).takeUnretainedValue();
            passwordTextField.text = NSString(data: retrievedData, encoding: NSUTF8StringEncoding) as! String;
        }
    }
    
    
    
    private func showErrorMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Signing In", comment: "Login page error message title"), popupError: popupMessage);
    }
    
    private func showPasswordRecoveryMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Password recovery failed. Please check if your email is valid", comment: "Password recovery error message title"), popupError: popupMessage);
    }
    
}
