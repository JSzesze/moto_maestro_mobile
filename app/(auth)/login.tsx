import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
        }
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Moto Maestro</Text>

                <Input
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Button
                        title="Sign in"
                        onPress={signInWithEmail}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                    />
                </View>

                <View style={styles.verticallySpaced}>
                    <Button
                        title="Don't have an account? Sign up"
                        onPress={() => router.push('/(auth)/signup')}
                        variant="ghost"
                        textStyle={styles.linkText}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 48,
        textAlign: 'center',
        color: '#ffffff',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    logo: {
        width: 140,
        height: 140,
        alignSelf: 'center',
        marginBottom: 24,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
    },
    mt20: {
        marginTop: 24,
    },
    button: {
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dc2626',
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    linkText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#9ca3af',
    },
});
