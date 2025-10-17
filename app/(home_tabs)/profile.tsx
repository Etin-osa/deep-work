import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "@/constants/theme";
import { AntDesign, Entypo, Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import LargeButton from "@/components/large-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function profile() {
    const insets = useSafeAreaInsets()

    return (
        <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.header}>
                    <Image source={require("@/assets/images/aiony-haust-3TLl_97HNJo-unsplash.jpg")} style={{ width: 60, height: 60, borderRadius: 100 }} />
                    <ThemedView>
                        <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>Alex Thompson</ThemedText>
                        <ThemedText style={{ fontSize: 15 }} darkColor={Colors.dark.paragraph}>alex.thompsom@example.com</ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={{ marginBottom: 20 }}>
                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <Feather name="user" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Edit Profile</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <AntDesign name="lock" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Password</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={[styles.eachSection, { borderBottomWidth: 0 }]}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <FontAwesome5 name="award" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Manage Subscription</ThemedText>
                        </ThemedView>
                        <ThemedText style={{ fontSize: 14 }} darkColor="rgb(107, 114, 128)">Pro Plan</ThemedText>
                    </Pressable>
                </ThemedView>

                {/* Preferences */}
                <ThemedView style={{ marginBottom: 20 }}>
                    <ThemedText style={styles.headerSection}>Preferences</ThemedText>
                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialCommunityIcons name="timer-outline" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Default Focus Duration</ThemedText>
                        </ThemedView>
                        <ThemedText style={{ fontSize: 14 }} darkColor="rgb(107, 114, 128)">45 min</ThemedText>
                    </Pressable>

                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialCommunityIcons name="timer-sand-empty" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Default Break Duration</ThemedText>
                        </ThemedView>
                        <ThemedText style={{ fontSize: 14 }} darkColor="rgb(107, 114, 128)">10 min</ThemedText>
                    </Pressable>

                    <Pressable style={[styles.eachSection, { borderBottomWidth: 0 }]}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialIcons name="vibration" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Sound & Vibration</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>
                </ThemedView>

                {/* Notifications */}
                <ThemedView style={{ marginBottom: 20 }}>
                    <ThemedText style={styles.headerSection}>Notifications</ThemedText>
                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <AntDesign name="bell" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Enable Notifications</ThemedText>
                        </ThemedView>
                        {/* ADD ENABLE NOTIFICATIONS */}
                    </Pressable>

                    <Pressable style={[styles.eachSection, { borderBottomWidth: 0 }]}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <Octicons name="sliders" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Notification Settings</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>
                </ThemedView>
                
                {/* General */}
                 <ThemedView style={{ marginBottom: 20 }}>
                    <ThemedText style={styles.headerSection}>General</ThemedText>
                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <Feather name="info" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>About this App</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <FontAwesome5 name="question-circle" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Help & Support</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialCommunityIcons name="message-question-outline" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Send Feedback</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={styles.eachSection}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialIcons name="privacy-tip" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Privacy Policy</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>

                    <Pressable style={[styles.eachSection, { borderBottomWidth: 0 }]}>
                        <ThemedView style={styles.eachSectionLeft}>
                            <ThemedView style={styles.eachSectionIcon} darkColor="rgba(31, 41, 55, 0.5)">
                                <MaterialIcons name="gavel" size={24} color="white" />
                            </ThemedView>
                            <ThemedText style={{ fontSize: 15 }}>Terms of Service</ThemedText>
                        </ThemedView>
                        <Entypo name="chevron-right" size={24} color="rgb(107, 114, 128)" />
                    </Pressable>
                </ThemedView>

                <ThemedView style={{ marginTop: 30, marginBottom: insets.bottom + 10 }}>
                    <LargeButton 
                        text="Log Out" 
                        buttonStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.5)",
                            marginBottom: 15,
                            borderRadius: 15,
                            width: '100%'
                        }}
                        // onPress={() => router.replace("/(session)")}
                    />
                    <LargeButton 
                        text="Delete Account" 
                        buttonStyle={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            borderRadius: 15,
                            width: '100%'
                        }}
                        textStyle={{
                            color: 'rgb(239, 68, 68)',
                        }}
                    />
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20, 
        paddingTop: 20,
        paddingBottom: 20
    },
    headerSection: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: .5,
        marginVertical: 10
    },
    eachSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(31, 41, 55)',
        paddingVertical: 15
    },
    eachSectionLeft: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
    },
    eachSectionIcon: {
        padding: 10,
        borderRadius: 15
    }
});
