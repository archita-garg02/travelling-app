import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {SafeAreaView} from 'react-native-safe-area-context';

const weatherDetails = code => {
  const conditions = {
    0: {label: 'Clear sky', icon: '☀️'},
    1: {label: 'Mainly clear', icon: '🌤️'},
    2: {label: 'Partly cloudy', icon: '⛅'},
    3: {label: 'Overcast', icon: '☁️'},
    45: {label: 'Foggy', icon: '🌫️'},
    48: {label: 'Foggy', icon: '🌫️'},
    51: {label: 'Light drizzle', icon: '🌦️'},
    53: {label: 'Drizzle', icon: '🌦️'},
    55: {label: 'Heavy drizzle', icon: '🌧️'},
    61: {label: 'Light rain', icon: '🌦️'},
    63: {label: 'Rain', icon: '🌧️'},
    65: {label: 'Heavy rain', icon: '🌧️'},
    71: {label: 'Light snow', icon: '🌨️'},
    73: {label: 'Snow', icon: '❄️'},
    75: {label: 'Heavy snow', icon: '❄️'},
    80: {label: 'Rain showers', icon: '🌦️'},
    81: {label: 'Rain showers', icon: '🌧️'},
    82: {label: 'Heavy showers', icon: '⛈️'},
    95: {label: 'Thunderstorm', icon: '⛈️'},
    96: {label: 'Thunderstorm', icon: '⛈️'},
    99: {label: 'Thunderstorm', icon: '⛈️'},
  };

  return conditions[code] || {
    label: 'Weather unavailable',
    icon: '🌡️',
  };
};

const formatDay = date =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
  });

