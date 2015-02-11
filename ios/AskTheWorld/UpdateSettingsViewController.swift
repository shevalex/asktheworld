//
//  UpdateSettingsViewController.swift
//  AskTheWorld
//
// PiSoft Corporation, 2014-2015. All Rights Reserved. 
//

import UIKit

class UpdateSettingsViewController: UIViewController, UIPickerViewDelegate, UITextFieldDelegate {

    var activityIndicator:UIActivityIndicatorView = UIActivityIndicatorView()
    
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
    
    @IBOutlet weak var GenderField_USVC: UITextField!
    
    @IBOutlet weak var AgeCategory_USVC: UITextField!
    
    @IBAction func UpdateUserSettings_USVC(sender: AnyObject) {
        var current_password:NSString = CurrentPasswordField_USVC.text
        var new_password:NSString = NewPasswordField_USVC.text
        var confirm_new_password:NSString = ConfirmNewPasswordField_USVC.text
        var nickname:NSString = NicknameField_USVC.text
        var gender:NSString = GenderField_USVC.text
        var ageCategory:NSString = AgeCategory_USVC.text
        
        if ( current_password.isEqualToString("") ){
            displayAlert("Update Failed!", alertError: "Please enter the valid current password")
        } else if ( !new_password.isEqual(confirm_new_password) ) {
            displayAlert("Update Failed!", alertError: "Passwords doesn't match")
        } else
        {
            activityIndicator = UIActivityIndicatorView(frame: CGRectMake(0, 0, 50, 50))
            activityIndicator.center = self.view.center
            activityIndicator.hidesWhenStopped = true
            activityIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
            view.addSubview(activityIndicator)
            activityIndicator.startAnimating()
            UIApplication.sharedApplication().beginIgnoringInteractionEvents()
            
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
                        
                        var params = Dictionary<String,String>()
                        if new_password != "" {
                            params["password"] = "\(new_password)"
                        } else if nickname != "" {
                            params["name"] = "\(nickname)"
                        } else if gender != "" {
                            params["gender"] = "\(gender)"
                        } else if ageCategory != "" {
                            params["age_category"] = "\(ageCategory)"
                        }
                        //var params = ["password":"\(new_password)","name":"\(nickname)","gender":"\(gender)","age_category":"\(ageCategory)"] as Dictionary
                        
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
                            dispatch_async(dispatch_get_main_queue()) {
                            if (res.statusCode == 200) {
                                println("Update Success!");
                                self.activityIndicator.stopAnimating()
                                UIApplication.sharedApplication().endIgnoringInteractionEvents()
                                var alert = UIAlertController(title: "Update successful", message: "Update Successful", preferredStyle: UIAlertControllerStyle.Alert)
                                alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default, handler: { (action) -> Void in
                                    self.performSegueWithIdentifier("BackToSettings", sender: self)
                                }))
                                self.presentViewController(alert, animated: true, completion: nil)

                            }
                            else if (res.statusCode == 400) {
                                self.activityIndicator.stopAnimating()
                                UIApplication.sharedApplication().endIgnoringInteractionEvents()
                                self.displayAlert("Update Failed!", alertError: "Error happened!")
                            }
                            else {
                                self.activityIndicator.stopAnimating()
                                UIApplication.sharedApplication().endIgnoringInteractionEvents()
                                self.displayAlert("Update Failed!", alertError: "Error happened!")
                            }
                            }
                        })
                        
                        task.resume()
                    }
                    else {
                        self.activityIndicator.stopAnimating()
                        UIApplication.sharedApplication().endIgnoringInteractionEvents()
                        self.displayAlert("Update Failed!", alertError: "Error happened!")
                    }
                }
            }

            task.resume()
    
        }
    }
    
    let gender_array = ["Please Select", "Male", "Female"]
    let age_category = ["Please Select", "Child", "Teenager", "Young", "Adult", "Senior"]
    
    @IBOutlet var getGender: UIPickerView!
    @IBOutlet var getAgeCategory: UIPickerView!
    @IBOutlet weak var Gender_toolBar: UIToolbar!
    @IBOutlet weak var AgeCategory_toolBar: UIToolbar!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        super.viewDidLoad()
        getGender = UIPickerView()
        getAgeCategory = UIPickerView()
        
        getGender.delegate = self
        getAgeCategory.delegate = self
        
        self.GenderField_USVC.inputView = self.getGender;
        self.AgeCategory_USVC.inputView = self.getAgeCategory;
        
        var gender_toolbar = UIToolbar(frame: CGRectMake(0, 0, self.view.bounds.size.width, 44))
        var gender_item = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: self, action: "doneGenderAction")
        gender_toolbar.setItems([gender_item], animated: true)
        self.GenderField_USVC.inputAccessoryView = gender_toolbar
        self.Gender_toolBar = gender_toolbar
        
        var ageCategory_toolbar = UIToolbar(frame: CGRectMake(0, 0, self.view.bounds.size.width, 44))
        var ageCategory_item = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: self, action: "doneAgeCategoryAction")
        ageCategory_toolbar.setItems([ageCategory_item], animated: true)
        self.AgeCategory_USVC.inputAccessoryView = ageCategory_toolbar
        self.AgeCategory_toolBar = ageCategory_toolbar

        // Do any additional setup after loading the view.
    }
    
    func doneGenderAction() {
        self.GenderField_USVC.resignFirstResponder()
    }
    
    func doneAgeCategoryAction() {
        self.AgeCategory_USVC.resignFirstResponder()
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
            GenderField_USVC.text = gender_array[row]
        } else if pickerView == getAgeCategory {
            AgeCategory_USVC.text = age_category[row]
        }
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
