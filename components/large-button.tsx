import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";

export default function LargeButton({ text, buttonStyle, textStyle, onPress }: { 
    text: string 
    buttonStyle?: object
    textStyle?: object
    onPress?: () => void
}) {
    return (
        <Pressable onPress={onPress}>
            <ThemedView style={[styles.button, buttonStyle]}>
                <ThemedText style={[textStyle]}>{text}</ThemedText>
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '95%',
        padding: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    }
});
