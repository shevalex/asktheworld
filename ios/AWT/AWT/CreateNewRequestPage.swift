//
//  CreateNewRequestPage.swift
//  AWT
//
//  Created by Oleg Burakov on 11/03/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class CreateNewRequestPage: UIViewControllerWithSpinner {

    @IBOutlet weak var expertiseTextField: UITextField!
    @IBOutlet weak var genderTextField: UITextField!
    @IBOutlet weak var ageTextField: UITextField!
    @IBOutlet weak var waitTimeTextField: UITextField!
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    @IBOutlet weak var imageScrollView: AttachmentBarView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        AtwUiUtils.setDataChooser(expertiseTextField, items: Configuration.EXPERTISES, multichoice: false)
        AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE, multichoice: false)
        AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE, multichoice: false)
        AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME, multichoice: false)
        AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY, multichoice: false)

        // Do any additional setup after loading the view.
    }

    @IBAction func attachButtonPressed(sender: AnyObject) {
        AtwUiUtils.setImagePicker(self, {(image: UIImage) in
            self.imageScrollView.addImage(image);
        });
    }
    
    @IBAction func sendButtonClickedAction(sender: UIBarButtonItem) {
        var request = Backend.RequestObject();
        
        Backend.getInstance().createRequest(request, observer: {() -> Void in
            println("PLace a segue to close the screen");
        });
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
