import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { PressableScale } from 'pressto';
import { ActivityIndicator, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
    loading = false,
    icon
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const getBackgroundColor = () => {
        if (disabled) return '#e0e0e0';
        switch (variant) {
            case 'primary': return theme.tint;
            case 'secondary': return theme.tabIconDefault;
            case 'danger': return '#ff4444';
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.tint;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#999';
        switch (variant) {
            case 'primary': return colorScheme === 'dark' ? '#000' : '#fff';
            case 'secondary': return '#fff';
            case 'danger': return '#fff';
            case 'outline': return theme.tint;
            case 'ghost': return theme.tint;
            default: return '#fff';
        }
    };

    const getBorderColor = () => {
        if (disabled) return 'transparent';
        if (variant === 'outline') return theme.tint;
        return 'transparent';
    };

    return (
        <PressableScale
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, { color: getTextColor(), marginLeft: icon ? 8 : 0 }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </PressableScale>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
