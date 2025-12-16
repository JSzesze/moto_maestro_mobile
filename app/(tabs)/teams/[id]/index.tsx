import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useTeam } from '@/hooks/useTeams';
import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function TeamDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const { data: team, isLoading, error, refetch } = useTeam(id as string);

    const getRoleDisplay = (role: string[] | undefined) => {
        if (!role || role.length === 0) return 'Member';
        return role.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (error || !team) {
        return (
            <View style={[styles.container, styles.centered]}>
                <FontAwesome name="exclamation-circle" size={48} color={theme.tabIconDefault} />
                <Text style={[styles.errorText, { marginTop: 16 }]}>Team not found</Text>
                <Button title="Go Back" onPress={() => router.back()} variant="outline" style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Team Details',
                }}
            />
            <ScrollView
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="automatic"
            >
                {/* Team Header */}
                <View style={styles.header}>
                    <View style={[styles.logoWrapper, { backgroundColor: theme.tabIconDefault + '15' }]}>
                        {team.logo ? (
                            <Image
                                source={{ uri: team.logo }}
                                style={styles.teamLogo}
                                resizeMode="contain"
                            />
                        ) : (
                            <FontAwesome name="users" size={48} color={theme.tabIconDefault} />
                        )}
                    </View>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={[styles.statusBadge, {
                        backgroundColor: team.status === 'active' ? '#22c55e20' : '#ef444420'
                    }]}>
                        <Text style={[styles.statusText, {
                            color: team.status === 'active' ? '#22c55e' : '#ef4444'
                        }]}>
                            {team.status === 'active' ? '● Active' : '○ Inactive'}
                        </Text>
                    </View>
                    <Text style={[styles.dateText, { color: theme.tabIconDefault }]}>
                        Created {formatDate(team.created_at)}
                    </Text>
                </View>

                {/* Quick Stats */}
                <View style={[styles.statsCard, {
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'
                }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>
                            {team.team_members?.length || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Members</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.tabIconDefault + '30' }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>—</Text>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Events</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.tabIconDefault + '30' }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>—</Text>
                        <Text style={[styles.statLabel, { color: theme.tabIconDefault }]}>Wins</Text>
                    </View>
                </View>

                {/* Team Members Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Team Members</Text>
                        <Pressable onPress={() => { /* TODO: Add member */ }}>
                            <FontAwesome name="plus-circle" size={24} color={theme.tint} />
                        </Pressable>
                    </View>

                    {team.team_members && team.team_members.length > 0 ? (
                        team.team_members.map((member: any) => (
                            <View
                                key={member.id}
                                style={[styles.memberCard, {
                                    backgroundColor: colorScheme === 'dark'
                                        ? 'rgba(255,255,255,0.05)'
                                        : 'rgba(0,0,0,0.02)'
                                }]}
                            >
                                <View style={[styles.memberAvatar, { backgroundColor: theme.tint + '20' }]}>
                                    {member.profiles?.avatar_url ? (
                                        <Image
                                            source={{ uri: member.profiles.avatar_url }}
                                            style={styles.avatarImage}
                                        />
                                    ) : (
                                        <Text style={[styles.avatarInitial, { color: theme.tint }]}>
                                            {member.profiles?.first_name?.[0] || member.profiles?.email?.[0]?.toUpperCase() || '?'}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.memberInfo}>
                                    <Text style={[styles.memberName, { color: theme.text }]}>
                                        {member.profiles?.first_name && member.profiles?.last_name
                                            ? `${member.profiles.first_name} ${member.profiles.last_name}`
                                            : member.profiles?.email || 'Unknown Member'}
                                    </Text>
                                    <View style={[styles.memberRoleBadge, { backgroundColor: theme.tint + '15' }]}>
                                        <Text style={[styles.memberRole, { color: theme.tint }]}>
                                            {getRoleDisplay(member.role)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyMembers}>
                            <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>
                                No members yet
                            </Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actionsSection}>
                    <Button
                        title="Invite Members"
                        onPress={() => { /* TODO: Invite flow */ }}
                        variant="primary"
                        icon={<FontAwesome name="user-plus" size={16} color="#fff" style={{ marginRight: 8 }} />}
                    />
                    <View style={{ height: 12 }} />
                    <Button
                        title="Edit Team"
                        onPress={() => router.push(`/teams/${id}/edit`)}
                        variant="outline"
                        icon={<FontAwesome name="pencil" size={16} color={theme.tint} style={{ marginRight: 8 }} />}
                    />
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
    errorText: {
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    logoWrapper: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    teamLogo: {
        width: 80,
        height: 80,
    },
    teamName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 14,
    },
    statsCard: {
        flexDirection: 'row',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
    },
    statDivider: {
        width: 1,
        height: '100%',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 48,
        height: 48,
    },
    avatarInitial: {
        fontSize: 20,
        fontWeight: '600',
    },
    memberInfo: {
        flex: 1,
        marginLeft: 14,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    memberRoleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    memberRole: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyMembers: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
});
