import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useTeam, useUpdateTeam } from '@/hooks/useTeams';
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function EditTeamScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const { data: team, isLoading: isTeamLoading } = useTeam(id as string);
    const updateTeam = useUpdateTeam();

    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        if (team) {
            setName(team.name || '');
            setLogoUrl(team.logo || '');
            setStatus(team.status || 'active');
        }
    }, [team]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Team name is required');
            return;
        }

        try {
            await updateTeam.mutateAsync({
                id: id as string,
                updates: {
                    name: name.trim(),
                    logo: logoUrl.trim() || null,
                    status,
                },
            });
            // Navigate back first, then show success message
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update team');
        }
    };

    const toggleStatus = () => {
        setStatus(prev => (prev === 'active' ? 'inactive' : 'active'));
    };

    if (isTeamLoading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (!team) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <FontAwesome name="exclamation-circle" size={48} color={theme.tabIconDefault} />
                <Text style={[styles.errorText, { color: theme.text, marginTop: 16 }]}>
                    Team not found
                </Text>
                <Button title="Go Back" onPress={() => router.back()} variant="outline" style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen
                options={{
                    title: 'Edit Team',
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
                    {/* Logo Preview */}
                    <View style={styles.logoSection}>
                        <View style={[styles.logoWrapper, { backgroundColor: theme.tabIconDefault + '20' }]}>
                            {logoUrl ? (
                                <Image
                                    source={{ uri: logoUrl }}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <FontAwesome name="users" size={40} color={theme.tabIconDefault} />
                            )}
                        </View>
                        <Text style={[styles.logoHint, { color: theme.tabIconDefault }]}>
                            Add a logo URL below
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={[styles.formCard, isDark && styles.formCardDark]}>
                        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>
                            TEAM DETAILS
                        </Text>

                        <Input
                            label="Team Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter team name"
                            autoCapitalize="words"
                        />

                        <Input
                            label="Logo URL"
                            value={logoUrl}
                            onChangeText={setLogoUrl}
                            placeholder="https://example.com/logo.png"
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                        <Text style={[styles.urlHint, { color: theme.tabIconDefault }]}>
                            Enter a direct link to an image (PNG recommended)
                        </Text>
                    </View>

                    <View style={[styles.formCard, isDark && styles.formCardDark]}>
                        <Text style={[styles.sectionTitle, { color: theme.tabIconDefault }]}>
                            STATUS
                        </Text>

                        <Pressable
                            style={[styles.statusToggle, isDark && styles.statusToggleDark]}
                            onPress={toggleStatus}
                        >
                            <View style={styles.statusInfo}>
                                <Text style={[styles.statusLabel, { color: theme.text }]}>
                                    Team Status
                                </Text>
                                <Text style={[styles.statusDescription, { color: theme.tabIconDefault }]}>
                                    {status === 'active'
                                        ? 'Team is visible and can participate'
                                        : 'Team is hidden and inactive'}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor:
                                            status === 'active' ? '#22c55e20' : '#ef444420',
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusBadgeText,
                                        { color: status === 'active' ? '#22c55e' : '#ef4444' },
                                    ]}
                                >
                                    {status === 'active' ? '● Active' : '○ Inactive'}
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* Save Button */}
                    <View style={styles.buttonSection}>
                        <Button
                            title={updateTeam.isPending ? 'Saving...' : 'Save Changes'}
                            onPress={handleSave}
                            variant="primary"
                            disabled={updateTeam.isPending}
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
    errorText: {
        fontSize: 16,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoWrapper: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoImage: {
        width: 80,
        height: 80,
    },
    logoHint: {
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
    urlHint: {
        fontSize: 12,
        marginTop: -8,
    },
    statusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f5f5f7',
        borderRadius: 10,
    },
    statusToggleDark: {
        backgroundColor: '#2c2c2e',
    },
    statusInfo: {
        flex: 1,
        marginRight: 12,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    statusDescription: {
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    buttonSection: {
        marginTop: 8,
    },
});
