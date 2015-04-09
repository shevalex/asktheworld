//
//  ImageChooser.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/23/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit


typealias ImagePickObserver = (image: UIImage) -> Void;


class ImagePickerDelegate: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    private var observer: ImagePickObserver?;
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingImage image: UIImage!, editingInfo: [NSObject : AnyObject]!) {
        picker.dismissViewControllerAnimated(true, completion: nil);
        
        self.observer?(image: image);
    }
    
    func setImagePickObserver(observer: ImagePickObserver?) {
        self.observer = observer;
    }
}



struct ImageChooserFactory {
    static let imagePickerDelegate: ImagePickerDelegate = ImagePickerDelegate();
    
    static func setImagePicker(viewController: UIViewController, imagePickObserver: ImagePickObserver? = nil) {
        let attachSheet: UIAlertController = UIAlertController(title: NSLocalizedString("Please Choose", comment: "Image Chooser Title"), message: "", preferredStyle: UIAlertControllerStyle.ActionSheet);
        
        let cancelAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("Cancel", comment: "Cancel action"), style: .Cancel) { (action) -> Void in
        }
        attachSheet.addAction(cancelAction)
        
        let takePictureAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("Take Picture", comment: "Take Picture action"), style: .Default) { (action) -> Void in
            println("Camera is not available in simulator")

//            let imageController: UIImagePickerController = UIImagePickerController();
//            imageController.allowsEditing = false;
//            self.imagePickerDelegate.setImagePickObserver(imagePickObserver);
//            imageController.delegate = self.imagePickerDelegate;
//            imageController.sourceType = UIImagePickerControllerSourceType.Camera
//            self.presentViewController(imageController, animated: true, completion: nil)
        }
        attachSheet.addAction(takePictureAction)
        
        if UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.PhotoLibrary) {
            let choosePictureAction: UIAlertAction = UIAlertAction(title: NSLocalizedString("Choose From Gallery", comment: "Choose picture action"), style: .Default) { (action) -> Void in
                
                let imageController: UIImagePickerController = UIImagePickerController();
                imageController.allowsEditing = false;
                self.imagePickerDelegate.setImagePickObserver(imagePickObserver);
                imageController.delegate = self.imagePickerDelegate;
                
                imageController.sourceType = UIImagePickerControllerSourceType.PhotoLibrary;
                viewController.presentViewController(imageController, animated: true, completion: nil);
            }
            attachSheet.addAction(choosePictureAction)
        }
        
        
        viewController.presentViewController(attachSheet, animated: true, completion: nil);
    }
}