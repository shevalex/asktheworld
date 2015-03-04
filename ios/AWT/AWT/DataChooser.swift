//
//  DataChooser.swift
//  AWT
//
//  Created by Anton Avtamonov on 3/3/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation
import UIKit



/*
class PickerDelegate: NSObject, UIPickerViewDelegate, UIGestureRecognizerDelegate {
private let items: [Configuration.Item]!;
private let boundInputElement: UITextField!;

init(items: [Configuration.Item], boundInputElement: UITextField) {
self.items = items;
self.boundInputElement = boundInputElement;
}

func numberOfComponentsInPickerView(pickerView: UIPickerView!) -> Int {
return 1;
}
func pickerView(pickerView: UIPickerView!, numberOfRowsInComponent component: Int) -> Int {
return items.count + 1;
}
func pickerView(pickerView: UIPickerView!, titleForRow row: Int, forComponent component: Int) -> String! {
return row == 0 ? "<unset>" : items[row - 1].getDisplay();
}
func pickerView(pickerView: UIPickerView!, didSelectRow row: Int, inComponent component: Int)
{
boundInputElement.text = row == 0 ? "" : items[row - 1].getDisplay();
}
func pickerView(pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusingView view: UIView!) -> UIView {

var renderView: UIButton!;
if (renderView == nil) {
renderView = UIButton();

renderView.backgroundColor = UIColor.greenColor();
renderView.setTitleColor(UIColor.blueColor(), forState: .Normal);
renderView.setTitleColor(UIColor.redColor(), forState: UIControlState.Selected);

renderView.addTarget(self, action: "Action:", forControlEvents: .TouchUpInside);
} else {
renderView = view as UIButton;
}

renderView.setTitle(self.pickerView(pickerView, titleForRow: row, forComponent: component), forState: .Normal);

let image: UIImage! = UIImage(named: "close.png");
renderView.setImage(image, forState: .Normal)

return renderView;
}

func pickerTouched() {
println("JOPA!");
}

func gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer) -> Bool {
println("PIZDEC");
return true;
}

func gestureRecognizer(gestureRecognizer: UIGestureRecognizer, shouldReceiveTouch touch: UITouch) -> Bool {

println("PIZDEC2");
return true;
}


}

static func setDataPicker(boundTextField: UITextField!, items: [Configuration.Item]) -> UIPickerViewDelegate {

var pickerDelegate = PickerDelegate(items: items, boundInputElement: boundTextField);
var picker = UIPickerView();
picker.backgroundColor = UIColor.whiteColor();
picker.delegate = pickerDelegate;
boundTextField.inputView = picker;


let tap = UITapGestureRecognizer(target: pickerDelegate, action: "pickerTouched");
tap.numberOfTouchesRequired = 1;
tap.numberOfTapsRequired = 2;
picker.addGestureRecognizer(tap);
tap.delegate = pickerDelegate;

return pickerDelegate;
}
*/

class UIDataSelectorDelegate: NSObject, UITableViewDelegate {
    private var dataModel: UIDataSelectorDataModel!;
    private var boundTextField: UITextField!;
    
    private var selectedItems: [Configuration.Item] = [];
    
    init(anchor: UITextField!, dataModel: UIDataSelectorDataModel) {
        self.boundTextField = anchor;
        self.dataModel = dataModel;
    }
    
    func getDataModel() -> UIDataSelectorDataModel! {
        return dataModel;
    }
    
    func tableView(tableView: UITableView, shouldHighlightRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true;
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        var selectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
            if (selectedItem.data === selectedItems[i].data) {
                return;
            }
        }
        
        selectedItems.append(selectedItem);
        
        updateSelection();
    }
    func tableView(tableView: UITableView, didDeselectRowAtIndexPath indexPath: NSIndexPath) {
        
        var deselectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
            if (deselectedItem.data === selectedItems[i].data) {
                selectedItems.removeAtIndex(i);
                break;
            }
        }
        
        updateSelection();
    }
    
    
    func doneButtonClickedAction() {
        boundTextField.endEditing(true);
    }
    
    private func updateSelection() {
        var text: String! = "";
        if (selectedItems.count > 0) {
            text = selectedItems[0].getDisplay();
        }
        
        for (var i: Int! = 1; i < selectedItems.count; i = i.successor()) {
            text = "\(text), \(selectedItems[i].getDisplay())";
        }
        
        boundTextField.text = text;
    }
}

class UIDataSelectorDataModel: NSObject, UITableViewDataSource {
    private var data: [Configuration.Item]!
    
    init(data: [Configuration.Item]) {
        self.data = data;
    }
    
    func getDataItem(indexPath: NSIndexPath) -> Configuration.Item {
        return getDataItem(indexPath.row);
    }
    
    func getDataItem(index: Int) -> Configuration.Item {
        return data[index];
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count;
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        var tableCell: UITableViewCell! = UITableViewCell();
        
        tableCell.textLabel?.text = getDataItem(indexPath).getDisplay();
        tableCell.textLabel?.textAlignment = .Center;
        tableCell.textLabel?.textColor = UIColor(red: 0, green: 122/255, blue: 1, alpha: 1.0)
        
        return tableCell;
    }
}

class SelectorView: UITableView {
    private var delegateHolder: UIDataSelectorDelegate!;
    
    init(height: Int!, delegate: UIDataSelectorDelegate!) {
        var rect: CGRect! = CGRect(x: 0, y: 0, width: 0, height: height);
        super.init(frame: rect);
        
        self.delegate = delegate;
        self.delegateHolder = delegate;
        self.dataSource = delegate.getDataModel();
    }
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder);
    }
    
    required override init(frame: CGRect, style: UITableViewStyle) {
        super.init(frame: frame, style: style);
    }
}


struct DataChooserFactory {
    static func createDataChooser(boundTextField: UITextField!, items: [Configuration.Item], multichoice: Bool!) -> UIView! {
        
        var dataModel = UIDataSelectorDataModel(data: items);
        var dataSelectorDelegate: UIDataSelectorDelegate! = UIDataSelectorDelegate(anchor: boundTextField, dataModel: dataModel);
        
        var toolbar = UIToolbar();
        toolbar.barStyle = .Default;
        toolbar.sizeToFit();
        var doneButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: dataSelectorDelegate, action: "doneButtonClickedAction")
        var flexibleSpace = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.FlexibleSpace, target: nil, action: nil)
        toolbar.setItems([flexibleSpace, doneButton], animated: true);
        boundTextField.inputAccessoryView = toolbar;
        
        var rowHeight: Int! = 45;
        
        var numOfRowsToShow = items.count > 5 ? 5: items.count;
        var height = rowHeight * numOfRowsToShow;
        
        var tableView: UITableView! = SelectorView(height: height, delegate: dataSelectorDelegate);
        
        tableView.allowsMultipleSelection = multichoice;
        tableView.editing = false;
        tableView.rowHeight = CGFloat(rowHeight);
        
        return tableView;
    }
}


