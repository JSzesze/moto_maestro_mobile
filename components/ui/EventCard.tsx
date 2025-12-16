import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

interface EventCardProps {
    title: string;
    date: string;
    venue?: string;
    imageSource: ImageSourcePropType;
    onPress?: () => void;
    badge?: string;
}

export function EventCard({
    title,
    date,
    venue,
    imageSource,
    onPress,
    badge,
}: EventCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            {/* Background Image */}
            <Image
                source={imageSource}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* Diagonal overlay for speed effect */}
            <View style={styles.diagonalOverlay} />

            {/* Bottom gradient for text legibility */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                locations={[0.3, 1]}
                style={styles.gradient}
            />

            {/* Accent stripe - racing inspired */}
            <View style={styles.accentStripe} />

            {/* Badge - subtle pill style */}
            {badge && (
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                </View>
            )}

            {/* Content */}
            <View style={styles.content}>
                {/* Date - clean and bold */}
                <Text style={styles.dateText}>{date}</Text>

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                {/* Venue with subtle icon */}
                {venue && (
                    <View style={styles.venueRow}>
                        <View style={styles.locationDot} />
                        <Text style={styles.venue} numberOfLines={1}>
                            {venue}
                        </Text>
                    </View>
                )}
            </View>

            {/* Chevron indicator - angular design */}
            <View style={styles.chevronContainer}>
                <View style={styles.chevron} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 180,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#0a0a0a',
        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    cardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    diagonalOverlay: {
        position: 'absolute',
        top: 0,
        right: -50,
        width: 100,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        transform: [{ skewX: '-12deg' }],
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    accentStripe: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 4,
        height: '40%',
        backgroundColor: '#00D4FF',
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        left: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 2,
        borderLeftWidth: 2,
        borderLeftColor: '#00D4FF',
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#00FF88',
        marginRight: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingLeft: 20,
    },
    dateText: {
        color: '#00D4FF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    venueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginRight: 8,
    },
    venue: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    chevronContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    chevron: {
        width: 8,
        height: 8,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        transform: [{ rotate: '45deg' }],
    },
});

