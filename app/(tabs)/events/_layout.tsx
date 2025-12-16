import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function EventsLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const isGlassAvailable = isLiquidGlassAvailable();
    const blurEffect = theme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight';

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
                    headerTintColor: theme === 'dark' ? 'white' : 'black',
                    headerLargeStyle: { backgroundColor: 'transparent' },
                    title: 'Events',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: true,
                    title: 'Event Details',
                    headerBackTitle: 'Back',
                    headerTransparent: true,
                    headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
                    headerTintColor: theme === 'dark' ? 'white' : 'black',
                    headerLargeStyle: { backgroundColor: 'transparent' },
                }}
            />
        </Stack>
    );
}
