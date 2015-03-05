//
//  RequestPreferencesPage.swift
//  AWT
//
//  Created by Oleg Burakov on 04/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RequestPreferencesPage: UIViewController {

    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    @IBOutlet weak var waitTimeTextField: UITextField!
    
    @IBAction func updateButtonClickAction(sender: UIButton) {
        
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
