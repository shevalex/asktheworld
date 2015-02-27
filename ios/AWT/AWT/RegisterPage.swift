//
//  RegisterPage.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RegisterPage: UIViewController {
    @IBOutlet weak var languagesTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var nicknameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    

    @IBAction func registerButtonAction(sender: UIButton) {
        var emailText = emailTextField.text
        
        if (emailText == "") {
            showErrorMessage("EMAIL_NOT_PROVIDED");
        } else if (!AwtUiUtils.isEmailValid(emailText)) {
            showErrorMessage("EMAIL_NOT_VALID");
        }
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
        AwtUiUtils.showPopup(self, popupTitle: AwtUiUtils.getLocalizedString("REGISTRATION_ERROR_TTILE"), popupError: AwtUiUtils.getLocalizedString(popupErrorKey))
    }
    

}
