//
//  PushBackend.swift
//  AWT
//
//  Created by Anton Avtamonov on 4/5/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import Foundation

struct PushBackend {
    typealias PushEventObserver = (ServerMessage) -> Void;
    
    private static var instance: PushBackend! = nil;
    
    private var notificationListeners: PushListenerCollection = PushListenerCollection();
    
    
    static func getInstance() -> PushBackend {
        if (instance == nil) {
            instance = PushBackend();
        }
        
        return instance;
    }
    
    
    struct ServerMessage {
        var type: String;
        var text: String;
    }
    
    
    
    
    
    private class PushListenerCollection {
        private var counter: Int! = 0;
        private var list: Dictionary<String, PushEventObserver> = Dictionary();
        
        func add(element: PushEventObserver, elementId: String?) -> String {
            counter = counter + 1;
            let id: String = elementId != nil ? elementId! : "listener-\(counter)";
            list.updateValue(element, forKey: id);
            
            return id;
        }
        
        func remove(elementId: String) {
            list.removeValueForKey(elementId);
        }
        
        func get() -> Dictionary<String, PushEventObserver> {
            return list;
        }
    }
    
    
    func addPushListener(listener: PushEventObserver, listenerId: String!) -> String {
        return notificationListeners.add(listener, elementId: listenerId);
    }
    
    func removePushListener(listenerId: String) {
        notificationListeners.remove(listenerId);
    }
    
    
    private func notifyPushListeners(message: ServerMessage) {
        for (id, listener) in notificationListeners.get() {
            listener(message);
        }
    }
    
    
    
    // Temporary
    
    func placeNotification(text: String) {
        let message: ServerMessage = ServerMessage(type: "notif", text: text);
        
        var action:()->Void = {() in
            self.notifyPushListeners(message);
        };
        
        DelayedNotifier(action: action).schedule(5);
    }
    
    
    private class DelayedNotifier: NSObject
    {
        private var action: (()->Void)?;
        
        init(action: (()->Void)? = nil) {
            super.init();
            
            self.action = action;
        }
        
        func schedule(delay: Double) {
            NSTimer.scheduledTimerWithTimeInterval(delay, target: self, selector: Selector("timerTick"), userInfo: nil, repeats: false);
        }
        
        @objc func timerTick() {
            action?();
        }
    }
}