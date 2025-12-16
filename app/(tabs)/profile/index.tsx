import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useMyEntries } from '@/hooks/useMyEntries';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/utils/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
    const { data: profile, isLoading } = useProfile();
    const { data: entries } = useMyEntries();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme ?? 'light'];

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase.auth.signOut();
                        if (error) {
                            Alert.alert('Error signing out', error.message);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={{ color: theme.text }}>Loading profile...</Text>
            </View>
        );
    }

    const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Racer';
    const initials = displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
    const eventsCount = entries?.length || 0;

    const MenuItem = ({ 
        icon, 
        title, 
        subtitle, 
        onPress,
        accent = false 
    }: { 
        icon: string; 
        title: string; 
        subtitle?: string;
        onPress: () => void;
        accent?: boolean;
    }) => (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                isDark && styles.menuItemDark,
                pressed && styles.menuItemPressed,
            ]}
        >
            <View style={[styles.menuIconContainer, accent && styles.menuIconAccent]}>
                <FontAwesome 
                    name={icon as any} 
                    size={18} 
                    color={accent ? '#fff' : (isDark ? '#aaa' : '#666')} 
                />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, isDark && styles.menuTitleDark]}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <FontAwesome name="chevron-right" size={14} color={isDark ? '#555' : '#ccc'} />
        </Pressable>
    );

    return (
        <ScrollView 
            style={[styles.container, isDark && styles.containerDark]}
            contentInsetAdjustmentBehavior="automatic" 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <LinearGradient
                        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerGradient}
                    >
                        {/* Accent stripe */}
                        <View style={styles.headerAccent} />
                        
                        <View style={styles.headerContent}>
                            {/* Avatar */}
                            {profile?.avatar_url ? (
                                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitials}>{initials}</Text>
                                </View>
                            )}

                            {/* Name & Team */}
                            <Text style={styles.name}>{displayName}</Text>
                            {profile?.team_name ? (
                                <View style={styles.teamBadge}>
                                    <FontAwesome name="flag-checkered" size={10} color="#fff" />
                                    <Text style={styles.teamText}>{profile.team_name}</Text>
                                </View>
                            ) : (
                                <Text style={styles.email}>{profile?.email}</Text>
                            )}
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{eventsCount}</Text>
                                <Text style={styles.statLabel}>Events</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>—</Text>
                                <Text style={styles.statLabel}>Best Lap</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>—</Text>
                                <Text style={styles.statLabel}>Podiums</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>ACCOUNT</Text>
                    <View style={[styles.menuGroup, isDark && styles.menuGroupDark]}>
                        <MenuItem
                            icon="user"
                            title="Edit Profile"
                            subtitle="Update your information"
                            onPress={() => router.push('/profile/edit')}
                        />
                        <MenuItem
                            icon="car"
                            title="My Vehicles"
                            subtitle="Manage your race cars"
                            onPress={() => router.push('/profile/vehicles')}
                        />
                        <MenuItem
                            icon="file-text-o"
                            title="Documents"
                            subtitle="Licenses & certifications"
                            onPress={() => router.push('/profile/documents')}
                            accent
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>PREFERENCES</Text>
                    <View style={[styles.menuGroup, isDark && styles.menuGroupDark]}>
                        <MenuItem
                            icon="bell-o"
                            title="Notifications"
                            subtitle="Alerts & reminders"
                            onPress={() => router.push('/profile/settings')}
                        />
                        <MenuItem
                            icon="cog"
                            title="Settings"
                            subtitle="App preferences"
                            onPress={() => router.push('/profile/settings')}
                        />
                    </View>
                </View>

                {/* Sign Out */}
                <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => [
                        styles.signOutButton,
                        pressed && styles.signOutPressed,
                    ]}
                >
                    <FontAwesome name="sign-out" size={16} color="#FF453A" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>

                <Text style={styles.version}>Moto Maestro v1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },
    containerDark: {
        backgroundColor: '#000',
    },
    content: {
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Header Card
    headerCard: {
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerGradient: {
        paddingTop: 24,
        paddingBottom: 0,
    },
    headerAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 4,
        height: '100%',
        backgroundColor: '#00D4FF',
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
    },
    name: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 12,
        letterSpacing: -0.5,
    },
    email: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 4,
    },
    teamBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
        gap: 6,
    },
    teamText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // Sections
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitleDark: {
        color: '#666',
    },

    // Menu
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuGroupDark: {
        backgroundColor: '#1c1c1e',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e5e5',
    },
    menuItemDark: {
        backgroundColor: '#1c1c1e',
        borderBottomColor: '#2c2c2e',
    },
    menuItemPressed: {
        backgroundColor: '#f0f0f0',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuIconAccent: {
        backgroundColor: '#00D4FF',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    menuTitleDark: {
        color: '#fff',
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },

    // Sign Out
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,69,58,0.1)',
        gap: 8,
    },
    signOutPressed: {
        backgroundColor: 'rgba(255,69,58,0.2)',
    },
    signOutText: {
        color: '#FF453A',
        fontSize: 16,
        fontWeight: '600',
    },

    // Version
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 24,
    },
});
