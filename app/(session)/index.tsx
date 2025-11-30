import { MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function index() {
    const theme = useColorScheme() ?? 'light'

    // useEffect(() => {
    //     router.push("/(session)/custom")
    // }, [])

    return (
        <ThemedView style={[styles.container]}>
            <ThemedView>
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { mode: "focus" } 
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
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>90 minutes, no breaks</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { mode: "pomodoro" } 
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
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { mode: "quick" } 
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
                            <ThemedText style={styles.cardHeader}>Quick Focus</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>For a quick burst of productivity.</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>15 minutes work, 3 minutes break</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { mode: "study" } 
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
                <Pressable 
                    onPress={() => router.push({ 
                        pathname: "/(session)/cycles", 
                        params: { mode: "custom" } 
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
                            <ThemedText style={styles.cardHeader}>Custom</ThemedText>
                            <View>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>Create your own work/break cycle.</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={styles.paragraph}>Study your way</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </Pressable>
            </ThemedView>
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
