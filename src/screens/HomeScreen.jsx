import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';


const services = [
  {
    id: 'map',
    title: 'Maps & Routes',
    description: 'Search destinations and find routes',
    icon: '🗺️',
    screen: 'MapScreen',
    backgroundColor: '#E8F3FF',
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'Check weather for any destination',
    icon: '🌤️',
    screen: 'WeatherScreen',
    backgroundColor: '#FFF4D8',
  },
  {
    id: 'ride',
    title: 'Book a Ride',
    description: 'Find and book available vehicles',
    icon: '🚕',
    screen: 'RideScreen',
    backgroundColor: '#FFEAE1',
  },
];


function HomeScreen({navigation}) {
  const openService = screen => {
    navigation.navigate(screen);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome to
            </Text>

            <Text style={styles.appName}>
              TravelMate
            </Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              T
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Plan your next journey
            </Text>

            <Text style={styles.heroDescription}>
              Explore routes, check weather and book rides
              from one application.
            </Text>
          </View>

          <Text style={styles.heroIcon}>
            ✈️
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Travel Services
        </Text>

        <Text style={styles.sectionSubtitle}>
          What would you like to do today?
        </Text>

        <View style={styles.serviceContainer}>
          {services.map(service => (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              style={styles.serviceCard}
              onPress={() => openService(service.screen)}>

              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      service.backgroundColor,
                  },
                ]}>

                <Text style={styles.serviceIcon}>
                  {service.icon}
                </Text>
              </View>

              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>
                  {service.title}
                </Text>

                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
              </View>

              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>
                  ›
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>
            💡
          </Text>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              Travel smarter
            </Text>

            <Text style={styles.infoDescription}>
              Check the route and weather before starting
              your journey.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


export default HomeScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  greeting: {
    color: '#64748B',
    fontSize: 14,
  },

  appName: {
    color: '#172033',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },

  profileCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    backgroundColor: '#FF6B35',
    borderRadius: 23,
  },

  profileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 155,
    padding: 22,
    backgroundColor: '#172033',
    borderRadius: 24,
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  heroDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  heroIcon: {
    fontSize: 56,
    marginLeft: 12,
  },

  sectionTitle: {
    color: '#172033',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 28,
  },

  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },

  serviceContainer: {
    gap: 13,
  },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderRadius: 17,
  },

  serviceIcon: {
    fontSize: 29,
  },

  serviceContent: {
    flex: 1,
    marginLeft: 15,
  },

  serviceTitle: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '800',
  },

  serviceDescription: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },

  arrow: {
    color: '#475569',
    fontSize: 25,
    lineHeight: 27,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 18,
    marginTop: 24,
  },

  infoIcon: {
    fontSize: 27,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    color: '#9A3412',
    fontSize: 14,
    fontWeight: '800',
  },

  infoDescription: {
    color: '#C2410C',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});