//
//  AttachmentBarView.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/23/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit


protocol AttachmentHandler {
    func getSelectedAttachment() -> AnyObject?;
    func getAttachments() -> [AnyObject];
    func addAttachment(attachment: AnyObject);
    func removeAttachment(attachment: AnyObject);
}

class AttachmentBarView: UIControl, AttachmentHandler {
    private let IMAGE_INSET: CGFloat = 5
    private let imageScollView: UIScrollView = UIScrollView(frame: CGRectZero);
    private let clipView: UIImageView = UIImageView(frame: CGRectZero);
    
    private var attachmentArray: Array<AnyObject> = []
    
    private var hostingViewController: UIViewController?
    
    private var lastClickedAttachment: UIImage?;
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder);

        backgroundColor = UIColor.lightGrayColor();
        layer.cornerRadius = 5;

        
        clipView.image = UIImage(named: "paper-clip.jpg");
        addSubview(clipView);
        clipView.setTranslatesAutoresizingMaskIntoConstraints(false);
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Leading, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Leading, multiplier: 1, constant: 5));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Width, relatedBy: NSLayoutRelation.Equal, toItem: nil, attribute: NSLayoutAttribute.NotAnAttribute, multiplier: 1, constant: 30));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Top, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Top, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Bottom, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Bottom, multiplier: 1, constant: 0));
        
        addSubview(imageScollView);
        imageScollView.setTranslatesAutoresizingMaskIntoConstraints(false);
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Trailing, relatedBy: NSLayoutRelation.Equal, toItem: imageScollView, attribute: NSLayoutAttribute.Leading, multiplier: 1, constant: -5));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Trailing, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Trailing, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Top, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Top, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Bottom, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Bottom, multiplier: 1, constant: 0));
    }
    
    override func layoutSubviews() {
        super.layoutSubviews();
    }
    
    func setHostingViewController(viewController: UIViewControllerWithSpinner) {
        hostingViewController = viewController;
    }
    
    
    func getAttachments() -> [AnyObject] {
        return attachmentArray;
    }
    
    func getSelectedAttachment() -> AnyObject? {
        return lastClickedAttachment;
    }
    
    func addAttachment(attachment: AnyObject) {
        attachmentArray.append(attachment);
        
        rebuildScrollView();
    }
    
    func removeAttachment(attachment: AnyObject) {
        for (index, att) in enumerate(attachmentArray) {
            if (att === attachment) {
                attachmentArray.removeAtIndex(index);
                rebuildScrollView();
                return;
            }
        }
    }
    
    
    func imagePressedAction(gestureRecognizer: UITapGestureRecognizer) {
        lastClickedAttachment = (gestureRecognizer.view as UIImageView).image;
        
        let storyboard = UIStoryboard(name: "Main", bundle: nil);
        let imagePage = storyboard.instantiateViewControllerWithIdentifier("ImagePage") as ImagePage;
        imagePage.attachmentHandler = self;
        
        hostingViewController?.navigationController?.pushViewController(imagePage, animated: true);
    }
    
    private func rebuildScrollView() {
        for (index, child) in enumerate(imageScollView.subviews) {
            child.removeFromSuperview();
        }
        
        imageScollView.contentSize = CGSizeMake((frame.size.height + IMAGE_INSET) * CGFloat(attachmentArray.count), frame.size.height);
        
        for (index, att) in enumerate(attachmentArray) {
            let x = (frame.size.height + IMAGE_INSET) * CGFloat(index);
            let nextImageView = UIImageView(frame: CGRectMake(x, 0, frame.size.height, frame.size.height));
            
            if (att.isKindOfClass(UIImage)) {
                nextImageView.image = att as? UIImage;
            } else {
                nextImageView.image = UIImage(named: "paper-clip.jpg");
            }
            nextImageView.contentMode = UIViewContentMode.ScaleToFill;
            nextImageView.userInteractionEnabled = true;
            imageScollView.addSubview(nextImageView);
            
            var tapRecognizer = UITapGestureRecognizer(target: self, action: "imagePressedAction:");
            nextImageView.addGestureRecognizer(tapRecognizer);
        }
    }
}