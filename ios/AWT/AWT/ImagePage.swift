//
//  ImagePage.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/31/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class ImagePage: UIViewController {
    var attachmentHandler: AttachmentHandler! // this is set from the outside

    @IBOutlet weak var imageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad();
    }
    
    @IBAction func barButtonPressed(sender: AnyObject) {
        println("bar button pressed")
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated);
        
        var image = attachmentHandler.getSelectedAttachment() as? UIImage;
        if (image != nil) {
            imageView.image = image;
            imageView.contentMode = UIViewContentMode.ScaleAspectFit
        } else {
            self.navigationController?.popViewControllerAnimated(true);
        }
    }
}
