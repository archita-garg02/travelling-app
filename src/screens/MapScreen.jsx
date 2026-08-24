import React, {useRef, useState} from 'react';
import {
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const API_BASE_URL = 'http://10.0.2.2:8000';

const DEFAULT_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function MapScreen() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  const [
    currentLocationText,
    setCurrentLocationText,
  ] = useState('');

  const [
    destinationText,
    setDestinationText,
  ] = useState('');

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] =
    useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'TravelMate Location Permission',
          message:
            'TravelMate needs your location to show maps, weather and nearby cafes.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        },
      );

      return (
        result ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (permissionError) {
      console.log(
        'Permission error:',
        permissionError,
      );

      return false;
    }
  };

  const getAddressFromCoordinates =
    async coordinates => {
      try {
        const url =
          `${API_BASE_URL}/reverse-geocode` +
          `?latitude=${coordinates.latitude}` +
          `&longitude=${coordinates.longitude}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || 'Unable to find address',
          );
        }

        return data.address;
      } catch (addressError) {
        console.log(
          'Reverse-geocoding error:',
          addressError,
        );

        return `${coordinates.latitude.toFixed(
          5,
        )}, ${coordinates.longitude.toFixed(5)}`;
      }
    };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');

    const permissionGranted =
      await requestLocationPermission();

    if (!permissionGranted) {
      setError('Location permission was denied.');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const currentCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(currentCoordinates);
        setCurrentLocationText(
          'Finding address...',
        );

        mapRef.current?.animateToRegion(
          {
            ...currentCoordinates,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          800,
        );

        const readableAddress =
          await getAddressFromCoordinates(
            currentCoordinates,
          );

        setCurrentLocationText(readableAddress);

        if (destination) {
          await calculateRoute(
            currentCoordinates,
            destination,
          );
        }

        setLoading(false);
      },
      locationError => {
        console.log(
          'Location error:',
          locationError.code,
          locationError.message,
        );

        setError(
          'Unable to find your location. Please check that GPS is enabled.',
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const calculateRoute = async (
    startCoordinates,
    destinationCoordinates,
  ) => {
    if (!startCoordinates || !destinationCoordinates) {
      return;
    }

    setRouteLoading(true);
    setError('');

    const query =
      `start_latitude=${startCoordinates.latitude}` +
      `&start_longitude=${startCoordinates.longitude}` +
      `&destination_latitude=${destinationCoordinates.latitude}` +
      `&destination_longitude=${destinationCoordinates.longitude}`;

    try {
      const response = await fetch(
        `${API_BASE_URL}/route?${query}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to calculate route',
        );
      }

      setRouteCoordinates(data.route_coordinates);
      setRouteInfo({
        distance: data.distance_km,
        duration: data.duration_minutes,
      });

      mapRef.current?.fitToCoordinates(
        data.route_coordinates,
        {
          edgePadding: {
            top: 120,
            right: 60,
            bottom: 120,
            left: 60,
          },
          animated: true,
        },
      );
    } catch (routeError) {
      console.log('Route error:', routeError);

      setRouteCoordinates([
        startCoordinates,
        destinationCoordinates,
      ]);
      setRouteInfo(null);
      setError(
        routeError.message ||
          'Unable to calculate road route.',
      );
    } finally {
      setRouteLoading(false);
    }
  };

  const searchDestination = async () => {
    const searchText = destinationText.trim();

    if (searchText.length < 2) {
      setError('Please enter a destination.');
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const url =
        `${API_BASE_URL}/geocode?address=` +
        encodeURIComponent(searchText);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Unable to find destination',
        );
      }

      const destinationCoordinates = {
        latitude: data.latitude,
        longitude: data.longitude,
      };

      setDestination(destinationCoordinates);
      setDestinationText(data.address);

      if (location) {
        await calculateRoute(
          location,
          destinationCoordinates,
        );
      } else {
        mapRef.current?.animateToRegion(
          {
            ...destinationCoordinates,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          },
          800,
        );
      }
    } catch (searchError) {
      console.log(
        'Destination search error:',
        searchError,
      );

      setError(
        searchError.message ||
          'Unable to search for destination.',
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const selectDestination = async event => {
    const selectedCoordinate =
      event.nativeEvent.coordinate;

    const destinationCoordinates = {
      latitude: selectedCoordinate.latitude,
      longitude: selectedCoordinate.longitude,
    };

    setDestination(destinationCoordinates);

    setDestinationText(
      `${destinationCoordinates.latitude.toFixed(
        5,
      )}, ${destinationCoordinates.longitude.toFixed(
        5,
      )}`,
    );

    if (location) {
      await calculateRoute(
        location,
        destinationCoordinates,
      );
    }
  };

  const handleDestinationTextChange = text => {
    setDestinationText(text);
    setDestination(null);
    setRouteCoordinates([]);
    setRouteInfo(null);
    setError('');
  };

  const clearDestination = () => {
    setDestination(null);
    setDestinationText('');
    setRouteCoordinates([]);
    setRouteInfo(null);
    setError('');
  };

  const startGoogleMapsNavigation = async () => {
    if (!destination) {
      setError('Please select a destination first.');
      return;
    }

    const destinationQuery =
      `${destination.latitude},${destination.longitude}`;

    const googleMapsNavigationUrl =
      `google.navigation:q=${destinationQuery}&mode=d`;

    const browserFallbackUrl =
      'https://www.google.com/maps/dir/?api=1' +
      `&destination=${encodeURIComponent(destinationQuery)}` +
      '&travelmode=driving&dir_action=navigate';

    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(googleMapsNavigationUrl);
      } else {
        await Linking.openURL(browserFallbackUrl);
      }
    } catch (navigationError) {
      console.log(
        'Google Maps navigation error:',
        navigationError,
      );

      try {
        await Linking.openURL(browserFallbackUrl);
      } catch (fallbackError) {
        console.log(
          'Google Maps fallback error:',
          fallbackError,
        );

        setError(
          'Unable to open Google Maps. Please install or enable it.',
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Explore Map
        </Text>

        <Text style={styles.subtitle}>
          Choose your starting point and destination
        </Text>
      </View>

      {/* Location inputs */}
      <View style={styles.locationInputsCard}>
        {/* Current location */}
        <View style={styles.inputRow}>
          <View style={styles.currentDot} />

          <TextInput
            style={styles.locationInput}
            value={currentLocationText}
            placeholder={
              loading
                ? 'Finding your location...'
                : 'Use your current location'
            }
            placeholderTextColor="#94A3B8"
            editable={false}
            numberOfLines={1}
          />

          <Pressable
            style={[
              styles.currentLocationButton,
              loading && styles.disabledButton,
            ]}
            onPress={getCurrentLocation}
            disabled={loading}>
            <Text
              style={
                styles.currentLocationButtonText
              }>
              {loading ? '...' : '⌖'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputDivider} />

        {/* Destination */}
        <View style={styles.inputRow}>
          <View style={styles.destinationDot} />

          <TextInput
            style={styles.locationInput}
            value={destinationText}
            onChangeText={
              handleDestinationTextChange
            }
            onSubmitEditing={searchDestination}
            placeholder="Enter destination"
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
            editable={!searchLoading}
            numberOfLines={1}
          />

          <Pressable
            style={[
              styles.searchButton,
              searchLoading &&
                styles.disabledButton,
            ]}
            onPress={searchDestination}
            disabled={searchLoading}>
            <Text style={styles.searchButtonText}>
              {searchLoading ? '...' : 'Search'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.attribution}>
        Search data © OpenStreetMap contributors
      </Text>

      {/* Error */}
      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          onPress={selectDestination}
          showsUserLocation={location !== null}
          showsMyLocationButton={false}
          showsCompass={true}
          showsTraffic={false}
          toolbarEnabled={false}>

          {location && (
            <Marker
              coordinate={location}
              title="Your Location"
              description={currentLocationText}
              pinColor="#22C55E"
            />
          )}

          {destination && (
            <Marker
              coordinate={destination}
              title="Selected Destination"
              description={destinationText}
              pinColor="#DC2626"
            />
          )}

          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF6B35"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {routeLoading && (
          <View style={styles.routeLoadingCard}>
            <Text style={styles.routeLoadingText}>
              Calculating route...
            </Text>
          </View>
        )}

        {routeInfo && !routeLoading && (
          <View style={styles.routeInfoCard}>
            <View style={styles.routeInfoSection}>
              <Text style={styles.routeInfoLabel}>
                Distance
              </Text>
              <Text style={styles.routeInfoValue}>
                {routeInfo.distance} km
              </Text>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routeInfoSection}>
              <Text style={styles.routeInfoLabel}>
                Estimated time
              </Text>
              <Text style={styles.routeInfoValue}>
                {routeInfo.duration} min
              </Text>
            </View>
          </View>
        )}

        {routeInfo && !routeLoading && (
          <Pressable
            style={styles.startNavigationButton}
            onPress={startGoogleMapsNavigation}>
            <Text style={styles.startNavigationIcon}>
              ➤
            </Text>
            <Text style={styles.startNavigationText}>
              Start Navigation
            </Text>
          </Pressable>
        )}

        {!destination && (
          <View style={styles.mapInstruction}>
            <Text
              style={styles.mapInstructionText}>
              Search above or tap the map
            </Text>
          </View>
        )}

        {destination && (
          <Pressable
            style={
              styles.clearDestinationButton
            }
            onPress={clearDestination}>
            <Text
              style={
                styles.clearDestinationText
              }>
              Clear destination
            </Text>
          </Pressable>
        )}
      </View>

    </SafeAreaView>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },

  title: {
    color: '#1E293B',
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },

  locationInputsCard: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },

  currentDot: {
    width: 12,
    height: 12,
    backgroundColor: '#22C55E',
    borderRadius: 6,
    marginRight: 12,
  },

  destinationDot: {
    width: 12,
    height: 12,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    marginRight: 12,
  },

  locationInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    paddingVertical: 10,
  },

  inputDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 24,
  },

  currentLocationButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1EB',
    borderRadius: 19,
  },

  currentLocationButtonText: {
    color: '#FF6B35',
    fontSize: 24,
    fontWeight: '700',
  },

  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FF6B35',
    borderRadius: 9,
    marginLeft: 7,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },

  attribution: {
    color: '#64748B',
    fontSize: 10,
    textAlign: 'right',
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 8,
  },

  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },

  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },

  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 22,
    overflow: 'hidden',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  routeLoadingCard: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
  },

  routeLoadingText: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '700',
  },

  routeInfoCard: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 14,
    elevation: 5,
  },

  routeInfoSection: {
    flex: 1,
    alignItems: 'center',
  },

  routeInfoLabel: {
    color: '#64748B',
    fontSize: 11,
  },

  routeInfoValue: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  routeDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#E2E8F0',
  },

  startNavigationButton: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    elevation: 5,
  },

  startNavigationIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 7,
  },

  startNavigationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  mapInstruction: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 20,
  },

  mapInstructionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  clearDestinationButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
  },

  clearDestinationText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
});