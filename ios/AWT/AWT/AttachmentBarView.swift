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
    func addAttachment(attachment: AnyObject);
    func removeAttachment(attachment: AnyObject);
}

class AttachmentBarView: UIControl, AttachmentHandler {
    private let IMAGE_INSET: CGFloat = 5
    private let imageScollView: UIScrollView = UIScrollView(frame: CGRectZero);
    private let clipView: UIImageView = UIImageView(frame: CGRectZero);
    
    private var imageArray: Array<UIImage> = []
    
    private var hostingView: UIViewController?
    
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
    
    func setHostingView(view: UIViewControllerWithSpinner) {
        hostingView = view;
    }
    
    
    func getSelectedAttachment() -> AnyObject? {
        return lastClickedAttachment;
    }
    
    func addAttachment(attachment: AnyObject) {
        addImage(attachment as UIImage);
    }
    
    func removeAttachment(attachment: AnyObject) {
        removeImage(attachment as UIImage);
    }
    
    
    func imagePressedAction(gestureRecognizer: UITapGestureRecognizer) {
        lastClickedAttachment = (gestureRecognizer.view as UIImageView).image;
        
        let storyboard = UIStoryboard(name: "Main", bundle: nil);
        let imagePage = storyboard.instantiateViewControllerWithIdentifier("ImagePage") as ImagePage;
        imagePage.attachmentHandler = self;
        
        hostingView?.navigationController?.pushViewController(imagePage, animated: true);
    }
    
    private func addImage(image: UIImage) {
        imageArray.append(image);
        
        imageScollView.contentSize = CGSizeMake((frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count), frame.size.height);
        
        let x = (frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count - 1);
        let newImageView = UIImageView(frame: CGRectMake(x, 0, frame.size.height, frame.size.height));
        newImageView.image = image;
        newImageView.contentMode = UIViewContentMode.ScaleToFill;
        newImageView.userInteractionEnabled = true;
        imageScollView.addSubview(newImageView);
        
        var tapRecognizer = UITapGestureRecognizer(target: self, action: "imagePressedAction:");
        newImageView.addGestureRecognizer(tapRecognizer);
    }
    
    private func removeImage(imageToRemove: UIImage) {
        for (index, image) in enumerate(imageArray) {
            if (image === imageToRemove) {
                for (index, imageView) in enumerate (imageScollView.subviews) {
                    if ((imageView as UIImageView).image === imageToRemove) {
                        imageView.removeFromSuperview();
                    }
                }
            }
        }
    }
}