//
//  AttachmentBarView.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/23/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class AttachmentBarView: UIControl {
    private let IMAGE_INSET: CGFloat = 5
    private let imageScollView: UIScrollView = UIScrollView(frame: CGRectZero);
    private let clipView: UIImageView = UIImageView(frame: CGRectZero);
    
    private var viewToShow: UIViewControllerWithSpinner = UIViewControllerWithSpinner()
    
    private var imageArray: Array<UIImage> = []
    
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
    
    
    func addImage(image: UIImage, view: UIViewControllerWithSpinner) {
        
        viewToShow = view
        
        imageArray.append(image);
        
        var tapRecognizer = UITapGestureRecognizer(target: self, action: "imagePressedAction:");
        
        imageScollView.contentSize = CGSizeMake((frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count), frame.size.height);
        
        
        let x = (frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count - 1);
        let newImageView = UIImageView(frame: CGRectMake(x, 0, frame.size.height, frame.size.height));
        newImageView.image = image;
        newImageView.contentMode = UIViewContentMode.ScaleToFill;
        newImageView.userInteractionEnabled = true;
        newImageView.addGestureRecognizer(tapRecognizer)

        imageScollView.addSubview(newImageView);
    }

    func removeImage(imageIndex: Int) {
        
    }
    
    func imagePressedAction(image: UIImage) {
        let attachSheet: UIAlertController = UIAlertController(title: NSLocalizedString("Please Choose", comment: "View Action Chooser Title"), message: "", preferredStyle: UIAlertControllerStyle.ActionSheet);
        
        let cancelAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("Cancel", comment: "Cancel action"), style: .Cancel) { (action) -> Void in
        }
        attachSheet.addAction(cancelAction)
        
        let viewAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("View", comment: "View action"), style: .Default) { (action) -> Void in
            println("View pressed")
        }
        attachSheet.addAction(viewAction)
        
        let deleteAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("Delete", comment: "Delete action"), style: .Default) { (action) -> Void in
            println("Delete pressed")
        }
        attachSheet.addAction(deleteAction)
        
        viewToShow.presentViewController(attachSheet, animated: true, completion: nil)
        
    }
}