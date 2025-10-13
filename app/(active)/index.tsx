import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DraxList, DraxListItem, DraxProvider, DraxView } from "react-native-drax";

import SlotSheet from "@/components/slot-sheet";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import ProgressBar from "@/components/progress-bar";
import LargeButton from "@/components/large-button";
import { Dimensions } from "react-native";
import { router } from "expo-router";

type SlotType = 'work' | 'break';

type SlotCard = {
    id: string;
    type: SlotType;
    duration: number; 
    label: string;
}

const customObjects = [
    {
        id: 'w-1',
        type: 'work',
        duration: 25,
        label: 'Deep Work Session'
    },
    {
        id: 'b-1',
        type: 'break',
        duration: 5,
        label: 'Short Break'
    },
    {
        id: 'w-2',
        type: 'work',
        duration: 25,
        label: 'Focused Task'
    },
    {
        id: 'b-2',
        type: 'break',
        duration: 5,
        label: 'Coffee Break'
    },
    {
        id: 'w-3',
        type: 'work',
        duration: 25,
        label: 'Project Work'
    },
    {
        id: 'b-3',
        type: 'break',
        duration: 15,
        label: 'Long Break'
    }
];

export default function index() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? 'dark'
    const deviceHeight = Dimensions.get("screen").height
    const bottomSheetRef = useRef<BottomSheet>(null)
    const dragSheetRef = useRef<FlatList | null>(null)
    const [playPause, setPlayPause] = useState(false)
    const [sheetType, setSheetType] = useState<"tasks" | "analytics" | "edit">("analytics")
    const [cycles, setCycles] = useState(customObjects)
    const sheetPosition = useSharedValue(0)
    const [taskType, setTaskType] = useState<SlotType>("work")
    const [sheetSlot, setSheeSlot] = useState<SlotCard | undefined>()
    const [showModal, setShowModal] = useState("........")

    const chevronAnimation = useAnimatedStyle(() => ({
        transform: [{ rotate: sheetPosition.value + 'deg' }]
    }), [sheetPosition])

    const handleCloseModalPress = useCallback(() => {
        bottomSheetRef.current?.collapse()
    }, [])

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, [])

    const updateChevronAnimation = (index: number) => {
        if (index === 0) {
            sheetPosition.value = withTiming(0, { duration: 400 })
        } else {
            sheetPosition.value = withTiming(180, { duration: 400 })
        }
    }

    useEffect(() => {
        router.push("/(active)/summary")
    }, [])

    return (
        <ThemedView darkColor="rgb(53, 158, 255)" style={{ flex: 1, paddingTop: insets.top }}>
            <View style={styles.headerView}>
                <ThemedText style={styles.headerLabel}>Focus Session</ThemedText>
                <Pressable style={styles.headerButton}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Stop</ThemedText>
                </Pressable>
            </View>

            <View style={[styles.view, { marginBottom: '10%' }]}>
                <View style={styles.body}>
                    <ThemedText style={styles.bodyTop}>WORK</ThemedText>
                </View>

                <ProgressBar backgroundColor="#FFFFFF" progressBarColor="rgba(255, 255, 255, 0.1)">
                    <ThemedText style={{ fontSize: 50, fontWeight: 'bold', lineHeight: 70}}>24:15</ThemedText>
                </ProgressBar>

                <View style={{ gap: 15 }}>
                    <ThemedText style={styles.bodyText}>Time Done: 00:35</ThemedText>
                    <ThemedText style={styles.bottomBodyText}>Total Work Time: 30 min</ThemedText>
                </View>

                <View style={styles.bottomView}>
                    <View style={styles.bottomSection}>
                        <Feather name="trash-2" size={24} color="white" />
                        <ThemedText style={{ fontWeight: 'bold' }}>Delete</ThemedText>
                    </View>
                    <Pressable 
                        onPress={() => setPlayPause(!playPause)} 
                        style={[styles.bottomSection, {
                            backgroundColor: !playPause ? 'rgba(255, 255, 255, 0.2)' : 'rgba(125, 211, 33, 0.4)'
                        }]}
                    >
                        {!playPause ?
                            <>
                                <Feather name="pause" size={24} color="white" />
                                <ThemedText style={{ fontWeight: 'bold' }}>Pause</ThemedText>
                            </> : 
                            <>
                                <Feather name="play" size={24} color="white" />
                                <ThemedText style={{ fontWeight: 'bold' }}>Resume</ThemedText>
                            </>
                        }
                    </Pressable>
                </View>
            </View>
            
            <BottomSheet 
                backgroundStyle={{ backgroundColor: 'rgba(19, 127, 236, 1)' }} 
                handleIndicatorStyle={{ backgroundColor: 'rgb(255, 255, 255, .5)' }}
                ref={bottomSheetRef}
                snapPoints={["10%"]}
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
                                        data={cycles}
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
                                                        <ThemedText style={{ marginLeft: 2 }}>{item.label}</ThemedText>
                                                    </View>

                                                    <View style={styles.sheetCardSide}>
                                                        <Pressable style={{ padding: 5 }} onPress={() => {
                                                            setSheetType("edit")
                                                            setTaskType(item.type as SlotType)
                                                            setSheeSlot(item as SlotCard)
                                                        }}>
                                                            <Feather name="edit-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                                        </Pressable>
                                                        <Pressable style={{ padding: 5 }} onPress={() => {
                                                            setCycles(cycles.filter(each => each.id !== item.id))
                                                            setSheeSlot(item as SlotCard)
                                                        }}>
                                                            <Feather name="trash-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                                        </Pressable>
                                                    </View>
                                                </DraxView>
                                            </DraxListItem>
                                        }
                                        onItemReorder={({fromIndex, toIndex}) => {
                                            const newData = [...cycles];
                                            const item = newData.splice(fromIndex, 1)[0];
                                            newData.splice(toIndex, 0, item);
                                            setCycles(newData);
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
                                        <ThemedText style={styles.analyticsTopText}>2</ThemedText>
                                    </View>
                                    <View style={styles.analyticsSection}>
                                        <ThemedText style={styles.analyticsTextTitle}>Tasks Done</ThemedText>
                                        <ThemedText style={styles.analyticsTopText}>75%</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.analyticsSection}>
                                    <ThemedText style={styles.analyticsTextTitle}>Total Focus Time</ThemedText>
                                    <ThemedText style={styles.analyticsTopText}>1h 35m</ThemedText>
                                </View>

                                <View style={[styles.analyticsTop, { marginTop: 15, marginBottom: 0 }]}>
                                    <View style={styles.analyticsSection}>
                                        <ThemedText style={styles.analyticsTextTitle}>Avg. Task Time</ThemedText>
                                        <ThemedText style={styles.analyticsTopText}>23m 45s</ThemedText>
                                    </View>
                                    <View style={styles.analyticsSection}>
                                        <ThemedText style={styles.analyticsTextTitle}>Avg. Break Time</ThemedText>
                                        <ThemedText style={styles.analyticsTopText}>4m 30s</ThemedText>
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
                            theme={theme}
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
                        />

                        <View style={{ height: insets.bottom }} />
                    </BottomSheetView>
                }
            </BottomSheet>

            {/* Modal */}
            {showModal.length > 0 && 
                <ThemedView style={[styles.activeModal, { height: deviceHeight }]}>
                    <ThemedView style={[styles.activeModalTop, { paddingTop: insets.top }]}>
                        <ThemedText style={styles.activeModalTitle}>Next up: Work Session</ThemedText>
                        <ProgressBar
                            backgroundColor="rgba(255, 255, 255, 0.1)" 
                            progressBarColor={Colors.accentColor} 
                        >
                            <ThemedText style={{ fontSize: 70, lineHeight: 70, fontWeight: 'bold' }}>5</ThemedText>
                        </ProgressBar>
                        <ThemedText style={{ color: 'rgb(156, 163, 175)' }}>Next session starts automatically</ThemedText>
                    </ThemedView>

                    <ThemedView>
                        <LargeButton 
                            text="Start Next Session" 
                            buttonStyle={{
                                backgroundColor: Colors.accentColor,
                                borderRadius: 30,
                                marginBottom: 10
                            }}
                            textStyle={{ fontWeight: 'bold' }}
                            onPress={() => setShowModal("")}
                        />
                        <LargeButton 
                            text="Pause" 
                            buttonStyle={{
                                backgroundColor: 'rgb(51, 65, 85)',
                                borderRadius: 30,
                            }}
                            textStyle={{ fontWeight: 'bold' }}
                            // onPress={() => setShowModal("")}
                        />
                        <View style={{ height: insets.bottom }} />
                    </ThemedView>
                </ThemedView>
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerLabel: { 
        fontSize: 25, 
        lineHeight: 50,
        fontWeight: '600',
    },
    headerButton: {
        backgroundColor: "rgba(185, 19, 19, 0.6)",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10
    },
    view: { 
        gap: 25, 
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigView: {
        marginTop: 0,
        justifyContent: 'center'
    },
    bodyTop: { 
        letterSpacing: 2, 
        fontWeight: 'bold', 
        fontSize: 20,
    },
    body: { 
        alignItems: 'center',
    },
    bodyText: {
        textAlign: 'center',
        fontSize: 20
    },
    bottomBodyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'rgba(255, 255, 255, .6)'
    },
    bottomView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        gap: 30,
        paddingHorizontal: 20
    },
    bottomSection: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
    },
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
    },
    activeModal: {
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        justifyContent: 'center',
    },
    activeModalTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    activeModalTitle: {
        color: 'rgb(156, 163, 175)',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
