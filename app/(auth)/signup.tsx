import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
        } else if (!session) {
            Alert.alert('Please check your inbox for email verification!');
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <Input
                placeholder="email@address.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.inputContainer}
            />

            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.inputContainer}
            />

            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button
                    title="Sign up"
                    onPress={signUpWithEmail}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                />
            </View>

            <View style={styles.verticallySpaced}>
                <Button
                    title="Already have an account? Sign in"
                    onPress={() => router.back()}
                    variant="ghost"
                    textStyle={styles.linkText}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 12,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        textAlign: 'center',
        marginTop: 16,
        textDecorationLine: 'underline',
    },
});
