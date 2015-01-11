//
//  LoginViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 10/12/14.
//  Copyright (c) 2014 Oleg Burakov. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var UserNameField: UITextField!

    @IBOutlet weak var PasswordField: UITextField!
    
    @IBAction func SignInButton(sender: AnyObject) {
        
        var username:NSString = UserNameField.text
        var password:NSString = PasswordField.text

        if ( username.isEqualToString("") || password.isEqualToString("") ){
            var alertView:UIAlertView = UIAlertView()
            alertView.title = "Login Failed!"
            alertView.message = "Please enter User Name and Password"
            alertView.delegate = self
            alertView.addButtonWithTitle("OK")
            alertView.show()
        } else {
            
            var request = NSMutableURLRequest(URL: NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user")!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "GET"
            
            var err: NSError?

            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            request.addValue("\(username):\(password)", forHTTPHeaderField: "Token")

            var task = session.dataTaskWithRequest(request) {data, response, error -> Void in
                println("Response: \(response)")
                println("Error: \(error)")
                println(request.allHTTPHeaderFields)
                let res = response as NSHTTPURLResponse!;
                dispatch_async(dispatch_get_main_queue()) {
                    if (res.statusCode == 200)
                    {
                        var prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
                        prefs.setObject(username, forKey: "username")
                        prefs.setInteger(1, forKey: "IsLogin")
                        prefs.synchronize()
                        
                        self.dismissViewControllerAnimated(true, completion: nil)
                    }
                    else {
                        var alertView:UIAlertView = UIAlertView()
                        alertView.title = "Login Failed!"
                        alertView.message = "Error happened!"
                        alertView.delegate = self
                        alertView.addButtonWithTitle("OK")
                        alertView.show()
                    }

                }

            }
            
            task.resume()

            /* Old method
            var url:NSURL = NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user")!
            
            var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
            request.HTTPMethod = "GET"
            request.setValue("application/json", forHTTPHeaderField: "Accept")
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("\(username):\(password)", forHTTPHeaderField: "Token")
            //request.setValue("\"\(username)\":\"\(password)\"", forHTTPHeaderField: "Token")
            
            var reponseError: NSError?
            var response: NSURLResponse?
            
            println(request.allHTTPHeaderFields)
            
            var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
            
            println(response)
            println(reponseError)
            
            if ( urlData != nil ) {
                let res = response as NSHTTPURLResponse!
                
                if (res != nil)
                {
                println("Response code: \(res.statusCode)")
                println(res.allHeaderFields)
                if (res.statusCode == 200)
                {
                    var prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
                    prefs.setObject(username, forKey: "USERNAME")
                    prefs.setInteger(1, forKey: "ISLOGGEDIN")
                    prefs.synchronize()
                    
                    self.dismissViewControllerAnimated(true, completion: nil)
                }
                else {
                    var alertView:UIAlertView = UIAlertView()
                    alertView.title = "Login Failed!"
                    alertView.message = "No such user!"
                    alertView.delegate = self
                    alertView.addButtonWithTitle("OK")
                    alertView.show()
                }
                }
                else
                {
                    println("res is null")
                }
            }*/


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
    
    override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
        self.view.endEditing(true)
        
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
