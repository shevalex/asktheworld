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
    func addAttachment(attachment: AnyObject) -> Bool;
    func removeAttachment(attachment: AnyObject) -> Bool;
}

class AttachmentBarView: UIControl, AttachmentHandler {
    private let IMAGE_INSET: CGFloat = 5
    private let imageScollView: UIScrollView = UIScrollView(frame: CGRectZero)
    private let clipView: UIImageView = UIImageView(frame: CGRectZero)
    
    private var isMutable = true;
    
    private var attachmentArray: Array<AnyObject> = []
    
    private var hostingViewController: UIViewController?
    
    private var lastClickedAttachment: UIImage?
    
    private var storyboard: UIStoryboard!;
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)!;

        backgroundColor = UIColor.lightGrayColor();
        layer.cornerRadius = 5;

        setMutable(true);
        
        addSubview(clipView);
        clipView.translatesAutoresizingMaskIntoConstraints = false;
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Leading, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Leading, multiplier: 1, constant: 5));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Width, relatedBy: NSLayoutRelation.Equal, toItem: nil, attribute: NSLayoutAttribute.NotAnAttribute, multiplier: 1, constant: 30));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Top, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Top, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Bottom, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Bottom, multiplier: 1, constant: 0));
        
        clipView.userInteractionEnabled = true;
        let clipTapRecognizer = UITapGestureRecognizer(target: self, action: "clipPressedAction:");
        clipView.addGestureRecognizer(clipTapRecognizer);

        
        addSubview(imageScollView);
        imageScollView.translatesAutoresizingMaskIntoConstraints = false;
        addConstraint(NSLayoutConstraint(item: clipView, attribute: NSLayoutAttribute.Trailing, relatedBy: NSLayoutRelation.Equal, toItem: imageScollView, attribute: NSLayoutAttribute.Leading, multiplier: 1, constant: -5));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Trailing, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Trailing, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Top, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Top, multiplier: 1, constant: 0));
        addConstraint(NSLayoutConstraint(item: imageScollView, attribute: NSLayoutAttribute.Bottom, relatedBy: NSLayoutRelation.Equal, toItem: self, attribute: NSLayoutAttribute.Bottom, multiplier: 1, constant: 0));
    }
    
    override func layoutSubviews() {
        super.layoutSubviews();
    }
    
    func setHostingViewController(viewController: AtwUIViewController) {
        hostingViewController = viewController;
    }
    
    func setMutable(mutable: Bool) {
        isMutable = mutable;
        
        clipView.userInteractionEnabled = mutable;
        clipView.image = mutable ? UIImage(named: "paper-clip.jpg") : nil;

    }
    
    func getAttachments() -> [AnyObject] {
        return attachmentArray;
    }
    
    func getSelectedAttachment() -> AnyObject? {
        return lastClickedAttachment;
    }
    
    func addAttachment(attachment: AnyObject) -> Bool {
        if (!isMutable) {
            return false;
        }
        
        attachmentArray.append(attachment);
        
        rebuildScrollView();
        
        return true;
    }
    
    func removeAttachment(attachment: AnyObject) -> Bool {
        if (!isMutable) {
            return false;
        }
        
        for (index, att) in attachmentArray.enumerate() {
            if (att === attachment) {
                attachmentArray.removeAtIndex(index);
                rebuildScrollView();
                return true;
            }
        }
        
        return false;
    }
    

    func showAttachAction() {
        AtwUiUtils.setImagePicker(hostingViewController!, imagePickObserver: {(image: UIImage) in
            self.addAttachment(image);
            return;
        });
    }
    
    func clipPressedAction(gestureRecognizer: UITapGestureRecognizer) {
        showAttachAction();
    }
    
    func imagePressedAction(gestureRecognizer: UITapGestureRecognizer) {
        lastClickedAttachment = (gestureRecognizer.view as! UIImageView).image;
        
        if (storyboard == nil) {
            storyboard = UIStoryboard(name: "Main", bundle: nil);
        }
        let imagePage = storyboard.instantiateViewControllerWithIdentifier("ImagePage") as! ImagePage;
        imagePage.attachmentHandler = self;
        
        hostingViewController?.navigationController?.pushViewController(imagePage, animated: true);
    }
    
    private func rebuildScrollView() {
        for (_, child) in imageScollView.subviews.enumerate() {
            child.removeFromSuperview();
        }
        
        imageScollView.contentSize = CGSizeMake((frame.size.height + IMAGE_INSET) * CGFloat(attachmentArray.count), frame.size.height);
        
        for (index, att) in attachmentArray.enumerate() {
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
            
            let tapRecognizer = UITapGestureRecognizer(target: self, action: "imagePressedAction:");
            nextImageView.addGestureRecognizer(tapRecognizer);
        }
    }
}