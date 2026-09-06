import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Image,
  StyleSheet,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import MapScreen from './src/screens/MapScreen';
import CafesScreen from './src/screens/CafesScreen';
import RideScreen from './src/screens/RideScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddServiceScreen from './src/screens/AddServiceScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/home.png')}
              style={styles.tabIcon}/>),
          headerShown:false
        }}
      />
      <Tab.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/profile.png')}
              style={styles.tabIcon}/>),
          headerShown:false
        }}
      />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HomeScreen"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WeatherScreen"
        component={WeatherScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CafesScreen"
        component={CafesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RideScreen"
        component={RideScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddServiceScreen"
        component={AddServiceScreen}
        options={{
          title: 'Add Vehicle Service',
        }}
      />

      <Stack.Screen
        name="MyBookingsScreen"
        component={MyBookingsScreen}
        options={{headerShown: false}}
      />

    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});