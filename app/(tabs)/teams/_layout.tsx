import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export default function TeamsLayout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const isGlassAvailable = isLiquidGlassAvailable();
    const blurEffect = theme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight';

    const handleCreateTeam = useCallback(() => {
        router.push('/teams/create');
    }, [router]);

    const handleJoinTeam = useCallback(() => {
        router.push('/teams/join');
    }, [router]);

    const headerLeftItems = useCallback(() => [
        {
            type: 'button',
            label: 'Add',
            icon: {
                name: 'plus',
                type: 'sfSymbol',
            },
            onPress: handleCreateTeam,
        },
    ], [handleCreateTeam]);

    const headerRightItems = useCallback(() => [
        {
            type: 'menu',
            label: 'Options',
            icon: {
                name: 'ellipsis.circle',
                type: 'sfSymbol',
            },
            menu: {
                title: 'Team Options',
                items: [
                    {
                        type: 'action',
                        label: 'Create Team',
                        onPress: handleCreateTeam,
                        icon: {
                            name: 'plus.circle',
                            type: 'sfSymbol',
                        },
                    },
                    {
                        type: 'action',
                        label: 'Join Team',
                        onPress: handleJoinTeam,
                        icon: {
                            name: 'person.2.badge.plus',
                            type: 'sfSymbol',
                        },
                    },
                ],
            },
        },
    ], [handleCreateTeam, handleJoinTeam]);

    const indexScreenOptions = useMemo(() => ({
        headerLargeTitle: true,
        title: 'Teams',
        unstable_headerLeftItems: headerLeftItems,
        unstable_headerRightItems: headerRightItems,
    }), [headerLeftItems, headerRightItems]);

    return (
        <Stack
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
                options={indexScreenOptions}
            />
            <Stack.Screen name="[id]/index" />
            <Stack.Screen name="[id]/edit" options={{ title: 'Edit Team' }} />
        </Stack>
    );
}
