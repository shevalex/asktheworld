//
//  CreateNewRequestPage.swift
//  AWT
//
//  Created by Oleg Burakov on 11/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class CreateNewRequestPage: UIViewController {

    @IBOutlet weak var expertiseTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var waitTimeTextField: UITextField!
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    
    @IBAction func attachButtonPressed(sender: AnyObject) {
        
        let imageController = UIImagePickerController()
        imageController.editing = false
        
        let attachSheet: UIAlertController = UIAlertController(title: "Please Choose", message: "", preferredStyle: UIAlertControllerStyle.ActionSheet)
        
        let cancelAction: UIAlertAction = UIAlertAction(title: "Cancel", style: .Cancel) { action -> Void in
        }
        
        let takePictureAction: UIAlertAction = UIAlertAction(title: "Take Picture", style: .Default) { action -> Void in
            println("Camera is not available in simulator")
            // imageController.sourceType = UIImagePickerControllerSourceType.Camera
            // self.presentViewController(imageController, animated: true, completion: nil)
        }
        
        let choosePictureAction: UIAlertAction = UIAlertAction(title: "Choose From Gallery", style: .Default) { action -> Void in
            imageController.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
            self.presentViewController(imageController, animated: true, completion: nil)
        }
        
        attachSheet.addAction(cancelAction)
        attachSheet.addAction(takePictureAction)
        attachSheet.addAction(choosePictureAction)
        
        self.presentViewController(attachSheet, animated: true, completion: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        AtwUiUtils.setDataChooser(expertiseTextField, items: Configuration.EXPERTISES, multichoice: false)
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE, multichoice: false)
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE, multichoice: false)
        AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME, multichoice: false)
        AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY, multichoice: false)

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