function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('Your location');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeCoordinates, setActiveCoordinates] = useState(null);
  const [error, setError] = useState('');

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'TravelMate Location Permission',
        message:
          'TravelMate needs your location to show local weather.',
        buttonPositive: 'Allow',
        buttonNegative: 'Cancel',
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchWeather = async (
    coordinates,
    selectedLocationName = '',
  ) => {
    const {latitude, longitude} = coordinates;

    const weatherUrl =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,relative_humidity_2m,' +
      'apparent_temperature,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,' +
      'temperature_2m_min,precipitation_probability_max' +
      '&timezone=auto&forecast_days=5';

    const locationUrl =
      'https://nominatim.openstreetmap.org/reverse' +
      `?lat=${latitude}&lon=${longitude}` +
      '&format=jsonv2&zoom=10';

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error('Unable to load weather information.');
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData.current || !weatherData.daily) {
      throw new Error('The weather service returned incomplete data.');
    }

    setWeather(weatherData);
    setActiveCoordinates(coordinates);

    if (selectedLocationName) {
      setLocationName(selectedLocationName);
      return;
    }

    try {
      const locationResponse = await fetch(locationUrl, {
        headers: {
          'User-Agent': 'TravelMate/1.0',
          'Accept-Language': 'en',
        },
      });

      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        const address = locationData.address || {};

        setLocationName(
          address.city ||
            address.town ||
            address.village ||
            address.county ||
            'Your location',
        );
      }
    } catch (locationNameError) {
      console.log('Location-name error:', locationNameError);
      setLocationName('Your location');
    }
  };

  const loadWeather = async () => {
    setLoading(true);
    setError('');

    let permissionGranted = false;

    try {
      permissionGranted = await requestLocationPermission();
    } catch (permissionError) {
      console.log('Permission error:', permissionError);
      setError('Unable to request location permission.');
      setLoading(false);
      return;
    }

    if (!permissionGranted) {
      setError('Location permission was denied.');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          await fetchWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } catch (weatherError) {
          console.log('Weather error:', weatherError);
          setError(weatherError.message || 'Unable to load weather.');
        } finally {
          setLoading(false);
        }
      },
      locationError => {
        console.log('Location error:', locationError);
        setError(
          'Unable to find your location. Please enable GPS.',
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  };

  const searchLocation = async () => {
    const city = searchText.trim();

    if (city.length < 2) {
      setError('Please enter a city or location name.');
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const searchUrl =
        'https://geocoding-api.open-meteo.com/v1/search' +
        `?name=${encodeURIComponent(city)}` +
        '&count=1&language=en&format=json';

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error('Unable to search for this location.');
      }

      const data = await response.json();
      const result = data.results?.[0];

      if (!result) {
        throw new Error(
          'Location not found. Try a city name with its state or country.',
        );
      }

      const displayName = [result.name, result.admin1, result.country]
        .filter(Boolean)
        .filter(
          (value, index, values) => values.indexOf(value) === index,
        )
        .join(', ');

      await fetchWeather(
        {
          latitude: result.latitude,
          longitude: result.longitude,
        },
        displayName,
      );

      setSearchText('');
    } catch (searchError) {
      console.log('Location search error:', searchError);
      setError(
        searchError.message ||
          'Unable to search for this location.',
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (!activeCoordinates) {
      await loadWeather();
      return;
    }

    setLoading(true);
    setError('');

    try {
      await fetchWeather(activeCoordinates, locationName);
    } catch (weatherError) {
      console.log('Refresh error:', weatherError);
      setError(
        weatherError.message || 'Unable to refresh weather.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const currentCondition = weather
    ? weatherDetails(weather.current.weather_code)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TRAVEL WEATHER</Text>
            <Text style={styles.title}>Weather forecast</Text>
            <Text style={styles.location}>📍 {locationName}</Text>
          </View>

          <Pressable
            style={styles.refreshButton}
            onPress={refreshWeather}
            disabled={loading || searchLoading}>
            {loading && weather ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.refreshText}>↻</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.searchPanel}>
          <View style={styles.searchInputRow}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                setError('');
              }}
              onSubmitEditing={searchLocation}
              placeholder="Search a city"
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              editable={!searchLoading}
            />

            <Pressable
              style={[
                styles.searchButton,
                searchLoading && styles.disabledButton,
              ]}
              onPress={searchLocation}
              disabled={searchLoading}>
              {searchLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </Pressable>
          </View>

          <Pressable
            style={styles.myLocationButton}
            onPress={loadWeather}
            disabled={loading || searchLoading}>
            <Text style={styles.myLocationIcon}>⌖</Text>
            <Text style={styles.myLocationText}>
              Use my current location
            </Text>
          </Pressable>
        </View>

        {loading && !weather && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.statusTitle}>
              Loading local weather
            </Text>
            <Text style={styles.statusText}>
              Getting your location and latest forecast...
            </Text>
          </View>
        )}

        {error !== '' && (
          <View style={styles.errorCard}>
            <View style={styles.errorIconCircle}>
              <Text style={styles.errorIcon}>!</Text>
            </View>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Weather unavailable</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <Pressable
              style={styles.retryButton}
              onPress={refreshWeather}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {weather && (
          <>
            <View style={styles.currentCard}>
              <View style={styles.currentTopRow}>
                <View style={styles.currentLocationBlock}>
                  <Text style={styles.currentLabel}>NOW IN</Text>
                  <Text
                    style={styles.currentLocation}
                    numberOfLines={2}>
                    {locationName}
                  </Text>
                  <Text style={styles.condition}>
                    {currentCondition.label}
                  </Text>
                </View>

                <Text style={styles.weatherIcon}>
                  {currentCondition.icon}
                </Text>
              </View>

              <View style={styles.temperatureRow}>
                <Text style={styles.temperature}>
                  {Math.round(weather.current.temperature_2m)}°
                </Text>
                <Text style={styles.feelsLike}>
                  Feels like{`\n`}
                  {Math.round(
                    weather.current.apparent_temperature,
                  )}°C
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <WeatherMetric
                  icon="💧"
                  value={`${weather.current.relative_humidity_2m}%`}
                  label="Humidity"
                />
                <WeatherMetric
                  icon="💨"
                  value={`${Math.round(
                    weather.current.wind_speed_10m,
                  )} km/h`}
                  label="Wind"
                />
                <WeatherMetric
                  icon="🌧️"
                  value={`${weather.daily.precipitation_probability_max[0]}%`}
                  label="Rain"
                />
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>5-day forecast</Text>
              <Text style={styles.sectionCaption}>Next five days</Text>
            </View>

            <View style={styles.forecastCard}>
              {weather.daily.time.map((date, index) => {
                const condition = weatherDetails(
                  weather.daily.weather_code[index],
                );

                return (
                  <View
                    key={date}
                    style={[
                      styles.forecastRow,
                      index === weather.daily.time.length - 1 &&
                        styles.lastForecastRow,
                    ]}>
                    <Text style={styles.forecastDay}>
                      {index === 0 ? 'Today' : formatDay(date)}
                    </Text>
                    <Text style={styles.forecastIcon}>
                      {condition.icon}
                    </Text>
                    <View style={styles.forecastDescription}>
                      <Text style={styles.forecastCondition}>
                        {condition.label}
                      </Text>
                      <Text style={styles.forecastRain}>
                        Rain {weather.daily.precipitation_probability_max[index]}%
                      </Text>
                    </View>
                    <Text style={styles.forecastTemperature}>
                      {Math.round(
                        weather.daily.temperature_2m_max[index],
                      )}° /{' '}
                      {Math.round(
                        weather.daily.temperature_2m_min[index],
                      )}°
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.attribution}>
              Weather data provided by Open-Meteo
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function WeatherMetric({icon, value, label}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 19,
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
    marginTop: 4,
  },
  location: {
    maxWidth: 260,
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
  },
  refreshButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172554',
    borderRadius: 14,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '700',
  },
  searchPanel: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 19,
    marginBottom: 17,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    color: '#64748B',
    fontSize: 24,
    marginHorizontal: 7,
  },
  searchInput: {
    flex: 1,
    color: '#172033',
    fontSize: 14,
    paddingVertical: 10,
  },
  searchButton: {
    minWidth: 76,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
  myLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingTop: 10,
  },
  myLocationIcon: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '800',
  },
  myLocationText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  statusCard: {
    minHeight: 270,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  statusTitle: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 16,
  },
  statusText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    marginBottom: 16,
  },
  errorIconCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 17,
  },
  errorIcon: {
    color: '#DC2626',
    fontSize: 17,
    fontWeight: '800',
  },
  errorContent: {
    flex: 1,
    marginLeft: 10,
  },
  errorTitle: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '800',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  retryButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: '#DC2626',
    borderRadius: 9,
    marginLeft: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  currentCard: {
    padding: 22,
    backgroundColor: '#172554',
    borderRadius: 26,
    elevation: 4,
  },
  currentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentLocationBlock: {
    flex: 1,
    paddingRight: 10,
  },
  currentLabel: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  currentLocation: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 5,
  },
  condition: {
    color: '#BFDBFE',
    fontSize: 13,
    marginTop: 5,
  },
  weatherIcon: {
    fontSize: 57,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 7,
  },
  temperature: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '300',
    lineHeight: 77,
  },
  feelsLike: {
    color: '#BFDBFE',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 12,
    marginLeft: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  metricCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF14',
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    borderRadius: 15,
  },
  metricIcon: {
    fontSize: 17,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },
  metricLabel: {
    color: '#BFDBFE',
    fontSize: 9,
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCaption: {
    color: '#94A3B8',
    fontSize: 11,
  },
  forecastCard: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
  },
  forecastRow: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastForecastRow: {
    borderBottomWidth: 0,
  },
  forecastDay: {
    width: 49,
    color: '#172033',
    fontSize: 12,
    fontWeight: '800',
  },
  forecastIcon: {
    width: 38,
    fontSize: 22,
  },
  forecastDescription: {
    flex: 1,
  },
  forecastCondition: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  forecastRain: {
    color: '#94A3B8',
    fontSize: 9,
    marginTop: 3,
  },
  forecastTemperature: {
    color: '#172033',
    fontSize: 12,
    fontWeight: '800',
  },
  attribution: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 14,
  },
});
