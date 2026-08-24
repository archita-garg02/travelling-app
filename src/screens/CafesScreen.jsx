import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

const cafes = [
  {
    id: '1',
    name: 'The Coffee House',
    category: 'Cafe',
    rating: 4.6,
    distance: '1.2 km',
    status: 'Open now',
    icon: '☕',
  },
  {
    id: '2',
    name: 'Brew & Bites',
    category: 'Cafe and Bakery',
    rating: 4.4,
    distance: '2.1 km',
    status: 'Open now',
    icon: '🥐',
  },
  {
    id: '3',
    name: 'Green Garden Cafe',
    category: 'Restaurant',
    rating: 4.7,
    distance: '2.8 km',
    status: 'Closes at 10 PM',
    icon: '🌿',
  },
];

function CafeCard({cafe}) {
  return (
    <Pressable style={styles.cafeCard}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.cafeIcon}>{cafe.icon}</Text>
      </View>

      <View style={styles.cafeInformation}>
        <View style={styles.nameRow}>
          <Text style={styles.cafeName} numberOfLines={1}>
            {cafe.name}
          </Text>

          <Text style={styles.rating}>⭐ {cafe.rating}</Text>
        </View>

        <Text style={styles.category}>{cafe.category}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.distance}>📍 {cafe.distance}</Text>
          <Text style={styles.status}>{cafe.status}</Text>
        </View>

        <Pressable style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function CafesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cafes}
        keyExtractor={item => item.id}
        renderItem={({item}) => <CafeCard cafe={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Nearby Cafes</Text>
              <Text style={styles.subtitle}>
                Discover the best food and coffee around you
              </Text>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                style={styles.searchInput}
                placeholder="Search cafes or restaurants"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.filterRow}>
              <Pressable style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>All</Text>
              </Pressable>

              <Pressable style={styles.filter}>
                <Text style={styles.filterText}>Cafes</Text>
              </Pressable>

              <Pressable style={styles.filter}>
                <Text style={styles.filterText}>Restaurants</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Popular near you</Text>
          </>
        }
      />
    </SafeAreaView>
  );
}

export default CafesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  listContent: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 20,
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
  },

  searchIcon: {
    color: '#64748B',
    fontSize: 25,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    paddingVertical: 14,
  },

  filterRow: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 25,
  },

  filter: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    marginRight: 10,
  },

  activeFilter: {
    paddingHorizontal: 19,
    paddingVertical: 9,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    marginRight: 10,
  },

  filterText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },

  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  cafeCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
  },

  imagePlaceholder: {
    width: 100,
    minHeight: 145,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1EB',
    borderRadius: 14,
  },

  cafeIcon: {
    fontSize: 44,
  },

  cafeInformation: {
    flex: 1,
    paddingLeft: 14,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cafeName: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },

  rating: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },

  category: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 5,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  distance: {
    color: '#64748B',
    fontSize: 12,
  },

  status: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '600',
  },

  detailsButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    marginTop: 16,
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});