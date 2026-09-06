import React, {useState} from 'react';
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
import AsyncStorage from
  '@react-native-async-storage/async-storage';
import {SafeAreaView} from
  'react-native-safe-area-context';


const SERVICE_URL = 'http://10.0.2.2:8000/services';


function AddServiceScreen({navigation}) {
  const [serviceType, setServiceType] = useState('CAB');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [seats, setSeats] = useState('');
  const [baseFare, setBaseFare] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (
      !vehicleName.trim() ||
      !vehicleNumber.trim() ||
      !seats ||
      !baseFare ||
      !pricePerKm ||
      !city.trim()
    ) {
      Alert.alert(
        'Missing information',
        'Please fill in all fields.',
      );
      return;
    }

    if (
      Number(seats) < 1 ||
      Number(baseFare) < 0 ||
      Number(pricePerKm) <= 0
    ) {
      Alert.alert(
        'Invalid values',
        'Please enter valid seats and fare values.',
      );
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem(
        'accessToken',
      );

      if (!token) {
        Alert.alert(
          'Login required',
          'Please log in again.',
        );
        return;
      }

      const response = await fetch(SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_type: serviceType,
          vehicle_name: vehicleName.trim(),
          vehicle_number: vehicleNumber
            .trim()
            .toUpperCase(),
          seats: Number(seats),
          base_fare: Number(baseFare),
          price_per_km: Number(pricePerKm),
          operating_city: city.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Unable to add service',
          data.detail || 'Please try again.',
        );
        return;
      }

      Alert.alert(
        'Service added',
        'Your vehicle service was added successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log('Service creation error:', error);

      Alert.alert(
        'Connection error',
        'Unable to connect to the TravelMate server.',
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        <Text style={styles.title}>
          Add Vehicle Service
        </Text>

        <Text style={styles.subtitle}>
          Enter your vehicle and pricing details
        </Text>

        <Text style={styles.label}>
          Service type
        </Text>

        <View style={styles.typeRow}>
          {['BIKE', 'AUTO', 'CAB'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                serviceType === type &&
                  styles.selectedTypeButton,
              ]}
              onPress={() => setServiceType(type)}>

              <Text
                style={[
                  styles.typeText,
                  serviceType === type &&
                    styles.selectedTypeText,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FormInput
          label="Vehicle name"
          placeholder="Example: Swift Dzire"
          value={vehicleName}
          onChangeText={setVehicleName}
        />

        <FormInput
          label="Vehicle number"
          placeholder="Example: HR02AB1234"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          autoCapitalize="characters"
        />

        <FormInput
          label="Number of seats"
          placeholder="Example: 4"
          value={seats}
          onChangeText={setSeats}
          keyboardType="number-pad"
        />

        <FormInput
          label="Base fare"
          placeholder="Example: 50"
          value={baseFare}
          onChangeText={setBaseFare}
          keyboardType="numeric"
        />

        <FormInput
          label="Price per kilometre"
          placeholder="Example: 12"
          value={pricePerKm}
          onChangeText={setPricePerKm}
          keyboardType="numeric"
        />

        <FormInput
          label="Operating city"
          placeholder="Example: Yamunanagar"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={loading}>

          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>
              Add Service
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


function FormInput({
  label,
  ...inputProperties
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        {...inputProperties}
      />
    </View>
  );
}


export default AddServiceScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: '#0F172A',
    fontSize: 27,
    fontWeight: '700',
  },

  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  selectedTypeButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },

  typeText: {
    color: '#334155',
    fontWeight: '600',
  },

  selectedTypeText: {
    color: '#FFFFFF',
  },

  inputGroup: {
    marginBottom: 16,
  },

  input: {
    height: 52,
    paddingHorizontal: 15,
    color: '#0F172A',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});