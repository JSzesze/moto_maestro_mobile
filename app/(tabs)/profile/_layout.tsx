import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function ProfileLayout() {
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
                    title: 'Profile',
                }}
            />
            <Stack.Screen
                name="documents"
                options={{
                    headerSortTitle: 'Documents',
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
                    headerTintColor: theme === 'dark' ? 'white' : 'black',
                    headerLargeStyle: { backgroundColor: 'transparent' },
                    title: 'My Documents',
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerBlurEffect: isGlassAvailable ? undefined : blurEffect,
                    headerTintColor: theme === 'dark' ? 'white' : 'black',
                    title: 'Edit Profile',
                    headerBackTitle: 'Back'
                }}
            />
        </Stack>
    );
}
