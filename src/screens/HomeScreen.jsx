import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello! Username</Text>

        <Text style={styles.subtitle}>Where do you want to go?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../../assets/search.png')}
          style={styles.searchIcon}
        />

        <TextInput
          placeholder="Search Destination"
          style={styles.searchInput}
        />
      </View>

      {/* Facilities */}
      <View style={styles.facilitiesContainer}>
        {/* Weather */}
        <TouchableOpacity
          style={styles.facility}
          onPress={() => navigation.navigate('WeatherScreen')}
        >
          <Image
            source={require('../../assets/weather.png')}
            style={styles.facilityImage}
            resizeMode="cover"
          />

          <Text style={styles.facilityText}>Weather</Text>
        </TouchableOpacity>

        {/* Map */}
        <TouchableOpacity
          style={styles.facility}
          onPress={() => navigation.navigate('MapScreen')}
        >
          <Image
            source={require('../../assets/map.png')}
            style={styles.facilityImage}
            resizeMode="cover"
          />

          <Text style={styles.facilityText}>Map</Text>
        </TouchableOpacity>

        {/* Cafes */}
        <TouchableOpacity
          style={styles.facility}
          onPress={() => navigation.navigate('CafesScreen')}
        >
          <Image
            source={require('../../assets/cafes.png')}
            style={styles.facilityImage}
            resizeMode="cover"
          />

          <Text style={styles.facilityText}>Cafes</Text>
        </TouchableOpacity>

        {/* Book Ride */}
        <TouchableOpacity
          style={styles.facility}
          onPress={() => navigation.navigate('RideScreen')}
        >
          <Image
            source={require('../../assets/ride.png')}
            style={styles.facilityImage}
            resizeMode="cover"
          />

          <Text style={styles.facilityText}>Book Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Popular Places */}
      <View style={styles.popularContainer}>
        <Text style={styles.popularTitle}>Popular Places</Text>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header */
  header: {
    paddingHorizontal: 25,
  },

  greeting: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
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

  /* Facilities */
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },

  facility: {
    width: '47%',
    height: 180,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },

  facilityImage: {
    width: '100%',
    height: 140,
  },

  facilityText: {
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  /* Popular Places */
  popularContainer: {
    marginHorizontal: 25,
    marginTop: 35,
  },

  popularTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});