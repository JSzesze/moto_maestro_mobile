import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
    style?: ViewStyle;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    error,
    style,
    autoCapitalize = 'sentences',
}: InputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: isDark ? '#9ca3af' : theme.text }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error ? '#ef4444' : isDark ? '#404040' : '#d1d5db',
                        color: isDark ? '#ffffff' : theme.text,
                        backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                    }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 6,
    },
});

