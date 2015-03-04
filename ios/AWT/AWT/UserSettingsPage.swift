//
//  UserSettingsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 03/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class UserSettingsPage: UITableViewController {

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

class logoutSegue: UIStoryboardSegue {
    override func perform() {
        let src = sourceViewController as UITableViewController
        let dst = destinationViewController as UIViewController
        src.navigationController?.pushViewController(dst, animated: true)
        dst.navigationItem.hidesBackButton = true
        Backend.logOut()
    }
}