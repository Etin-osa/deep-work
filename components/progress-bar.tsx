import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedText } from "./themed-text";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CIRCLE_LENGTH = 800
const SVG_SIZE = 300

export default function progressBar({ progressBarColor, backgroundColor, children, radius, size }: { 
    progressBarColor: string
    backgroundColor: string
    children: React.ReactNode
    radius?: number
    size?: number
}) {
    const percentage = useSharedValue(0.2)
    const VIEW_SIZE = size ?? SVG_SIZE
    const RADIUS = radius ? radius / (2 * Math.PI) : CIRCLE_LENGTH / (2 * Math.PI)

    const animatedPercentage = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * percentage.value
    }), [percentage])

    const updateProgressAnimation = () => percentage.value = withTiming(1, { duration: 2000 })

    return (
        <View style={styles.svgCover}>
            <View style={styles.svgCoverCenter}>
                {children}
            </View>
            <Svg width={SVG_SIZE} height={SVG_SIZE}>
                <Circle 
                    cx={SVG_SIZE / 2}
                    cy={SVG_SIZE / 2}
                    r={RADIUS}
                    stroke={backgroundColor}
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
                    stroke={progressBarColor}
                    strokeWidth={23}
                    strokeDasharray={CIRCLE_LENGTH}
                    animatedProps={animatedPercentage}
                    transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    svgCover: {
        position: 'relative',
        marginHorizontal: 'auto',
        width: 300,
    },
    svgCoverCenter: {
        position: 'absolute',
        left: '50%', top: '50%',
        transform: [{ translateX: '-50%' },{ translateY: '-50%' }],
    }, 
})
