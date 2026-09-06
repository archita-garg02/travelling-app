import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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


const LOGIN_URL = 'http://10.0.2.2:8000/auth/login';


function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Missing information',
        'Please enter your email and password.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Login failed',
          data.detail || 'Invalid email or password.',
        );
        return;
      }

      await AsyncStorage.setItem(
        'accessToken',
        data.access_token,
      );

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      Alert.alert(
        'Login successful',
        `Welcome, ${data.user.full_name}!`,
      );

      navigation.replace('HomeScreen');
    } catch (error) {
      console.log('Login error:', error);

      Alert.alert(
        'Connection error',
        'Unable to connect to the TravelMate server.',
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/image.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          WELCOME BACK
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue!
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/gmail.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/lock.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}>

            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SignupScreen')
            }>
            <Text style={styles.signupButton}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


export default LoginScreen;


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  logo: {
    width: 180,
    height: 180,
  },

  header: {
    paddingHorizontal: 40,
    marginTop: 10,
  },

  welcomeText: {
    fontWeight: 'bold',
    fontSize: 25,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },

  form: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 55,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: '#f8f2f2',
  },

  image: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#000',
    width: '100%',
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  signupText: {
    fontSize: 14,
  },

  signupButton: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});