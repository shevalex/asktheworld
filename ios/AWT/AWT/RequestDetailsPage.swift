//
//  RequestDetailsPage.swift
//  AWT
//
//  Created by Oleg Burakov on 10/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class RequestDetailsPage: UIViewController {

    @IBOutlet weak var testLabel: UILabel!
    var requestId: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        testLabel.text = requestId

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
