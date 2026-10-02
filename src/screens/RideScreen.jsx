import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

const AVAILABLE_SERVICES_URL =
  'http://10.0.2.2:8000/services/available';
const MY_SERVICES_URL =
  'http://10.0.2.2:8000/services/my-services';
const BOOKINGS_URL = 'http://10.0.2.2:8000/bookings';

function RideScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoggedInUser();
  }, []);

  const loadLoggedInUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('User loading error:', error);
      Alert.alert(
        'Error',
        'Unable to load your account information.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Please log in to use Ride services.
        </Text>
      </SafeAreaView>
    );
  }

  if (user.role === 'PROVIDER') {
    return (
      <ProviderRideScreen
        user={user}
        navigation={navigation}
      />
    );
  }

  return (
    <CustomerRideScreen
      user={user}
      navigation={navigation}
    />
  );
}

function CustomerRideScreen({user, navigation}) {
  const [selectedRide, setSelectedRide] = useState('CAB');
  const [availableServices, setAvailableServices] = useState([]);
  const [searching, setSearching] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [bookingServiceId, setBookingServiceId] = useState(null);

  const findRides = async () => {
    try {
      setSearching(true);
      setAvailableServices([]);

      const url =
        `${AVAILABLE_SERVICES_URL}?service_type=${selectedRide}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to find rides');
      }

      setAvailableServices(data);

      if (data.length === 0) {
        Alert.alert(
          'No rides found',
          `No ${selectedRide.toLowerCase()} service is currently available.`,
        );
      }
    } catch (error) {
      console.log('Ride search error:', error);
      Alert.alert(
        'Connection error',
        'Unable to connect to the TravelMate server.',
      );
    } finally {
      setSearching(false);
    }
  };

  const bookRide = async serviceId => {
    if (!pickupAddress.trim()) {
      Alert.alert(
        'Pickup required',
        'Please enter your pickup location.',
      );
      return;
    }

    if (!destinationAddress.trim()) {
      Alert.alert(
        'Destination required',
        'Please enter your destination.',
      );
      return;
    }

    try {
      setBookingServiceId(serviceId);
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert(
          'Login required',
          'Please log in again to book a ride.',
        );
        return;
      }

      const response = await fetch(BOOKINGS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: serviceId,
          pickup_address: pickupAddress.trim(),
          destination_address: destinationAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to create booking');
      }

      Alert.alert(
        'Booking created',
        `Your booking #${data.id} is pending.`,
      );
      setAvailableServices([]);
    } catch (error) {
      console.log('Booking error:', error);
      Alert.alert('Booking failed', error.message);
    } finally {
      setBookingServiceId(null);
    }
  };

  return (
    <SafeAreaView style={styles.customerContainer}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.customerHeader}>
          <Text style={styles.customerTitle}>Book a Ride</Text>
          <Text style={styles.customerSubtitle}>
            Welcome, {user.full_name}
          </Text>

          <TouchableOpacity
            style={styles.myBookingsButton}
            onPress={() =>
              navigation.navigate('MyBookingsScreen')
            }>
            <Text style={styles.myBookingsButtonText}>
              View My Bookings
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.inputLabel}>Pickup location</Text>
          <View style={styles.inputContainer}>
            <View style={styles.pickupDot} />
            <TextInput
              style={styles.input}
              placeholder="Enter pickup location"
              placeholderTextColor="#94A3B8"
              value={pickupAddress}
              onChangeText={setPickupAddress}
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
              value={destinationAddress}
              onChangeText={setDestinationAddress}
            />
          </View>
        </View>

        <Text style={styles.customerSectionTitle}>
          Choose your ride
        </Text>

        <View style={styles.rideRow}>
          <RideOption
            icon="🛵"
            name="Bike"
            description="Affordable"
            selected={selectedRide === 'BIKE'}
            onPress={() => setSelectedRide('BIKE')}
          />
          <RideOption
            icon="🛺"
            name="Auto"
            description="Quick ride"
            selected={selectedRide === 'AUTO'}
            onPress={() => setSelectedRide('AUTO')}
          />
          <RideOption
            icon="🚕"
            name="Cab"
            description="Comfortable"
            selected={selectedRide === 'CAB'}
            onPress={() => setSelectedRide('CAB')}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.customerPrimaryButton,
            searching && styles.disabledButton,
          ]}
          onPress={findRides}
          disabled={searching}>
          {searching ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Find Available Rides
            </Text>
          )}
        </TouchableOpacity>

        {availableServices.length > 0 && (
          <>
            <Text style={styles.customerSectionTitle}>
              Available rides
            </Text>

            {availableServices.map(service => (
              <View
                key={service.id}
                style={styles.customerServiceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>
                    {service.vehicle_name}
                  </Text>
                  <Text style={styles.customerAvailableText}>
                    Available
                  </Text>
                </View>

                <Text style={styles.serviceDetail}>
                  Type: {service.service_type}
                </Text>
                <Text style={styles.serviceDetail}>
                  Vehicle number: {service.vehicle_number}
                </Text>
                <Text style={styles.serviceDetail}>
                  Seats: {service.seats}
                </Text>
                <Text style={styles.serviceDetail}>
                  City: {service.operating_city}
                </Text>
                <Text style={styles.customerServiceFare}>
                  ₹{service.base_fare} base fare + ₹{service.price_per_km}/km
                </Text>

                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    bookingServiceId === service.id &&
                      styles.disabledButton,
                  ]}
                  disabled={bookingServiceId === service.id}
                  onPress={() => bookRide(service.id)}>
                  {bookingServiceId === service.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.bookButtonText}>
                      Book This Ride
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RideOption({icon, name, description, selected, onPress}) {
  return (
    <TouchableOpacity
      style={[
        styles.rideCard,
        selected && styles.selectedRideCard,
      ]}
      onPress={onPress}>
      <Text style={styles.rideIcon}>{icon}</Text>
      <Text style={styles.rideName}>{name}</Text>
      <Text style={styles.ridePrice}>{description}</Text>
    </TouchableOpacity>
  );
}

function ProviderRideScreen({user, navigation}) {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      loadMyServices,
    );

    return unsubscribe;
  }, [navigation]);

  const loadMyServices = async () => {
    try {
      setLoadingServices(true);
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        setServices([]);
        return;
      }

      const response = await fetch(MY_SERVICES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to load services');
      }

      setServices(data);
    } catch (error) {
      console.log('Provider services error:', error);
      Alert.alert('Unable to load services', error.message);
    } finally {
      setLoadingServices(false);
    }
  };

  const availableCount = services.filter(
    service => service.is_available,
  ).length;

  return (
    <SafeAreaView style={styles.providerContainer}>
      <ScrollView
        contentContainerStyle={styles.providerContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.providerHero}>
          <View style={styles.providerBadge}>
            <Text style={styles.providerBadgeText}>
              SERVICE PROVIDER
            </Text>
          </View>

          <Text style={styles.providerHeroTitle}>
            Provider Dashboard
          </Text>
          <Text style={styles.providerHeroSubtitle}>
            Welcome, {user.full_name}
          </Text>

          <View style={styles.providerStatsRow}>
            <ProviderStat
              value={services.length}
              label="Total services"
            />
            <View style={styles.providerStatsDivider} />
            <ProviderStat
              value={availableCount}
              label="Available"
            />
          </View>
        </View>

        <Text style={styles.providerSectionTitle}>
          Quick actions
        </Text>

        <View style={styles.providerActionsRow}>
          <ProviderAction
            icon="＋"
            title="Add Service"
            description="Register a vehicle"
            onPress={() =>
              navigation.navigate('AddServiceScreen')
            }
          />

          <ProviderAction
            icon="📋"
            title="Bookings"
            description="View ride requests"
            onPress={() =>
              navigation.navigate('MyBookingsScreen')
            }
          />
        </View>

        <View style={styles.providerSectionHeader}>
          <Text style={styles.providerSectionTitleNoMargin}>
            My vehicle services
          </Text>

          <TouchableOpacity onPress={loadMyServices}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loadingServices ? (
          <View style={styles.providerLoadingCard}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.providerLoadingText}>
              Loading your services...
            </Text>
          </View>
        ) : services.length === 0 ? (
          <View style={styles.emptyProviderCard}>
            <View style={styles.emptyProviderIconCircle}>
              <Text style={styles.emptyProviderIcon}>🚘</Text>
            </View>

            <Text style={styles.emptyProviderTitle}>
              No vehicle service added
            </Text>
            <Text style={styles.emptyProviderDescription}>
              Add your first vehicle so customers can find and book your service.
            </Text>

            <TouchableOpacity
              style={styles.emptyProviderButton}
              onPress={() =>
                navigation.navigate('AddServiceScreen')
              }>
              <Text style={styles.emptyProviderButtonText}>
                Add First Service
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          services.map(service => (
            <ProviderServiceCard
              key={service.id}
              service={service}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProviderStat({value, label}) {
  return (
    <View style={styles.providerStat}>
      <Text style={styles.providerStatValue}>{value}</Text>
      <Text style={styles.providerStatLabel}>{label}</Text>
    </View>
  );
}

function ProviderAction({icon, title, description, onPress}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.providerActionCard}
      onPress={onPress}>
      <View style={styles.providerActionIconContainer}>
        <Text style={styles.providerActionIcon}>{icon}</Text>
      </View>
      <Text style={styles.providerActionTitle}>{title}</Text>
      <Text style={styles.providerActionDescription}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

function ProviderServiceCard({service}) {
  const available = service.is_available;

  return (
    <View style={styles.providerServiceCard}>
      <View style={styles.providerVehicleRow}>
        <View style={styles.providerVehicleIconBox}>
          <Text style={styles.providerVehicleIcon}>🚘</Text>
        </View>

        <View style={styles.providerVehicleHeading}>
          <Text style={styles.providerServiceName}>
            {service.vehicle_name}
          </Text>
          <Text style={styles.providerVehicleNumber}>
            {service.vehicle_number}
          </Text>
        </View>

        <View
          style={[
            styles.providerStatusPill,
            !available && styles.providerUnavailablePill,
          ]}>
          <View
            style={[
              styles.providerStatusDot,
              !available && styles.providerUnavailableDot,
            ]}
          />
          <Text
            style={[
              styles.providerStatusText,
              !available && styles.providerUnavailableText,
            ]}>
            {available ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.providerDetailsGrid}>
        <ProviderDetail
          label="Service type"
          value={service.service_type}
        />
        <ProviderDetail
          label="Seats"
          value={String(service.seats)}
        />
        <ProviderDetail
          label="Operating city"
          value={service.operating_city}
        />
        <ProviderDetail
          label="Price per km"
          value={`₹${service.price_per_km}`}
        />
      </View>

      <View style={styles.providerFareRow}>
        <Text style={styles.providerFareLabel}>Base fare</Text>
        <Text style={styles.providerFareValue}>
          ₹{service.base_fare}
        </Text>
      </View>
    </View>
  );
}

function ProviderDetail({label, value}) {
  return (
    <View style={styles.providerDetailItem}>
      <Text style={styles.providerDetailLabel}>{label}</Text>
      <Text style={styles.providerDetailValue}>{value}</Text>
    </View>
  );
}

export default RideScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#64748B',
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  customerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  customerHeader: {
    marginBottom: 24,
  },
  customerTitle: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '700',
  },
  customerSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 5,
  },
  myBookingsButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#FFF1EB',
    borderRadius: 10,
    marginTop: 14,
  },
  myBookingsButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '700',
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
  customerSectionTitle: {
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
  selectedRideCard: {
    borderColor: '#FF6B35',
    borderWidth: 2,
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
  customerPrimaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 30,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  customerServiceCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    flex: 1,
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  customerAvailableText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceDetail: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
  customerServiceFare: {
    color: '#FF6B35',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  bookButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    marginTop: 16,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  providerContainer: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  providerContent: {
    padding: 20,
    paddingBottom: 45,
  },
  providerHero: {
    padding: 22,
    backgroundColor: '#172554',
    borderRadius: 24,
  },
  providerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#2563EB',
    borderRadius: 20,
  },
  providerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  providerHeroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 14,
  },
  providerHeroSubtitle: {
    color: '#BFDBFE',
    fontSize: 14,
    marginTop: 5,
  },
  providerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 19,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF20',
  },
  providerStat: {
    flex: 1,
  },
  providerStatValue: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },
  providerStatLabel: {
    color: '#BFDBFE',
    fontSize: 11,
    marginTop: 3,
  },
  providerStatsDivider: {
    width: 1,
    height: 37,
    backgroundColor: '#FFFFFF25',
    marginHorizontal: 20,
  },
  providerSectionTitle: {
    color: '#172554',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 13,
  },
  providerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerActionCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E3FC',
    borderRadius: 18,
  },
  providerActionIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    backgroundColor: '#DBEAFE',
    borderRadius: 13,
  },
  providerActionIcon: {
    color: '#1D4ED8',
    fontSize: 22,
    fontWeight: '800',
  },
  providerActionTitle: {
    color: '#172554',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  providerActionDescription: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  providerSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 13,
  },
  providerSectionTitleNoMargin: {
    color: '#172554',
    fontSize: 18,
    fontWeight: '800',
  },
  refreshText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  providerLoadingCard: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  providerLoadingText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 12,
  },
  emptyProviderCard: {
    alignItems: 'center',
    padding: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E3FC',
    borderRadius: 20,
  },
  emptyProviderIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    backgroundColor: '#DBEAFE',
    borderRadius: 38,
  },
  emptyProviderIcon: {
    fontSize: 38,
  },
  emptyProviderTitle: {
    color: '#172554',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 17,
  },
  emptyProviderDescription: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 7,
  },
  emptyProviderButton: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    backgroundColor: '#2563EB',
    borderRadius: 13,
    marginTop: 20,
  },
  emptyProviderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  providerServiceCard: {
    padding: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7E3FC',
    borderRadius: 19,
    marginBottom: 14,
  },
  providerVehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerVehicleIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 49,
    height: 49,
    backgroundColor: '#DBEAFE',
    borderRadius: 14,
  },
  providerVehicleIcon: {
    fontSize: 25,
  },
  providerVehicleHeading: {
    flex: 1,
    marginLeft: 12,
  },
  providerServiceName: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '800',
  },
  providerVehicleNumber: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
  },
  providerStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
  },
  providerUnavailablePill: {
    backgroundColor: '#FEE2E2',
  },
  providerStatusDot: {
    width: 7,
    height: 7,
    backgroundColor: '#16A34A',
    borderRadius: 4,
    marginRight: 5,
  },
  providerUnavailableDot: {
    backgroundColor: '#DC2626',
  },
  providerStatusText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
  },
  providerUnavailableText: {
    color: '#B91C1C',
  },
  providerDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  providerDetailItem: {
    width: '50%',
    marginBottom: 13,
  },
  providerDetailLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  providerDetailValue: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  providerFareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  providerFareLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  providerFareValue: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '800',
  },
});
