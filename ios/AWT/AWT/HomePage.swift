//
//  ViewController.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class HomePage: UIViewController {

    @IBOutlet weak var activeRequestsLabel: UILabel!
    @IBOutlet weak var requestTableView: UITableView!
    @IBOutlet weak var activeResponsesLabel: UILabel!
    @IBOutlet weak var responseTableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true;

        var selectionObserver: RequestManagement.RequestSelectionObserver = { (requestId) in
            println("Clicked \(requestId)");
        }
        
        RequestManagement.attachRequestObjectProvider(requestTableView, requestObjectProvider: RequestManagement.ActiveOutgoingRequestObjectProvider(), selectionObserver);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

