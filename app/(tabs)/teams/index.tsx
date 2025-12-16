import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useMyTeams } from '@/hooks/useTeams';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TeamsScreen() {
    const { data: teams, isLoading, refetch } = useMyTeams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const getRoleDisplay = (role: string[] | undefined) => {
        if (!role || role.length === 0) return 'Member';
        return role.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Loading teams...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={teams}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <FontAwesome name="users" size={48} color={theme.tabIconDefault} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Teams Yet</Text>
                        <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
                            Join or create a team to get started
                        </Text>
                        <Button
                            title="Join a Team"
                            variant="outline"
                            onPress={() => router.push('/teams/join')}
                            style={{ marginTop: 20 }}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={({ pressed }) => [
                            styles.teamCard,
                            {
                                backgroundColor: colorScheme === 'dark'
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'rgba(0,0,0,0.03)',
                            },
                            pressed && styles.teamCardPressed,
                        ]}
                        onPress={() => router.push(`/teams/${item.teams.id}`)}
                    >
                        <View style={[styles.logoContainer, { backgroundColor: theme.tabIconDefault + '20' }]}>
                            {item.teams.logo ? (
                                <Image
                                    source={{ uri: item.teams.logo }}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            ) : (
                                <FontAwesome name="users" size={24} color={theme.tabIconDefault} />
                            )}
                        </View>

                        <View style={styles.teamInfo}>
                            <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={1}>
                                {item.teams.name}
                            </Text>
                            <View style={styles.roleContainer}>
                                <View style={[styles.roleBadge, { backgroundColor: theme.tint + '20' }]}>
                                    <Text style={[styles.roleText, { color: theme.tint }]}>
                                        {getRoleDisplay(item.role)}
                                    </Text>
                                </View>
                                <Text style={[styles.statusText, { color: theme.tabIconDefault }]}>
                                    {item.teams.status === 'active' ? '● Active' : '○ Inactive'}
                                </Text>
                            </View>
                        </View>

                        <FontAwesome name="chevron-right" size={16} color={theme.tabIconDefault} />
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    teamCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    teamCardPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    logoContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: 48,
        height: 48,
    },
    teamInfo: {
        flex: 1,
        marginLeft: 14,
        marginRight: 8,
    },
    teamName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    roleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusText: {
        fontSize: 12,
    },
    separator: {
        height: 12,
    },
});
