import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";

export default function index() {
    const theme = useColorScheme() ?? 'light'

    useEffect(() => {
        router.push("/(session)/custom")
    }, [])

    return (
        <ThemedView style={[styles.container]}>
            <ThemedView>
                <Pressable>
                    <ThemedView darkColor={Colors[theme].inputBg} style={styles.card}>
                        <ThemedView darkColor="rgba(58, 90, 154, 0.2)" style={styles.cardLeft}>
                            <MaterialIcons style={styles.transformIcon} name="psychology" size={35} color="rgb(58, 90, 154)" />
                        </ThemedView>
                        <View>
                            <ThemedText style={styles.cardHeader}>Focus Mode</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>For intensive, uninterrupted work</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>90 minutes</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                <Pressable>
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
                <Pressable>
                    <ThemedView darkColor={Colors[theme].inputBg} style={styles.card}>
                        <ThemedView darkColor="rgba(58, 90, 154, 0.2)" style={styles.cardLeft}>
                            <Ionicons name="flash-outline" size={24} color="rgb(58, 90, 154)" />
                        </ThemedView>
                        <View>
                            <ThemedText style={styles.cardHeader}>Quick Focus</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>For a quick burst of productivity.</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>15 minutes</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                <Pressable>
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
            </ThemedView>

            <LargeButton 
                text="Create a Custom Session" 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    marginBottom: 15,
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
                onPress={() => router.push("/(session)/custom")}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 20,
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
