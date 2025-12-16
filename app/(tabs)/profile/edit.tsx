import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const updateProfile = useUpdateProfile();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setPhone(profile.phone || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                first_name: firstName || null,
                last_name: lastName || null,
                phone: phone || null,
                avatar_url: avatarUrl || null,
            });
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    };

    const initials = [firstName, lastName]
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase() || '?';

    if (isProfileLoading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen
                options={{
                    title: 'Edit Profile',
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar Preview */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarWrapper, { backgroundColor: theme.tint + '20' }]}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Text style={[styles.avatarInitials, { color: theme.tint }]}>
                                    {initials}
                                </Text>
                            )}
                        </View>
                        <Text style={[styles.avatarHint, { color: theme.tabIconDefault }]}>
                            Add an image URL below
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={[styles.formCard, isDark && styles.formCardDark]}>
                        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>
                            PERSONAL INFORMATION
                        </Text>

                        <Input
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter your first name"
                            autoCapitalize="words"
                        />

                        <Input
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter your last name"
                            autoCapitalize="words"
                        />

                        <Input
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />

                        <View style={styles.emailRow}>
                            <Text style={[styles.emailLabel, { color: theme.text }]}>Email</Text>
                            <Text style={[styles.emailValue, { color: theme.tabIconDefault }]}>
                                {profile?.email || 'Not set'}
                            </Text>
                            <FontAwesome name="lock" size={12} color={theme.tabIconDefault} />
                        </View>
                    </View>

                    <View style={[styles.formCard, isDark && styles.formCardDark]}>
                        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>
                            PROFILE PHOTO
                        </Text>

                        <Input
                            label="Avatar URL"
                            value={avatarUrl}
                            onChangeText={setAvatarUrl}
                            placeholder="https://example.com/avatar.jpg"
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                        <Text style={[styles.urlHint, { color: theme.tabIconDefault }]}>
                            Enter a direct link to an image (JPG, PNG)
                        </Text>
                    </View>

                    {/* Save Button (for users who scroll past header) */}
                    <View style={styles.buttonSection}>
                        <Button
                            title={updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                            onPress={handleSave}
                            variant="primary"
                            disabled={updateProfile.isPending}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        fontSize: 17,
        fontWeight: '600',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 100,
        height: 100,
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: '700',
    },
    avatarHint: {
        marginTop: 8,
        fontSize: 13,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    formCardDark: {
        backgroundColor: '#1c1c1e',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 16,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e5e5e5',
        marginTop: 8,
        gap: 8,
    },
    emailLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    emailValue: {
        flex: 1,
        fontSize: 14,
        textAlign: 'right',
    },
    urlHint: {
        fontSize: 12,
        marginTop: -8,
    },
    buttonSection: {
        marginTop: 8,
    },
});
