import { StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { TextInput } from "react-native-gesture-handler";
import { Colors } from "@/constants/theme";

export default function TimerCarousel({ setHourSelected, setMinuteSelected, setFocus }: {
    setHourSelected: Dispatch<SetStateAction<number>>
    setMinuteSelected: Dispatch<SetStateAction<number>>
    setFocus: React.Dispatch<React.SetStateAction<"" | "top" | "bottom">>
}) {
    const hours = Array.from(Array(24).keys())
    const minutes = Array.from(Array(60).keys())
    
    const handleHourSelected = (selected: number) => setHourSelected(selected)
    const handleMinuteSelected = (selected: number) => setMinuteSelected(selected)
    
    return (
        <ThemedView style={styles.timerView}>
            <ThemedView style={[styles.timerSection, { gap: 0}]}>
                <ThemedView style={{ flex: 1, alignItems: 'center', transform: [{ translateX: 8 }] }}>
                    <ThemedText>Hours</ThemedText>
                </ThemedView>
                <ThemedView style={{ flex: 1, alignItems: 'center', transform: [{ translateX: -10 }] }}>
                    <ThemedText>Minutes</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.timerSection}>
                <ThemedView>
                    <TextInput 
                        keyboardType="number-pad"
                        defaultValue="00"
                        style={[styles.input, { color: Colors.dark.text} ]}
                        maxLength={2}
                        onFocus={() => setFocus("bottom")}
                        onBlur={() => setFocus("")}
                        // setCounter={handleHourSelected} 
                    />
                </ThemedView>
                <ThemedText style={styles.timerColon}>:</ThemedText>
                <ThemedView>
                    <TextInput 
                        keyboardType="number-pad"
                        defaultValue="00"
                        style={[styles.input, { color: Colors.dark.text} ]}
                        maxLength={2}
                        onFocus={() => setFocus("bottom")}
                        onBlur={() => setFocus("")}
                        // setCounter={handleMinuteSelected} 
                    />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    timerView: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eachCarousel: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselText: {
        fontSize: 60,
        lineHeight: 70,
        textAlign: 'center'
    },
    timerSection: { 
        flexDirection: 'row', 
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    timerColon: {
        fontSize: 50,
        lineHeight: 40,
    },
    input: {
        fontSize: 50,
        lineHeight: 50
    }
});
