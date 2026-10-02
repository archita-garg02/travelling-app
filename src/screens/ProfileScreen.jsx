import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

function ProfileScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Profile loading error:', error);

      Alert.alert(
        'Error',
        'Unable to load your profile.',
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    const stackNavigation =
      navigation.getParent() || navigation;

    stackNavigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'accessToken',
                'user',
              ]);

              goToLogin();
            }catch (error) {
                console.log('Logout error:', error);
                console.log('Logout error message:', error?.message);

                Alert.alert(
                  'Logout error',
                  error?.message || String(error),
                );
              }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#FF6B35"
        />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>
          Profile unavailable
        </Text>

        <Text style={styles.emptyDescription}>
          Please log in to view your profile.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={goToLogin}>
          <Text style={styles.loginButtonText}>
            Go to Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayRole =
    user.role === 'PROVIDER'
      ? 'Service Provider'
      : 'Customer';

  const firstLetter =
    user.full_name?.charAt(0).toUpperCase() || 'T';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>
          My Profile
        </Text>

        <Text style={styles.pageSubtitle}>
          View your TravelMate account
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {firstLetter}
            </Text>
          </View>

          <Text style={styles.userName}>
            {user.full_name}
          </Text>

          <Text style={styles.userEmail}>
            {user.email}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {displayRole}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Account information
        </Text>

        <View style={styles.informationCard}>
          <InformationRow
            icon="👤"
            label="Full name"
            value={user.full_name}
          />

          <View style={styles.divider} />

          <InformationRow
            icon="✉️"
            label="Email"
            value={user.email}
          />

          <View style={styles.divider} />

          <InformationRow
            icon="☎️"
            label="Phone"
            value={user.phone || 'Not available'}
          />

          <View style={styles.divider} />

          <InformationRow
            icon="🪪"
            label="Account type"
            value={displayRole}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Travel activity
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('MyBookingsScreen')
          }>
          <View style={styles.menuIconContainer}>
            <Image
              source={require('../../assets/booking.png')}
              style={styles.menuIcon}
            />
          </View>

          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>
              My Bookings
            </Text>

            <Text style={styles.menuDescription}>
              View your current and previous ride bookings
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Image
            source={require('../../assets/logout.png')}
            style={styles.logoutIcon}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          TravelMate Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InformationRow({icon, label, value}) {
  return (
    <View style={styles.informationRow}>
      <Text style={styles.informationIcon}>
        {icon}
      </Text>

      <View style={styles.informationContent}>
        <Text style={styles.informationLabel}>
          {label}
        </Text>

        <Text
          style={styles.informationValue}
          numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F6F8FC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 35,
  },
  pageTitle: {
    color: '#172033',
    fontSize: 28,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 22,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#172033',
    borderRadius: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
    backgroundColor: '#FF6B35',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 44,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 14,
  },
  userEmail: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 5,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF20',
    borderRadius: 20,
    marginTop: 13,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 12,
  },
  informationCard: {
    paddingHorizontal: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 19,
  },
  informationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  informationIcon: {
    width: 32,
    fontSize: 21,
  },
  informationContent: {
    flex: 1,
    marginLeft: 8,
  },
  informationLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  informationValue: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 19,
  },
  menuIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: '#FFF1EB',
    borderRadius: 14,
  },
  menuIcon: {
    width: 25,
    height: 25,
    tintColor: '#FF6B35',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 13,
  },
  menuTitle: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '800',
  },
  menuDescription: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  arrow: {
    color: '#64748B',
    fontSize: 27,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    marginTop: 25,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    tintColor: '#E11D48',
    marginRight: 10,
  },
  logoutText: {
    color: '#E11D48',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 21,
    fontWeight: '800',
  },
  emptyDescription: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 7,
  },
  loginButton: {
    paddingHorizontal: 25,
    paddingVertical: 14,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 25,
  },
});
