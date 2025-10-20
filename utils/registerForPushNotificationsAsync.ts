import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    try {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                sound: 'default'
            });
        }

        if (!Device.isDevice) { return null }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            throw new Error("Permission not granted for push notifications!");
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
    } catch (error) {
        throw new Error("Failed to get push token for push notification!");
    }
}