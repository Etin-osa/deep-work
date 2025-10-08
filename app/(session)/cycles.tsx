import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DraxList, DraxListItem, DraxProvider } from 'react-native-drax';

import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import LargeButton from "@/components/large-button";

type SlotType = 'work' | 'break';

type SlotCard = {
    id: string;
    type: SlotType;
    duration: number; 
    label: string;
}

export default function slot() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'light'
    const { label, hours, minutes } = useLocalSearchParams()
    const [slotList, setSlotList] = useState<SlotCard[]>([])
    const [extraTime, setExtraTime] = useState(10)

    function makeId(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 9);
    }

    const generateCycles = useCallback(() => {
        const slots: SlotCard[] = []
        const totalMinutes = (parseInt(hours as string) * 60) + parseInt(minutes as string)

        if (totalMinutes <= 20) {
            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: 20,
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
                duration: workDuration,
                label: `Work`,
            })
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: 5,
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
                duration: 45,
                label: 'Work',
            })
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: 10,
                label: 'Break',
            })
        })
        
        if (remaining > 0) { 
            const lastType = slots[slots.length - 1].type
            const prefix = lastType === 'work' ? 'b-' : 'w-' 
            const label = lastType === 'work' ? `Break`:  `Work`

            slots.push({
                id: makeId(prefix),
                type: lastType === "work" ? "break" : "work",
                duration: remaining,
                label,
            });
        }

        setSlotList(slots)
        return;
    }, [slotList])

    const handleItem = (id: string) => {
        const newList = slotList.filter(each => each.id !== id)
        setSlotList(newList)
    }

    useEffect(() => {
        generateCycles()
    }, [])

    return (
        <ThemedView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
            <ThemedView style={styles.headerView}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={30} color="white" />
                </Pressable>
                <ThemedText style={styles.headerLabel}>{label}</ThemedText>
                <Pressable>
                    <ThemedText darkColor={Colors.accentColor} style={{ fontSize: 18, fontWeight: '600' }}>Save</ThemedText>
                </Pressable>
            </ThemedView>

            <ThemedView style={styles.timeView}>
                <ThemedText style={{ fontSize: 18 }} darkColor={Colors[theme].placeholder}>1 hour 30 minutes </ThemedText>
                <ThemedView style={styles.extraTime}>
                    <ThemedText style={[styles.extraTimeTitle, {  color: 'rgb(74, 222, 128)' }]}>
                        <FontAwesome name="plus" size={30} color="rgb(74, 222, 128)" />
                        {extraTime}
                    </ThemedText>
                    <ThemedText style={[{ color: Colors[theme].inputLabel }, styles.extraMin]}>min</ThemedText>
                </ThemedView>
            </ThemedView>

            <DraxProvider>
                <DraxList
                    data={slotList}
                    parentDraxViewProps={{ style: { flex: 1, overflow: 'scroll' } }}
                    renderItem={({ item }, itemProps) => (
                        <DraxListItem
                            itemProps={itemProps}
                            style={{ marginVertical: 7, marginHorizontal: 10, borderRadius: 15 }}
                            draggingStyle={{ opacity: 0 }}
                            hoverDraggingStyle={{ borderWidth: 1, borderColor: 'rgba(82, 104, 136, 1)' }}
                            dragReleasedStyle={{ opacity: 0 }}
                            key={item.id}
                        >
                            <ThemedView style={styles.card} darkColor={Colors.dark.inputBg}>
                                <View style={styles.cardLeft}>
                                    <MaterialIcons name="drag-indicator" size={26} color={Colors[theme].paragraph} />

                                    <View style={styles.cardBody}>
                                        <ThemedView 
                                            darkColor={item.type.includes("w") ? 'rgba(30, 58, 138, .5)' : 'rgba(20, 83, 45, 0.5)'} 
                                            style={styles.cardTypeIcon}
                                        >
                                            {item.type.includes("w") ?
                                                <Entypo name="laptop" size={24} color="rgb(147, 197, 253)" /> :
                                                <MaterialIcons name="coffee" size={24} color="rgb(134, 239, 172)" />
                                            }
                                        </ThemedView>
                                        <View>
                                            <ThemedText>{item.label}</ThemedText>
                                            <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>{item.duration} min</ThemedText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardRight}>
                                    <Pressable>
                                        <Feather name="edit-2" size={20} color={Colors[theme].paragraph} />
                                    </Pressable>
                                    <Pressable onPress={() => handleItem(item.id)}>
                                        <Feather name="trash-2" size={20} color={Colors[theme].paragraph} />
                                    </Pressable>
                                </View>
                            </ThemedView>
                        </DraxListItem>
                    )}
                    onItemReorder={({fromIndex, toIndex}) => {
                        const newData = [...slotList];
                        const item = newData.splice(fromIndex, 1)[0];
                        newData.splice(toIndex, 0, item);
                        setSlotList(newData);
                    }}
                    ListFooterComponent={<ThemedView style={{ height: 100 }} />}
                />

                <ThemedView style={styles.addBtnView}>
                    <AntDesign name="plus" size={20} color="white" />
                </ThemedView>
            </DraxProvider>

            <LargeButton 
                text="Start Session " 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    marginBottom: 15,
                    width: '100%',
                    borderRadius: 15
                }}
                containerStyle={{
                    width: '95%',
                    marginHorizontal: 'auto'
                    // left: 20,
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
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    headerLabel: { 
        fontSize: 25, 
        lineHeight: 50,
        fontWeight: '600'
    },
    timeView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40
    },
    extraTime: { 
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
        alignItems: 'flex-end'
    },
    extraTimeTitle: {
        fontSize: 60,
        lineHeight: 60,
        fontWeight: 'bold'
    },
    extraMin: { 
        fontSize: 25,
        transform: [{ translateY: -7 }]
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    cardTypeIcon: {
        width: 55,
        height: 55,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 35
    },
    addBtnView: {
        backgroundColor: Colors.accentColor,
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20,
        right: 10
    }
    // topView: { 
    //     height: 270, 
    //     justifyContent: 'center',
    //     backgroundColor: '#00000049',
    //     paddingHorizontal: 20
    // },
    // header: {
    //     fontSize: 45,
    //     lineHeight: 55,
    //     width: '70%',
    //     fontWeight: 600,
    //     color: Colors.dark.text
    // },
    // timeHeader: {
    //     paddingTop: 10
    // },
    // time: {
    //     fontSize: 25,
    //     color: 'white'
    // },
    // timeLabel: {
    //     fontSize: 20,
    //     color: 'white'
    // },
    // cardGradient: {
    //     padding: 1.5,
    //     margin: 5,
    //     borderRadius: 15,
    //     borderWidth: 1,
    // },
    // card: { 
    //     flexDirection: 'row', 
    //     justifyContent: 'space-between', 
    //     alignItems: 'center', 
    //     borderRadius: 15, 
    //     padding: 20,
    // },
    // cardLeft: {
    //     flexDirection: 'row',
    //     gap: 10
    // },
    // cardTitle: { 
    //     fontSize: 13, 
    //     color: '#ffffffa4', 
    //     letterSpacing: .5 
    // },
    // cardBreak: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     gap: 30,
    //     margin: 5,
    //     borderRadius: 30,
    //     paddingVertical: 15,
    //     flexDirection: 'row',
    //     marginVertical: 20
    // },
    // topButton: { 
    //     flexDirection: 'row', 
    //     alignItems: 'center', 
    //     gap: 10, 
    //     paddingHorizontal: 20, 
    //     backgroundColor: 'white', 
    //     borderRadius: 20, 
    //     paddingVertical: 8 
    // }
});
