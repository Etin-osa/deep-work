import { Dimensions } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { cancelAnimation, Easing, SharedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import ProgressBar from "@/components/progress-bar";
import LargeButton from "@/components/large-button";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { addNewSessionOnActive, getAllSessions, SlotCard, updateSession } from "@/redux/slices/sessionSlice";
import ActiveBottomSheet from "@/components/active-bottom-sheet";
import { useAppDispatch } from "@/redux/hooks/useAppDispatch";
import { presentTime } from "@/constants/utils";
import { actions } from "react-native-drax/build/hooks/useDraxState";

export default function index() {
    const sessions = useAppSelector(getAllSessions)
    const insets = useSafeAreaInsets()
    const dispatch = useAppDispatch()
    const deviceHeight = Dimensions.get("screen").height

    // For counter and progressbar
    const counterRef = useRef<number>(0)
    const [counter, setCounter] = useState(5)
    const [progress, setProgress] = useState(5)
    const [remainingSection, setRemaningSection] = useState(sessions.slots)
    const [activeSection, setActiveSession] = useState<SlotCard | undefined>()
    const [completedSection, setCompletedSection] = useState<SlotCard[]>([])
    const [playPause, setPlayPause] = useState(false)
    const percentage = useSharedValue(0)
    const modalPercentage = useSharedValue(0)
    
    const [showModal, setShowModal] = useState("show")

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const calculateCompletedTime = () => {
        const completedDuration = completedSection.map(each => each.skipTime ?? each.duration).reduce((a, b) => a + b)
        return presentTime(completedDuration * 60)
    }

    const calculateTotalTime = () => sessions.slots.map(each => {
        if (each.id.includes('w-')) {
            return each.duration
        }
        return 0
    }).reduce((a,b) => a+b)

    const handleCompletedSession = () => {
        const completed = [ ...completedSection, { 
            ...activeSection, status: activeSection?.status ?? "completed" 
        } ]
        dispatch(updateSession(completed))
        router.replace("/(active)/summary")
    }

    const handleSkippedSession = () => {
        setCounter(5)
        setProgress(5)
        setShowModal("show")
        percentage.value = withTiming(1, { duration: 0}) 
        if (playPause) {
            setPlayPause(false)
        }
        setActiveSession(active => {
            if (active) {
                return { ...active, status: "skipped", skipTime: active.duration - counter }
            }

            return active
        })
    }

    const handleNewSession = () => {
        const newActiveSession = remainingSection[0]

        setCompletedSection(completed => {
            const updatedCompleted = [...completed]
            if (!activeSection) { return updatedCompleted }

            return [
                ...updatedCompleted, 
                { ...activeSection, status: activeSection.status ?? "completed" } 
            ]
        })
        setActiveSession(newActiveSession)
        setRemaningSection(current => {
            const newSection = [...current]
            newSection.shift()
            return newSection
        })
        setShowModal("")
        // setProgress(newActiveSession.duration * 60)
        // return newActiveSession.duration * 60
        setProgress(newActiveSession.duration)
        return newActiveSession.duration
    }

    const handleInterval = (value: number) => {
        if (!(value <= 1)) {
            return value - 1
        }

        if (showModal.length > 0) {
            return handleNewSession()
        } else {
            if (remainingSection.length > 0) {
                setShowModal("show")
                setProgress(5)
                return 5
            }

            setShowModal("Completed")
            clearInterval(counterRef.current)
            return NaN
        }
    }

    const handleProgressBar = (sharedValue: SharedValue<number>) => {
        if (sharedValue.value === 1) {
            sharedValue.value = withTiming(0, { duration: 0 })
        }
        sharedValue.value = withTiming(1, { duration: progress * 1000, easing: Easing.linear })
    }

    useEffect(() => {
        if (!Number.isNaN(counter)) {
            counterRef.current = setInterval(() => {
                setCounter(counter => handleInterval(counter))
            }, 1000);
        } else {
            handleCompletedSession()
            
        }
        
        if (playPause) {
            setProgress(counter)
            clearInterval(counterRef.current)
        }

        return () => {
            clearInterval(counterRef.current)
        }
    }, [counter, showModal, remainingSection, completedSection, activeSection, playPause, progress])

    useEffect(() => {
        if (!playPause) {
            if (showModal === "") {
                handleProgressBar(percentage)
            } else if (showModal === "show") {
                handleProgressBar(modalPercentage)
            }
        } else {
            if (showModal === "") {
                cancelAnimation(percentage)
            } else {
                cancelAnimation(modalPercentage)
            }
        }
    }, [progress, playPause, showModal])

    useEffect(() => {
        const reduxList = sessions.slots.map(each => each.id)
        const newList = remainingSection.map(each => {
            if (!reduxList.includes(each.id)) {
                return each
            }
        }).filter(each => each !== undefined)

        if (newList.length > 0) {
            dispatch(addNewSessionOnActive(newList[0]))
        }
    }, [remainingSection])

    return (
        <ThemedView darkColor="rgb(53, 158, 255)" style={{ flex: 1, paddingTop: insets.top }}>
            <View style={styles.headerView}>
                <ThemedText style={styles.headerLabel}>{sessions.label}</ThemedText>
                <Pressable style={styles.headerButton}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Stop</ThemedText>
                </Pressable>
            </View>

            <View style={[styles.view, { marginBottom: '10%' }]}>
                <View style={styles.body}>
                    <ThemedText style={styles.bodyTop}>{activeSection?.label}</ThemedText>
                </View>

                <ProgressBar 
                    backgroundColor="rgba(255, 255, 255, 0.1)" 
                    progressBarColor="rgba(255, 255, 255, 0.9)"
                    percentage={percentage}
                >
                    <ThemedText style={{ fontSize: 50, fontWeight: 'bold', lineHeight: 70}}>
                        {Number.isNaN(counter) ? "00:00" : formatTime(counter)}
                    </ThemedText>
                </ProgressBar>

                <View style={{ gap: 15 }}>
                    {completedSection.length > 0 &&
                        <ThemedText style={styles.bodyText}>Time Completed: {calculateCompletedTime()}</ThemedText>
                    }
                    {activeSection &&
                        <ThemedText style={styles.bottomBodyText}>
                            {activeSection.label} Time: {presentTime(activeSection.duration * 60)}
                        </ThemedText>
                    }
                </View>

                <View style={styles.bottomView}>
                    <Pressable style={styles.bottomSection} onPress={() => {
                        if (remainingSection[0] !== undefined) {
                            handleSkippedSession()
                        } else {
                            setActiveSession(active => {
                                if (active) {
                                    return { ...active, status: "skipped" }
                                }

                                return active
                            })
                            setCounter(NaN)
                        }
                    }}>
                        <Feather name="trash-2" size={24} color="white" />
                        <ThemedText style={{ fontWeight: 'bold' }}>Delete</ThemedText>
                    </Pressable>
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

            <ActiveBottomSheet 
                modal={showModal} 
                remainingSection={remainingSection} 
                completedSection={completedSection}
                setRemaningSection={setRemaningSection}
                totalTime={calculateTotalTime()} 
            />

            {/* Modal */}
            {showModal === "show" && 
                <ThemedView style={[styles.activeModal, { height: deviceHeight }]}>
                    <ThemedView style={[styles.activeModalTop, { paddingTop: insets.top }]}>
                        <ThemedText style={styles.activeModalTitle}>Session starting in...</ThemedText>
                        <ProgressBar
                            backgroundColor="rgba(255, 255, 255, 0.1)" 
                            progressBarColor={Colors.accentColor} 
                            percentage={modalPercentage}
                        >
                            <ThemedText style={{ fontSize: 70, lineHeight: 70, fontWeight: 'bold' }}>
                                {Number.isNaN(counter) ? "00:00" : counter}
                            </ThemedText>
                        </ProgressBar>
                        <ThemedText style={{ color: 'rgb(156, 163, 175)' }}>Next session: {remainingSection[0].label}</ThemedText>
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
                            onPress={() => {
                                modalPercentage.value = withTiming(1, { duration: 0}) 
                                if (playPause) {
                                    setPlayPause(false)
                                }
                                setCounter(() => handleNewSession())
                            }}
                        />
                        <LargeButton 
                            text={playPause ? "Resume" : "Pause"} 
                            buttonStyle={{
                                backgroundColor: playPause ? 'rgba(125, 211, 33, 0.64)' : 'rgb(51, 65, 85)',
                                borderRadius: 30,
                            }}
                            textStyle={{ fontWeight: 'bold' }}
                            onPress={() => {
                                setPlayPause(current => !current)
                            }}
                        />
                        <View style={{ height: insets.bottom }} />
                    </ThemedView>
                </ThemedView>
            }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
