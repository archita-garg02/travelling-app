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
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);


  const handleSignup = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPhone ||
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
          full_name: normalizedName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data.detail === 'string'
            ? data.detail
            : 'Unable to create your account.';

        Alert.alert('Registration failed', message);
        return;
      }

      Alert.alert(
        'Account created',
        'Your TravelMate account was created successfully.',
        [
          {
            text: 'Login',
            onPress: () =>
              navigation.replace('LoginScreen'),
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.brandContainer}>
            <Image
              source={require('../../assets/image.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>
                TravelMate
              </Text>

              <Text style={styles.brandDescription}>
                Create your travel account
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.title}>
              Create account
            </Text>

            <Text style={styles.subtitle}>
              Enter your details to get started
            </Text>

            <Text style={styles.label}>
              Full name
            </Text>

            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/user.png')}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

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
              />
            </View>

            <Text style={styles.label}>
              Phone number
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.phoneIcon}>
                ☎
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
                maxLength={15}
              />
            </View>

            <Text style={styles.label}>
              Register as
            </Text>

            <View style={styles.roleContainer}>
              <RoleButton
                icon="🧳"
                label="Customer"
                description="Book rides"
                selected={role === 'CUSTOMER'}
                disabled={loading}
                onPress={() => setRole('CUSTOMER')}
              />

              <RoleButton
                icon="🚘"
                label="Provider"
                description="Offer rides"
                selected={role === 'PROVIDER'}
                disabled={loading}
                onPress={() => setRole('PROVIDER')}
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
                placeholder="Minimum 8 characters"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />

              <TouchableOpacity
                disabled={loading}
                onPress={() =>
                  setShowPassword(current => !current)
                }>

                <Text style={styles.showPassword}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Confirm password
            </Text>

            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/lock.png')}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter password again"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.signupButton,
                loading && styles.disabledButton,
              ]}
              disabled={loading}
              onPress={handleSignup}>

              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signupButtonText}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>

              <TouchableOpacity
                disabled={loading}
                onPress={() =>
                  navigation.navigate('LoginScreen')
                }>

                <Text style={styles.loginButton}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function RoleButton({
  icon,
  label,
  description,
  selected,
  disabled,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.roleButton,
        selected && styles.selectedRoleButton,
      ]}>

      <Text style={styles.roleIcon}>
        {icon}
      </Text>

      <Text
        style={[
          styles.roleLabel,
          selected && styles.selectedRoleLabel,
        ]}>
        {label}
      </Text>

      <Text
        style={[
          styles.roleDescription,
          selected && styles.selectedRoleDescription,
        ]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}


export default SignupScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 35,
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 4,
  },

  logo: {
    width: 76,
    height: 76,
  },

  brandTextContainer: {
    marginLeft: 13,
  },

  brandName: {
    color: '#172033',
    fontSize: 25,
    fontWeight: '800',
  },

  brandDescription: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },

  formCard: {
    padding: 21,
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
    marginBottom: 23,
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
    height: 55,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    marginBottom: 17,
  },

  inputIcon: {
    width: 21,
    height: 21,
    marginRight: 11,
    tintColor: '#64748B',
  },

  phoneIcon: {
    color: '#64748B',
    fontSize: 21,
    marginRight: 11,
  },

  input: {
    flex: 1,
    color: '#172033',
    fontSize: 15,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 19,
  },

  roleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },

  selectedRoleButton: {
    backgroundColor: '#FFF1EB',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },

  roleIcon: {
    fontSize: 25,
  },

  roleLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },

  selectedRoleLabel: {
    color: '#C2410C',
  },

  roleDescription: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },

  selectedRoleDescription: {
    color: '#EA580C',
  },

  showPassword: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
  },

  signupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    marginTop: 6,
  },

  disabledButton: {
    opacity: 0.65,
  },

  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#64748B',
    fontSize: 13,
  },

  loginButton: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 5,
  },
});