import { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';

type NotificationData = {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
}

type NotificationContextType = {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    schedulePushNotification: (content: NotificationData, trigger?: Notifications.NotificationTriggerInput) => Promise<string>;
    cancelNotification: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: any }) {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);

    const schedulePushNotification = async (
        content: NotificationData,
        trigger?: Notifications.NotificationTriggerInput
    ) => {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: content.title ?? "Notification",
                body: content.body,
                data: content.data ?? {},
                sound: 'default'
            },
            trigger: trigger ?? null,
        });
        return id;
    };

    const cancelNotification = async (notificationId: string) => {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                sound: 'default'
            });
        }

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider  value={{ expoPushToken, notification, schedulePushNotification, cancelNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

// Helper hook to use the context
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
