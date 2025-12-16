import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function HomeLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const isGlassAvailable = isLiquidGlassAvailable();
    const blurEffect = theme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight';

    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
                headerTintColor: theme === 'dark' ? 'white' : 'black',
                headerLargeStyle: { backgroundColor: 'transparent' },
                headerBackTitle: 'Back',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerLargeTitle: true,
                    title: 'Home',
                }}
            />
            <Stack.Screen name="[id]/index" />
            <Stack.Screen name="[id]/register" options={{ title: 'Register' }} />
        </Stack>
    );
}
