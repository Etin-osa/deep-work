import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import TimerCarousel from "@/components/timer-carousel";
import { router } from "expo-router";

export default function index() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'light'
    const [defaultName, setDefaultName] = useState("Deep work")
    const [hourSelected, setHourSelected] = useState(1)
    const [minuteSelected, setMinuteSelected] = useState(0)

    const handleSession = () => {
        if (hourSelected === 0 && minuteSelected === 0) {
            return;
        }

        router.push({ 
            pathname: "/(session)/slot", 
            params: { name: defaultName, hour: hourSelected, minute: minuteSelected }
        })
    }

    // useEffect(() => {
    //     handleSession()
    // }, [])
    
    return (
        <ScrollView style={[styles.container, { paddingVertical: insets.top }]}>
            <ThemedText style={styles.header}>Welcome to your First Focus Session</ThemedText>

            <ThemedView style={styles.card} reverse>
                <ThemedText style={{ textAlign: 'center' }} reverse>
                    Select a name for your focus session
                </ThemedText>
                <ThemedView style={styles.inputView} reverse>
                    <TextInput 
                        placeholder={defaultName}
                        placeholderTextColor={`${Colors[theme].background}36`}
                        style={[
                            styles.input, 
                            { 
                                borderBottomColor: Colors[theme].background,
                                color: Colors[theme].background
                            }
                        ]}
                    />
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.card} reverse>
                <ThemedText style={{ textAlign: 'center' }} reverse>
                    Pick your focus session duration.
                </ThemedText>
                <TimerCarousel 
                    setHourSelected={setHourSelected} 
                    setMinuteSelected={setMinuteSelected}
                />
            </ThemedView>     
                        
            
            <Pressable onPress={handleSession}>
                <ThemedView reverse style={styles.smallButton}>
                    <ThemedText reverse style={styles.smallButtonText}>Next</ThemedText>
                </ThemedView>       
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 100,
        lineHeight: 35,
        width: '80%',
        marginHorizontal: 'auto'
    },
    card: {
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 20,
        marginVertical: 5
    },
    inputView: {
        height: 200,
        justifyContent: 'center',
        paddingBottom: 30
    },
    input: {
        borderBottomWidth: 2,
        textAlign: 'center',
        fontSize: 30,
        width: '50%',
        marginHorizontal: 'auto',
        paddingBottom: 20
    },
    timerView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    smallButton: {
        marginTop: 50,
        width: 250,
        padding: 20,
        borderRadius: 30,
        marginHorizontal: 'auto'
    },
    smallButtonText: {
        fontSize: 20,
        textAlign: 'center'
    }
});
