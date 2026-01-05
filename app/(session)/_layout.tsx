import React from "react";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import Logo from "@/components/logo";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Feather } from "@expo/vector-icons";

export default function _layout() {
    const theme = useColorScheme() ?? 'dark'

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors[theme].background }}>
            <Stack>
                <Stack.Screen 
                    name="index" 
                    options={{ 
                        header: () => (
                            <ThemedView style={styles.indexCover}>
                                <Feather 
                                    name="target" 
                                    size={24} 
                                    color={Colors.accentColor} 
                                />
                                <ThemedText style={styles.logoText}>Welcome to Deep work</ThemedText>
                            </ThemedView>
                        ),
                        headerRight: () => <></>
                    }} 
                />
                <Stack.Screen name="cycles" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    indexCover: { 
        flexDirection: 'row', 
        gap: 15,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoText: { 
        fontSize: 25, 
        lineHeight: 50,
        fontWeight: '600',
        width: '100%'
    }
})