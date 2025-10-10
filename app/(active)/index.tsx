import { Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";

const CIRCLE_LENGTH = 800
const RADIUS = CIRCLE_LENGTH / (2 * Math.PI)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const SVG_SIZE = 300

const cycles = [
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
    const bottomSheetRef = useRef<BottomSheet>(null)
    const [playPause, setPlayPause] = useState(false)
    const [sheetType, setSheetType] = useState<"tasks" | "analytics">("tasks")

    const percentage = useSharedValue(0.2)
    const animatedPercentage = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * percentage.value
    }), [percentage])

    const handleAnimation = () => percentage.value = withTiming(1, { duration: 2000 })

    return (
        <ThemedView darkColor="rgb(53, 158, 255)" style={{ flex: 1, paddingTop: insets.top }}>
            <View style={styles.headerView}>
                <ThemedText style={styles.headerLabel}>Focus Session</ThemedText>
                <Pressable style={styles.headerButton}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Stop</ThemedText>
                </Pressable>
            </View>

            <View style={[styles.view]}>
                <View style={styles.body}>
                    <ThemedText style={styles.bodyTop}>WORK</ThemedText>
                </View>

                <View style={styles.svgCover}>
                    <ThemedText style={styles.svgCoverCenter}>24:15</ThemedText>
                    <Svg width={SVG_SIZE} height={SVG_SIZE}>
                        <Circle 
                            cx={SVG_SIZE / 2}
                            cy={SVG_SIZE / 2}
                            r={RADIUS}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth={22}
                            fill={"none"}
                        />
                        <AnimatedCircle 
                            cx={SVG_SIZE / 2}
                            fill={"none"}
                            cy={SVG_SIZE / 2}
                            r={RADIUS}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            stroke="#FFFFFF"
                            strokeWidth={23}
                            strokeDasharray={CIRCLE_LENGTH}
                            animatedProps={animatedPercentage}
                            transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
                        />
                    </Svg>
                </View>

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
                            backgroundColor: !playPause ? 'rgba(185, 19, 19, 0.6)' : 'rgba(125, 211, 33, 0.4)'
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
                handleIndicatorStyle={{ backgroundColor: 'rgb(255, 255, 255)' }}
                ref={bottomSheetRef} 
                snapPoints={["10%"]}
            >
                <BottomSheetView style={{ paddingHorizontal: 20 }}>
                    <View style={styles.bottomSheetHeader}>
                        <View style={styles.bottomSheetHeaderLeft}>
                            <Pressable onPress={() => setSheetType("tasks")} style={[styles.bottmSheetType, sheetType === "tasks" && styles.bottomSheetSelected]}>
                                <ThemedText style={{ fontSize: 14 }}>Tasks</ThemedText>
                            </Pressable>
                            <Pressable onPress={() => setSheetType("analytics")} style={[styles.bottmSheetType, sheetType === "analytics" && styles.bottomSheetSelected]}>
                                <ThemedText style={{ fontSize: 14 }}>Analytics</ThemedText>
                            </Pressable>
                        </View>
                        <View>
                            <Entypo name="chevron-down" size={24} color="rgba(255, 255, 255, 0.6)" />
                        </View>
                    </View>

                    {sheetType === "tasks" ?
                        <>
                            <BottomSheetFlatList
                                data={cycles}
                                keyExtractor={(item: any) => String(item.id)}
                                enableFooterMarginAdjustment
                                style={{ height: 300 }}
                                renderItem={({ item, index }: { item: any, index: number }) => 
                                    <View key={item.id} style={[styles.sheetCard, { backgroundColor: item.type === "work" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(126, 211, 33, 0.2)' }]}>
                                        <View style={styles.sheetCardSide}>
                                            <MaterialIcons name="drag-indicator" size={26} color="rgba(255, 255, 255, 0.6)" />
                                            <ThemedText style={{ marginLeft: 2 }}>{item.label}</ThemedText>
                                        </View>

                                        <View style={styles.sheetCardSide}>
                                            <Pressable style={{ padding: 5 }} onPress={() => {
                                                // setSheeSlot(item)
                                                // setSheetType(item.type)
                                                // handlePresentModalPress()
                                            }}>
                                                <Feather name="edit-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                            </Pressable>
                                            <Pressable style={{ padding: 5 }}>
                                                <Feather name="trash-2" size={18} color="rgba(255, 255, 255, 0.6)" />
                                            </Pressable>
                                        </View>
                                    </View>
                                }
                            />
                        </> :
                        <>
                        </>
                    }
                </BottomSheetView>
            </BottomSheet>
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
        gap: 20, 
        flex: 1, 
        alignItems: 'center',
        marginTop: 50
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
    svgCover: {
        position: 'relative',
        marginHorizontal: 'auto',
        width: 300,
    },
    svgCoverCenter: {
        position: 'absolute',
        left: '50%', top: '50%',
        transform: [{ translateX: '-50%' },{ translateY: '-50%' }],
        fontSize: 50,
        fontWeight: 'bold',
        lineHeight: 60
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
        margin: 7,
        borderRadius: 15
    },
    sheetCardSide: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
});
