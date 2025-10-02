import { StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Logo from "@/components/logo";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import LargeButton from "@/components/large-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

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
    "Eliminate distraction. Build custom focus sessions to crush your goals.",
    "Silence the noise and maximize productivity with Deep Work.",
    "Staying Focused will be your New Superpower."
]

export default function onboarding() {
    const insets = useSafeAreaInsets()
    const progress = useSharedValue(0)
    const theme = useColorScheme() ?? "dark"
    const [absoluteProgress, setAbsoluteProgress] = React.useState(0)
    const ref = React.useRef<ICarouselInstance>(null)

    return (
        <ThemedView 
            style={{ 
                flex: 1, 
                justifyContent: 'space-between', 
                paddingTop: 60 + insets.top, 
                paddingBottom: insets.bottom + 10 
            }}
        >
            <ThemedView style={{ flex: 1, alignItems: 'center' }}>
                <Carousel
                    ref={ref}
                    height={700}
                    width={400}
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
                        <ThemedView style={styles.header} key={index}>
                            <Logo />
                            <ThemedText style={styles.headerText}>{item}</ThemedText>
                            <ThemedView style={[styles.imageView, { backgroundColor: Colors[theme].tabIconDefault }]} />
                        </ThemedView>
                    }
                />
            </ThemedView>

            <ThemedView>
                <ThemedView style={styles.pagination}>
                    {onboardingTitle.map((_, index) => (
                        <PaginationBar 
                            key={index} 
                            activeColor={Colors[theme].tabIconDefault}
                            defaultColor={Colors[theme].text}
                            isActive={absoluteProgress === index}
                        />
                    ))}
                </ThemedView>

                <ThemedView>
                    <LargeButton 
                        buttonStyle={{ backgroundColor: Colors[theme].text, marginBottom: 15 }} 
                        textStyle={{ color: Colors[theme].background }}
                        text="Start your First Deep Work" 
                        onPress={() => router.replace("/(session)")}
                    />
                    <LargeButton buttonStyle={{ borderWidth: 1, borderColor: Colors[theme].text }} text="Continue with an account" />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const PaginationBar = ({ isActive, activeColor, defaultColor }: { isActive: boolean, activeColor: string, defaultColor: string }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(isActive ? 30 : 7, { duration: 200 }),
            backgroundColor: withTiming(
                isActive ? activeColor : defaultColor, { duration: 200 }
            ),
        }
    })

    return <Animated.View style={[{ height: 7, borderRadius: 100 }, animatedStyle]} />
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
    headerText: {
        fontSize: 25,
        lineHeight: 30,
        textAlign: 'center',
        marginTop: 20
    },
    pagination: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        marginBottom: 30
    },
    imageView: { marginTop: 60, height: '65%', width: '97%', borderRadius: 35 }
});
