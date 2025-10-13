import React from "react";
import { ThemedView } from "./themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { Colors } from "@/constants/theme";

export default function Logo() {
    const theme = useColorScheme() ?? "dark";

    return (
        <ThemedView 
            style={{ 
                width: 30, 
                height: 30, 
                borderRadius: 12,
                transform: [{ rotate: '-15deg' }],
                backgroundColor: Colors.accentColor
            }} 
        />
    );
}
