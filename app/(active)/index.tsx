import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from 'react-native-svg';

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import LargeButton from "@/components/large-button";

const CIRCLE_LENGTH = 1000
const RADIUS = CIRCLE_LENGTH / (2 * Math.PI)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default function index() {
    const insets = useSafeAreaInsets()
    const deviceWidth = Dimensions.get("screen").width
    const deviceHeight = Dimensions.get("screen").height

    const percentage = useSharedValue(0)
    const animatedPercentage = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * percentage.value
    }), [percentage])

    const handleAnimation = () => percentage.value = withTiming(1, { duration: 2000 })

    return (
        <ThemedView darkColor="rgb(53, 158, 255)" style={{ flex: 1, paddingTop: insets.top }}>
            <View style={styles.headerView}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={30} color="white" />
                </Pressable>
                <ThemedText style={styles.headerLabel}>Focus Session</ThemedText>
                <Pressable style={styles.headerButton}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Stop</ThemedText>
                </Pressable>
            </View>

            <LargeButton text="animate circle" onPress={handleAnimation} />
            <View style={{ alignItems: 'center', width: 400, height: 400, marginHorizontal: 'auto', marginTop: 30 }}>
                <ThemedText style={styles.bodyTop}>WORK</ThemedText>

                <Svg width={400} height={400}>
                    <Circle 
                        cx={400 / 2}
                        cy={400 / 2}
                        r={RADIUS}
                        stroke={Colors.accentColor}
                        strokeWidth={30}
                        fill={"none"}
                    />
                    <AnimatedCircle 
                        cx={400 / 2}
                        fill={"none"}
                        cy={400 / 2}
                        r={RADIUS}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke={Colors.dark.inputLabel}
                        strokeWidth={30}
                        strokeDasharray={CIRCLE_LENGTH}
                        animatedProps={animatedPercentage}
                    />
                </Svg>
            </View>

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
        paddingBottom: 20
    },
    headerLabel: { 
        fontSize: 25, 
        lineHeight: 50,
        fontWeight: '600',
        transform: [{ translateX: 10 }]
    },
    headerButton: {
        backgroundColor: "rgba(249, 115, 22, .8)",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10
    },
    bodyTop: { 
        // letterSpacing: .5, 
        // fontWeight: 'bold', 
        fontSize: 19,
    }
});
