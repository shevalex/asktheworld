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
    
    let genderArray = ["Male","Female"]
    let ageArray = ["Teen","Young","Adult"]
    
    class PickerDelegate: NSObject, UIPickerViewDelegate {
        let arrayElements: Array<String>
        let textEdit: UITextField!
        
        init(elements: Array<String>, textField: UITextField) {
            arrayElements = elements
            textEdit = textField
        }
        
        func numberOfComponentsInPickerView(pickerView: UIPickerView!) -> Int{
            return 1
        }
        func pickerView(pickerView: UIPickerView!, numberOfRowsInComponent component: Int) -> Int{
            return arrayElements.count
        }
        func pickerView(pickerView: UIPickerView!, titleForRow row: Int, forComponent component: Int) -> String! {
            return arrayElements[row]
        }
        func pickerView(pickerView: UIPickerView!, didSelectRow row: Int, inComponent component: Int)
        {
            textEdit.text = arrayElements[row]
        }
        
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
    
    var genderDelegate: PickerDelegate!
    var ageDelegate: PickerDelegate!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        var genderPicker = UIPickerView()
        var agePicker = UIPickerView()
        
        genderDelegate = PickerDelegate(elements: genderArray, textField: genderTextField)
        ageDelegate = PickerDelegate(elements: ageArray, textField: ageTextField)
        
        genderPicker.delegate = genderDelegate
        agePicker.delegate = ageDelegate
        
        genderTextField.inputView = genderPicker
        ageTextField.inputView = agePicker
        
        
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
