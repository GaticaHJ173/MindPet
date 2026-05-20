import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Background, HeaderTitle } from '@react-navigation/elements';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tabs
      	screenOptions={{
        	tabBarActiveTintColor: '#9183af',
        	headerShown: false,
        	tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={26} name="house.fill" color={
            focused ? '#9183af' : '#8E8E8F'
          } />,
        }}
      />
      <Tabs.Screen
        name="diario"
        options={{
          title: 'Diario',
          tabBarIcon: ({ color }) => <MaterialIcons name="event-note" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mascota"
        options={{
          title: 'Mascota',
          tabBarIcon: ({ color }) => <MaterialIcons name="pets" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habitos"
        options={{
          title: 'Hábitos',
          tabBarIcon: ({ color }) => <Fontisto name="check" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comunidad"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ color }) => <FontAwesome name="group" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}

const style = ({
  color: {
    backgroundColor: '#9183af',
  }

});