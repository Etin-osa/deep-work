import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useRef, useState } from "react";
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
    const [alert, setAlert] = useState<"name" | "time" | "time-error" | "name-error" | "">("")
    const [hours, setHours] = useState("00")
    const [minutes, setMinutes] = useState("00")
    const [label, setLabel] = useState("")
    const [textSelection, setTextSelection] = useState<{ start: number, end: number } | undefined>()

    const handleRoutes = () => {
        const checkTime = (parseInt(hours) * 60) + parseInt(minutes)
        if (checkTime <= 20) {
            router.push({ 
                pathname: "/(session)/cycles", 
                params: { label, hours, minutes, mode: "custom" }
            })
        } else {
            router.push({ 
                pathname: "/(session)/custom", 
                params: { label, hours, minutes }
            })
        }
    }

    // useEffect(() => {
    //     router.push({ pathname: "/(session)/cycles", params: { label, hours, minutes, mode: "pomodoro" }})
    // }, [])

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.containerTop}>
                <ThemedView style={styles.containerTopLeft}>
                    <ThemedText darkColor={Colors[theme].inputLabel}>Name *</ThemedText>
                    <TextInput 
                        placeholder="e.g., Morning Study"
                        placeholderTextColor={Colors[theme].placeholder}
                        style={[styles.input, { 
                            backgroundColor: Colors[theme].inputBg,
                            borderColor: alert === "name" ? 'rgba(82, 104, 136, 1)' : alert === "name-error" 
                                ? Colors.inputError : Colors[theme].border,
                            borderWidth: 1
                        }]}
                        onChangeText={(text) => setLabel(text)}
                        onFocus={() => setAlert("name")}
                        onBlur={() => setAlert("")}
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
                <ThemedText darkColor={Colors[theme].inputLabel}>Average Duration *</ThemedText>
                <ThemedView style={[styles.timeCover, {
                    backgroundColor: Colors[theme].inputBg,
                    borderColor: alert === "time" ? 'rgba(82, 104, 136, 1)' : alert === "time-error" 
                        ? Colors.inputError : Colors[theme].border,
                    borderWidth: 1
                }]}>
                    <View style={styles.timeInputView}>
                        <TextInput 
                            style={styles.timeInput} 
                            value={hours}
                            maxLength={2}
                            keyboardType="number-pad"
                            onFocus={() => {
                                setAlert("time")
                                setTextSelection({ start: 0, end: 2 })
                            }}
                            onBlur={() => setAlert("")}
                            placeholderTextColor={Colors[theme].placeholder}
                            selection={textSelection}
                            onChangeText={(text) => {
                                setTextSelection(undefined)
                                const numbersOnly = text.replace(/[^0-9]/g, '');
                                setHours(numbersOnly);

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
                            value={minutes}
                            maxLength={2}
                            keyboardType="number-pad"
                            onFocus={() => {
                                setTextSelection({ start: 0, end: 2 })
                                setAlert("time")
                            }}
                            onBlur={() => setAlert("")}
                            selection={textSelection}
                            placeholderTextColor={Colors[theme].placeholder}
                            onChangeText={(text) => {
                                setTextSelection(undefined)
                                const num = parseInt(text)

                                if ((num >= 0 && num <= 59) || text === '') {
                                    const numbersOnly = text.replace(/[^0-9]/g, '');
                                    setMinutes(numbersOnly);
                                } else {
                                    setMinutes("59")
                                }
                            }}
                        />
                        <ThemedText style={styles.timeLetter}>m</ThemedText>
                    </View>
                </ThemedView>
            </ThemedView>

            <LargeButton 
                text="Create your First Habit Session" 
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
                onPress={() => {
                    if (label.length === 0) {
                        setAlert("name-error")
                    } else if ((hours === "00" || hours === "0") && (minutes === "00" || minutes === "0")) {
                        setAlert("time-error")
                    } else {
                        handleRoutes()
                    }
                }}
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
