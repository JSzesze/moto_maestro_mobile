import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <NativeTabs tintColor={tintColor}>
      <NativeTabs.Trigger name="home">
        <Icon src={<VectorIcon family={FontAwesome} name="home" />} />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="events">
        <Icon src={<VectorIcon family={FontAwesome} name="calendar" />} />
        <Label>Events</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="teams">
        <Icon src={<VectorIcon family={FontAwesome} name="users" />} />
        <Label>Teams</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon src={<VectorIcon family={FontAwesome} name="user" />} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
