//
//  SettingsScreenController.swift
//  AskTheWorld
//
//  Created by Oleg Burakov on 08/01/15.
//  Copyright (c) 2015 Oleg Burakov. All rights reserved.
//

import UIKit

class SettingsScreenController: UITableViewController, UITableViewDelegate
{

    @IBAction func cancelSettingsScreen(sender: AnyObject) {
                    self.dismissViewControllerAnimated(true, completion: nil)
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.navigationBarHidden = false


        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
  /*  func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int
    {
        return 1
    }*/
    
 /*   override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell
    {
        let cell = UITableViewCell(style: UITableViewCellStyle.Default, reuseIdentifier: "cell")
        cell.textLabel?.text = "test"
        return cell
        
    }*/
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
