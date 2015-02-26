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
    
    func displayPopup(popupTitle:String, popupError:String) {
        var popup = UIAlertController(title: popupTitle, message: popupError, preferredStyle: UIAlertControllerStyle.Alert)
        popup.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { action in }))
        self.presentViewController(popup, animated: true, completion: nil)
    }


    @IBAction func registerButtonAction(sender: UIButton) {
        var emailText = emailTextField.text
        
        if (emailText == "") {
            println("Gopa")
            displayPopup("Big gopa", popupError: "Gopa")
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

}
