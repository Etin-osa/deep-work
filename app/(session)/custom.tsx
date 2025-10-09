import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";
import { router } from "expo-router";

export default function custom() {
    const theme = useColorScheme() ?? 'dark'
    const minuteRef = useRef<TextInput | null>(null)
    const [focus, setFocus] = useState(false)
    const [hours, setHours] = useState("2")
    const [minutes, setMinutes] = useState("30")
    const [label, setLabel] = useState("Morning Study")

    useEffect(() => {
        router.push({ pathname: "/(session)/cycles", params: { label, hours, minutes }})
    }, [])

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.containerTop}>
                <ThemedView style={styles.containerTopLeft}>
                    <ThemedText darkColor={Colors[theme].inputLabel}>Session Name *</ThemedText>
                    <TextInput 
                        placeholder="e.g., Morning Study"
                        placeholderTextColor={Colors[theme].placeholder}
                        style={[styles.input, { 
                            backgroundColor: Colors[theme].inputBg,
                            borderColor: theme === "dark" ? focus ? 'rgba(82, 104, 136, 1)' : Colors[theme].border : '',
                            borderWidth: 1
                        }]}
                        onChangeText={(text) => setLabel(text)}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                    />
                </ThemedView>
                <ThemedView style={{ gap: 10 }}>
                    <ThemedText darkColor={Colors[theme].inputLabel}>Icon</ThemedText>
                    <Pressable>
                        <ThemedView
                            darkColor={Colors.dark.inputBg}
                            style={[styles.topRight, {
                                borderColor: theme === "dark" ? Colors[theme].border : '',
                            }]}
                        >
                            <AntDesign name="plus" size={26} color={Colors[theme].border} />
                        </ThemedView>
                    </Pressable>
                </ThemedView>
            </ThemedView>

            <ThemedView style={{ gap: 10 }}>
                <ThemedText darkColor={Colors[theme].inputLabel}>Session Duration *</ThemedText>
                <ThemedView style={[styles.timeCover, {
                    backgroundColor: Colors[theme].inputBg,
                }]}>
                    <View style={styles.timeInputView}>
                        <TextInput 
                            style={styles.timeInput} 
                            defaultValue="00"
                            maxLength={2}
                            keyboardType="number-pad"
                            placeholderTextColor={Colors[theme].placeholder}
                            onChangeText={(text) => {
                                setHours(text)
                                if (text.length === 2 && minuteRef) {
                                    minuteRef.current?.focus()
                                }
                            }}
                        />
                        <ThemedText style={styles.timeLetter}>h</ThemedText>
                    </View>
                    <View style={styles.timeInputView}>
                        <TextInput 
                            ref={minuteRef}
                            style={styles.timeInput} 
                            defaultValue="00"
                            maxLength={2}
                            keyboardType="number-pad"
                            placeholderTextColor={Colors[theme].placeholder}
                            onChangeText={(text) => setMinutes(text)}
                        />
                        <ThemedText style={styles.timeLetter}>m</ThemedText>
                    </View>
                </ThemedView>
            </ThemedView>

            <LargeButton 
                text="Create Session Layout" 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    width: '100%',
                    borderRadius: 15
                }}
                containerStyle={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    left: 20,
                }}
                onPress={() => router.push({ pathname: "/(session)/cycles", params: { label, hours, minutes }})}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        position: 'relative'
    },
    containerTop: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
        marginBottom: 30
    },
    containerTopLeft: {
        flex: 1,
        gap: 10,
    },
    input: {
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 55
    },
    topRight: {
        borderRadius: 15,
        borderWidth: 1,
        height: 55,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeCover: {
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 30,
        paddingVertical: 30
    },
    timeInputView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10
    },
    timeInput: {
        fontSize: 65,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 1
    },
    timeLetter: {
        transform: [{ translateY: -20 }]
    },
});
