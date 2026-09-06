import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';


const REGISTER_URL = 'http://10.0.2.2:8000/auth/register';


function SignupScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);


  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Missing information',
        'Please fill in all fields.',
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least 8 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password mismatch',
        'Password and confirm password must match.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message = 'Unable to create your account.';

        if (typeof data.detail === 'string') {
          message = data.detail;
        }

        Alert.alert('Registration failed', message);
        return;
      }

      Alert.alert(
        'Account created',
        'Your account was created successfully.',
        [
          {
            text: 'Login',
            onPress: () =>
              navigation.navigate('LoginScreen'),
          },
        ],
      );
    } catch (error) {
      console.log('Registration error:', error);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/image.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            CREATE ACCOUNT
          </Text>

          <Text style={styles.subtitle}>
            Sign up to start your journey!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Image
              source={require('../../assets/user.png')}
              style={styles.image}
            />

            <TextInput
              placeholder="Enter your name"
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

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
            />
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={require('../../assets/user.png')}
              style={styles.image}
            />

            <TextInput
              placeholder="Enter your phone number"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.roleTitle}>
            Register as
          </Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'CUSTOMER' &&
                  styles.selectedRoleButton,
              ]}
              onPress={() => setRole('CUSTOMER')}>
              <Text
                style={[
                  styles.roleText,
                  role === 'CUSTOMER' &&
                    styles.selectedRoleText,
                ]}>
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'PROVIDER' &&
                  styles.selectedRoleButton,
              ]}
              onPress={() => setRole('PROVIDER')}>
              <Text
                style={[
                  styles.roleText,
                  role === 'PROVIDER' &&
                    styles.selectedRoleText,
                ]}>
                Provider
              </Text>
            </TouchableOpacity>
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

          <View style={styles.inputContainer}>
            <Image
              source={require('../../assets/lock.png')}
              style={styles.image}
            />

            <TextInput
              placeholder="Confirm your password"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleSignup}
              disabled={loading}>

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoginScreen')
              }>
              <Text style={styles.loginButton}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


export default SignupScreen;


const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  logo: {
    width: 130,
    height: 130,
  },

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

  form: {
    paddingHorizontal: 40,
    paddingTop: 25,
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

  roleTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },

  roleButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedRoleButton: {
    backgroundColor: '#000',
  },

  roleText: {
    color: '#000',
    fontWeight: '600',
  },

  selectedRoleText: {
    color: '#fff',
  },

  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
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