"use client";
import { useState, useEffect } from "react";
import withAuth from "@/auth/authUtils";
import Sidebar from "@/components/admin/sidebar";
import ContactList from "@/components/admin/contact/contact";
import { getQuery } from "@/services/customerServices";

interface Contact {
  id: string;
  email: string;
  companyName: string;
  subject: string;
  body: string;
  createdAt: string;
  seen: boolean;
}

function Contact() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const [lastNotificationTime, setLastNotificationTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          try {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
          } catch (error) {
            console.error('Error requesting notification permission:', error);
          }
        }
      }
    };

    requestNotificationPermission();
  }, []);

  const showNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const now = Date.now();
      if (now - lastNotificationTime > 10000) {
        try {
          const notification = new Notification('New Messages Received', {
            body: `You have ${count} new unread message${count > 1 ? 's' : ''} in Contact EC Power`,
            icon: '/favicon.ico', 
            badge: '/favicon.ico',
            tag: 'contact-notification',
            requireInteraction: false,
            silent: false,
          });

          setTimeout(() => {
            notification.close();
          }, 5000);

          setLastNotificationTime(now);
          console.log('Notification sent for', count, 'new messages');
        } catch (error) {
          console.error('Error showing notification:', error);
        }
      }
    } else {
      console.log('Notifications not available or not permitted');
    }
  };

  const checkForNewMessages = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const IdToken = localStorage.getItem("IdToken") || "";
      
      if (!token || !IdToken) {
        console.error('Missing authentication tokens');
        return;
      }

      const data = await getQuery(token, IdToken);
      const currentUnreadCount = data.filter((contact: Contact) => !contact.seen).length;
      
      console.log('Current unread:', currentUnreadCount, 'Previous unread:', previousUnreadCount, 'Initialized:', isInitialized);
      
      if (isInitialized && currentUnreadCount > previousUnreadCount) {
        const newMessages = currentUnreadCount - previousUnreadCount;
        showNotification(newMessages);
        console.log('New messages detected:', newMessages);
      }
      
      setPreviousUnreadCount(currentUnreadCount);
      setUnreadCount(currentUnreadCount);
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Failed to check for new messages:", error);
    }
  };

  useEffect(() => {
    checkForNewMessages();
    
    const interval = setInterval(checkForNewMessages, 15000);
    
    return () => clearInterval(interval);
  }, [isInitialized, previousUnreadCount]);

  const handleUnreadCountChange = (newCount: number) => {
    console.log('Unread count changed to:', newCount);
    
    setUnreadCount(newCount);
    
    if (newCount < previousUnreadCount) {
      setPreviousUnreadCount(newCount);
    }
    setTimeout(() => {
      checkForNewMessages();
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar unreadCount={unreadCount} />
      <ContactList onUnreadCountChange={handleUnreadCountChange} />
    </div>
  );
}

export default withAuth(Contact, true);