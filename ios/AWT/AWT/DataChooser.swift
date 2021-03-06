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
}

func gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer) -> Bool {
return true;
}

func gestureRecognizer(gestureRecognizer: UIGestureRecognizer, shouldReceiveTouch touch: UITouch) -> Bool {
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
        let selectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
            if (selectedItem.data === selectedItems[i].data) {
                return;
            }
        }
        
        selectedItems.append(selectedItem);
        
        updateSelection();
    }
    func tableView(tableView: UITableView, didDeselectRowAtIndexPath indexPath: NSIndexPath) {
        let deselectedItem: Configuration.Item! = dataModel.getDataItem(indexPath);
        for (var i: Int! = 0; i < selectedItems.count; i = i.successor()) {
            if (deselectedItem.data === selectedItems[i].data) {
                selectedItems.removeAtIndex(i);
                break;
            }
        }
        
        updateSelection();
    }
    
    
    func getSelectedItems() -> [Configuration.Item]! {
        return selectedItems;
    }
    
    func setSelectedItems(selection: [Configuration.Item]!) {
        selectedItems = selection;
        
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
        return data[indexPath.row];
    }
    
    func getData() -> [Configuration.Item]! {
        return data;
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count;
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var tableCell: UITableViewCell? = tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell?;
        if (tableCell == nil) {
            tableCell = UITableViewCell(style: .Default, reuseIdentifier: "cell");
        }
        
        tableCell!.textLabel?.text = getDataItem(indexPath).getDisplay();
        tableCell!.textLabel?.textAlignment = .Center;
        tableCell!.textLabel?.textColor = AtwUiUtils.getColor("DATA_CHOOSER_TEXT_COLOR");
        
        return tableCell!;
    }
}

class SelectorView: UITableView {
    private var delegateHolder: UIDataSelectorDelegate!;
    
    init(height: Int!, delegate: UIDataSelectorDelegate!) {
        let rect: CGRect = CGRect(x: 0, y: 0, width: 0, height: height);
        super.init(frame: rect, style: UITableViewStyle.Plain);
        self.delegate = delegate;
        self.delegateHolder = delegate;
        self.dataSource = delegate.getDataModel();
    }
    
    required override init(frame: CGRect, style: UITableViewStyle) {
        super.init(frame: frame, style: style);
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func getSelectedItem() -> Configuration.Item? {
        var selection = delegateHolder.getSelectedItems();
        if (selection.count == 0) {
            return nil;
        } else {
            return selection[0];
        }
    }
    func setSelectedItem(selectedItem: Configuration.Item)  {
        setSelectedItems([selectedItem]);
    }
    
    func getSelectedItems() -> [Configuration.Item]! {
        return delegateHolder.getSelectedItems();
    }
    func setSelectedItems(selectedItems: [Configuration.Item]!)  {
        delegateHolder.setSelectedItems(selectedItems);

        let data = delegateHolder.getDataModel().getData();
        for (_, selectedItem) in selectedItems.enumerate() {
            for (index, item) in data.enumerate() {
                if (selectedItem.data === item.data) {
                    let indexPath = NSIndexPath(index: 0).indexPathByAddingIndex(index);
                    self.selectRowAtIndexPath(indexPath, animated: false, scrollPosition: UITableViewScrollPosition.Middle);
                }
            }
        }
    }
}


struct DataChooserFactory {
    static func createDataChooser(boundTextField: UITextField!, items: [Configuration.Item]!, multichoice: Bool!) -> SelectorView! {
        
        let dataModel = UIDataSelectorDataModel(data: items);
        let dataSelectorDelegate: UIDataSelectorDelegate! = UIDataSelectorDelegate(anchor: boundTextField, dataModel: dataModel);
        
        let toolbar = UIToolbar();
        toolbar.barStyle = .Default;
        toolbar.sizeToFit();
        let doneButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Done, target: dataSelectorDelegate, action: "doneButtonClickedAction")
        let flexibleSpace = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.FlexibleSpace, target: nil, action: nil)
        toolbar.setItems([flexibleSpace, doneButton], animated: true);
        boundTextField.inputAccessoryView = toolbar;
        
        let rowHeight: Int! = 45;
        
        let numOfRowsToShow = items.count > 5 ? 5: items.count;
        let height = rowHeight * numOfRowsToShow;
        
        let tableView: SelectorView! = SelectorView(height: height, delegate: dataSelectorDelegate);
        
        tableView.allowsMultipleSelection = multichoice;
        tableView.editing = false;
        tableView.rowHeight = CGFloat(rowHeight);
        
        return tableView;
    }
}


