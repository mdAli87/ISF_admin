import { supabase } from "@/integrations/supabase/client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id?: string;
  training_event_id: string;
  title: string;
  body: string;
  sent_at?: Date;
  scheduled_for?: Date;
  status?: 'pending' | 'sent' | 'failed';
  created_at?: Date;
}

export interface DeviceToken {
  id?: string;
  user_id: string;
  device_token: string;
  device_type?: string;
  created_at?: Date;
  last_used_at?: Date;
  is_active?: boolean;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2Y5z-LdmhFWah86JflrSox9f4bK1x6Ko",
  authDomain: "isf-admin-8f71f.firebaseapp.com",
  projectId: "isf-admin-8f71f",
  storageBucket: "isf-admin-8f71f.firebasestorage.app",
  messagingSenderId: "249683699534",
  appId: "1:249683699534:web:4bb16d111dc720cbe1a01f"
};

// Initialize Firebase if we're in a browser environment
let messaging: any = null;

if (typeof window !== 'undefined') {
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    
    // Listen for messages when the app is in the foreground
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      toast({
        title: payload.notification?.title || "New notification",
        description: payload.notification?.body,
        duration: 5000,
      });
    });
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

/**
 * Retrieves all notifications from the database
 */
export const getNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Creates a notification in the database
 */
export const createNotification = async (notification: Notification) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Sends a push notification using Firebase Cloud Messaging
 */
export const sendPushNotification = async (notification: Notification, deviceTokens: string[]) => {
  try {
    if (!deviceTokens || deviceTokens.length === 0) {
      console.log("No device tokens provided for push notification");
      return null;
    }

    // Call Firebase Cloud Messaging API to send notifications
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=YOUR_SERVER_KEY` // You need to add your Firebase server key here
      },
      body: JSON.stringify({
        registration_ids: deviceTokens,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          trainingEventId: notification.training_event_id,
          notificationId: notification.id,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Firebase responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("FCM response:", result);
    
    // Update the notification status in the database
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString() 
      })
      .eq('id', notification.id)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error sending push notification:", error);
    
    // Update the notification status to failed
    await supabase
      .from('notifications')
      .update({ 
        status: 'failed',
      })
      .eq('id', notification.id);
      
    throw error;
  }
};

/**
 * Register a device token for push notifications
 */
export const registerDeviceToken = async (deviceToken: DeviceToken) => {
  try {
    // Check if the token already exists
    const { data: existingToken } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('device_token', deviceToken.device_token)
      .single();
      
    if (existingToken) {
      // Update existing token
      const { data, error } = await supabase
        .from('device_tokens')
        .update({
          last_used_at: new Date().toISOString(),
          is_active: true,
          device_type: deviceToken.device_type
        })
        .eq('id', existingToken.id)
        .select();
        
      if (error) throw error;
      return data[0];
    } else {
      // Create new token
      const { data, error } = await supabase
        .from('device_tokens')
        .insert(deviceToken)
        .select();
        
      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error("Error registering device token:", error);
    throw error;
  }
};

/**
 * Request permission and get Firebase messaging token
 */
export const requestNotificationPermission = async (userId: string) => {
  try {
    if (!messaging) {
      console.error("Firebase messaging is not initialized");
      return null;
    }
    
    console.log("Requesting notification permission...");
    
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("Notification permission denied");
      return null;
    }
    
    // Get the token
    const token = await getToken(messaging, {
      vapidKey: "BGVmJJ58BMNd3SKEEWlbYmGf4qOPlHUA9Rt0l4VtLDiFAtLREoYlDuzvNuk0MhuPyP7m7XMuK7gxl3mNWCSSuMQ" // You still need to add your VAPID key here
    });
    
    if (token) {
      console.log("Got FCM token:", token);
      
      // Register the token with our backend
      await registerDeviceToken({
        user_id: userId,
        device_token: token,
        device_type: 'web'
      });
      
      return token;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

/**
 * Deactivate a device token
 */
export const deactivateDeviceToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('device_tokens')
      .update({ is_active: false })
      .eq('device_token', token)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error deactivating device token:", error);
    throw error;
  }
};
