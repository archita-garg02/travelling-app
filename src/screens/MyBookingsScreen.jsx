import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const MY_BOOKINGS_URL =
  'http://10.0.2.2:8000/bookings/my-bookings';

function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert('Login required', 'Please log in again.');
        setBookings([]);
        return;
      }

      const response = await fetch(MY_BOOKINGS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to load bookings');
      }

      setBookings(data);
    } catch (error) {
      console.log('Booking loading error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, []),
  );

  const refreshBookings = () => {
    setRefreshing(true);
    loadBookings(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshBookings}
            colors={['#FF6B35']}
          />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Your recent ride requests</Text>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🧳</Text>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyDescription}>
              Your booked rides will appear here.
            </Text>
          </View>
        ) : (
          bookings.map(booking => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.bookingNumber}>
                  Booking #{booking.id}
                </Text>
                <Text
                  style={[
                    styles.status,
                    booking.status === 'COMPLETED' && styles.completedStatus,
                    booking.status === 'CANCELLED' && styles.cancelledStatus,
                  ]}>
                  {booking.status}
                </Text>
              </View>

              <Text style={styles.label}>Pickup</Text>
              <Text style={styles.address}>{booking.pickup_address}</Text>

              <View style={styles.divider} />

              <Text style={styles.label}>Destination</Text>
              <Text style={styles.address}>
                {booking.destination_address}
              </Text>

              <Text style={styles.date}>
                Created: {new Date(booking.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 5,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 52,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDescription: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 6,
  },
  bookingCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  bookingNumber: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },
  status: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  completedStatus: {
    color: '#16A34A',
  },
  cancelledStatus: {
    color: '#DC2626',
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    color: '#334155',
    fontSize: 15,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 18,
  },
});
