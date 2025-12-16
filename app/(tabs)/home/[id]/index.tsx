import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useEvent } from '@/hooks/useEvents';
import { useMyEntries } from '@/hooks/useMyEntries';
import { getHeroPlaceholder } from '@/utils/placeholderImages';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet } from 'react-native';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const { data: event, isLoading: isEventLoading, error } = useEvent(id as string);
    const { data: myEntries, isLoading: isEntriesLoading } = useMyEntries();

    const existingEntry = myEntries?.find(entry => entry.event_id === id);
    const isLoading = isEventLoading || isEntriesLoading;

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (error || !event) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text>Event not found.</Text>
                <Button title="Go Back" onPress={() => router.back()} variant="outline" style={{ marginTop: 20 }} />
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: event.name }} />
            <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
                <Image
                    source={
                        event.hero_image_url
                            ? { uri: event.hero_image_url }
                            : getHeroPlaceholder(event.id)
                    }
                    style={styles.heroImage}
                    resizeMode="cover"
                />

                <View style={styles.header}>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={[styles.date, { color: theme.tabIconDefault }]}>
                        {formatDate(event.date_start)}
                        {event.date_start !== event.date_end && ` - ${formatDate(event.date_end)} `}
                    </Text>
                    <Text style={styles.venue}>{event.venue}</Text>
                </View>

                {event.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.description}>{event.description}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Classes</Text>
                    {event.classes?.map((cls: any) => (
                        <Card key={cls.id} style={{ marginBottom: 10 }}>
                            <View style={styles.classRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.className}>{cls.name}</Text>
                                    <Text style={[styles.classCapacity, { color: theme.tabIconDefault }]}>
                                        Capacity: {cls.capacity}
                                    </Text>
                                </View>
                                <Text style={[styles.classPrice, { color: theme.tint }]}>
                                    ${cls.price}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={styles.footer}>
                    {existingEntry ? (
                        <Button
                            title="You are Registered"
                            onPress={() => router.push('/(tabs)/profile')}
                            variant="secondary"
                            icon={<Text style={{ color: '#fff', marginRight: 8 }}>✓</Text>}
                        />
                    ) : (
                        <Button
                            title="Register Now"
                            onPress={() => router.push(`/(tabs)/home/${id}/register`)}
                            variant="primary"
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    date: {
        fontSize: 16,
        marginBottom: 4,
    },
    venue: {
        fontSize: 16,
        fontWeight: '500',
    },
    section: {
        padding: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    classRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    className: {
        fontSize: 18,
        fontWeight: '600',
    },
    classCapacity: {
        fontSize: 14,
        marginTop: 4,
    },
    classPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
    },
});
