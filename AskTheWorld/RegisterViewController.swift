//
//  RegisterViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 10/12/14.
//  Copyright (c) 2014 Oleg Burakov. All rights reserved.
//

import UIKit

class RegisterViewController: UIViewController {

    @IBOutlet weak var UserNameField_Reg: UITextField!
    
    @IBOutlet weak var PasswordField_Reg: UITextField!
    
    @IBOutlet weak var ConfirmPassword_Reg: UITextField!
    
    @IBAction func RegisterButton_Reg(sender: UIButton) {
        
        var username:NSString = UserNameField_Reg.text
        var password:NSString = PasswordField_Reg.text
        var confirm_password:NSString = ConfirmPassword_Reg.text
        
        if ( username.isEqualToString("") || password.isEqualToString("") ){
            var alertView:UIAlertView = UIAlertView()
            alertView.title = "Register Failed!"
            alertView.message = "Please enter User Name and Password"
            alertView.delegate = self
            alertView.addButtonWithTitle("OK")
            alertView.show()
        } else if ( !password.isEqual(confirm_password) ) {
            var alertView:UIAlertView = UIAlertView()
            alertView.title = "Register Failed!"
            alertView.message = "Passwords doesn't Match"
            alertView.delegate = self
            alertView.addButtonWithTitle("OK")
            alertView.show()
        } else {
            //connect to server somehow
        }
    }

    @IBAction func LoginButton_Reg(sender: UIButton) {
        self.dismissViewControllerAnimated(true, completion: nil)
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
