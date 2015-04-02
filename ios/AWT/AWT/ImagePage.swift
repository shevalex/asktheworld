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

        var swipeRightRecognizer = UISwipeGestureRecognizer(target: self, action: "imageSwipedRightAction:");
        swipeRightRecognizer.direction = UISwipeGestureRecognizerDirection.Right;
        imageView.addGestureRecognizer(swipeRightRecognizer);
        
        var swipeLeftRecognizer = UISwipeGestureRecognizer(target: self, action: "imageSwipedLeftAction:");
        swipeRightRecognizer.direction = UISwipeGestureRecognizerDirection.Left;
        imageView.addGestureRecognizer(swipeLeftRecognizer);
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
        
        pageChanged(pageControl);
    }
    
    @IBAction func deleteButtonClickAction(sender: AnyObject) {
        attachmentHandler.removeAttachment(attachmentHandler.getAttachments()[pageControl.currentPage]);
        if (pageControl.numberOfPages == 1) {
            self.navigationController?.popViewControllerAnimated(true);
        } else {
            if (pageControl.currentPage > 0) {
                pageControl.currentPage = pageControl.currentPage - 1;
            }
            pageControl.numberOfPages = pageControl.numberOfPages - 1;
            pageChanged(pageControl);
        }
    }
    
    @IBAction func pageChanged(sender: UIPageControl) {
        imageView.image = attachmentHandler.getAttachments()[pageControl.currentPage] as? UIImage;
    }

    func imageSwipedRightAction(gestureRecognizer: UISwipeGestureRecognizer) {
        if (pageControl.currentPage + 1 < pageControl.numberOfPages) {
            pageControl.currentPage = pageControl.currentPage + 1;
            pageChanged(pageControl);
        }
    }
    func imageSwipedLeftAction(gestureRecognizer: UISwipeGestureRecognizer) {
        if (pageControl.currentPage > 0) {
            pageControl.currentPage = pageControl.currentPage - 1;
            pageChanged(pageControl);
        }
    }
}
