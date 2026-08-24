import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

function WeatherScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Weather</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Image
            source={require('../../assets/search.png')}
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search location"
            style={styles.searchInput}
          />
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.location}>Yamunanagar</Text>
          <Text style={styles.country}>Haryana, India</Text>
        </View>

        {/* Current Weather */}
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherIcon}>☀️</Text>

          <Text style={styles.temperature}>29°</Text>

          <Text style={styles.condition}>Sunny</Text>

          <Text style={styles.feelsLike}>Feels like 31°</Text>
        </View>

        {/* Weather Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>💧</Text>
            <Text style={styles.detailTitle}>Humidity</Text>
            <Text style={styles.detailValue}>65%</Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>💨</Text>
            <Text style={styles.detailTitle}>Wind</Text>
            <Text style={styles.detailValue}>12 km/h</Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>🌡️</Text>
            <Text style={styles.detailTitle}>Pressure</Text>
            <Text style={styles.detailValue}>1012 hPa</Text>
          </View>
        </View>

        {/* Forecast */}
        <View style={styles.forecastContainer}>
          <Text style={styles.sectionTitle}>5-Day Forecast</Text>

          <View style={styles.forecastCard}>
            <Text style={styles.day}>Mon</Text>
            <Text style={styles.forecastIcon}>☀️</Text>
            <Text style={styles.forecastTemp}>30° / 22°</Text>
          </View>

          <View style={styles.forecastCard}>
            <Text style={styles.day}>Tue</Text>
            <Text style={styles.forecastIcon}>🌤️</Text>
            <Text style={styles.forecastTemp}>31° / 23°</Text>
          </View>

          <View style={styles.forecastCard}>
            <Text style={styles.day}>Wed</Text>
            <Text style={styles.forecastIcon}>🌧️</Text>
            <Text style={styles.forecastTemp}>27° / 21°</Text>
          </View>

          <View style={styles.forecastCard}>
            <Text style={styles.day}>Thu</Text>
            <Text style={styles.forecastIcon}>☁️</Text>
            <Text style={styles.forecastTemp}>28° / 22°</Text>
          </View>

          <View style={styles.forecastCard}>
            <Text style={styles.day}>Fri</Text>
            <Text style={styles.forecastIcon}>☀️</Text>
            <Text style={styles.forecastTemp}>30° / 23°</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 10,
  },

  backButton: {
    fontSize: 40,
    lineHeight: 40,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  headerSpace: {
    width: 30,
  },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    marginHorizontal: 25,
    marginTop: 25,
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
  },

  searchIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  /* Location */
  locationContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  location: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  country: {
    marginTop: 5,
    fontSize: 15,
  },

  /* Current Weather */
  weatherContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  weatherIcon: {
    fontSize: 70,
  },

  temperature: {
    marginTop: 5,
    fontSize: 60,
    fontWeight: 'bold',
  },

  condition: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
  },

  feelsLike: {
    marginTop: 5,
    fontSize: 14,
  },

  /* Details */
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },

  detailBox: {
    width: '31%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },

  detailIcon: {
    fontSize: 24,
  },

  detailTitle: {
    marginTop: 8,
    fontSize: 12,
  },

  detailValue: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Forecast */
  forecastContainer: {
    marginHorizontal: 25,
    marginTop: 35,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  forecastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
  },

  day: {
    width: 50,
    fontSize: 16,
    fontWeight: '600',
  },

  forecastIcon: {
    fontSize: 25,
  },

  forecastTemp: {
    fontSize: 15,
    fontWeight: '600',
  },
});