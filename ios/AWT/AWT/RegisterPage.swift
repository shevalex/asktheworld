//
//  RegisterPage.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RegisterPage: UIViewControllerForTextEditing, UITextFieldDelegate, BackendCallback {
    @IBOutlet weak var languagesTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var nicknameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var scrollView: UIScrollView!
    
    @IBOutlet weak var bottonSpacing: NSLayoutConstraint!
    @IBOutlet weak var toolbar: UIToolbar!
    
    //BackendCallback
    func onError() {
        AtwUiUtils.runOnMainThread({
            AtwUiUtils.hideSpinner();
            self.showErrorMessage(NSLocalizedString("Server Error", comment: "Register page error message"));
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
            self.showErrorMessage(NSLocalizedString("User with such email is already registered", comment: "Register page error message"));
        });
    }
    
    @IBAction func registerButtonAction(sender: UIButton) {
        if (emailTextField.text == "") {
            showErrorMessage(NSLocalizedString("Email must be provided", comment: "Register page error message"));
            return;
        } else if (!AtwUiUtils.isEmailValid(emailTextField.text)) {
            showErrorMessage(NSLocalizedString("Provided email does not look like a valid email address", comment: "Register page error message"));
            return;
        }

        if (nicknameTextField.text == "") {
            showErrorMessage(NSLocalizedString("Please provide your nickname", comment: "Register page error message"));
            return;
        }

        if (genderTextField.text == "") {
            self.showErrorMessage(NSLocalizedString("Please specify your gender", comment: "Register page error message"));
            return;
        }

        if (ageTextField.text == "") {
            self.showErrorMessage(NSLocalizedString("Please specify your age category", comment: "Register page error message"));
            return;
        }

        if (languagesTextField.text == "") {
            self.showErrorMessage(NSLocalizedString("Please specify languages that you speak", comment: "Register page error message"));
            return;
        }
        
        if (passwordTextField.text == "") {
            self.showErrorMessage(NSLocalizedString("Please provide your password", comment: "Register page error message"));
            return;
        } else if (!AtwUiUtils.isPasswordValid(passwordTextField.text)) {
            self.showErrorMessage(NSLocalizedString("Password should be at least 5 symbols long", comment: "Register page error message"));
            return;
        } else if (passwordTextField.text != confirmPasswordTextField.text) {
            self.showErrorMessage(NSLocalizedString("Passwords do not match", comment: "Register page error message"));
            return;
        }
        
        AtwUiUtils.showSpinner(self.view);
        
        var languageItems = (languagesTextField.inputView as! SelectorView).getSelectedItems();
        var genderItem = (genderTextField.inputView as! SelectorView).getSelectedItems()[0];
        var ageItem = (ageTextField.inputView as! SelectorView).getSelectedItems()[0];
        
        Backend.register(emailTextField.text, password: passwordTextField.text, gender: genderItem, age: ageItem, nickname: nicknameTextField.text, languages: languageItems, callback: self)
    }
    
    @IBAction func passwordChangedAction(sender: UITextField) {
        confirmPasswordTextField.text = "";
    }
    
    override func viewDidLoad() {
        super.viewDidLoad();
        
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDERS, multichoice: false);
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORIES, multichoice: false);
        AtwUiUtils.setDataChooser(languagesTextField, items: Configuration.LANGUAGES, multichoice: true);
        
        confirmPasswordTextField.delegate = self;
        passwordTextField.delegate = self;
        nicknameTextField.delegate = self;
        emailTextField.delegate = self;
        
        setSensitiveConstraint(bottonSpacing, offset: toolbar.frame.height);
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

    private func showErrorMessage(popupMessage: String) {
        AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Registration", comment: "Registration page message title"), popupError: popupMessage);
    }
}
