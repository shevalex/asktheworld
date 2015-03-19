//
//  IncomingRequestTableCell.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/18/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

class IncomingRequestTableCell: UITableViewCell {
    
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var requestTextLabel: UILabel!
    @IBOutlet weak var sourceLabel: UILabel!

    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
}
