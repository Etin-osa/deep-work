import { Pressable, useColorScheme } from "react-native";
import React from "react";
import { router, Tabs } from "expo-router";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function _layout() {
    const theme = useColorScheme() ?? 'dark'
    const insets = useSafeAreaInsets()
    
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: Colors[theme].background,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(19, 127, 236, 0.44)',
                    height: 60 + insets.bottom,
                    paddingTop: 5
                },
                tabBarLabelStyle: {
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen name="index" options={{
                tabBarIcon: ({ color, size }) => (
                    <Feather 
                        name="target" 
                        size={size} 
                        color={color} />
                ),
                headerShown: false,
                tabBarLabelStyle: {
                    display: 'none'
                }
            }} />
            <Tabs.Screen name="stats" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons 
                        name="stats-chart" 
                        size={size - 3} 
                        color={color} 
                    />
                ),
                headerShown: false,
                tabBarLabelStyle: {
                    display: 'none'
                }
            }}/>
            <Tabs.Screen name="profile" options={{
                tabBarIcon: ({ color, size }) => (
                    <Feather 
                        name="settings" 
                        size={size - 3} 
                        color={color} 
                    />
                ),
                headerShown: true,
                tabBarStyle: {
                    display: 'none'
                },
                headerTitle: "Settings",
                headerStyle: {
                    backgroundColor: Colors.dark.background
                },
                tabBarLabelStyle: {
                    display: 'none'
                },
                headerLeft: () => (
                    <Pressable style={{ paddingLeft: 20}} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={26} color="#FFFFFF" />
                    </Pressable>
                ),
                headerTitleAlign: 'center'
            }} />
        </Tabs>
    );
}
