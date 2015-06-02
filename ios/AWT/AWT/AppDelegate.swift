//
//  AppDelegate.swift
//  AWT
//
//  Created by Oleg Burakov on 25/02/15.
//  Copyright (c) 2015 PiSoft Corporation. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    
    var notificationObserver: PushBackend.PushEventObserver!
    var notificationCount: Int = 0;
    

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        
        application.registerForRemoteNotifications()
        
        application.registerUserNotificationSettings(UIUserNotificationSettings(forTypes: UIUserNotificationType.Alert | UIUserNotificationType.Badge, categories: nil));
        
        notificationObserver = { (message) in
            self.placeNotification(application, message: message);
        }
        
        return true;
    }
    
    func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) {
        println("token - \(deviceToken)")
    }
    
    func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
        println("Failed to Register for Remote Notficiations")
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        
        PushBackend.getInstance().addPushListener(notificationObserver, listenerId: "notifications");
        
        PushBackend.getInstance().placeNotification("Hello");
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
        
        PushBackend.getInstance().removePushListener("notifications");
        clearNotifications(application);
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


    private func placeNotification(application: UIApplication, message: PushBackend.ServerMessage) {
        let notification = UILocalNotification();

        notification.alertBody = message.text;
        notification.applicationIconBadgeNumber = ++notificationCount;
        
        application.scheduleLocalNotification(notification);
    }
    
    private func clearNotifications(application: UIApplication) {
        notificationCount = 0;
        let clearBadgeNotification = UILocalNotification();
        clearBadgeNotification.applicationIconBadgeNumber = -1;
        application.scheduleLocalNotification(clearBadgeNotification);
        
        application.cancelAllLocalNotifications();
    }
}

