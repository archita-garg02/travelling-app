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
      Alert.alert('Error', 'Unable to load your account information.');
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
    return <ProviderRideScreen user={user} navigation={navigation} />;
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
      Alert.alert('Pickup required', 'Please enter your pickup location.');
      return;
    }

    if (!destinationAddress.trim()) {
      Alert.alert('Destination required', 'Please enter your destination.');
      return;
    }

    try {
      setBookingServiceId(serviceId);
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert('Login required', 'Please log in again to book a ride.');
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Book a Ride</Text>
          <Text style={styles.subtitle}>Welcome, {user.full_name}</Text>

          <TouchableOpacity
            style={styles.myBookingsButton}
            onPress={() => navigation.navigate('MyBookingsScreen')}>
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

        <Text style={styles.sectionTitle}>Choose your ride</Text>
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
          style={[styles.button, searching && styles.disabledButton]}
          onPress={findRides}
          disabled={searching}>
          {searching ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Find Available Rides</Text>
          )}
        </TouchableOpacity>

        {availableServices.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Available rides</Text>
            {availableServices.map(service => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>
                    {service.vehicle_name}
                  </Text>
                  <Text style={styles.availableText}>Available</Text>
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
                <Text style={styles.serviceFare}>
                  ₹{service.base_fare} base fare + ₹{service.price_per_km}/km
                </Text>

                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    bookingServiceId === service.id && styles.disabledButton,
                  ]}
                  disabled={bookingServiceId === service.id}
                  onPress={() => bookRide(service.id)}>
                  {bookingServiceId === service.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.bookButtonText}>Book This Ride</Text>
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
      style={[styles.rideCard, selected && styles.selectedRideCard]}
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
    const unsubscribe = navigation.addListener('focus', loadMyServices);
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
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to load services');
      }

      setServices(data);
    } catch (error) {
      console.log('Provider services error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Provider Dashboard</Text>
          <Text style={styles.subtitle}>Welcome, {user.full_name}</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddServiceScreen')}>
          <Text style={styles.buttonText}>Add Vehicle Service</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My vehicle services</Text>

        {loadingServices ? (
          <ActivityIndicator size="large" color="#FF6B35" />
        ) : services.length === 0 ? (
          <View style={styles.providerCard}>
            <Text style={styles.providerIcon}>🚘</Text>
            <Text style={styles.providerTitle}>No vehicle service added</Text>
            <Text style={styles.providerDescription}>
              Add your vehicle so customers can find and book your service.
            </Text>
          </View>
        ) : (
          services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.vehicle_name}</Text>
                <Text
                  style={[
                    styles.status,
                    !service.is_available && styles.unavailableStatus,
                  ]}>
                  {service.is_available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
              <Text style={styles.vehicleNumber}>
                {service.vehicle_number}
              </Text>
              <Text style={styles.serviceDetail}>
                {service.service_type} • {service.seats} seats
              </Text>
              <Text style={styles.serviceDetail}>
                Operating city: {service.operating_city}
              </Text>
              <Text style={styles.serviceFare}>
                ₹{service.base_fare} base fare + ₹{service.price_per_km}/km
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default RideScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {color: '#64748B', fontSize: 16},
  content: {padding: 20, paddingBottom: 40},
  header: {marginBottom: 24},
  title: {color: '#0F172A', fontSize: 28, fontWeight: '700'},
  subtitle: {color: '#64748B', fontSize: 14, marginTop: 5},
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
  inputContainer: {flexDirection: 'row', alignItems: 'center'},
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
  line: {height: 1, backgroundColor: '#E2E8F0', marginVertical: 16},
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 14,
  },
  rideRow: {flexDirection: 'row', justifyContent: 'space-between'},
  rideCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },
  selectedRideCard: {borderColor: '#FF6B35', borderWidth: 2},
  rideIcon: {fontSize: 34},
  rideName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  ridePrice: {color: '#64748B', fontSize: 11, marginTop: 3},
  button: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 30,
    width: '100%',
  },
  addButton: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
  },
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  disabledButton: {opacity: 0.6},
  providerCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
  },
  providerIcon: {fontSize: 60},
  providerTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
  },
  providerDescription: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  serviceCard: {
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
  vehicleNumber: {color: '#64748B', fontSize: 13, marginBottom: 5},
  status: {color: '#16A34A', fontSize: 12, fontWeight: '700'},
  unavailableStatus: {color: '#DC2626'},
  availableText: {color: '#16A34A', fontSize: 12, fontWeight: '700'},
  serviceDetail: {color: '#64748B', fontSize: 14, marginTop: 4},
  serviceFare: {
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
  bookButtonText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700'},
});
