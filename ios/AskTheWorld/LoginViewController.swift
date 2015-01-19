//
//  LoginViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 10/12/14.
//  Copyright (c) 2014 Oleg Burakov. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController, UITextFieldDelegate {
    
    func displayAlert(alertTitle:String,alertError:String)
    {
        var alert = UIAlertController(title: alertTitle, message: alertError, preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { action in
        }))
        self.presentViewController(alert, animated: true, completion: nil)
    }
    
    @IBOutlet weak var UserNameField: UITextField!

    @IBOutlet weak var PasswordField: UITextField!
    
    @IBAction func SignInButton(sender: AnyObject) {
        
        var username:NSString = UserNameField.text
        var password:NSString = PasswordField.text

        if ( username.isEqualToString("") || password.isEqualToString("") ){
            displayAlert("Login Failed!", alertError: "Please enter User Name and Password")
        } else {
            
           // var url:NSURL = NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user?login=\(username)")!
           // var request = NSMutableURLRequest(URL: url)
            var request = NSMutableURLRequest(URL: NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user?login=\(username)")!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "GET"
            
            var err: NSError?

            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            request.addValue("\(username):\(password)", forHTTPHeaderField: "Token")

            var task = session.dataTaskWithRequest(request) {data, response, error -> Void in
                println("Error: \(error)")
                println(request.allHTTPHeaderFields)
            //    var strData = NSString(data: data, encoding: NSUTF8StringEncoding)!
            //    println("Data: \(strData)")
                
                let res = response as NSHTTPURLResponse!;
                dispatch_async(dispatch_get_main_queue()) {
                    if (res.statusCode == 200)
                    {
                        var prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
                        prefs.setObject(username, forKey: "username")
                        prefs.setInteger(1, forKey: "IsLogin")
                        prefs.synchronize()
                        
                        var userId_dict: NSDictionary = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: nil) as NSDictionary
                      //  println(userId_dict["userId"]!)
                        
                        self.dismissViewControllerAnimated(true, completion: nil)
                    }
                    else {
                        self.displayAlert("Login Failed!", alertError: "Error happened!")
                    }

                }

            }
            
            task.resume()

            /* Old method - just for reference
            var url:NSURL = NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user")!
            
            var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
            request.HTTPMethod = "GET"
            request.setValue("application/json", forHTTPHeaderField: "Accept")
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("\(username):\(password)", forHTTPHeaderField: "Token")
            
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
                    prefs.setObject(username, forKey: "username")
                    prefs.setInteger(1, forKey: "IsLogin")
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
