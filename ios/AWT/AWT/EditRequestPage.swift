//
//  EditRequestPage.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/27/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class EditRequestPage: UIViewControllerWithSpinner {
    
    @IBOutlet weak var expertiseTextField: UITextField!
    
    @IBOutlet weak var genderTextField: UITextField!
    
    @IBOutlet weak var ageTextField: UITextField!
    
    @IBOutlet weak var waitTimeTextField: UITextField!
    
    @IBOutlet weak var numOfResponsesTextField: UITextField!
    
    
    @IBOutlet weak var requestTextField: UITextView!
    
    
    @IBOutlet weak var attachmentsView: UIScrollView!
    
    @IBAction func attachButtonClickAction(sender: AnyObject) {
    }
    
    @IBAction func sendButtonClickAction(sender: AnyObject) {
    }
    
}
