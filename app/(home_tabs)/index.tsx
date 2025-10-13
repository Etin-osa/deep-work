import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { AntDesign, Feather, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

const sessions = [
    {
        icon: <FontAwesome6 name="book-open" size={24} color="white" />,
        title: "Morning Reading",
        time: "45 min"
    },
    {
        icon: <MaterialIcons name="psychology" size={24} color="white" />,
        title: "Deep Work",
        time: "90 min"
    },
    {
        icon: <FontAwesome6 name="book-open" size={24} color="white" />,
        title: "Morning Reading",
        time: "45 min"
    },
]

export default function index() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'light'
    const [weekNumber, setWeekNumber] = useState(0)
    const [weekDates, setWeekDates] = useState<{ date: string, day: string }[]>([])
    const [currentDay, setCurrentDay] = useState({
        month: '',
        date: ''
    })

    function updateWeekInfo() {
        const now = new Date();
        
        // ISO week calculation
        const target = new Date(now.valueOf());
        const dayNr = (now.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
        
        // Find Monday of current week
        const curr = new Date(now);
        const day = curr.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(curr);
        monday.setDate(curr.getDate() + diff);
        
        // Generate week dates
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(monday);
            weekDay.setDate(monday.getDate() + i);
            const weekDate = weekDay.getDate()

            dates.push({
                date: weekDate >= 10 ? weekDate.toString() : "0" + weekDate,
                day: weekDay.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }
        
        setWeekNumber(weekNum);
        setWeekDates(dates);
        setCurrentDay({ 
            month: now.toLocaleDateString('en-US', { month: 'long' }),
            date: now.getDate().toString()
        })
    }

    useEffect(() => {
        updateWeekInfo()
    }, [])

    return (
        <ThemedView style={{ flex: 1, }}>
            <ThemedView style={{ height: insets.top }} />
            <ScrollView style={{ ...styles.container, paddingTop: 25,  }}>
                <ThemedView style={[styles.header, { marginBottom: 20 }]}>
                    <ThemedText style={styles.headerText}>
                        {currentDay.month},  <ThemedText style={styles.headerTextWeek}>Week {weekNumber}</ThemedText>
                    </ThemedText>
                    <Pressable style={styles.headerPressable}>
                        <Image source={require("@/assets/images/aiony-haust-3TLl_97HNJo-unsplash.jpg")} style={{ width: '100%', height: '100%'}} />
                    </Pressable>
                </ThemedView>

                <ThemedView style={styles.calender}>
                    {weekDates.map(eachDay => 
                        <ThemedView style={[styles.calenderSection, eachDay.date === currentDay.date && styles.calenderActive]} key={eachDay.date}>
                            <ThemedText>{eachDay.day}</ThemedText>
                            <ThemedText>{eachDay.date}</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
                
                <ThemedView style={{ gap: 15, marginBottom: 35 }}>
                    <ThemedView style={styles.header}>
                        <ThemedText style={{ fontSize: 18 }}>Saved Sessions</ThemedText>
                        <ThemedText style={{ fontSize: 14, color: Colors[theme].placeholder }}>See All</ThemedText>
                    </ThemedView>

                    <ThemedView style={{ gap: 15 }}>
                        {sessions.map((session, index) => 
                            <ThemedView style={styles.eachSession} darkColor={Colors.dark.inputBg} key={index}>
                                <View style={styles.sessionLeft}>
                                    <ThemedView darkColor="rgba(19, 127, 236, 0.2)" style={{ padding: 10, borderRadius: 15 }}>
                                        {session.icon}
                                    </ThemedView>

                                    <View>
                                        <ThemedText>{session.title}</ThemedText>
                                        <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>{session.time}</ThemedText>
                                    </View>
                                </View>

                                <Pressable style={styles.sessionPressable}>
                                    <Feather name="play" size={20} color="white" />
                                </Pressable>
                            </ThemedView>
                        )}
                    </ThemedView>
                </ThemedView>

                <ThemedView style={{ gap: 15 }}>
                    <ThemedView>
                        <ThemedText style={{ fontSize: 18 }}>Quick Add</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.quickSection}>
                        <ThemedView style={styles.quickSectionTop}>
                            <Pressable style={styles.quickSectionEach}>
                                <ThemedView style={styles.quickSectionIcon} darkColor="rgba(19, 127, 236, 0.2)">
                                    <MaterialCommunityIcons name="timer-outline" size={24} color="rgb(58, 90, 154)" />
                                </ThemedView>

                                <View>
                                    <ThemedText>Pomodoro</ThemedText>
                                    <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>25 min</ThemedText>
                                </View>
                            </Pressable>

                            <Pressable style={styles.quickSectionEach}>
                                <ThemedView style={styles.quickSectionIcon} darkColor="rgba(19, 127, 236, 0.2)">
                                    <Ionicons name="flash-outline" size={24} color="rgb(58, 90, 154)" />
                                </ThemedView>

                                <View>
                                    <ThemedText>Quick Focus</ThemedText>
                                    <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>15 min</ThemedText>
                                </View>
                            </Pressable>
                        </ThemedView>

                        <ThemedView style={styles.bottomPressable}>
                            <Pressable style={styles.newSection}>
                                <AntDesign name="plus" size={24} color={Colors[theme].paragraph} />
                                <ThemedText darkColor={Colors[theme].paragraph}>New session</ThemedText>
                            </Pressable>

                            <View style={{ flex: 1, height: '100%', padding: 15 }} />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 20, 
        backgroundColor: Colors.dark.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: { 
        fontSize: 25
    },
    headerTextWeek: { 
        fontSize: 25,
    },
    headerPressable: { 
        width: 40, 
        height: 40, 
        borderRadius: 100, 
        overflow: 'hidden' 
    },
    calender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 55
    },
    calenderSection: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
    },
    calenderActive: {
        backgroundColor: Colors.accentColor
    },
    eachSession: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sessionPressable: {
        backgroundColor: Colors.accentColor,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30
    },
    sessionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    quickSection: {
        gap: 15
    },
    quickSectionTop: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    quickSectionEach: {
        padding: 15,
        backgroundColor: Colors.dark.inputBg,
        flex: 1,
        borderRadius: 15,
        height: 160,
        justifyContent: 'space-between'
    },
    quickSectionIcon: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    newSection: {
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 70,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        borderRadius: 15,
        borderStyle: 'dashed',
        flex: 1,
        height: 160
    },
    bottomPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15
    }
});
