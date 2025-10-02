import React from "react";
import { Stack } from "expo-router";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { getIsFirstTime } from "@/redux/slices/isFirstTimeSlice";

export default function _layout() {
    const isFirstTime = useAppSelector(getIsFirstTime)

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
