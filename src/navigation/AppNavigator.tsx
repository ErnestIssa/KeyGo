import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from '../types/navigation';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // For now, we'll assume the user is logged in
  // Later we'll add authentication state management
  const isAuthenticated = true;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomColor: '#E5E7EB',
            borderBottomWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#000000',
          },
          headerTintColor: '#000000',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="RequestDetails" 
              component={RequestDetailsScreen}
              options={{ title: 'Request Details' }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ title: 'Chat' }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen}
              options={{ title: 'Payment' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
