import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";

export default function index() {
    const theme = useColorScheme() ?? 'light'
    const params = useLocalSearchParams()

    // useEffect(() => {
    //     router.push("/(session)/custom")
    // }, [])

    return (
        <ThemedView style={[styles.container]}>
            <ThemedView>
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { ...params, mode: "focus" } 
                    })} 
                    style={({ pressed }) => ({
                        ...styles.pressable,
                        borderColor: pressed ? Colors.accentColor : 'transparent'
                    })}
                >
                    <ThemedView darkColor={Colors[theme].inputBg} style={styles.card}>
                        <ThemedView darkColor="rgba(58, 90, 154, 0.2)" style={styles.cardLeft}>
                            <MaterialIcons style={styles.transformIcon} name="psychology" size={35} color="rgb(58, 90, 154)" />
                        </ThemedView>
                        <View>
                            <ThemedText style={styles.cardHeader}>Focus Mode</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>For intensive, uninterrupted work</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>No breaks</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { ...params, mode: "pomodoro" } 
                    })}
                    style={({ pressed }) => ({
                        ...styles.pressable,
                        borderColor: pressed ? Colors.accentColor : 'transparent'
                    })}
                >
                    <ThemedView darkColor={Colors[theme].inputBg} style={styles.card}>
                        <ThemedView darkColor="rgba(58, 90, 154, 0.2)" style={styles.cardLeft}>
                            <MaterialCommunityIcons name="timer-outline" size={24} color="rgb(58, 90, 154)" />
                        </ThemedView>
                        <View>
                            <ThemedText style={styles.cardHeader}>Pomodoro</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>Classic time management technique.</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>25 minutes work, 5 minutes break</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                {(parseInt(params.hours as string) * 60) + parseInt(params.minutes as string) >= 50 &&
                    <Pressable 
                        onPress={() => router.push({ 
                            pathname: "/(session)/cycles", 
                            params: { ...params, mode: "study" } 
                        })}
                        style={({ pressed }) => ({
                            ...styles.pressable,
                            borderColor: pressed ? Colors.accentColor : 'transparent'
                        })}
                    >
                        <ThemedView darkColor={Colors[theme].inputBg} style={styles.card}>
                            <ThemedView darkColor="rgba(58, 90, 154, 0.2)" style={styles.cardLeft}>
                                <SimpleLineIcons name="graduation" size={24} color="rgb(58, 90, 154)" />
                            </ThemedView>
                            <View>
                                <ThemedText style={styles.cardHeader}>Study Session</ThemedText>
                                <View>
                                    <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>Optimized for learning and retention.</ThemedText>
                                    <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>50 minutes work, 10 minutes break</ThemedText>
                                </View>
                            </View>
                        </ThemedView>
                    </Pressable>
                }
            </ThemedView>

            <LargeButton 
                text="Create a Custom Session" 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    width: '100%',
                    borderRadius: 15
                }}
                containerStyle={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: [{ translateX: '-50%' }],
                    width: '90%'
                }}
                onPress={() => router.push({ 
                    pathname: "/(session)/cycles", 
                    params: { ...params, mode: "custom", customValue: "30" } 
                })}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    pressable: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1
    },
    card: {
        borderRadius: 16,
        flexDirection: 'row',
        padding: 15,
        gap: 15,
    },
    cardLeft: {
        borderRadius: 16,
        height: 55,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHeader: {
        fontSize: 18,
        marginBottom: 5
    },
    transformIcon: {
        transform: [{ rotateY: '180deg' }]
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 20
    }
});
