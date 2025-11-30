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
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import useKeyboard from "@/hooks/useKeyboard";
import { useDispatch } from "react-redux";
import { addNewSession, SlotCard, SlotType } from "@/redux/slices/sessionSlice";
import LargeButton from "@/components/large-button";

const timeStyle = {
    focus: {
        work: 90,
        break: 0
    },
    pomodoro: {
        work: 25,
        break: 5
    },
    quick: {
        work: 15,
        break: 3
    },
    study: {
        work: 50,
        break: 10
    },
    custom: {
        work: 40,
        break: 10
    }
}

export default function slot() {
    const theme = useColorScheme() ?? 'light'
    const dispatch = useDispatch()
    const deviceHeight = Dimensions.get("screen").height
    const params = useLocalSearchParams()
    const { keyboardVisible } = useKeyboard()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)

    const [displayTime, setDisplayTime] = useState("")
    const [slotList, setSlotList] = useState<SlotCard[]>([])
    const [sheetType, setSheetType] = useState<SlotType>("work")
    const [sheetSlot, setSheeSlot] = useState<SlotCard | undefined>()

    function makeId(prefix = '') {
        return prefix + Math.random().toString(36).slice(2, 9);
    }

    const generateCycles = useCallback(() => {
        const selectedStyle = timeStyle[params.mode as keyof typeof timeStyle]
        const slots: SlotCard[] = [{
            id: makeId('w-'),
            type: 'work',
            duration: selectedStyle.work,
            label: 'Work',
        }]

        if (selectedStyle.break > 0) {
            slots.push({
                id: makeId('b-'),
                type: 'break',
                duration: selectedStyle.break,
                label: 'Break',
            })
        }

        setSlotList(slots)
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

    const handleSlots = async () => {        
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
        const totalTime = slotList.map(slot => slot.duration).reduce((a, b) => a + b, 0)
        let hoursDom = Math.floor(totalTime / 60);
        let minutesDom = Math.round(totalTime - (60 * hoursDom))
        const isPlural = hoursDom > 1 ? ' hours' : ' hour'

        setDisplayTime(`${hoursDom > 0 ? hoursDom + isPlural : ''}${minutesDom > 0 ? ' ' + minutesDom + ' min' : ''}`)
    }, [slotList])

    useEffect(() => {
        generateCycles()
    }, [])

    return (
        <ThemedView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
            <ThemedView style={styles.headerView}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={30} color="white" />
                </Pressable>
                <Pressable>
                    <ThemedText darkColor={Colors.accentColor} style={{ fontSize: 18, fontWeight: '600' }}>Save</ThemedText>
                </Pressable>
            </ThemedView>

            <ThemedView style={styles.timeView}>
                <ThemedText style={styles.timeViewTitle}>
                    {displayTime}
                </ThemedText>
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
                    handleSlots()
                }}
            />

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
    timeView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40
    },
    timeViewTitle: {
        fontSize: 35,
        lineHeight: 60,
        fontWeight: 'bold'
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
    input: {
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 15,
        borderRadius: 15,
        height: 55
    },
});
