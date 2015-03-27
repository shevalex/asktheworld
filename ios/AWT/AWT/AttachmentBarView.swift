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
    private let IMAGE_INSET: CGFloat = 5;
    private var imageArray: Array<UIImage> = [];
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder);
    }
    
    func addImage(image: UIImage) {
        imageArray.append(image);
        
        contentSize = CGSizeMake((frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count), frame.size.height);
        
        
        let x = (frame.size.height + IMAGE_INSET) * CGFloat(imageArray.count - 1);
        let newImageView = UIImageView(frame: CGRectMake(x, 0, frame.size.height, frame.size.height));
        newImageView.image = image;
        newImageView.contentMode = UIViewContentMode.ScaleToFill;

        addSubview(newImageView);
    }

    func removeImage(imageIndex: Int) {
        
    }
}