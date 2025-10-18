import React, { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Entypo, MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { DraxProvider, DraxList, DraxListItem, DraxView } from "react-native-drax";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "./themed-text";
import { SlotCard, SlotType } from "@/redux/slices/sessionSlice";
import SlotSheet from "./slot-sheet";
import useKeyboard from "@/hooks/useKeyboard";
import { presentTime } from "@/constants/utils";

export default function ActiveBottomSheet({ modal, completedSection, totalTime, remainingSection, setRemaningSection }: {
    modal: string,
    totalTime: number
    remainingSection: SlotCard[]
    completedSection: SlotCard[]
    setRemaningSection: React.Dispatch<React.SetStateAction<SlotCard[]>>
}) {
    const insets = useSafeAreaInsets()
    const { keyboardVisible } = useKeyboard()
    const bottomSheetRef = useRef<BottomSheet | null>(null)
    const dragSheetRef = useRef<FlatList | null>(null)
    const sheetPosition = useSharedValue(0)
    const [bottomSheet, setBottomSheet] = useState<string[]>(["10%"])
    const [sheetType, setSheetType] = useState<"tasks" | "analytics" | "edit">("tasks")
    const [taskType, setTaskType] = useState<SlotType>("work")
    const [sheetSlot, setSheeSlot] = useState<SlotCard | undefined>()

    const chevronAnimation = useAnimatedStyle(() => ({
        transform: [{ rotate: sheetPosition.value + 'deg' }]
    }), [sheetPosition])

    const handleCloseModalPress = useCallback(() => {
        bottomSheetRef.current?.collapse()
    }, [])

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, [])

    function makeId(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 9);
    }

    const updateChevronAnimation = (index: number) => {
        if (index === 0) {
            sheetPosition.value = withTiming(0, { duration: 400 })
        } else {
            sheetPosition.value = withTiming(180, { duration: 400 })
        }
    }

    const handleOnSaveSlot = (label: string, duration: number) => {
        if (sheetSlot) {
            const currentSlot = remainingSection.filter(slot => slot.id === sheetSlot.id)

            if (!currentSlot) {
                console.log("Slot id not found")
            }

            const newId = currentSlot[0].id.split('-')
            const customId = taskType === "break" ? 'b-' : 'w-'
            const editedSlot: SlotCard = {
                duration, label, type: taskType, id: customId + newId[1]
            }

            const newSlotList = remainingSection.map(slot => currentSlot[0].id === slot.id ? editedSlot : slot)
            setRemaningSection(newSlotList)
        } else {
            const customId = taskType === "break" ? 'b-' : 'w-'
            setRemaningSection([...remainingSection, {
                duration, label, type: taskType, id: makeId(customId)
            }])
        }

        setSheetType("tasks")
    }

    const calculateTotalWorkTime = () => {
        if (completedSection.length === 0) {
            return {
                total: "0",
                percentage: 0
            }
        }
        const completedTasks = completedSection.map(each => {
            if (each.id.includes('w-')) {
                return each.skipTime ? each.skipTime : each.duration
            }
            return 0
        }).reduce((a, b) => a+b)
        const percentage = Math.round((completedTasks * 100) / totalTime)
        
        return { total: presentTime(completedTasks * 60), percentage }
    }

    const calculateSkip = (type: 'b-' | 'w-') => {
        return completedSection.filter(each => each.status === "skipped" && each.id.includes(type)).length
    }
    
    const calculateBreaks = () => {
        return completedSection.map(each => {
            if (each.id.includes('b-') && !each.skipTime) { return 1 }
        }).filter(each => each !== undefined).length
    }

    useEffect(() => {
        if (keyboardVisible) {
            setBottomSheet(["100%"])
            bottomSheetRef.current?.expand()
        } else {
            setBottomSheet(["10%"])
        }
    }, [keyboardVisible])

    useEffect(() => {
        if (modal === "") {
            setSheetType("tasks")
        }
    }, [modal])

    return (
        <BottomSheet 
            backgroundStyle={{ backgroundColor: 'rgba(19, 127, 236, 1)' }} 
            handleIndicatorStyle={{ backgroundColor: 'rgba(255, 255, 255, .5)' }}
            ref={bottomSheetRef}
            snapPoints={bottomSheet}
            onChange={updateChevronAnimation}
            enableContentPanningGesture={false}
        >
            {(sheetType === "tasks" || sheetType === "analytics") &&
                <BottomSheetView style={{ paddingHorizontal: 20 }}>
                    <View style={styles.bottomSheetHeader}>
                        <View style={styles.bottomSheetHeaderLeft}>
                            <Pressable 
                                onPress={() => {setSheetType("tasks"); handlePresentModalPress()}} 
                                style={[styles.bottmSheetType, sheetType === "tasks" && styles.bottomSheetSelected]}
                            >
                                <ThemedText style={{ fontSize: 14 }}>Tasks</ThemedText>
                            </Pressable>
                            <Pressable 
                                onPress={() => {setSheetType("analytics"); handlePresentModalPress()}} 
                                style={[styles.bottmSheetType, sheetType === "analytics" && styles.bottomSheetSelected]}
                            >
                                <ThemedText style={{ fontSize: 14 }}>Analytics</ThemedText>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => {
                            if (sheetPosition.value === 0) {
                                handlePresentModalPress()
                            } else {
                                handleCloseModalPress()
                            }
                        }} style={[{ padding: 5 }]}>
                            <Animated.View style={chevronAnimation}>
                                <Entypo name="chevron-up" size={24} color="rgba(255, 255, 255, 0.6)" />
                            </Animated.View>
                        </Pressable>
                    </View>

                    {sheetType === "tasks" ?
                        <>
                            <DraxProvider style={{ height: 300 }}>
                                <DraxList 
                                    data={remainingSection}
                                    parentDraxViewProps={{ style: { height: 300 } }}
                                    ref={dragSheetRef}
                                    renderItem={({ item }, itemProps) => 
                                        <DraxListItem
                                            itemProps={itemProps}
                                            style={{ marginVertical: 7, borderRadius: 15 }}
                                            draggingStyle={{ opacity: 0 }}
                                            hoverDraggingStyle={{ borderWidth: 1, borderColor: 'rgba(255, 255, 255, .7)', transform: [{ scale: 1.05 }] }}
                                            dragReleasedStyle={{ opacity: 0 }}
                                            key={item.id}
                                            longPressDelay={200}
                                        >
                                            <DraxView 
                                                key={item.id} 
                                                style={[styles.sheetCard, { 
                                                    backgroundColor: item.type === "work" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(126, 211, 33, 0.2)' 
                                                }]}
                                            >
                                                <View style={styles.sheetCardSide}>
                                                    <MaterialIcons name="drag-indicator" size={26} color="rgba(255, 255, 255, 0.6)" />
                                                    <ThemedText style={{ marginLeft: 2 }}>{item.label.length > 20 ? item.label.substring(0, 20) + '...' : item.label}</ThemedText>
                                                </View>

                                                <View style={styles.sheetCardSide}>
                                                    <Pressable style={{ padding: 5 }} onPress={() => {
                                                        setSheetType("edit")
                                                        setTaskType(item.type as SlotType)
                                                        setSheeSlot(item)
                                                    }}>
                                                        <Feather name="edit-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                                    </Pressable>
                                                    <Pressable style={{ padding: 5 }} onPress={() => {
                                                        setRemaningSection(remainingSection.filter(each => each.id !== item.id))
                                                        setSheeSlot(item)
                                                    }}>
                                                        <Feather name="trash-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                                    </Pressable>
                                                </View>
                                            </DraxView>
                                        </DraxListItem>
                                    }
                                    onItemReorder={({fromIndex, toIndex}) => {
                                        const newData = [...remainingSection];
                                        const item = newData.splice(fromIndex, 1)[0];
                                        newData.splice(toIndex, 0, item);
                                        setRemaningSection(newData);
                                    }}
                                />
                            </DraxProvider>

                            <View style={styles.sheetButton}>
                                <Pressable style={styles.sheetButtonSection} onPress={() => {
                                    setSheetType("edit")
                                    setTaskType("work")
                                    setSheeSlot(undefined)
                                }}>
                                    <AntDesign name="plus" size={24} color="white" />
                                    <ThemedText>Add Task</ThemedText>
                                </Pressable>
                                <Pressable style={styles.sheetButtonSection} onPress={() => {
                                    setSheetType("edit")
                                    setTaskType("break")
                                    setSheeSlot(undefined)
                                }}>
                                    <AntDesign name="plus" size={24} color="white" />
                                    <ThemedText>Add Break</ThemedText>
                                </Pressable>
                            </View>

                            <View style={{ height: insets.bottom }} />
                        </> :
                        <>
                            <View style={styles.analyticsTop}>
                                <View style={styles.analyticsSection}>
                                    <ThemedText style={styles.analyticsTextTitle}>Breaks Taken</ThemedText>
                                    <ThemedText style={styles.analyticsTopText}>
                                        {calculateBreaks()}
                                    </ThemedText>
                                </View>
                                <View style={styles.analyticsSection}>
                                    <ThemedText style={styles.analyticsTextTitle}>Tasks Done</ThemedText>
                                    <ThemedText style={styles.analyticsTopText}>{calculateTotalWorkTime().percentage}%</ThemedText>
                                </View>
                            </View>

                            <View style={styles.analyticsSection}>
                                <ThemedText style={styles.analyticsTextTitle}>Total Focus Time</ThemedText>
                                <ThemedText style={styles.analyticsTopText}>{calculateTotalWorkTime().total}</ThemedText>
                            </View>

                            <View style={[styles.analyticsTop, { marginTop: 15, marginBottom: 0 }]}>
                                <View style={styles.analyticsSection}>
                                    <ThemedText style={styles.analyticsTextTitle}>Tasks Skipped</ThemedText>
                                    <ThemedText style={styles.analyticsTopText}>{calculateSkip('w-')}</ThemedText>
                                </View>
                                <View style={styles.analyticsSection}>
                                    <ThemedText style={styles.analyticsTextTitle}>Breaks Skipped</ThemedText>
                                    <ThemedText style={styles.analyticsTopText}>{calculateSkip('b-')}</ThemedText>
                                </View>
                            </View>

                            <View style={{ height: insets.bottom }} />
                        </>
                    }
                </BottomSheetView>
            }

            {sheetType === "edit" &&
                <BottomSheetView style={{ paddingHorizontal: 20, gap: 20 }}>
                    <SlotSheet 
                        handleCloseModalPress={() => setSheetType("tasks")}
                        setSheetType={setTaskType}
                        sheetType={taskType}
                        sheetSlot={sheetSlot}
                        closeColor="rgb(255, 255, 255)"
                        defaultBackgroundColor="rgba(255, 255, 255, 0.1)"
                        defaultBorderColor="rgba(255, 255, 255, 0.3)"
                        defaultContentColor="rgba(255, 255, 255, 0.3)"
                        selectedBorderColor="rgb(255, 255, 255)"
                        selectedContentColor="rgba(255, 255, 255, 1)"
                        selectedBackgroundColor="rgba(255, 255, 255, 0.1)"
                        inputBackgroundColor="rgba(255, 255, 255, 0.1)"
                        inputBlurColor="rgba(255, 255, 255, 0.3)"
                        inputFocusColor="rgba(255, 255, 255, 1)"
                        placeholderColor="rgba(255, 255, 255, 0.6)"
                        labelColor="white"
                        cancelButtonColor='rgba(255, 255, 255, 0.2)'
                        saveButtonColor="rgba(51, 65, 85, 0.77)"
                        timerColor="rgba(255, 255, 255, 0.6)"
                        onSave={handleOnSaveSlot}
                    />

                    <View style={{ height: insets.bottom }} />
                </BottomSheetView>
            }
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    bottomSheetHeaderLeft: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        borderRadius: 8,
        padding: 5,
    },
    bottmSheetType: {
        padding: 5,
        paddingHorizontal: 35,
        borderRadius: 5
    },
    bottomSheetSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    sheetCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15
    },
    sheetCardSide: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    transformChevronDown: {
        transform: [{ rotate: '180deg' }]
    },
    transformChevronUp: {
        transform: [{ rotate: '0deg' }]   
    },
    sheetButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginTop: 10,
    },
    sheetButtonSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        flex: 1,
        gap: 15,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        fontWeight: 'bold'
    },
    analyticsTop: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 15
    },
    analyticsSection: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        gap: 5
    },
    analyticsTextTitle: {
        color: 'rgb(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    analyticsTopText: {
        fontSize: 35,
        fontWeight: 'bold',
        lineHeight: 40
    }
});
