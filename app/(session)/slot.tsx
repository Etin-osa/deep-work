import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

// Less than 1 hour -> 5 for break
// => 1 hour -> 45 - 10 - 45 -10 - remaning

export default function slot() {
    const { name: sessionName, hour, minute } = useLocalSearchParams()

    const generateSlots = () => {
        const slots: { type: string, duration: number }[] = []
        const timeInMinutes = parseInt(hour as string) + parseInt(minute as string)

        if (timeInMinutes <= 20) {
            slots.push({ type: "work", duration: timeInMinutes })
        }

        if (timeInMinutes <= 60 && timeInMinutes > 20) {
            slots.push({ type: "work", duration: timeInMinutes - 5 })
            slots.push({ type: "break", duration: 5 })
        }

        if (timeInMinutes > 60) {
            
        }

    }
    
    return (
        <View>
            <Text>slot</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
