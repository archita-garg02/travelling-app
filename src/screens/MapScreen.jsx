import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MapScreen() {
    return(
        <SafeAreaView>
          <View>
            <Text>
              Map
            </Text>
          </View>

          <View>
        
            <TextInput
              placeholder='Search Destination'
              style={styles.searchInput}>
            </TextInput>
          </View>

            
        </SafeAreaView>
    );
}

export default MapScreen;

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
    height: 55,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
  },

  searchInput: {
    fontSize: 16,
  },

  /* Map */
  mapContainer: {
    flex: 1,
    marginTop: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  /* Location Button */
  locationButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 5,
  },

  locationButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});