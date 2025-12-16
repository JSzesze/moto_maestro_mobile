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

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error ? 'red' : theme.tabIconDefault,
                        color: theme.text,
                        backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                    }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
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
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});
