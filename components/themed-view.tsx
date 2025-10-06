import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    reverse?: boolean
};

export function ThemedView({ style, lightColor, darkColor, reverse, ...otherProps }: ThemedViewProps) {
    let backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    
    if (reverse) {
        backgroundColor = backgroundColor === "#ffffff" ? '#0e0f0f' : "#ffffff"
    }

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
