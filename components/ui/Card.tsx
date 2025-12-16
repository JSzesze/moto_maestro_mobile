import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CardProps {
    children?: React.ReactNode;
    style?: ViewStyle;
    title?: string;
    subtitle?: string;
    image?: React.ReactNode;
    footer?: React.ReactNode;
    onPress?: () => void;
}

export function Card({
    children,
    style,
    title,
    subtitle,
    image,
    footer,
}: CardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.card, { backgroundColor: theme.background }, style]}>
            {image && <View style={[styles.imageContainer, { backgroundColor: theme.tabIconDefault }]}>{image}</View>}

            {(title || subtitle) && (
                <View style={styles.header}>
                    {title && <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}
                    {subtitle && <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>{subtitle}</Text>}
                </View>
            )}

            <View style={styles.content}>{children}</View>

            {footer && <View style={[styles.footer, { borderTopColor: theme.tabIconDefault }]}>{footer}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    content: {
        padding: 16,
        paddingTop: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
    },
});
