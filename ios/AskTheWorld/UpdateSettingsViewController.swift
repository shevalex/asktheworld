//
//  UpdateSettingsViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 13/01/15.
//  Copyright (c) 2015 Oleg Burakov. All rights reserved.
//

import UIKit

class UpdateSettingsViewController: UIViewController {

    func displayAlert(alertTitle:String,alertError:String)
    {
        var alert = UIAlertController(title: alertTitle, message: alertError, preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { action in
        }))
        self.presentViewController(alert, animated: true, completion: nil)
    }
    
    @IBOutlet weak var CurrentPasswordField_USVC: UITextField!
    
    @IBOutlet weak var NewPasswordField_USVC: UITextField!
    
    @IBOutlet weak var ConfirmNewPasswordField_USVC: UITextField!
    
    @IBOutlet weak var NicknameField_USVC: UITextField!
    
    @IBAction func UpdateUserSettings_USVC(sender: AnyObject) {
        var current_password:NSString = CurrentPasswordField_USVC.text
        var new_password:NSString = NewPasswordField_USVC.text
        var confirm_new_password:NSString = ConfirmNewPasswordField_USVC.text
        var nickname:NSString = NicknameField_USVC.text
        
        if ( current_password.isEqualToString("") ){
            displayAlert("Update Failed!", alertError: "Please enter the valid current password")
        } else if ( !new_password.isEqual(confirm_new_password) ) {
            displayAlert("Update Failed!", alertError: "Passwords doesn't match")
        } else
        {
            let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
            var username:NSString = prefs.valueForKey("username") as NSString
            // println(username)
            
            var request = NSMutableURLRequest(URL: NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user?login=\(username)")!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "GET"
            
            var err: NSError?
            
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            request.addValue("\(username):\(current_password)", forHTTPHeaderField: "Token")
            
            var task = session.dataTaskWithRequest(request) {data, response, error -> Void in
                println("Error: \(error)")
                println(request.allHTTPHeaderFields)
                let res = response as NSHTTPURLResponse!;
                println(res.statusCode)
                dispatch_async(dispatch_get_main_queue()) {
                    if (res.statusCode == 200){
                        var userId_dict: NSDictionary = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: nil) as NSDictionary
                        println(userId_dict["userId"]!)
                        var userId: AnyObject? = userId_dict["userId"]
                        
                        var request = NSMutableURLRequest(URL: NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user/\(userId!)")!)
                        var session = NSURLSession.sharedSession()
                        request.HTTPMethod = "PUT"
                        var params = ["password":"\(new_password)","name":"\(nickname)"] as Dictionary
                        
                        var err: NSError?
                        request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
                        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
                        request.addValue("application/json", forHTTPHeaderField: "Accept")
                        request.addValue("\(username):\(current_password)", forHTTPHeaderField: "Token")
                        
                        println(params)
                        
                        var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                            println("Response: \(response)")
                            let res = response as NSHTTPURLResponse!
                            println(res.statusCode)
                            if (res.statusCode == 200) {
                                println("Update Success!");
                                self.dismissViewControllerAnimated(true, completion: nil)
                            }
                            else if (res.statusCode == 400) {
                                println("Bad request")
                            }
                            else {
                                println("Error!")
                            }
                        })
                        
                        task.resume()
                    }
                    else {
                        self.displayAlert("Update Failed!", alertError: "Error happened!")
                    }
                }
            }

            task.resume()
    
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
