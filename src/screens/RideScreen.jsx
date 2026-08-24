import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

function RideScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Book a Ride</Text>
          <Text style={styles.subtitle}>
            Choose your destination and ride
          </Text>
        </View>

        {/* Location card */}
        <View style={styles.locationCard}>
          <Text style={styles.inputLabel}>Pickup location</Text>

          <View style={styles.inputContainer}>
            <View style={styles.pickupDot} />

            <TextInput
              style={styles.input}
              placeholder="Enter pickup location"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.line} />

          <Text style={styles.inputLabel}>Destination</Text>

          <View style={styles.inputContainer}>
            <View style={styles.destinationDot} />

            <TextInput
              style={styles.input}
              placeholder="Where do you want to go?"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Ride options */}
        <Text style={styles.sectionTitle}>Choose your ride</Text>

        <View style={styles.rideRow}>
          <TouchableOpacity style={styles.rideCard}>
            <Text style={styles.rideIcon}>🛵</Text>
            <Text style={styles.rideName}>Bike</Text>
            <Text style={styles.ridePrice}>Affordable</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rideCard}>
            <Text style={styles.rideIcon}>🛺</Text>
            <Text style={styles.rideName}>Auto</Text>
            <Text style={styles.ridePrice}>Quick ride</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rideCard}>
            <Text style={styles.rideIcon}>🚕</Text>
            <Text style={styles.rideName}>Cab</Text>
            <Text style={styles.ridePrice}>Comfortable</Text>
          </TouchableOpacity>
        </View>

        {/* Booking button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find Available Rides</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
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

  locationCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
  },

  inputLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 7,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    paddingVertical: 8,
    marginLeft: 12,
  },

  pickupDot: {
    width: 12,
    height: 12,
    backgroundColor: '#22C55E',
    borderRadius: 6,
  },

  destinationDot: {
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },

  line: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },

  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 14,
  },

  rideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rideCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },

  rideIcon: {
    fontSize: 34,
  },

  rideName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },

  ridePrice: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },

  button: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});