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

  const fetchWeather = async (coordinates, selectedLocationName = '') => {
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

    // Weather is the important request. Location-name lookup is
    // handled separately so its failure cannot hide valid weather.
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
          setError(
            weatherError.message || 'Unable to load weather.',
          );
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
        .filter((value, index, values) => values.indexOf(value) === index)
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
        searchError.message || 'Unable to search for this location.',
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
      setError(weatherError.message || 'Unable to refresh weather.');
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
            <Text style={styles.title}>Weather</Text>
            <Text style={styles.location}>📍 {locationName}</Text>
          </View>

          <Pressable
            style={styles.refreshButton}
            onPress={refreshWeather}
            disabled={loading || searchLoading}>
            <Text style={styles.refreshText}>↻</Text>
          </Pressable>
        </View>

        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              setError('');
            }}
            onSubmitEditing={searchLocation}
            placeholder="Search city or location"
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
          <Text style={styles.myLocationText}>⌖ Use my location</Text>
        </Pressable>

        {loading && !weather && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.statusText}>
              Finding your local weather...
            </Text>
          </View>
        )}

        {error !== '' && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={refreshWeather}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {weather && (
          <>
            <View style={styles.currentCard}>
              <Text style={styles.weatherIcon}>
                {currentCondition.icon}
              </Text>
              <Text style={styles.temperature}>
                {Math.round(weather.current.temperature_2m)}°
              </Text>
              <Text style={styles.condition}>
                {currentCondition.label}
              </Text>
              <Text style={styles.feelsLike}>
                Feels like{' '}
                {Math.round(weather.current.apparent_temperature)}°C
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💧</Text>
                  <Text style={styles.detailValue}>
                    {weather.current.relative_humidity_2m}%
                  </Text>
                  <Text style={styles.detailLabel}>Humidity</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💨</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weather.current.wind_speed_10m)} km/h
                  </Text>
                  <Text style={styles.detailLabel}>Wind</Text>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🌧️</Text>
                  <Text style={styles.detailValue}>
                    {weather.daily.precipitation_probability_max[0]}%
                  </Text>
                  <Text style={styles.detailLabel}>Rain</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>5-day forecast</Text>

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
                    <Text style={styles.forecastCondition}>
                      {condition.label}
                    </Text>
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
              Weather data by Open-Meteo
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F8FA'},
  content: {padding: 20, paddingBottom: 32},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {color: '#1E293B', fontSize: 28, fontWeight: '700'},
  location: {color: '#64748B', fontSize: 14, marginTop: 5},
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingLeft: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 3,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    paddingVertical: 10,
  },
  searchButton: {
    minWidth: 72,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledButton: {opacity: 0.6},
  myLocationButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF1EB',
    borderRadius: 10,
    marginBottom: 16,
  },
  myLocationText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '700',
  },
  refreshButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1EB',
    borderRadius: 21,
  },
  refreshText: {color: '#FF6B35', fontSize: 27, fontWeight: '700'},
  statusCard: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  statusText: {color: '#64748B', fontSize: 14, marginTop: 14},
  errorCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    marginBottom: 16,
  },
  errorText: {color: '#B91C1C', fontSize: 13, textAlign: 'center'},
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    marginTop: 12,
  },
  retryText: {color: '#FFFFFF', fontSize: 12, fontWeight: '700'},
  currentCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 26,
    elevation: 5,
  },
  weatherIcon: {fontSize: 62},
  temperature: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '300',
    lineHeight: 75,
  },
  condition: {color: '#FFFFFF', fontSize: 20, fontWeight: '700'},
  feelsLike: {color: '#FFE4D8', fontSize: 13, marginTop: 5},
  detailsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 22,
    marginTop: 22,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  detailItem: {flex: 1, alignItems: 'center'},
  detailIcon: {fontSize: 19},
  detailValue: {color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginTop: 5},
  detailLabel: {color: '#FFE4D8', fontSize: 11, marginTop: 2},
  detailDivider: {width: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.3)'},
  sectionTitle: {color: '#1E293B', fontSize: 18, fontWeight: '700', marginTop: 25, marginBottom: 12},
  forecastCard: {paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 20, elevation: 2},
  forecastRow: {minHeight: 64, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'},
  lastForecastRow: {borderBottomWidth: 0},
  forecastDay: {width: 52, color: '#1E293B', fontSize: 13, fontWeight: '700'},
  forecastIcon: {width: 38, fontSize: 23},
  forecastCondition: {flex: 1, color: '#64748B', fontSize: 12},
  forecastTemperature: {color: '#1E293B', fontSize: 13, fontWeight: '700'},
  attribution: {color: '#94A3B8', fontSize: 10, textAlign: 'center', marginTop: 14},
});