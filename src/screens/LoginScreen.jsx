import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';


const LOGIN_URL = 'http://10.0.2.2:8000/auth/login';


function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    Alert.alert(
      'Missing information',
      'Please enter your email and password.',
    );
    return;
  }

  setLoading(true);

  let data;

  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    data = await response.json();

    if (!response.ok) {
      Alert.alert(
        'Login failed',
        data.detail || 'Invalid email or password.',
      );

      setLoading(false);
      return;
    }
  } catch (error) {
    console.log('Network/login response error:', error);

    Alert.alert(
      'Connection error',
      'Unable to connect to the TravelMate server.',
    );

    setLoading(false);
    return;
  }

  if (!data.access_token || !data.user) {
    console.log('Unexpected login response:', data);

    Alert.alert(
      'Server response error',
      'The server returned incomplete login information.',
    );

    setLoading(false);
    return;
  }

  try {
    await AsyncStorage.setItem(
      'accessToken',
      data.access_token,
    );

    await AsyncStorage.setItem(
      'user',
      JSON.stringify(data.user),
    );
  } catch (error) {
    console.log('Login storage error:', error);

    Alert.alert(
      'Storage error',
      'Login succeeded, but the session could not be saved.',
    );

    setLoading(false);
    return;
  }

  setLoading(false);

  navigation.reset({
    index: 0,
    routes: [{name: 'HomeScreen'}],
  });
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/image.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandName}>
              TravelMate
            </Text>

            <Text style={styles.brandDescription}>
              Your complete travel companion
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.title}>
              Welcome back
            </Text>

            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>

            <Text style={styles.label}>
              Email address
            </Text>

            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/gmail.png')}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/lock.png')}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(current => !current)}
                disabled={loading}>

                <Text style={styles.showPassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.loginButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}>

              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SignupScreen')
                }
                disabled={loading}>

                <Text style={styles.signupButton}>
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            Plan routes, check weather and book rides
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


export default LoginScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },

  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 55,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
  },

  logo: {
    width: 82,
    height: 82,
  },

  brandName: {
    color: '#172033',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 14,
  },

  brandDescription: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },

  formCard: {
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDF4',
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },

  title: {
    color: '#172033',
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 24,
  },

  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    marginBottom: 18,
  },

  inputIcon: {
    width: 21,
    height: 21,
    marginRight: 11,
    tintColor: '#64748B',
  },

  input: {
    flex: 1,
    color: '#172033',
    fontSize: 15,
  },

  showPassword: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
  },

  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 7,
  },

  disabledButton: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  signupText: {
    color: '#64748B',
    fontSize: 13,
  },

  signupButton: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 5,
  },

  footer: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
  },
});