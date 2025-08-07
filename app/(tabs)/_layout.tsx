import { Tabs } from 'expo-router';
import { Calculator, FlaskConical } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          color: '#1E293B',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Basic',
          tabBarIcon: ({ size, color }) => (
            <Calculator size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="scientific"
        options={{
          title: 'Science',
          tabBarIcon: ({ size, color }) => (
            <FlaskConical size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}