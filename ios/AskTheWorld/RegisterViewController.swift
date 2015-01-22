//
//  RegisterViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 10/12/14.
//  Copyright (c) 2014 Oleg Burakov. All rights reserved.
//

import UIKit

class RegisterViewController: UIViewController, UIPickerViewDelegate, UITextFieldDelegate {

    var activityIndicator:UIActivityIndicatorView = UIActivityIndicatorView()
    
    func displayAlert(alertTitle:String,alertError:String)
    {
        var alert = UIAlertController(title: alertTitle, message: alertError, preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { action in
        }))
        self.presentViewController(alert, animated: true, completion: nil)
    }
    
    @IBOutlet weak var UserNameField_Reg: UITextField!
    
    @IBOutlet weak var PasswordField_Reg: UITextField!
    
    @IBOutlet weak var ConfirmPassword_Reg: UITextField!
    
    @IBOutlet weak var NickName_Reg: UITextField!

    @IBOutlet weak var AgeCategory_Reg: UITextField!
    
    @IBOutlet weak var Gender_Reg: UITextField!

    @IBOutlet weak var Languages_Reg: UITextField!
    
    @IBAction func Language_Type_2(sender: AnyObject) {
        
            self.performSegueWithIdentifier("Lang_seg", sender: self)
    }
    @IBAction func RegisterButton_Reg(sender: AnyObject) {        
        var username:NSString = UserNameField_Reg.text
        var password:NSString = PasswordField_Reg.text
        var confirm_password:NSString = ConfirmPassword_Reg.text
        var nickname:NSString = NickName_Reg.text
        var gender:NSString = Gender_Reg.text
        var age_category:NSString = AgeCategory_Reg.text
        
        if ( username.isEqualToString("") || password.isEqualToString("") ){
            displayAlert("Register Failed!", alertError: "Please enter User Name and Password")
        } else if (username.length < 4 || password.length < 4) {
           displayAlert("Register Failed!", alertError: "User name and password should have more than 3 symbols")
        } else if ( !password.isEqual(confirm_password) ) {
            displayAlert("Register Failed!", alertError: "Passwords doesn't Match")
        } else if (nickname.isEqualToString("")) {
            displayAlert("Register Failed!", alertError: "Nickname cannot be empty")
        } else if (age_category.isEqualToString("Please Select") || age_category.isEqualToString("")) {
            displayAlert("Register Failed!", alertError: "Please choose the Age Category")
        } else if (gender.isEqualToString("Please Select") || gender.isEqualToString("") ) {
            displayAlert("Register Failed!", alertError: "Please choose Gender")
        } else {
            
            activityIndicator = UIActivityIndicatorView(frame: CGRectMake(0, 0, 50, 50)) //need to check this coordinates.
            activityIndicator.center = self.view.center
            activityIndicator.hidesWhenStopped = true
            activityIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
            view.addSubview(activityIndicator)
            activityIndicator.startAnimating()
            UIApplication.sharedApplication().beginIgnoringInteractionEvents()
            
            var request = NSMutableURLRequest(URL: NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user")!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "POST"
            var params = ["login":"\(username)", "password":"\(password)", "name":"\(nickname)", "gender":"\(gender)", "age_category":"\(age_category)"] as Dictionary
            
            var err: NSError?
            request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            
            println(params)

            var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                println("Response: \(response)")
                let res = response as NSHTTPURLResponse!;
                println(res.statusCode)
                dispatch_async(dispatch_get_main_queue()) {
                   if (res.statusCode == 201) {
                       println("Register success!");
                       self.activityIndicator.stopAnimating()
                       UIApplication.sharedApplication().endIgnoringInteractionEvents()
                       self.dismissViewControllerAnimated(true, completion: nil)
                   }
                   else if (res.statusCode == 409) {
                       self.activityIndicator.stopAnimating()
                       UIApplication.sharedApplication().endIgnoringInteractionEvents()
                       self.displayAlert("Register Failed!", alertError: "Such user already exist")
                   }
                   else {
                       self.activityIndicator.stopAnimating()
                       UIApplication.sharedApplication().endIgnoringInteractionEvents()
                       self.displayAlert("Register Failed!", alertError: "Connection Failed")
                   }
                }
            })

            task.resume()

          /* Old method
            //var post:NSString = "{\"login\":\"\(username)\",\"password\":\"\(password)\",\"name\":\"nickname\",\"gender\":\"male\",\"birth_year\":\(year_of_birth),\"languages\":[ENG]}"
            
             var post:NSString = "{\"login\":\"\(username)\",\"password\":\"\(password)\",\"name\":\"\(nickname)\",\"gender\":\"\(gender)\",\"age_category\":\"\(age_category)\"}"
            
            
            println("PostData:" + post);
            
            var url:NSURL = NSURL(string: "https://hidden-taiga-8809.herokuapp.com/user")!
            //var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld3s/user")!
            
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
                
                println("Response code: \(res.statusCode)")
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
            }*/
            
        }
    }

    @IBAction func LoginButton_Reg(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    
/*  Next 3 function commented out - they are only for test purposes at the moment. UIButtons from storyboard also removed.
    Should be added back - if need to test these actions.
    
    @IBAction func TryDeleteUser(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld2/user/2")!
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!;
            
            println("Response code: \(res.statusCode)")
        }
        
    }
    
    @IBAction func UpdateUserTest(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld2/user/1")!
        
        var put:NSString = "{\"password\":\"AnyPass\",\"gender\":\"male\",\"byear\":1986}"
        
        println("putData: \(put)")
        
        var putData:NSData = put.dataUsingEncoding(NSASCIIStringEncoding)!
        
        var putLength:NSString = String( putData.length )
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "PUT"
        request.HTTPBody = putData
        request.setValue(putLength, forHTTPHeaderField: "Content-Length")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!
            
            println("Response code: \(res.statusCode)")
            println(res.allHeaderFields)
        }
        
    }
    
    
    @IBAction func GetUsersTest(sender: UIButton) {
        var url:NSURL = NSURL(string: "http://env-7303452.whelastic.net/asktheworld2/user")!
        
        var request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
        request.HTTPMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var reponseError: NSError?
        var response: NSURLResponse?
        
        var urlData: NSData? = NSURLConnection.sendSynchronousRequest(request, returningResponse:&response, error:&reponseError)
        if ( urlData != nil ) {
            let res = response as NSHTTPURLResponse!
            
            println("Response code: \(res.statusCode)")
            println(res.allHeaderFields)
        }

    }
    */
    
    let gender_array = ["Please Select", "Male", "Female"]
    let age_category = ["Please Select", "Child", "Teenager", "Young", "Adult", "Senior"]
    
    @IBOutlet var getGender: UIPickerView!
    @IBOutlet var getAgeCategory: UIPickerView!
    @IBOutlet weak var Gender_toolBar: UIToolbar!
    @IBOutlet weak var AgeCategory_toolBar: UIToolbar!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        getGender = UIPickerView()
        getAgeCategory = UIPickerView()
        
        getGender.delegate = self
        getAgeCategory.delegate = self
        
        self.Gender_Reg.inputView = self.getGender;
        self.AgeCategory_Reg.inputView = self.getAgeCategory;
        
        var gender_toolbar = UIToolbar(frame: CGRectMake(0, 0, self.view.bounds.size.width, 44))
        var gender_item = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: self, action: "doneGenderAction")
        gender_toolbar.setItems([gender_item], animated: true)
        self.Gender_Reg.inputAccessoryView = gender_toolbar
        self.Gender_toolBar = gender_toolbar
        
        var ageCategory_toolbar = UIToolbar(frame: CGRectMake(0, 0, self.view.bounds.size.width, 44))
        var ageCategory_item = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: self, action: "doneAgeCategoryAction")
        ageCategory_toolbar.setItems([ageCategory_item], animated: true)
        self.AgeCategory_Reg.inputAccessoryView = ageCategory_toolbar
        self.AgeCategory_toolBar = ageCategory_toolbar

        // Do any additional setup after loading the view.
    }
    
    func doneGenderAction() {
        self.Gender_Reg.resignFirstResponder()
    }
    
    func doneAgeCategoryAction() {
        self.AgeCategory_Reg.resignFirstResponder()
    }
    
    func numberOfComponentsInPickerView(pickerView: UIPickerView!) -> Int{
        return 1
    }
    
    func pickerView(pickerView: UIPickerView!, numberOfRowsInComponent component: Int) -> Int{
        if pickerView == getGender {
            return gender_array.count
        } else if pickerView == getAgeCategory {
            return age_category.count
        }
        return 1
    }
    
    func pickerView(pickerView: UIPickerView!, titleForRow row: Int, forComponent component: Int) -> String! {
        if pickerView == getGender {
            return gender_array[row]
        } else if pickerView == getAgeCategory {
            return age_category[row]
        }
        return ""
    }
    
    func pickerView(pickerView: UIPickerView!, didSelectRow row: Int, inComponent component: Int)
    {
        if pickerView == getGender {
            Gender_Reg.text = gender_array[row]
        } else if pickerView == getAgeCategory {
            AgeCategory_Reg.text = age_category[row]
        }
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
