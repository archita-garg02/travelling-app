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

function SignupScreen({navigation}) {
  return (
    <SafeAreaView style={styles.safeAreaView}>

      {/* Logo */}
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
          CREATE ACCOUNT
        </Text>

        <Text style={styles.subtitle}>
          Sign up to start your journey!
        </Text>
      </View>

      {/* Signup Form */}
      <View style={styles.form}>

        {/* Name */}
        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/user.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

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

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Image
            source={require('../../assets/lock.png')}
            style={styles.image}
          />

          <TextInput
            placeholder="Confirm your password"
            style={styles.input}
            secureTextEntry
          />
        </View>

        {/* Signup Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity 
            onPress={()=>navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginButton}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

      </View>

    </SafeAreaView>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Logo */
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  logo: {
    width: 150,
    height: 150,
  },

  /* Header */
  header: {
    paddingHorizontal: 40,
    marginTop: 5,
  },

  welcomeText: {
    fontWeight: 'bold',
    fontSize: 25,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },

  /* Form */
  form: {
    paddingHorizontal: 40,
    paddingTop: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 55,
    marginBottom: 15,
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

  /* Button */
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
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

  /* Login */
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  loginText: {
    fontSize: 14,
  },

  loginButton: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});