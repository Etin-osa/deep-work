import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from '@expo/vector-icons'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import TimerCarousel from "@/components/timer-carousel";
import useKeyboard from "@/hooks/useKeyboard";

export default function index() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'light'
    const { keyboardHeight } = useKeyboard()
    const [focus, setFocus] = useState<"" | "top" | "bottom">("")
    const scrollAnimation = useAnimatedStyle(() => {
        let translateY = 0

        if (focus === "top") {
            translateY = keyboardHeight == 0 ? 0 : -50
        }
        if (focus === "bottom") {
            translateY = -keyboardHeight
        }

        return { transform: [{ translateY: withTiming(translateY, { duration: 500 }) }]}
    }, [focus, keyboardHeight])
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

    return (
        <Animated.View style={[styles.container, scrollAnimation, { backgroundColor: Colors[theme].background }]}>
            <ScrollView keyboardShouldPersistTaps="never">
                <LinearGradient
                    colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                    start={[0, 1]} end={[0, 0]}
                >
                    <View style={[styles.topView, { paddingTop: insets.top }]}>
                        <Text style={styles.header}>Get started with your first deep work</Text>
                    </View> 
                </LinearGradient>

                <ThemedView style={styles.cover}>
                    <LinearGradient
                        colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                        start={[0, 1]} end={[0, 0]}
                        style={styles.cardGradient}
                    >
                        <ThemedView style={styles.card}>
                            <ThemedText style={{ textAlign: 'center' }}>
                                Select a name for your focus session
                            </ThemedText>
                            <ThemedView style={styles.inputView}>
                                <TextInput 
                                    placeholder={defaultName}
                                    placeholderTextColor={`${Colors[theme].text}80`}
                                    onChangeText={(text) => setDefaultName(text)}
                                    onFocus={() => setFocus("top")}
                                    onBlur={() => setFocus("")}
                                    style={[
                                        styles.input, 
                                        { 
                                            borderBottomColor: Colors[theme].text,
                                            color: Colors[theme].text
                                        }
                                    ]}
                                />
                            </ThemedView>
                        </ThemedView>
                    </LinearGradient>

                    <LinearGradient
                        colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                        start={[0, 1]} end={[0, 0]}
                        style={styles.cardGradient}
                    >
                        <ThemedView style={styles.card}>
                            <ThemedText style={{ textAlign: 'center' }}>
                                Pick your focus session duration.
                            </ThemedText>
                            <TimerCarousel 
                                setHourSelected={setHourSelected} 
                                setMinuteSelected={setMinuteSelected}
                                setFocus={setFocus}
                            />
                        </ThemedView>     
                    </LinearGradient>
                </ThemedView>

                <View style={{ height: insets.bottom + 100}} />
            </ScrollView>

            <Pressable 
                style={[styles.bottom, { bottom: insets.bottom, backgroundColor: Colors[theme].background }]} 
                onPress={handleSession}
            >
                <LinearGradient
                    colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                    style={styles.gradientButton}
                    start={[0, 0]}
                    end={[1, 0]}
                >
                    <Text style={styles.gradientText}>Next</Text>
                    <FontAwesome6 name="arrow-right-long" size={24} color="white" />
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    topView: { 
        height: 270, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000049'
    },
    cover: {
        flex: 1,
        marginTop: 30,
    },
    coverTopText: {
        marginHorizontal: 'auto',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 30
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
        lineHeight: 35,
        width: '70%',
        marginHorizontal: 'auto',
        fontWeight: 600,
        color: Colors.dark.text
    },
    cardGradient: {
        padding: 1.5,
        marginHorizontal: 10,
        borderRadius: 20,
        marginVertical: 5,
        borderWidth: 1,
    },
    card: {
        padding: 20,
        borderRadius: 20,
    },
    inputView: {
        height: 200,
        justifyContent: 'center',
        paddingBottom: 30,
        borderRadius: 20
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
    },
    bottom: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    gradientButton: {
        width: '50%',
        padding: 15,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        marginBottom: 15,
        flexDirection: 'row',
        gap: 20
    },
    gradientText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    },
});
