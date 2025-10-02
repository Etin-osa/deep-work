import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <Provider store={store}>
           <PersistGate loading={null} persistor={persistor}> 
                <GestureHandlerRootView>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                            <Stack.Screen name="login" options={{ headerShown: false }} />
                            <Stack.Screen name="(session)" options={{ headerShown: false }} />
                        </Stack>
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}
 