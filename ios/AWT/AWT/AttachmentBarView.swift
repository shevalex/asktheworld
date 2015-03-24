//
//  AttachmentBarView.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/23/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit

class AttachmentBarView: UIScrollView {
    private var imageArray: Array<UIImage> = [];
    
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder);
    }
    
    func addImage(image: UIImage) {
        imageArray.append(image);
        
        contentSize = CGSizeMake(CGFloat(Int(frame.size.height + 5) * self.imageArray.count), frame.size.height);
        
        let x = 5 + Int(frame.size.height + 5) * (imageArray.count - 1);
        let newImageView = UIImageView(frame: CGRectMake(CGFloat(x), 0, frame.size.height, frame.size.height));
        newImageView.image = image;
        newImageView.contentMode = UIViewContentMode.ScaleToFill;

        addSubview(newImageView);
    }

    func removeImage(imageIndex: Int) {
        
    }
}