import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DraxList, DraxListItem, DraxProvider } from 'react-native-drax';

import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { AntDesign } from "@expo/vector-icons";

type SlotType = 'work' | 'break';

type SlotCard = {
    id: string;
    type: SlotType;
    duration: string[]; 
    label?: string;
}

export default function slot() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'light'
    const { name: sessionName, hour, minute } = useLocalSearchParams()
    const [slotList, setSlotList] = useState<SlotCard[]>([])

    function makeId(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 9);
    }

    const formatDuration = (value: number) => {
        let formatedValue = value.toFixed(2)

        if (formatedValue.split(".")[0].length === 1) {
            formatedValue = '0' + formatedValue
        }

        return formatedValue.split('.')
    }

    const generateSlots = () => {
        const slots: SlotCard[] = []
        const totalMinutes = (parseInt(hour as string) * 60) + parseInt(minute as string)

        if (totalMinutes <= 20) {
            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: formatDuration(20),
                label: 'Work',
            })

            setSlotList(slots)
            return;
        }

        if (totalMinutes <= 60) {
            const workDuration = Math.max(1, Math.round(totalMinutes - 5));

            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: formatDuration(workDuration),
                label: `Work`,
            })
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: formatDuration(5),
                label: 'Break (5 min)',
            })

            setSlotList(slots)
            return;
        }

        const cycleLength = 45 + 10 // Average cycle length
        const cycles = Math.floor(totalMinutes / cycleLength) // Number of cycles in totalMinutes
        const usedByCycles = cycles * cycleLength // totalMinutes of usedTime
        let remaining = Math.round(totalMinutes - usedByCycles);

        Array.from(Array(cycles).keys()).forEach(() => {
            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: formatDuration(45),
                label: 'Work',
            })
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: formatDuration(10),
                label: 'Break',
            })
        })
        
        if (remaining > 0) { 
            const lastType = slots[slots.length - 1].type
            const prefix = lastType === 'work' ? 'b-' : 'w-' 
            const label = lastType === 'work' ? `Break`:  `Work`

            slots.push({
                id: makeId(prefix),
                type: lastType,
                duration: formatDuration(remaining),
                label,
            });
        }

        setSlotList(slots)
        return;
    }

    useEffect(() => {
        generateSlots()
    }, [])

    return (
        <Animated.View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
            <LinearGradient
                colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                start={[0, 1]} end={[0, 0]}
            >
                <View style={[styles.topView, { paddingTop: insets.top }]}>
                    <Text style={styles.header}>{sessionName}</Text>

                    <View style={styles.timeHeader}>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            {parseInt(hour as string) > 0 && 
                                <Text style={styles.time}>{hour} <Text style={styles.timeLabel}>hour</Text></Text>
                            }
                            {parseInt(minute as string) > 0 && 
                                <Text style={styles.time}>{minute} <Text style={styles.timeLabel}>minutes</Text></Text>
                            }
                        </View>
                    </View>
                </View> 
            </LinearGradient>

            <DraxProvider>
                <View style={{ flexDirection: 'row' , gap: 20, paddingVertical: 25, marginLeft: 5 }}>
                    <Pressable style={styles.topButton}>
                        <AntDesign name="plus" size={20} color="black" />
                        <Text style={{ fontSize: 16 }}>Add Task</Text>
                    </Pressable>
                    <Pressable style={styles.topButton}>
                        <AntDesign name="plus" size={20} color="black" />
                        <Text style={{ fontSize: 16 }}>Add Break</Text>
                    </Pressable>
                </View>

                <DraxList
                    data={slotList}
                    parentDraxViewProps={{ style: { flex: 1 } }}
                    renderItem={({ item }, itemProps) => (
                        <DraxListItem
                            itemProps={itemProps}
                            draggingStyle={{ opacity: 0 }}
                            dragReleasedStyle={{ opacity: 0 }}
                        >
                            {item.id.includes('w-') ?
                                <LinearGradient
                                    colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                                    start={[0, 1]} end={[0, 0]}
                                    style={styles.cardGradient}
                                >
                                    <ThemedView style={styles.card}>
                                        <ThemedView style={{ gap: 5 }}>
                                            <ThemedText style={styles.cardTitle}>Title</ThemedText>
                                            <ThemedText style={{ fontSize: 25 }}>{item.label}</ThemedText>
                                        </ThemedView>
                                        <ThemedView style={{ gap: 5 }}>
                                            <ThemedText style={styles.cardTitle}>Duration</ThemedText>
                                            <ThemedView style={styles.cardLeft}>
                                                <ThemedText style={{ fontSize: 25 }}>{item.duration[0]}</ThemedText>
                                                <ThemedText style={{ fontSize: 25 }}>:</ThemedText>
                                                <ThemedText style={{ fontSize: 25 }}>{item.duration[1]}</ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                    </ThemedView>
                                </LinearGradient> :
                                <ThemedView style={styles.cardBreak} darkColor="#202020ff">
                                    <ThemedText style={styles.cardTitle}>Break</ThemedText>
                                    <View style={styles.cardLeft}>
                                        <ThemedText style={{ fontSize: 25 }}>{item.duration[0]}</ThemedText>
                                        <ThemedText style={{ fontSize: 25 }}>:</ThemedText>
                                        <ThemedText style={{ fontSize: 25 }}>{item.duration[1]}</ThemedText>
                                    </View>
                                </ThemedView>
                            }
                        </DraxListItem>
                    )}
                    onItemReorder={({fromIndex, toIndex}) => {
                        const newData = [...slotList];
                        const item = newData.splice(fromIndex, 1)[0];
                        newData.splice(toIndex, 0, item);
                        setSlotList(newData);
                    }}
                />
            </DraxProvider>
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
        justifyContent: 'center',
        backgroundColor: '#00000049',
        paddingHorizontal: 20
    },
    header: {
        fontSize: 45,
        lineHeight: 55,
        width: '70%',
        fontWeight: 600,
        color: Colors.dark.text
    },
    timeHeader: {
        paddingTop: 10
    },
    time: {
        fontSize: 25,
        color: 'white'
    },
    timeLabel: {
        fontSize: 20,
        color: 'white'
    },
    cardGradient: {
        padding: 1.5,
        margin: 5,
        borderRadius: 15,
        borderWidth: 1,
    },
    card: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: 15, 
        padding: 20,
    },
    cardLeft: {
        flexDirection: 'row',
        gap: 10
    },
    cardTitle: { 
        fontSize: 13, 
        color: '#ffffffa4', 
        letterSpacing: .5 
    },
    cardBreak: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        margin: 5,
        borderRadius: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        marginVertical: 20
    },
    topButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        paddingHorizontal: 20, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        paddingVertical: 8 
    }
});
