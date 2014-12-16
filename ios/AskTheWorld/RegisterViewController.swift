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
            //var login_str:NSString = "\"login\""
            //var post:NSString = "{\"login\":\"\(username)\",\"password\":\"\(password)\",\"gender\":\"male\",\"birth_year\":1980,\"languages\":[ENG]}"
            
            var post:NSString = "{\"login\":\"\(username)\",\"password\":\"\(password)\",\"gender\":\"male\",\"byear\":1980}"
            
            println("PostData:" + post);
            
            var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld/user")!
            
            var postData:NSData = post.dataUsingEncoding(NSASCIIStringEncoding)!
            
            var postLength:NSString = String( postData.length )
            
            var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
            request.HTTPMethod = "POST"
            request.HTTPBody = postData
            request.setValue(postLength, forHTTPHeaderField: "Content-Length")
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            var reponseError: NSError?
            var response: NSURLResponse?
            
            var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)

            
            if ( urlData != nil ) {
                let res = response as NSHTTPURLResponse!;
                
                //NSLog("Response code: %ld", res.statusCode);
                NSLog("Response code: %ld", res.statusCode);
                println(res.allHeaderFields)
                
                if (res.statusCode == 201) {
                    println("Register success!");
                    self.dismissViewControllerAnimated(true, completion: nil)
                }
                else if (res.statusCode == 409) {
                    var alertView:UIAlertView = UIAlertView()
                    alertView.title = "Register Failed!"
                    alertView.message = "Such user already exist"
                    alertView.delegate = self
                    alertView.addButtonWithTitle("OK")
                    alertView.show()
                }
                else {
                    var alertView:UIAlertView = UIAlertView()
                    alertView.title = "Register Failed!"
                    alertView.message = "Connection Failed"
                    alertView.delegate = self
                    alertView.addButtonWithTitle("OK")
                    alertView.show()
                }
            }
            
        }
    }

    @IBAction func LoginButton_Reg(sender: UIButton) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    @IBAction func TryDeleteUser(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld/user/2")!
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!;
            
            NSLog("Response code: %ld", res.statusCode);
        }
        
    }
    
    @IBAction func UpdateUserTest(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld/user/8")!
        
        var post:NSString = "{\"password\":\"AnyPass\",\"gender\":\"female\",\"byear\":1985}"
        
        println("PostData:" + post);
        
        var postData:NSData = post.dataUsingEncoding(NSASCIIStringEncoding)!
        
        var postLength:NSString = String( postData.length )
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "POST"
        request.HTTPBody = postData
        request.setValue(postLength, forHTTPHeaderField: "Content-Length")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!
            
            NSLog("Response code: %ld", res.statusCode)
            println(res.allHeaderFields)
        }
        
    }
    
    
    @IBAction func GetUsersTest(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld/user")!
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!
            
            NSLog("Response code: %ld", res.statusCode)
            println(res.allHeaderFields)
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
