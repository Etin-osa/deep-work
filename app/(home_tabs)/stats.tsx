import { Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";
import React 
from "react";
import { Calendar, toDateId, useCalendar } from "@marceloterreiro/flash-calendar";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

const today = toDateId(new Date());

export default function stats() {
    const theme = useColorScheme() ?? 'light' 
    const insets = useSafeAreaInsets()
    const { weekDaysList, weeksList } = useCalendar({
        calendarMonthId: today,
        getCalendarWeekDayFormat: (date) => date.toLocaleDateString('en-US', { weekday: 'short' })
    })

    return (
        <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
            <ThemedView style={[styles.header, { paddingTop: insets.top + 25 }]}>
                <ThemedText style={styles.headerText}>October,  2025</ThemedText>
                <Pressable style={styles.headerPressable}>
                    <Image source={require("@/assets/images/aiony-haust-3TLl_97HNJo-unsplash.jpg")} style={{ width: '100%', height: '100%'}} />
                </Pressable>
            </ThemedView>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 20 }}>
                <ThemedView>
                    <Calendar.VStack>
                        <Calendar.Row.Week>
                            {weekDaysList.map((eachDay, index) => 
                                <Calendar.Item.WeekName key={index} height={50}>
                                    <ThemedView>
                                        <ThemedText>{eachDay}</ThemedText>
                                    </ThemedView>
                                </Calendar.Item.WeekName>
                            )}
                        </Calendar.Row.Week>

                        {weeksList.map((week, i) =>
                            <Calendar.Row.Week key={i}>
                                {week.map(day =>
                                    <Calendar.Item.Day.Container 
                                        isStartOfWeek={day.isStartOfWeek} 
                                        key={day.id} dayHeight={45}
                                        daySpacing={0}
                                    >
                                        <Calendar.Item.Day theme={{
                                            today: ({ }) => ({
                                                container: {
                                                    borderWidth: 0
                                                }
                                            })
                                        }} height={50} onPress={() => {}} metadata={day}>
                                            <ThemedView>
                                                <ThemedText>{day.displayLabel}</ThemedText>
                                                
                                            </ThemedView>
                                        </Calendar.Item.Day>
                                    </Calendar.Item.Day.Container>
                                )}
                            </Calendar.Row.Week>
                        )}
                    </Calendar.VStack>
                </ThemedView>

                <ThemedView style={styles.month}>
                    <ThemedView>
                        <ThemedText style={{ fontSize: 25, fontWeight: 'bold'}}>4h 17m</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.monthBar}>
                        <ThemedView style={{ width: '60%', backgroundColor: 'rgba(19, 127, 236, 0.8)', height: '100%' }} />
                        <ThemedView style={{ width: '20%', backgroundColor: 'rgba(19, 236, 37, 0.8)', height: '100%' }} />
                        <ThemedView style={{ width: '20%', backgroundColor: 'rgba(236, 19, 189, 0.8)', height: '100%' }} />
                    </ThemedView>
                    <ThemedView>
                        <ThemedView style={styles.monthEach}>
                            <ThemedView style={styles.monthLeft}>
                                <ThemedView darkColor="#137fec1a" style={{ padding: 10, borderRadius: 15 }}>
                                    <Feather name="book-open" size={24} color="#137fec" />
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText>Deep Work</ThemedText>
                                    <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>2h 57m</ThemedText>
                                </ThemedView>
                            </ThemedView>
                            <ThemedText>60%</ThemedText>
                        </ThemedView>

                        <ThemedView style={styles.monthEach}>
                            <ThemedView style={styles.monthLeft}>
                                <ThemedView darkColor="#13ec251a" style={{ padding: 10, borderRadius: 15 }}>
                                    <MaterialIcons name="psychology" size={24} color="#13ec25" />
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText>Reading</ThemedText>
                                    <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>51m</ThemedText>
                                </ThemedView>
                            </ThemedView>
                            <ThemedText>20%</ThemedText>
                        </ThemedView>

                        <ThemedView style={styles.monthEach}>
                            <ThemedView style={styles.monthLeft}>
                                <ThemedView darkColor="#ec13bd1a" style={{ padding: 10, borderRadius: 15 }}>
                                    <Feather name="book-open" size={24} color="#ec13bd" />
                                </ThemedView>
                                <ThemedView>
                                    <ThemedText>Exercise</ThemedText>
                                    <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>51m</ThemedText>
                                </ThemedView>
                            </ThemedView>
                            <ThemedText>20%</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.today}>
                    <ThemedView style={styles.todaySection}>
                        <ThemedText style={{ fontSize: 14 }} darkColor="rgb(156, 163, 175)">Total Hour Focused</ThemedText>
                        <ThemedText style={styles.todayHeader}>12h 5m</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.todaySection}>
                        <ThemedText style={{ fontSize: 14 }} darkColor="rgb(156, 163, 175)">Total Hours Break</ThemedText>
                        <ThemedText style={styles.todayHeader}>45m</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: { 
        fontSize: 25
    },
    headerPressable: { 
        width: 40, 
        height: 40, 
        borderRadius: 100, 
        overflow: 'hidden' 
    },
    month: {
        padding: 20,
        marginTop: 50,
        borderColor: Colors.secondaryColor,
        borderRadius: 15,
        borderWidth: 1,
        gap: 15,
        marginBottom: 15
    },
    monthEach: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center'
    },
    monthLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    monthBar: {
        height: 30,
        width: '100%',
        borderRadius: 100,
        borderWidth: 1,
        overflow: 'hidden',
        flexDirection: 'row'
    },
    today: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 70
    },
    todaySection: {
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        flex: 1,
        gap: 20,
        height: 160,
        borderColor: Colors.secondaryColor,
        justifyContent: 'space-between'
    },
    todayHeader: {
        fontSize: 35,
        lineHeight: 40,
        fontWeight: 'bold'
    }
});
