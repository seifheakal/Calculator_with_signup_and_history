import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { User, LogOut } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <User size={20} color="#3B82F6" strokeWidth={2} />
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <LogOut size={16} color="#64748B" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
});