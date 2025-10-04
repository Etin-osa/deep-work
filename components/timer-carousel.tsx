import { StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

export default function TimerCarousel({ setHourSelected, setMinuteSelected }: {
    setHourSelected: Dispatch<SetStateAction<number>>
    setMinuteSelected: Dispatch<SetStateAction<number>>
}) {
    const hours = Array.from(Array(24).keys())
    const minutes = Array.from(Array(60).keys())
    
    const handleHourSelected = (selected: number) => setHourSelected(selected)
    const handleMinuteSelected = (selected: number) => setMinuteSelected(selected)
    
    return (
        <ThemedView style={styles.timerView} reverse>
            <ThemedView reverse style={[styles.timerSection, { gap: 0}]}>
                <ThemedView reverse style={{ flex: 1, alignItems: 'center', transform: [{ translateX: 5 }] }}>
                    <ThemedText reverse>Hours</ThemedText>
                </ThemedView>
                <ThemedView reverse style={{ flex: 1, alignItems: 'center', transform: [{ translateX: -10 }] }}>
                    <ThemedText reverse>Minutes</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView reverse style={styles.timerSection}>
                <ThemedView reverse>
                    <CarouselTimer counter={hours} setCounter={handleHourSelected} />
                </ThemedView>
                <ThemedText reverse style={styles.timerColon}>:</ThemedText>
                <ThemedView reverse>
                    <CarouselTimer counter={minutes} setCounter={handleMinuteSelected} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const CarouselTimer = ({ counter, setCounter }: { 
    counter: number[], setCounter: (selected: number) => void 
}) => {
    const progress = useSharedValue(0)
    
    return (
        <Carousel
            height={80}
            width={70}
            snapEnabled={true}
            pagingEnabled={true}
            vertical
            loop={true}
            data={counter}
            defaultScrollOffsetValue={progress}
            style={{ borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center'  }}
            onSnapToItem={(item) => setCounter(item)}
            renderItem={({ item }) => 
                <ThemedView reverse style={styles.eachCarousel}>
                    <ThemedText style={styles.carouselText} reverse>{item < 9 ? `0${item}` : item }</ThemedText>
                </ThemedView>
            }
        />
    )
}


const styles = StyleSheet.create({
    timerView: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eachCarousel: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselText: {
        fontSize: 60,
        lineHeight: 70,
        textAlign: 'center'
    },
    timerSection: { 
        flexDirection: 'row', 
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    timerColon: {
        fontSize: 50,
        lineHeight: 40,
    }
});
