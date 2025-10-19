import { Dimensions, Platform, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { DraxList, DraxListItem, DraxProvider } from 'react-native-drax';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';

import SlotSheet from "@/components/slot-sheet";
import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { AntDesign, Entypo, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import LargeButton from "@/components/large-button";
import useKeyboard from "@/hooks/useKeyboard";
import { useDispatch } from "react-redux";
import { addNewSession, SlotCard, SlotType } from "@/redux/slices/sessionSlice";

export default function slot() {
    const theme = useColorScheme() ?? 'light'
    const dispatch = useDispatch()
    const deviceHeight = Dimensions.get("screen").height
    const params = useLocalSearchParams()
    const { keyboardVisible } = useKeyboard()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [slotList, setSlotList] = useState<SlotCard[]>([])
    const [extraTime, setExtraTime] = useState(0)
    const [sheetType, setSheetType] = useState<SlotType>("work")
    const [showModal, setShowModal] = useState("")
    const [sheetSlot, setSheeSlot] = useState<SlotCard | undefined>()

    function makeId(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 9);
    }

    const checkWork = () => {
        switch (params.mode) {
            case "pomodoro":
                return 25;
            case "study":
                return 50
            default:
                return 30;
        }
    }

    const checkBreak = () => {
        switch (params.mode) {
            case "pomodoro":
                return 5;
            case "study":
                return 10
            default:
                return 5;
        }
    }

    const presentTime = () => {
        const totalTime = (parseInt(params.hours as string) * 60) + parseInt(params.minutes as string)
        let hoursDom = Math.floor(totalTime / 60);
        let minutesDom = Math.round(totalTime - (60 * hoursDom))
        const isPlural = hoursDom > 1 ? ' hours' : ' hour'

        return `${hoursDom > 0 ? hoursDom + isPlural : ''}${minutesDom > 0 ? ' ' + minutesDom + ' minutes' : ''}`
    }

    const generateCycles = useCallback(() => {
        const slots: SlotCard[] = []
        const totalMinutes = (parseInt(params.hours as string) * 60) + parseInt(params.minutes as string)

        if (totalMinutes <= 29 || params.mode === "focus" || (params.mode === "custom" && totalMinutes <= 34)) {
            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: totalMinutes,
                label: 'Work',
            })

            setSlotList(slots)
            return;
        }

        const cycleWork = checkWork()
        const cycleBreak = checkBreak()
        const cycleLength = cycleWork + cycleBreak // Average cycle length
        const cycles = Math.floor(totalMinutes / cycleLength) // Number of cycles in totalMinutes
        const usedByCycles = cycles * cycleLength // totalMinutes of usedTime
        let remaining = Math.round(totalMinutes - usedByCycles);

        Array.from(Array(cycles).keys()).forEach(() => {
            slots.push({
                id: makeId('w-'),
                type: 'work',
                duration: cycleWork,
                label: 'Work',
            })
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: cycleBreak,
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

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, [])

    const handleCloseModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, [])

    const handleItem = (id: string) => {
        const newList = slotList.filter(each => each.id !== id)
        setSlotList(newList)
    }

    const calculateExtraTime = () => {
        const totalMinutes = (parseInt(params.hours as string) * 60) + parseInt(params.minutes as string)
        const slotDuration = slotList.map(slot => slot.duration).reduce((a, b) => a + b, 0)

        setExtraTime(slotDuration - totalMinutes)
    }

    const handleOnSaveSlot = (label: string, duration: number) => {
        if (sheetSlot) {
            const currentSlot = slotList.filter(slot => slot.id === sheetSlot.id)
            
            if (!currentSlot) {
                console.log("Slot id not found")
            }

            const newId = currentSlot[0].id.split('-')
            const customId = sheetType === "break" ? 'b-' : 'w-'
            const editedSlot: SlotCard = {
                duration, label, type: sheetType, id: customId + newId[1]
            }

            const newSlotList = slotList.map(slot => currentSlot[0].id === slot.id ? editedSlot : slot)
            setSlotList(newSlotList)
        } else {
            const customId = sheetType === "break" ? 'b-' : 'w-'
            setSlotList([...slotList, {
                duration, label, type: sheetType, id: makeId(customId)
            }])
        }
        
        bottomSheetModalRef.current?.forceClose()
    }

    const handleSlots = () => {
        dispatch(addNewSession({
            label: params.label,
            hour: params.hours,
            minute: params.minutes,
            slots: slotList
        }))
        router.replace("/(active)")
    }

    useEffect(() => {
        if (keyboardVisible) {
            bottomSheetModalRef.current?.expand()
        } else {
            bottomSheetModalRef.current?.collapse()
        }
    }, [keyboardVisible])

    useEffect(() => {
        calculateExtraTime()
    }, [slotList])

    useEffect(() => {
        // generateCycles()
        router.replace("/(active)/summary")
    }, [])

    return (
        <ThemedView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
            <ThemedView style={styles.headerView}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={30} color="white" />
                </Pressable>
                <ThemedText style={styles.headerLabel}>{params.label}</ThemedText>
                <Pressable>
                    <ThemedText darkColor={Colors.accentColor} style={{ fontSize: 18, fontWeight: '600' }}>Save</ThemedText>
                </Pressable>
            </ThemedView>

            <ThemedView style={styles.timeView}>
                <ThemedText style={{ 
                    fontSize: extraTime === 0 ? 25 : 18, 
                    color: extraTime === 0 ? 'white' : Colors[theme].placeholder 
                }}>
                    {presentTime()}
                </ThemedText>
                {extraTime !== 0 &&
                    <ThemedView style={styles.extraTime}>
                        <ThemedView style={{ transform: [{ translateY: extraTime > 0 ? -5 : -10 }] }}>
                            <FontAwesome 
                                name={extraTime > 0 ? "plus" : "minus"} 
                                size={30} 
                                color={extraTime > 0 ? 'rgb(74, 222, 128)' : "rgb(222, 74, 74)" }
                            />
                        </ThemedView>
                        <ThemedText style={[styles.extraTimeTitle, {  
                            color: extraTime > 0 ? 'rgb(74, 222, 128)' : "rgb(222, 74, 74)",
                            marginRight: 10
                        }]}>
                            {Math.abs(extraTime)}
                        </ThemedText>
                        <ThemedText style={[{ color: Colors[theme].inputLabel }, styles.extraMin]}>min</ThemedText>
                    </ThemedView>
                }
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
                            hoverDraggingStyle={{ borderWidth: 1, borderColor: 'rgba(82, 104, 136, 1)', transform: [{ scale: 1.05 }] }}
                            dragReleasedStyle={{ opacity: 0 }}
                            key={item.id}
                            longPressDelay={200}
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
                                            <ThemedText>{item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}</ThemedText>
                                            <ThemedText style={{ fontSize: 15 }} darkColor={Colors[theme].paragraph}>{item.duration} min</ThemedText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.cardRight}>
                                    <Pressable style={{ padding: 5 }} onPress={() => {
                                        setSheeSlot(item)
                                        setSheetType(item.type)
                                        handlePresentModalPress()
                                    }}>
                                        <Feather name="edit-2" size={20} color={Colors[theme].paragraph} />
                                    </Pressable>
                                    <Pressable style={{ padding: 5 }} onPress={() => handleItem(item.id)}>
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

                <Pressable style={styles.addBtnPressable} onPress={handlePresentModalPress}>
                    <ThemedView style={styles.addBtnView}>
                        <AntDesign name="plus" size={20} color="white" />
                    </ThemedView>
                </Pressable>
            </DraxProvider>

            <LargeButton 
                text="Start Session" 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    width: '100%',
                    borderRadius: 15
                }}
                containerStyle={{
                    width: '95%',
                    marginHorizontal: 'auto'
                }}
                onPress={() => {
                    if (extraTime !== 0) {
                        setShowModal("Adjust Time")
                    } else {
                        handleSlots()
                    }
                }}
            />

            {showModal.length > 0 &&
                <ThemedView darkColor="rgb(0, 0, 0)" style={styles.modalView}>
                    <ThemedView darkColor="rgb(17, 26, 34)" style={styles.modal}>
                        <View style={styles.modalIconView}>
                            <MaterialCommunityIcons name="information-outline" size={40} color={Colors.accentColor} />
                        </View>

                        <ThemedText style={styles.modalHeader}>Time Mismatch</ThemedText>

                        <ThemedText darkColor={Colors[theme].inputLabel} style={styles.modalParagraph}>   
                            Your planned activities are 10 minutes shorter than your total session time. Would you like to go back and adjust session layout or start the session?
                        </ThemedText>

                        <View style={{ gap: 15, width: '100%' }}>
                            <LargeButton 
                                text="Adjust Session Layout" 
                                buttonStyle={{
                                    backgroundColor: Colors.accentColor,
                                    borderRadius: 30,
                                }}
                                textStyle={{ fontWeight: 'bold' }}
                                onPress={() => setShowModal("")}
                            />
                            <LargeButton 
                                text="Start Session Anyway" 
                                buttonStyle={{
                                    backgroundColor: 'rgb(51, 65, 85)',
                                    borderRadius: 30,
                                }}
                                textStyle={{ fontWeight: 'bold' }}
                                onPress={handleSlots}
                            />
                        </View>
                    </ThemedView>
                </ThemedView>
            }

            <BottomSheetModalProvider>
                <BottomSheetModal 
                    ref={bottomSheetModalRef}
                    snapPoints={deviceHeight > 832 ? ["65%", "100%"] : ["70", "100%"]}
                    enableDynamicSizing={false}
                    enablePanDownToClose
                    onChange={(index) => index === -1 && setSheeSlot(undefined)}
                    backgroundStyle={{
                        backgroundColor: Colors[theme].slotModal,
                    }}
                    handleIndicatorStyle={{ backgroundColor: 'rgb(255, 255, 255)' }}
                    keyboardBehavior="interactive"
                    backdropComponent={props => Platform.OS === "ios" ? 
                        <BlurView
                            {...props}
                            intensity={80}
                            tint={theme === 'dark' ? 'dark' : 'light'}
                            style={styles.backdrop}
                        /> :
                        <View 
                            {...props}
                            style={[styles.backdrop, { 
                                backgroundColor: '#101922cc'
                            }]}
                        />
                    }
                >
                    <BottomSheetView style={{ paddingHorizontal: 20, paddingTop: 10, gap: 20 }}>
                        <SlotSheet 
                            handleCloseModalPress={handleCloseModalPress}
                            setSheetType={setSheetType}
                            sheetSlot={sheetSlot}
                            sheetType={sheetType}
                            closeColor={Colors[theme].placeholder}
                            selectedBorderColor="rgb(19, 127, 236)"
                            selectedBackgroundColor={Colors.secondaryColor}
                            selectedContentColor={Colors.accentColor}
                            defaultBorderColor={Colors[theme].border}
                            defaultBackgroundColor='transparent'
                            defaultContentColor="white"
                            labelColor={Colors[theme].inputLabel}
                            inputBackgroundColor={Colors[theme].inputBg}
                            inputFocusColor={'rgba(82, 104, 136, 1)'}
                            inputBlurColor={Colors[theme].border}
                            placeholderColor={Colors[theme].placeholder}
                            cancelButtonColor='rgb(51, 65, 85)'
                            saveButtonColor={Colors.accentColor}
                            timerColor={Colors[theme].placeholder}
                            onSave={handleOnSaveSlot}
                        />
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
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
        // gap: 10,
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
        gap: 30
    },
    addBtnPressable: {
        position: 'absolute',
        bottom: 20,
        right: 10
    },
    addBtnView: {
        backgroundColor: Colors.accentColor,
        width: 60,
        height: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0, left: 0,
        height: '100%',
        width: '130%'
    },
    bottomType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    eachBottomType: {
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        borderRadius: 15,
        gap: 15
    },
    input: {
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 55
    },
    sheetTimer: {
        flexDirection: 'row',
        gap: 15
    },
    numberInputView: {
        borderRadius: 15,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        flex: 1,
    },
    numberInput: {
        textAlign: 'center',
        fontSize: 40,
        flex: 1,
        fontWeight: "bold",
        color: 'white'
    },
    numberInputSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sheetBottomView: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20
    },
    modalView: {
        position: 'absolute',
        top: 0, left: 0,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    modal: {
        padding: 30,
        width: '100%',
        gap: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    modalIconView: { 
        padding: 15, 
        borderRadius: 100, 
        marginBottom: 15,
        backgroundColor: Colors.secondaryColor
    },
    modalHeader: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    modalParagraph: {
        textAlign: 'center',
        width: '80%'
    },
});
