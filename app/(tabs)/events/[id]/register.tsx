import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useEvent } from '@/hooks/useEvents';
import { useProfile } from '@/hooks/useProfile';
import { useRegisterForEvent } from '@/hooks/useRegisterForEvent';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PressableScale } from 'pressto';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const { data: event, isLoading: isEventLoading } = useEvent(id as string);
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const { mutate: register, isPending: isRegistering } = useRegisterForEvent();

    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [driverName, setDriverName] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [kartNumber, setKartNumber] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (profile) {
            setDriverName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
            setDriverEmail(profile.email || '');
        }
    }, [profile]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!selectedClassId) newErrors.classId = 'Please select a class.';
        if (!driverName) newErrors.driverName = 'Driver name is required.';
        if (!driverEmail) newErrors.driverEmail = 'Driver email is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = () => {
        if (!validate()) return;
        if (!event || !profile) return;

        register({
            eventId: event.id,
            classId: selectedClassId!,
            profileId: profile.id,
            driverName,
            driverEmail,
            kartNumber,
        }, {
            onSuccess: () => {
                router.replace('/(tabs)/events');
            }
        });
    };

    if (isEventLoading || isProfileLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={{ color: theme.text }}>Event not found.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.heading, { color: theme.text }]}>Register for {event.name}</Text>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Select Class</Text>
                    {errors.classId && <Text style={styles.errorText}>{errors.classId}</Text>}

                    {event.classes?.map((cls: any) => (
                        <PressableScale
                            key={cls.id}
                            onPress={() => setSelectedClassId(cls.id)}
                            style={[
                                styles.classOption,
                                {
                                    borderColor: selectedClassId === cls.id ? theme.tint : theme.tabIconDefault,
                                    backgroundColor: selectedClassId === cls.id ? theme.tint + '20' : 'transparent'
                                }
                            ]}
                        >
                            <View style={styles.classHeader}>
                                <Text style={[styles.className, { color: theme.text }]}>{cls.name}</Text>
                                <Text style={[styles.classPrice, { color: theme.tint }]}>${cls.price}</Text>
                            </View>
                            <Text style={{ color: theme.tabIconDefault }}>Capacity: {cls.capacity}</Text>
                            {selectedClassId === cls.id && (
                                <View style={styles.checkIcon}>
                                    <FontAwesome name="check-circle" size={24} color={theme.tint} />
                                </View>
                            )}
                        </PressableScale>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Driver Information</Text>

                    <Input
                        label="Full Name"
                        value={driverName}
                        onChangeText={setDriverName}
                        placeholder="Enter driver name"
                        error={errors.driverName}
                        style={styles.input}
                    />

                    <Input
                        label="Email"
                        value={driverEmail}
                        onChangeText={setDriverEmail}
                        placeholder="Enter driver email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.driverEmail}
                        style={styles.input}
                    />

                    <Input
                        label="Kart Number (Optional)"
                        value={kartNumber}
                        onChangeText={setKartNumber}
                        placeholder="Preferred kart number"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Submit Registration"
                        onPress={handleRegister}
                        loading={isRegistering}
                        disabled={isRegistering}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => router.back()}
                        variant="ghost"
                        style={{ marginTop: 10 }}
                        disabled={isRegistering}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    classOption: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        position: 'relative',
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
    },
    classPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    input: {
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
    footer: {
        marginTop: 20,
    },
});
