import { Platform, Pressable, StyleSheet, TextInput, useColorScheme, View, ViewStyle } from "react-native";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DraxList, DraxListItem, DraxProvider } from 'react-native-drax';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';

import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { AntDesign, Entypo, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [slotList, setSlotList] = useState<SlotCard[]>([])
    const [extraTime, setExtraTime] = useState(10)
    const [sheeType, setSheetType] = useState<SlotType>("work")
    const [showModal, setShowModal] = useState("")
    const [sheetSlot, setSheeSlot] = useState<SlotCard | undefined>()
    const [focus, setFocus] = useState("")

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

    useEffect(() => {
        // generateCycles()
        // handlePresentModalPress()

        router.replace("/(active)")
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
                text="Start Session " 
                buttonStyle={{
                    backgroundColor: Colors.accentColor,
                    width: '100%',
                    borderRadius: 15
                }}
                containerStyle={{
                    width: '95%',
                    marginHorizontal: 'auto'
                }}
                onPress={() => setShowModal("Adjust time")}
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
                                onPress={() => router.push("/(active)")}
                            />
                        </View>
                    </ThemedView>
                </ThemedView>
            }

            <BottomSheetModalProvider>
                <BottomSheetModal 
                    ref={bottomSheetModalRef}
                    snapPoints={["70%", "90%"]}
                    // snapPoints={["100%"]}
                    enableDynamicSizing={false}
                    enablePanDownToClose
                    onChange={(index) => index === -1 && setSheeSlot(undefined)}
                    backgroundStyle={{
                        backgroundColor: Colors[theme].slotModal,
                    }}
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ThemedText style={{ fontWeight: 'bold', fontSize: 18 }}>
                                {sheetSlot ? 'Edit Time Slot' : 'Add Time Slot'}
                            </ThemedText>
                            <Pressable onPress={handleCloseModalPress}>
                                <AntDesign name="close" size={20} color={Colors[theme].placeholder} />
                            </Pressable>
                        </View>

                        <View style={{ gap: 10 }}>
                            <ThemedText darkColor={Colors[theme].inputLabel}>Type</ThemedText>
                            <View style={styles.bottomType}>
                                <Pressable 
                                    style={[
                                        styles.eachBottomType, 
                                        { 
                                            borderColor: sheeType === "work" ? "rgb(19, 127, 236)" : Colors[theme].border,
                                            backgroundColor: sheeType === "work" ? Colors.secondaryColor : 'transparent'
                                        }
                                    ]}
                                    onPress={() => setSheetType("work")}
                                >
                                    <Entypo name="laptop" size={24} color={sheeType === "work" ? Colors.accentColor : 'white'} />
                                    <ThemedText style={{ color: sheeType === "work" ? Colors.accentColor : 'white', fontWeight: 'bold' }}>Work</ThemedText>
                                </Pressable>
                                <Pressable 
                                    style={[
                                        styles.eachBottomType, 
                                        { 
                                            borderColor: sheeType === "break" ? "rgb(19, 127, 236)" : Colors[theme].border,
                                            backgroundColor: sheeType === "break" ? Colors.secondaryColor : 'transparent'
                                        }
                                    ]}
                                    onPress={() => setSheetType("break")}
                                >
                                    <MaterialIcons name="coffee" size={24} color={sheeType === "break" ? Colors.accentColor : 'white'} />
                                    <ThemedText style={{ color: sheeType === "break" ? Colors.accentColor : 'white', fontWeight: 'bold' }}>Break</ThemedText>
                                </Pressable>
                            </View>
                        </View>

                        {sheeType === "work" &&
                            <View style={{ gap: 10 }}>
                                <ThemedText darkColor={Colors[theme].inputLabel}>Name</ThemedText>
                                <TextInput 
                                    placeholder="e.g., Research"
                                    defaultValue={sheetSlot?.label}
                                    placeholderTextColor={Colors[theme].placeholder}
                                    style={[styles.input, {
                                        backgroundColor: Colors[theme].inputBg,
                                        borderColor: theme === "dark" ? focus === "name" ? 'rgba(82, 104, 136, 1)' : Colors[theme].border : '',
                                        borderWidth: 1
                                    }]}
                                    onFocus={() => setFocus("name")}
                                    onBlur={() => setFocus("")}
                                />
                            </View>
                        }

                        <View style={{ gap: 10 }}>
                            <ThemedText darkColor={Colors[theme].inputLabel}>Duration</ThemedText>
                            <View style={styles.sheetTimer}>
                                <View style={[styles.numberInputView, {
                                    backgroundColor: Colors[theme].inputBg,
                                    borderColor: theme === "dark" ? focus === "hour" ? 'rgba(82, 104, 136, 1)' : Colors[theme].border : '',
                                    borderWidth: 1
                                }]}>
                                    <View style={styles.numberInputSection}>
                                        <TextInput 
                                            style={styles.numberInput}
                                            defaultValue="00"
                                            keyboardType="number-pad"
                                            onFocus={() => {
                                                setFocus("hour")
                                            }}
                                            onBlur={() => {
                                                setFocus("")
                                            }}
                                        />
                                        <ThemedText 
                                            darkColor={Colors[theme].placeholder}
                                            style={{ transform: [{ translateY: 1 }]}}
                                        >hour</ThemedText>
                                    </View>

                                    <View style={styles.numberInputSection}>
                                        <TextInput 
                                            style={styles.numberInput}
                                            defaultValue={sheetSlot ? `${sheetSlot.duration}` : "00"}
                                            keyboardType="number-pad"
                                            onFocus={() => {
                                                setFocus("min")
                                            }}
                                            onBlur={() => setFocus("")}
                                        />
                                        <ThemedText 
                                            darkColor={Colors[theme].placeholder}
                                            style={{ transform: [{ translateY: 1 }]}}
                                        >min</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.sheetBottomView}>
                            <LargeButton 
                                text="Cancel" 
                                buttonStyle={{
                                    backgroundColor: 'rgb(51, 65, 85)',
                                    borderRadius: 15,
                                    width: "100%"
                                }}
                                containerStyle={{ flex: 1 }}
                                onPress={handleCloseModalPress}
                            />
                            <LargeButton 
                                text="Save" 
                                buttonStyle={{
                                    backgroundColor: Colors.accentColor,
                                    borderRadius: 15,
                                    width: "100%"
                                }}
                                containerStyle={{ flex: 1 }}
                            />
                        </View>
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
