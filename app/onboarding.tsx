import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient';
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
    "Welcome to {{Deep Work",
    "Automate and Customize your Sessions {{At Any Point",
    "The Ultimate App to Charge up your {{Productivity",
]

export default function onboarding() {
    const insets = useSafeAreaInsets()
    const theme = useColorScheme() ?? "dark"
    const ref = React.useRef<ICarouselInstance>(null)
    const progress = useSharedValue(0)
    const [absoluteProgress, setAbsoluteProgress] = React.useState(0)

    const checkAbsoluteHeight = () => {
        if (absoluteProgress === 0) {
            return 100
        } else if (absoluteProgress === 1) {
            return 200
        } else {
            return 250
        }
    }

    return (
        <View 
            style={{ 
                flex: 1, 
                justifyContent: 'space-between',
                paddingBottom: insets.bottom + 15
            }}
        >
            <Image
                source={require("@/assets/images/guille-pozzi-sbcIAn4Mn14-unsplash.jpg")}
                style={styles.image}
            />

            <LinearGradient 
                colors={['#000000e1', '#0000008f']} 
                start={[0, 1]} end={[0, 0]}
                locations={[0.6, 1]}
                style={[styles.background, { paddingTop: insets.top }]}
            >
                <View style={{ flex: 1 }}>
                    <Carousel
                        ref={ref}
                        height={400}
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
                        style={styles.carousel}  
                        onProgressChange={(_, absoluteProgress) => debounce(() => setAbsoluteProgress(Math.round(absoluteProgress)), 100)()}
                        renderItem={({ item, index }) => 
                            <View key={index} style={styles.eachCarousel}>
                                <Logo />
                                <ThemedText style={[styles.headerText]}>
                                    {item.split("{{")[0]}
                                    <ThemedText style={[styles.headerText, styles.headerHighlight]}>
                                        {item.split("{{")[1]}
                                    </ThemedText>
                                </ThemedText>
                            </View>
                        }
                    />
                </View>

                <View>
                    <View style={styles.pagination}>
                        {onboardingTitle.map((_, index) => (
                            <PaginationBar key={index} isActive={absoluteProgress === index} />
                        ))}
                    </View>

                    <View>
                        <Pressable onPress={() => router.replace("/(session)")}>
                            <LinearGradient
                                colors={[Colors.gradient_0, Colors.gradient_1, Colors.gradient_2]}
                                style={styles.gradientButton}
                                start={[0, 0]}
                                end={[1, 0]}
                            >
                                <Text style={styles.gradientText}>Start your First Deep Work</Text>
                            </LinearGradient>
                        </Pressable>
                        <LargeButton text="Continue with an account" />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const PaginationBar = ({ isActive }: { isActive: boolean }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(isActive ? 30 : 7, { duration: 200 }),
            backgroundColor: withTiming(
                isActive ? Colors.gradient_2 : '#EEEEEE', { duration: 200 }
            ),
        }
    })

    return <Animated.View style={[{ height: 7, borderRadius: 100 }, animatedStyle]} />
}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    background: {
        paddingHorizontal: 10,
        width: '100%',
        flex: 1,
    },
    carousel: { 
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eachCarousel: { 
        height: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingHorizontal: 10,
        transform: [{ translateY: 40 }]
    },
    headerText: {
        fontSize: 40,
        lineHeight: 50,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: .2
    },
    headerHighlight: {
        color: Colors.gradient_2
    },
    pagination: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 3,
        marginVertical: 30
    },
    gradientButton: {
        width: '95%',
        padding: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        marginBottom: 15
    },
    gradientText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    }
});
