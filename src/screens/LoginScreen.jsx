import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeAreaView}>

      {/* Top Image */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/image.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          WELCOME UserName
        </Text>

        <Text style={styles.subtitle}>
          Sign in to Continue!
        </Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/gmail.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/lock.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            secureTextEntry
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.buttonText}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Signup */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignupScreen')}
          >
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

  forgotContainer: {
    alignItems: 'center',
    marginTop: 5,
  },

  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },

  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#000',
    width: 300,
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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