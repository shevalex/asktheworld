//
//  ViewController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 10/12/14.
//  Copyright (c) 2014 Oleg Burakov. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var UserNameLabel: UILabel!
    
    @IBAction func LogoutButton(sender: UIButton) {
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
        self.performSegueWithIdentifier("GoTo_LoginScreen", sender: self)
    }

}

