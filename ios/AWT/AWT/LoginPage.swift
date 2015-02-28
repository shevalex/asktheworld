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
    
    
    
    func onError() {
        showErrorMessage("SERVER_ERROR_MESSSAGE");
    }
    func onSuccess() {
        println("Successflly logged");
    }
    func onFailure() {
        showErrorMessage("FAILED_TO_LOGIN_MESSAGE");
    }
    
    
    @IBAction func loginButtonClicked(sender: UIButton) {
        var emailText = emailTextField.text;
        if (emailText == "") {
            showErrorMessage("EMAIL_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AwtUiUtils.isEmailValid(emailText)) {
            showErrorMessage("EMAIL_NOT_VALID_MESSAGE");
            return;
        }
        
        var passwordText = passwordTextField.text;
        if (passwordText == "") {
            showErrorMessage("PASSWORD_NOT_PROVIDED_MESSAGE");
            return;
        } else if (!AwtUiUtils.isPasswordValid(passwordText)) {
            showErrorMessage("PASSWORD_NOT_VALID_MESSAGE");
            return;
        }

        
        Backend.logIn(emailText, password: passwordText, callback: self);
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
        AwtUiUtils.showPopup(self, popupTitle: AwtUiUtils.getLocalizedString("LOGIN_ERROR_MESSAGE_TTILE"), popupError: AwtUiUtils.getLocalizedString(popupErrorKey))
    }
    
    
}
