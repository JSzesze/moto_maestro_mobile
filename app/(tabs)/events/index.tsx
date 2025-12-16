import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/ui/EventCard';
import { useMyEntries } from '@/hooks/useMyEntries';
import { getEventPlaceholder } from '@/utils/placeholderImages';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

export default function EventsScreen() {
    const { data: entries, isLoading, refetch } = useMyEntries();
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text>Loading your events...</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic"
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            ListEmptyComponent={
                <View style={styles.centered}>
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                        You haven't registered for any events yet.
                    </Text>
                    <Button
                        title="Browse Upcoming Events"
                        onPress={() => router.push('/(tabs)/')}
                        variant="primary"
                    />
                </View>
            }
            renderItem={({ item, index }) => (
                <EventCard
                    title={item.events.name}
                    date={formatDate(item.events.date_start)}
                    venue={item.events.venue || 'TBA'}
                    imageSource={
                        item.events.hero_image_url
                            ? { uri: item.events.hero_image_url }
                            : getEventPlaceholder(item.events.id, index)
                    }
                    badge={item.status.toUpperCase()}
                    onPress={() => router.push(`/events/${item.events.id}`)}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
