import { useColorScheme } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
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
                tabBarLabel: 'Deep Work',
                headerShown: false
            }} />
            <Tabs.Screen name="stats" options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons 
                        name="stats-chart" 
                        size={size} 
                        color={color} 
                    />
                ),
                tabBarLabel: 'Stats',
                headerShown: false
            }}/>
            <Tabs.Screen name="profile" options={{
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome5 
                        name="user-circle" 
                        size={size} 
                        color={color} 
                    />
                ),
                tabBarLabel: 'Profile',
                headerShown: true,
                tabBarStyle: {
                    display: 'none'
                }
            }} />
        </Tabs>
    );
}
