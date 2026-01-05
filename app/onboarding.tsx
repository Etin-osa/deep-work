import { Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from 'expo-image'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";

function debounce<T extends (...args: any[]) => any>( func: T,  wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const context = this as ThisParameterType<T>;
        
        const later = function() {
            timeout = undefined;
            func.apply(context, args);
        };

        clearTimeout(timeout);
        
        timeout = setTimeout(later, wait);
    };
}

const onboardingTitle = [
    {
        img: require("@/assets/icons/undraw_to-do-list_o3jf.svg"),
        title: "Find Your Focus.",
        paragraph: "Design your perfect work/break sequence. Stay focused without manual interruptions."
    },
    {
        img: require("@/assets/icons/undraw_designing-components_kb05.svg"),
        title: "Design Your Perfect Productivity Flow",
        paragraph: "Get total command. Customize every detail to create a unique structure that fits your workflow."
    },
    {
        img: require("@/assets/icons/undraw_instant-analysis_vm8x.svg"),
        title: "Track and Optimize Your Progress",
        paragraph: "Detailed tracking logs your sessions. Refine and optimize your custom routine for peak concentration."
    }
]

export default function onboarding() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? "dark"
    const deviceWidth = Dimensions.get('window').width
    const ref = React.useRef<ICarouselInstance>(null)
    const progress = useSharedValue(0)
    const [absoluteProgress, setAbsoluteProgress] = useState(0)
    const [carouselHeight, setCarouselHeight] = useState(0)

    useEffect(() => {
        router.push("/(session)")
    }, [])

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center' }}>
            <ThemedView 
                style={{ flex: 1, overflow: 'hidden' }}
                onLayout={e => setCarouselHeight(e.nativeEvent.layout.height)}
            >
                <Carousel
                    ref={ref}
                    height={carouselHeight}
                    width={deviceWidth}
                    snapEnabled={true}
                    pagingEnabled={true}
                    loop={false}
                    data={onboardingTitle}
                    defaultScrollOffsetValue={progress}
                    onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                        "worklet";
                        g.enabled(false);
                    }}
                    onProgressChange={(_, absoluteProgress) => debounce(() => setAbsoluteProgress(Math.round(absoluteProgress)), 100)()}
                    renderItem={({ item, index }) => 
                        <ThemedView key={index} style={[styles.eachCarousel, { paddingTop: insets.top}]}>
                            <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 30 }}>
                                <Image style={styles.image} source={item.img} />
                            </ThemedView>
                            <ThemedView>
                                <ThemedText style={styles.header}>{item.title}</ThemedText>
                                <ThemedText darkColor={Colors.dark.paragraph} style={{ textAlign: 'center' }}>{item.paragraph}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    }
                />
            </ThemedView>

            <ThemedView style={{ paddingBottom: insets.bottom }}>
                <ThemedView style={styles.pagination}>
                    {onboardingTitle.map((each, index) => 
                        <PaginationBar key={each.title} isActive={index === absoluteProgress} />
                    )}
                </ThemedView>

                <LargeButton 
                    text="Create Your First Habit" 
                    buttonStyle={{
                        backgroundColor: Colors.accentColor,
                        marginBottom: 15
                    }}
                    onPress={() => router.replace("/(session)")}
                />
                <LargeButton 
                    text="Continue with an account" 
                    buttonStyle={{
                        backgroundColor: Colors.secondaryColor,
                    }}
                    textStyle={{
                        color: Colors.accentColor,
                    }}
                />
            </ThemedView>
        </ThemedView>
    );
}

/*
 */

const PaginationBar = ({ isActive }: { isActive: boolean }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(isActive ? 30 : 7, { duration: 200 }),
            backgroundColor: withTiming(
                isActive ? Colors.accentColor : 'rgb(51, 65, 85)', { duration: 200 }
            ),
        }
    })

    return <Animated.View style={[{ height: 7, borderRadius: 100 }, animatedStyle]} />
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: 310,
    },
    eachCarousel: {
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        paddingHorizontal: 30,
        height: '100%',
    },
    header: {
        fontSize: 35,
        lineHeight: 45,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: .2,
        marginBottom: 20
    },
    pagination: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
        marginVertical: 30
    }
});
