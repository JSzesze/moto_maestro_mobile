import { Text, View } from '@/components/Themed';
import { EventCard } from '@/components/ui/EventCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useEvents } from '@/hooks/useEvents';
import { useProfile } from '@/hooks/useProfile';
import { getEventPlaceholder } from '@/utils/placeholderImages';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { data: profile } = useProfile();
  const { data: events, isLoading: eventsLoading, refetch } = useEvents();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: 'transparent' }]}>
      <Text style={styles.greeting}>
        Welcome back, {profile?.first_name || 'Racer'}!
      </Text>
      <Text style={styles.subtitle}>
        Here are the upcoming events on the calendar.
      </Text>
    </View>
  );

  if (eventsLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      data={events}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl refreshing={eventsLoading} onRefresh={refetch} />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>No upcoming events found.</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <EventCard
          title={item.name}
          date={formatDate(item.date_start)}
          venue={item.venue || 'TBA'}
          imageSource={
            item.hero_image_url 
              ? { uri: item.hero_image_url }
              : getEventPlaceholder(item.id, index)
          }
          onPress={() => router.push(`/(tabs)/home/${item.id}`)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});
