import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
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
  const [currentLocationText, setCurrentLocationText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

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
            'TravelMate needs your location for maps and route navigation.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        },
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (permissionError) {
      console.log('Permission error:', permissionError);
      return false;
    }
  };

  const getAddressFromCoordinates = async coordinates => {
    try {
      const url =
        `${API_BASE_URL}/reverse-geocode` +
        `?latitude=${coordinates.latitude}` +
        `&longitude=${coordinates.longitude}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to find address');
      }

      return data.address;
    } catch (addressError) {
      console.log('Reverse-geocoding error:', addressError);
      return `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`;
    }
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
        throw new Error(data.detail || 'Unable to calculate route');
      }

      setRouteCoordinates(data.route_coordinates);
      setRouteInfo({
        distance: data.distance_km,
        duration: data.duration_minutes,
      });

      mapRef.current?.fitToCoordinates(data.route_coordinates, {
        edgePadding: {
          top: 100,
          right: 55,
          bottom: 150,
          left: 55,
        },
        animated: true,
      });
    } catch (routeError) {
      console.log('Route error:', routeError);
      setRouteCoordinates([
        startCoordinates,
        destinationCoordinates,
      ]);
      setRouteInfo(null);
      setError(
        routeError.message || 'Unable to calculate road route.',
      );
    } finally {
      setRouteLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError('');

    const permissionGranted = await requestLocationPermission();

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
        setCurrentLocationText('Finding address...');

        mapRef.current?.animateToRegion(
          {
            ...currentCoordinates,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          800,
        );

        const readableAddress = await getAddressFromCoordinates(
          currentCoordinates,
        );
        setCurrentLocationText(readableAddress);

        if (destination) {
          await calculateRoute(currentCoordinates, destination);
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
          data.detail || 'Unable to find destination',
        );
      }

      const destinationCoordinates = {
        latitude: data.latitude,
        longitude: data.longitude,
      };

      setDestination(destinationCoordinates);
      setDestinationText(data.address);

      if (location) {
        await calculateRoute(location, destinationCoordinates);
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
      console.log('Destination search error:', searchError);
      setError(
        searchError.message ||
          'Unable to search for destination.',
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const selectDestination = async event => {
    const selectedCoordinate = event.nativeEvent.coordinate;
    const destinationCoordinates = {
      latitude: selectedCoordinate.latitude,
      longitude: selectedCoordinate.longitude,
    };

    setDestination(destinationCoordinates);
    setDestinationText(
      `${destinationCoordinates.latitude.toFixed(5)}, ${destinationCoordinates.longitude.toFixed(5)}`,
    );

    if (location) {
      await calculateRoute(location, destinationCoordinates);
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
      console.log('Google Maps navigation error:', navigationError);

      try {
        await Linking.openURL(browserFallbackUrl);
      } catch (fallbackError) {
        console.log('Google Maps fallback error:', fallbackError);
        setError(
          'Unable to open Google Maps. Please install or enable it.',
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ROUTE PLANNER</Text>
          <Text style={styles.title}>Explore Map</Text>
          <Text style={styles.subtitle}>
            Search a destination or tap on the map
          </Text>
        </View>

        <View style={styles.headerIconBox}>
          <Text style={styles.headerIcon}>🧭</Text>
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.routeDotsColumn}>
          <View style={styles.currentDot} />
          <View style={styles.routeDotLine} />
          <View style={styles.destinationDot} />
        </View>

        <View style={styles.inputsColumn}>
          <View style={styles.inputRow}>
            <View style={styles.inputTextBlock}>
              <Text style={styles.inputLabel}>CURRENT LOCATION</Text>
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
            </View>

            <Pressable
              style={[
                styles.currentLocationButton,
                loading && styles.disabledButton,
              ]}
              onPress={getCurrentLocation}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Text style={styles.currentLocationIcon}>⌖</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.inputDivider} />

          <View style={styles.inputRow}>
            <View style={styles.inputTextBlock}>
              <Text style={styles.inputLabel}>DESTINATION</Text>
              <TextInput
                style={styles.locationInput}
                value={destinationText}
                onChangeText={handleDestinationTextChange}
                onSubmitEditing={searchDestination}
                placeholder="Where do you want to go?"
                placeholderTextColor="#94A3B8"
                returnKeyType="search"
                editable={!searchLoading}
                numberOfLines={1}
              />
            </View>

            <Pressable
              style={[
                styles.searchButton,
                searchLoading && styles.disabledButton,
              ]}
              onPress={searchDestination}
              disabled={searchLoading}>
              {searchLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorSymbol}>!</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

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
              strokeColor="#2563EB"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        <View style={styles.mapBrandBadge}>
          <Text style={styles.mapBrandText}>TravelMate Maps</Text>
        </View>

        {routeLoading && (
          <View style={styles.routeLoadingCard}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.routeLoadingText}>
              Calculating best route...
            </Text>
          </View>
        )}

        {!destination && !routeLoading && (
          <View style={styles.mapInstruction}>
            <Text style={styles.mapInstructionIcon}>⌖</Text>
            <Text style={styles.mapInstructionText}>
              Tap anywhere to choose a destination
            </Text>
          </View>
        )}

        {destination && (
          <Pressable
            style={styles.clearButton}
            onPress={clearDestination}>
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        )}

        {routeInfo && !routeLoading && (
          <View style={styles.routePanel}>
            <View style={styles.routeSummaryRow}>
              <RouteMetric
                label="DISTANCE"
                value={`${routeInfo.distance} km`}
              />
              <View style={styles.routeDivider} />
              <RouteMetric
                label="ESTIMATED TIME"
                value={`${routeInfo.duration} min`}
              />

              <Pressable
                style={styles.navigationButton}
                onPress={startGoogleMapsNavigation}>
                <Text style={styles.navigationIcon}>➤</Text>
                <Text style={styles.navigationText}>Start</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.attribution}>
        Route and search data from OpenStreetMap and OSRM
      </Text>
    </SafeAreaView>
  );
}

function RouteMetric({label, value}) {
  return (
    <View style={styles.routeMetric}>
      <Text style={styles.routeMetricLabel}>{label}</Text>
      <Text style={styles.routeMetricValue}>{value}</Text>
    </View>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: '#172033',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 3,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  headerIconBox: {
    width: 47,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 15,
  },
  headerIcon: {
    fontSize: 24,
  },
  locationCard: {
    flexDirection: 'row',
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    marginHorizontal: 16,
    elevation: 3,
  },
  routeDotsColumn: {
    width: 22,
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 22,
  },
  currentDot: {
    width: 11,
    height: 11,
    backgroundColor: '#22C55E',
    borderRadius: 6,
  },
  routeDotLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  destinationDot: {
    width: 11,
    height: 11,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  inputsColumn: {
    flex: 1,
    marginLeft: 8,
  },
  inputRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTextBlock: {
    flex: 1,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  locationInput: {
    color: '#172033',
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
    paddingRight: 6,
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },
  currentLocationButton: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  currentLocationIcon: {
    color: '#2563EB',
    fontSize: 22,
    fontWeight: '800',
  },
  searchButton: {
    minWidth: 65,
    minHeight: 39,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FF6B35',
    borderRadius: 11,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  errorSymbol: {
    width: 22,
    height: 22,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 11,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 8,
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#D7E3FC',
    borderRadius: 23,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapBrandBadge: {
    position: 'absolute',
    top: 13,
    left: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#172554E8',
    borderRadius: 10,
  },
  mapBrandText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  routeLoadingCard: {
    position: 'absolute',
    top: 13,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
  },
  routeLoadingText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  mapInstruction: {
    position: 'absolute',
    bottom: 17,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#172554E8',
    borderRadius: 20,
  },
  mapInstructionIcon: {
    color: '#93C5FD',
    fontSize: 16,
    fontWeight: '800',
  },
  mapInstructionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
  clearButton: {
    position: 'absolute',
    top: 13,
    right: 13,
    width: 37,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
  },
  clearButtonText: {
    color: '#DC2626',
    fontSize: 25,
    lineHeight: 27,
    fontWeight: '500',
  },
  routePanel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 10,
    backgroundColor: '#FFFFFFF5',
    borderRadius: 17,
    elevation: 5,
  },
  routeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeMetric: {
    flex: 1,
    paddingHorizontal: 5,
  },
  routeMetricLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  routeMetricValue: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  routeDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    marginLeft: 7,
  },
  navigationIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  navigationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },
  attribution: {
    color: '#94A3B8',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
});
