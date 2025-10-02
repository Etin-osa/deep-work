import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { getIsFirstTime } from "@/redux/slices/isFirstTimeSlice";
import { router } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function index() {
    const isFirstTime = useAppSelector(getIsFirstTime)

    useEffect(() => {
        if (isFirstTime) {
            router.replace("/(session)")
        } else {
            router.replace("/login")
        }
    }, [])

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Welcome to</ThemedText>
            <ThemedText style={styles.title}>Deep Work</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 60,
        fontWeight: "bold",
        lineHeight: 70
    },
});
