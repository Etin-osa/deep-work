import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import ProgressBar from "@/components/progress-bar";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSharedValue } from "react-native-reanimated";

export default function summary() {
    const insets = useSafeAreaInsets()
    const deviceWidth = Dimensions.get("screen").width
    const percentage = useSharedValue(0)

    // useEffect(() => {
    //     router.replace("/(home_tabs)/profile")
    // }, [])

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 30, flex: 1 }}>
                <ThemedView style={{ marginBottom: 30 }}>
                    <ThemedView style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="checkmark-circle" size={120} color="#24D397" />
                    </ThemedView>
                    <ThemedText style={styles.header}>
                        Session Complete!
                    </ThemedText>
                    <ThemedText style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }}>
                        Awesome work. Time to recharge
                    </ThemedText>
                </ThemedView>

                <ThemedView darkColor="#1A242E" style={{ borderRadius: 15, paddingVertical: 10, marginBottom: 30 }}>
                    <ProgressBar 
                        backgroundColor={Colors.accentColor} 
                        progressBarColor="#24D397" 
                        percentage={percentage}
                    >
                        <View>
                            <ThemedText darkColor="rgb(255, 255, 255, 0.8)" style={{ textAlign: 'center', fontSize: 14 }}>Total time</ThemedText>
                            <ThemedText style={styles.timer}>2h 15m</ThemedText>
                        </View>
                    </ProgressBar>
                </ThemedView>

                <ThemedView style={styles.timerInfo}>
                    <ThemedView darkColor="#1A242E" style={styles.timerInfoSection}>
                        <View style={styles.eachTimerSection}>
                            <Entypo name="laptop" size={22} color="rgb(147, 197, 253)" />
                            <ThemedText style={styles.timerTitle}>Focus Time</ThemedText>
                        </View>
                        <ThemedText style={styles.timerText}>1h 45m</ThemedText>
                    </ThemedView>
                    <ThemedView darkColor="#1A242E" style={styles.timerInfoSection}>
                        <View style={styles.eachTimerSection}>
                            <MaterialIcons name="coffee" size={22} color="rgb(134, 239, 172)" />
                            <ThemedText style={styles.timerTitle}>Breaks</ThemedText>
                        </View>
                        <ThemedText style={styles.timerText}>3</ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedView darkColor="#1A242E" style={styles.taskInfo}>
                    <ThemedText style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)' }}>Tasks</ThemedText>
                    <View style={{ gap: 20 }}>
                        {["Projects proposal", "Design Mockups", "Client Meeting"].map((each, index) => 
                            <View style={styles.taskSection} key={index}>
                                <ThemedText>{each}</ThemedText>
                                {index === 2 ?
                                    <ThemedText style={{ fontSize: 14, color: '#ef4444' }}>Skipped</ThemedText> :
                                    <ThemedText style={{ fontSize: 14, color: '#24D397' }}>Completed</ThemedText> 
                                }
                            </View>
                        )}
                    </View>
                </ThemedView>

                <View style={{ height: insets.bottom + 150 }} />
            </ScrollView>

            <ThemedView 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth
                }}
            >
                <LargeButton 
                    text="Done" 
                    buttonStyle={{
                        backgroundColor: "#24D397",
                        borderRadius: 15,
                        marginBottom: 10
                    }}
                    textStyle={{ fontWeight: 'bold', color: Colors.dark.background }}
                    onPress={() => router.replace("/(home_tabs)")}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        position: 'relative',  
        paddingHorizontal: 15 
    },
    header: { 
        textAlign: 'center', 
        fontSize: 30, 
        fontWeight: 'bold', 
        marginVertical: 10,
        lineHeight: 40 
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    timerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 30
    },
    timerInfoSection: {
        borderRadius: 15,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 15
    },
    eachTimerSection: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 10
    },
    timerText: {
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight: 40,
        letterSpacing: 1
    },
    timerTitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14
    },
    taskInfo: {
        padding: 20,
        borderRadius: 15,
        gap: 20
    },
    taskSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)'
    }
});
