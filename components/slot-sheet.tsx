import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/theme";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import LargeButton from "./large-button";
import { ThemedText } from "./themed-text";
import { SlotCard, SlotType } from "@/redux/slices/sessionSlice";

export default function SlotSheet({ 
    sheetType, closeColor, sheetSlot, setSheetType, handleCloseModalPress, onSave,
    defaultBackgroundColor, defaultBorderColor, defaultContentColor, selectedBackgroundColor, 
    selectedContentColor, selectedBorderColor, labelColor, inputBackgroundColor, inputFocusColor, 
    cancelButtonColor, saveButtonColor, placeholderColor, inputBlurColor, timerColor
}: {
    sheetSlot: SlotCard | undefined
    sheetType: SlotType
    setSheetType: React.Dispatch<React.SetStateAction<SlotType>>
    handleCloseModalPress: () => void
    onSave: (name: string, time: number) => void
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
    const [nameValue, setNameValue] = useState(sheetSlot ? sheetSlot.label : sheetType === "work" ? "Work" : "Break")
    const [textSelection, setTextSelection] = useState<{ start: number, end: number } | undefined>()
    const minuteRef = useRef<TextInput | null>(null)
    const hourRef = useRef<TextInput | null>(null)
    const nameRef = useRef<TextInput | null>(null)
    const [timeValue, setTimeValue] = useState({
        hour: "00",
        minute: "00"
    })
    const [errorMessage, setErrorMessage] = useState<"name" | "time" | "">("")

    const generateTime = () => {
        return (parseInt(timeValue.hour) * 60) + parseInt(timeValue.minute)
    }

    useEffect(() => {
        if (!sheetSlot) { return; }
        let hoursDom = Math.floor(sheetSlot.duration / 60)
        let minutesDom = Math.round(sheetSlot.duration - (60 * hoursDom)).toString()

        setTimeValue({ 
            hour: hoursDom.toString().length === 1 ? "0" + hoursDom.toString() : hoursDom.toString() , 
            minute: minutesDom.length === 1 ? "0" + minutesDom : minutesDom
        })
    }, [sheetSlot])

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
                        onPress={() => {setSheetType("work"); setNameValue("Work")}}
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
                        onPress={() => {
                            setNameValue("Break")
                            setSheetType("break")
                        }}
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
                        ref={nameRef}
                        placeholder="e.g., Research"
                        defaultValue={sheetSlot ? sheetSlot.label : nameValue}
                        placeholderTextColor={placeholderColor}
                        style={[styles.input, {
                            backgroundColor: inputBackgroundColor,
                            borderColor: focus === "name" ? inputFocusColor : errorMessage === "name" ? Colors.inputError : inputBlurColor,
                            borderWidth: 1
                        }]}
                        onChangeText={(text) => setNameValue(text)}
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
                        borderColor: focus === "hour" || focus === "min" ? inputFocusColor : errorMessage === "time" ? Colors.inputError : inputBlurColor,
                        borderWidth: 1
                    }]}>
                        <View style={styles.numberInputSection}>
                            <TextInput 
                                ref={hourRef}
                                style={styles.numberInput}
                                value={timeValue.hour}
                                keyboardType="number-pad"
                                selection={textSelection}
                                onFocus={() => {
                                    setTextSelection({ start: 0, end: 2 })
                                    setFocus("hour")
                                }}
                                onBlur={() => {
                                    setFocus("")
                                    setErrorMessage("")
                                }}
                                onChangeText={(text) => {
                                    setTextSelection(undefined)
                                    const numbersOnly = text.replace(/[^0-9]/g, '');
                                    setTimeValue(current => ({
                                        ...current,
                                        hour: numbersOnly
                                    }))

                                    if (text.length === 2 && minuteRef) {
                                        minuteRef.current?.focus()
                                    }
                                }}
                            />
                            <ThemedText 
                                darkColor={timerColor}
                                style={{ transform: [{ translateY: 1 }]}}
                            >h</ThemedText>
                        </View>

                        <View style={styles.numberInputSection}>
                            <TextInput 
                                ref={minuteRef}
                                style={styles.numberInput}
                                value={timeValue.minute}
                                keyboardType="number-pad"
                                selection={textSelection}
                                onFocus={() => {
                                    setTextSelection({ start: 0, end: 2 })
                                    setFocus("min")
                                }}
                                onBlur={() => {
                                    setErrorMessage("")
                                    setFocus("")
                                }}
                                onChangeText={(text) => {
                                    setTextSelection(undefined)
                                    const num = parseInt(text)

                                    if ((num >= 0 && num <= 59) || text === '') { 
                                        const numbersOnly = text.replace(/[^0-9]/g, '');
                                        setTimeValue(current => ({
                                            ...current,
                                            minute: numbersOnly
                                        }))
                                    } else {
                                        setTimeValue(current => ({
                                            ...current,
                                            minute: "59"
                                        }))
                                    }
                                }}
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
                    onPress={() => {                        
                        if (nameValue === "") { 
                            setErrorMessage("name")
                        } else if (timeValue.hour === "00" && timeValue.minute === "00") {
                            setErrorMessage("time")
                        } else {    
                            onSave(nameValue, generateTime())
                        }

                        nameRef.current?.blur()
                        hourRef.current?.blur()
                        minuteRef.current?.blur()
                    }}
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
