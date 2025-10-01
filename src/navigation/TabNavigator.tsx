import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { RootTabParamList } from '../types/navigation';
import { Colors, Typography, Spacing } from '../constants';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import RequestsNearbyScreen from '../screens/RequestsNearbyScreen';
import GetDriverNowScreen from '../screens/GetDriverNowScreen';
import MyRequestsScreen from '../screens/MyRequestsScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'RequestsNearby':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'GetDriverNow':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'MyRequests':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[500],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.textPrimary,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="RequestsNearby" 
        component={RequestsNearbyScreen}
        options={{ title: 'Nearby' }}
      />
      <Tab.Screen 
        name="GetDriverNow" 
        component={GetDriverNowScreen}
        options={{ 
          title: 'Get Driver',
          tabBarButton: (props) => (
            <View style={styles.getDriverButton}>
              <View style={styles.getDriverButtonInner}>
                <Text style={styles.getDriverButtonText}>Get Driver</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="MyRequests" 
        component={MyRequestsScreen}
        options={{ title: 'My Requests' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    height: 80,
  },
  tabBarLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  getDriverButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  getDriverButtonInner: {
    backgroundColor: Colors.secondary,
    borderRadius: 25,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minWidth: 120,
    alignItems: 'center',
    ...Shadows.md,
  },
  getDriverButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
});

export default TabNavigator;
