import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/theme";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import LargeButton from "./large-button";
import { ThemedText } from "./themed-text";

type SlotType = 'work' | 'break';

type SlotCard = {
    id: string;
    type: SlotType;
    duration: number; 
    label: string;
}

export default function SlotSheet({ 
    theme, sheetType, closeColor, sheetSlot, setSheetType, handleCloseModalPress,
    defaultBackgroundColor, defaultBorderColor, defaultContentColor, selectedBackgroundColor, 
    selectedContentColor, selectedBorderColor, labelColor, inputBackgroundColor, inputFocusColor, 
    cancelButtonColor, saveButtonColor, placeholderColor, inputBlurColor, timerColor
}: { 
    theme: "dark" | "light"
    sheetSlot: SlotCard | undefined
    sheetType: SlotType
    setSheetType: React.Dispatch<React.SetStateAction<SlotType>>
    handleCloseModalPress: () => void
    closeColor: string
    defaultBackgroundColor: string
    defaultBorderColor: string
    defaultContentColor: string
    selectedBackgroundColor: string
    selectedContentColor: string
    selectedBorderColor: string
    labelColor: string,
    inputBackgroundColor: string
    placeholderColor: string
    inputFocusColor: string
    inputBlurColor: string
    cancelButtonColor: string
    saveButtonColor: string
    timerColor: string
}) {
    const [focus, setFocus] = useState("")

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {sheetSlot ? 'Edit Time Slot' : 'Add Time Slot'}
                </ThemedText>
                <Pressable onPress={handleCloseModalPress} style={{ padding: 5 }}>
                    <AntDesign name="close" size={20} color={closeColor} />
                </Pressable>
            </View>

            <View style={{ gap: 10 }}>
                <ThemedText darkColor={labelColor}>Type</ThemedText>
                <View style={styles.bottomType}>
                    <Pressable 
                        style={[
                            styles.eachBottomType, 
                            { 
                                borderColor: sheetType === "work" ? selectedBorderColor : defaultBorderColor,
                                backgroundColor: sheetType === "work" ? selectedBackgroundColor : defaultBackgroundColor
                            }
                        ]}
                        onPress={() => setSheetType("work")}
                    >
                        <Entypo name="laptop" size={24} color={sheetType === "work" ? selectedContentColor : defaultContentColor} />
                        <ThemedText style={{ color: sheetType === "work" ? selectedContentColor : defaultContentColor, fontWeight: 'bold' }}>Work</ThemedText>
                    </Pressable>
                    <Pressable 
                        style={[
                            styles.eachBottomType, 
                            { 
                                borderColor: sheetType === "break" ? selectedBorderColor : defaultBorderColor,
                                backgroundColor: sheetType === "break" ? selectedBackgroundColor : defaultBackgroundColor
                            }
                        ]}
                        onPress={() => setSheetType("break")}
                    >
                        <MaterialIcons name="coffee" size={24} color={sheetType === "break" ? selectedContentColor : defaultContentColor} />
                        <ThemedText style={{ color: sheetType === "break" ? selectedContentColor : defaultContentColor, fontWeight: 'bold' }}>Break</ThemedText>
                    </Pressable>
                </View>
            </View>

            {sheetType === "work" &&
                <View style={{ gap: 10 }}>
                    <ThemedText darkColor={labelColor}>Name</ThemedText>
                    <TextInput 
                        placeholder="e.g., Research"
                        defaultValue={sheetSlot?.label}
                        placeholderTextColor={placeholderColor}
                        style={[styles.input, {
                            backgroundColor: inputBackgroundColor,
                            borderColor: focus === "name" ? inputFocusColor : inputBlurColor,
                            borderWidth: 1
                        }]}
                        onFocus={() => setFocus("name")}
                        onBlur={() => setFocus("")}
                    />
                </View>
            }

            <View style={{ gap: 10 }}>
                <ThemedText darkColor={labelColor}>Duration</ThemedText>
                <View style={styles.sheetTimer}>
                    <View style={[styles.numberInputView, {
                        backgroundColor: inputBackgroundColor,
                        borderColor: focus === "hour" || focus === "min" ? inputFocusColor : inputBlurColor,
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
                                darkColor={timerColor}
                                style={{ transform: [{ translateY: 1 }]}}
                            >h</ThemedText>
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
                                darkColor={timerColor}
                                style={{ transform: [{ translateY: 1 }]}}
                            >m</ThemedText>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.sheetBottomView}>
                <LargeButton 
                    text="Cancel" 
                    buttonStyle={{
                        backgroundColor: cancelButtonColor,
                        borderRadius: 15,
                        width: "100%"
                    }}
                    containerStyle={{ flex: 1 }}
                    onPress={handleCloseModalPress}
                />
                <LargeButton 
                    text="Save" 
                    buttonStyle={{
                        backgroundColor: saveButtonColor,
                        borderRadius: 15,
                        width: "100%"
                    }}
                    containerStyle={{ flex: 1 }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
});
