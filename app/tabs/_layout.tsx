import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../lib/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007BFF',
        sceneStyle: { backgroundColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: '/tabs',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="event" color={color} />,
        }}
      />
      {user?.isAdmin && (
        <Tabs.Screen
          name="booking"
          options={{
            title: 'Book Room',
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add-circle" color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
