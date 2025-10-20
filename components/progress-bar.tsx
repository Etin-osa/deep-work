import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CIRCLE_LENGTH = 900
const SVG_SIZE = 320

export default function progressBar({ progressBarColor, backgroundColor, percentage, children, radius }: { 
    progressBarColor: string
    backgroundColor: string
    children: React.ReactNode
    percentage: SharedValue<number>
    radius?: number
}) {
    const deviceWidth = Dimensions.get('window').width
    const RADIUS = radius ? radius / (2 * Math.PI) : CIRCLE_LENGTH / (2 * Math.PI)
    const animatedPercentage = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * percentage.value
    }))

    return (
        <View style={[styles.svgCover, { width: deviceWidth }]}>
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
                    strokeWidth={24}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    svgCoverCenter: {
        position: 'absolute',
        left: '50%', top: '50%',
        transform: [{ translateX: '-50%' },{ translateY: '-50%' }],
    }, 
})
