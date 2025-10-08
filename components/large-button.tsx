import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import React from "react";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";

export default function LargeButton({ text, containerStyle, buttonStyle, textStyle, onPress }: { 
    text: string 
    buttonStyle?: ViewStyle
    textStyle?: TextStyle
    containerStyle?: ViewStyle
    onPress?: () => void
}) {
    return (
        <Pressable onPress={onPress} style={[containerStyle]}>
            <ThemedView style={[styles.button, buttonStyle]}>
                <ThemedText style={[textStyle, { fontWeight: 600 }]}>{text}</ThemedText>
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '95%',
        padding: 15,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    }
});
