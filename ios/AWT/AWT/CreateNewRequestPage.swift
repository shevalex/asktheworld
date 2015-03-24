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
    @IBOutlet weak var imageScrollView: UIScrollView!
    
    var imageArray: Array<UIImage> = [];
    var xCoordinate: Int = 0;
    
    @IBAction func attachButtonPressed(sender: AnyObject) {
        var imagePickObserver: ImagePickObserver = {(image: UIImage) in
            self.imageArray.append(image)
            self.imageScrollView.contentSize = CGSizeMake(CGFloat(Int(self.imageScrollView.frame.size.height + 5) * self.imageArray.count), self.imageScrollView.frame.size.height)
            self.xCoordinate = 5 + Int(self.imageScrollView.frame.size.height + 5) * (self.imageArray.count - 1)
            let newImageView = UIImageView(frame: CGRectMake(CGFloat(self.xCoordinate), 0, self.imageScrollView.frame.size.height, self.imageScrollView.frame.size.height))
            newImageView.image = image
            newImageView.contentMode = UIViewContentMode.ScaleToFill
            self.imageScrollView.addSubview(newImageView)
        }
        AtwUiUtils.setImagePicker(self, imagePickObserver);
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
