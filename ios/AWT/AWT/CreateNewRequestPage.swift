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
    var expertiseSelector: SelectorView!
    
    @IBOutlet weak var genderTextField: UITextField!
    var genderSelector: SelectorView!
    
    @IBOutlet weak var ageTextField: UITextField!
    var ageSelector: SelectorView!
    
    @IBOutlet weak var waitTimeTextField: UITextField!
    var waitTimeSelector: SelectorView!
    
    @IBOutlet weak var numberOfResponsesTextField: UITextField!
    var numOfResponsesSelector: SelectorView!
    
    @IBOutlet weak var imageScrollView: AttachmentBarView!
    @IBOutlet weak var requestTextField: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        imageScrollView.setHostingView(self)
        
        expertiseSelector = AtwUiUtils.setDataChooser(expertiseTextField, items: Configuration.EXPERTISES, multichoice: false);
        genderSelector = AtwUiUtils.setDataChooser(genderTextField, items: Configuration.GENDER_PREFERENCE, multichoice: false);
        ageSelector = AtwUiUtils.setDataChooser(ageTextField, items: Configuration.AGE_CATEGORY_PREFERENCE, multichoice: false);
        waitTimeSelector = AtwUiUtils.setDataChooser(waitTimeTextField, items: Configuration.RESPONSE_WAIT_TIME, multichoice: false);
        numOfResponsesSelector = AtwUiUtils.setDataChooser(numberOfResponsesTextField, items: Configuration.RESPONSE_QUANTITY, multichoice: false);
    }

    @IBAction func attachButtonPressed(sender: AnyObject) {
        AtwUiUtils.setImagePicker(self, {(image: UIImage) in
            self.imageScrollView.addImage(image);
        });
    }
    
    @IBAction func sendButtonClickedAction(sender: UIBarButtonItem) {
        if (requestTextField.text == "") {
            AtwUiUtils.showPopup(self, popupTitle: NSLocalizedString("Error", comment: "Error title"), popupError: NSLocalizedString("Please enter a message", comment: "Cannot send empty request"), okCallback: { () -> Void in
            });
            
            return;
        }
        
        
        var request = Backend.RequestObject();
        
//        request.attachments;
        request.expertiseCategory = expertiseSelector.getSelectedItem();
        request.responseAgeGroup = ageSelector.getSelectedItem();
        request.responseGender = genderSelector.getSelectedItem();
        request.responseQuantity = numOfResponsesSelector.getSelectedItem();
        request.responseWaitTime = waitTimeSelector.getSelectedItem();
        request.text = requestTextField.text;
        
        Backend.getInstance().createRequest(request, observer: {(id) -> Void in
            self.navigationController?.popViewControllerAnimated(true);
            return;
        });
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);

        expertiseSelector.setSelectedItem(Configuration.EXPERTISES[0]);
        genderSelector.setSelectedItem(Backend.getInstance().getUserContext().requestTargetGender);
        ageSelector.setSelectedItem(Backend.getInstance().getUserContext().requestTargetAge);
        waitTimeSelector.setSelectedItem(Backend.getInstance().getUserContext().responseWaitTime);
        numOfResponsesSelector.setSelectedItem(Backend.getInstance().getUserContext().responseQuantity);
        
        requestTextField.text = "";
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
