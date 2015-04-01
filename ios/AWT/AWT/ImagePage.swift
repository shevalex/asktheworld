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
    @IBOutlet weak var pageControl: UIPageControl!
    
    override func viewDidLoad() {
        super.viewDidLoad();
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated);
        
        if (attachmentHandler.getAttachments().count == 0) {
            self.navigationController?.popViewControllerAnimated(true);
            return;
        }
        
        pageControl.numberOfPages = attachmentHandler.getAttachments().count;
        
        var image = attachmentHandler.getSelectedAttachment() as? UIImage;
        if (image == nil) {
            image = attachmentHandler.getAttachments()[0] as? UIImage;
            pageControl.currentPage = 0;
        } else {
            for (index, img) in enumerate(attachmentHandler.getAttachments()) {
                if (img === image) {
                    pageControl.currentPage = index;
                    break;
                }
            }
        }
        imageView.image = image;
    }
    
    @IBAction func deleteButtonClickAction(sender: AnyObject) {
        attachmentHandler.removeAttachment(attachmentHandler.getAttachments()[sender.currentPage]);
    }
    
    @IBAction func pageChanged(sender: UIPageControl) {
        imageView.image = attachmentHandler.getAttachments()[sender.currentPage] as? UIImage;
    }
}
