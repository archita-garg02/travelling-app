import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>

          <TouchableOpacity>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileImage}
          />

          <Text style={styles.username}>Archita Garg</Text>

          <Text style={styles.email}>archita@example.com</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {/* My Bookings */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/booking.png')}
                style={styles.menuIcon}
              />
            </View>

            <Text style={styles.menuText}>My Bookings</Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Favorite Places */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/heart.png')}
                style={styles.menuIcon}
              />
            </View>

            <Text style={styles.menuText}>Favorite Places</Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/settings.png')}
                style={styles.menuIcon}
              />
            </View>

            <Text style={styles.menuText}>Settings</Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/help.png')}
                style={styles.menuIcon}
              />
            </View>

            <Text style={styles.menuText}>Help & Support</Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/logout.png')}
                style={styles.menuIcon}
              />
            </View>

            <Text style={[styles.menuText, styles.logoutText]}>
              Logout
            </Text>

            <Text style={[styles.arrow, styles.logoutText]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  editText: {
    fontSize: 16,
    fontWeight: '600',
  },

  /* Profile */
  profileContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  username: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: 'bold',
  },

  email: {
    marginTop: 5,
    fontSize: 15,
  },

  /* Stats */
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 25,
    marginTop: 30,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },

  stat: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  statLabel: {
    marginTop: 5,
    fontSize: 14,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: '#ccc',
  },

  /* Menu */
  menuContainer: {
    marginHorizontal: 25,
    marginTop: 30,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },

  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuIcon: {
    width: 24,
    height: 24,
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  arrow: {
    fontSize: 28,
  },

  logoutText: {
    color: '#d9534f',
  },
});