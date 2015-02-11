//
//  ViewController.swift
//  AskTheWorld
//
// PiSoft Corporation, 2014-2015. All Rights Reserved. 
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var UserNameLabel: UILabel!
    
    @IBAction func LogoutBarButton(sender: AnyObject) {
        self.performSegueWithIdentifier("GoTo_LoginScreen", sender: self)
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewDidAppear(animated: Bool) {
        let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
        let isLoggedIn:Int = prefs.integerForKey("IsLogin") as Int
        if (isLoggedIn != 1) {
            self.performSegueWithIdentifier("GoTo_LoginScreen", sender: self)
        } else {
            self.UserNameLabel.text = prefs.valueForKey("username") as NSString
        }
        
    }

}

