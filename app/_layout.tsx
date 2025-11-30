import { Appearance } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        Appearance.setColorScheme("dark")
    }, [])

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}> 
                <GestureHandlerRootView>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <KeyboardProvider>
                            <Stack>
                                <Stack.Screen name="index" options={{ headerShown: false }} />
                                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                                <Stack.Screen name="login" options={{ headerShown: false }} />
                                <Stack.Screen name="(session)" options={{ headerShown: false }} />
                                <Stack.Screen name="(active)" options={{ headerShown: false }} />
                                <Stack.Screen name="(home)" options={{ headerShown: false }} />
                                <Stack.Screen name="(home_tabs)" options={{ headerShown: false }} />
                            </Stack>
                            <StatusBar style="light" />
                        </KeyboardProvider>
                    </ThemeProvider>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}
 