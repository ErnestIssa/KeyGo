import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CarRequest } from '../types';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [region, setRegion] = useState({
    latitude: 59.3293, // Stockholm coordinates
    longitude: 18.0686,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [requests, setRequests] = useState<CarRequest[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: CarRequest[] = [
      {
        id: '1',
        ownerId: 'owner1',
        title: 'Move car from Central Station',
        description: 'Need to move my car from Central Station to Arlanda Airport',
        pickupLocation: {
          address: 'Central Station, Stockholm',
          coordinates: { latitude: 59.3304, longitude: 18.0593 },
        },
        dropoffLocation: {
          address: 'Arlanda Airport',
          coordinates: { latitude: 59.6519, longitude: 17.9186 },
        },
        proposedPayment: 500,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        ownerId: 'owner2',
        title: 'Relocate vehicle to garage',
        description: 'Car needs to be moved from street parking to garage',
        pickupLocation: {
          address: 'Östermalm, Stockholm',
          coordinates: { latitude: 59.3402, longitude: 18.0738 },
        },
        dropoffLocation: {
          address: 'Garage, Östermalm',
          coordinates: { latitude: 59.3389, longitude: 18.0701 },
        },
        proposedPayment: 200,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setRequests(mockRequests);
  }, []);

  const handleRequestPress = (request: CarRequest) => {
    Alert.alert(
      'Request Details',
      `${request.title}\n\nFrom: ${request.pickupLocation.address}\nTo: ${request.dropoffLocation.address}\nPayment: ${request.proposedPayment} SEK`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            coordinate={request.pickupLocation.coordinates}
            onPress={() => handleRequestPress(request)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Icon name="car" size={20} color={Colors.white} />
              </View>
              <View style={styles.markerLabel}>
                <Text style={styles.markerText}>{request.proposedPayment} SEK</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Quick Actions Overlay */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="add" size={24} color={Colors.white} />
          <Text style={styles.quickActionText}>New Request</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="search" size={24} color={Colors.white} />
          <Text style={styles.quickActionText}>Find Driver</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info Panel */}
      <View style={styles.bottomPanel}>
        <Text style={styles.bottomPanelTitle}>Available Requests</Text>
        <Text style={styles.bottomPanelSubtitle}>
          {requests.length} requests near you
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.md,
  },
  markerLabel: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
    ...Shadows.sm,
  },
  markerText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  quickActions: {
    position: 'absolute',
    top: 60,
    right: Spacing.md,
    gap: Spacing.sm,
  },
  quickActionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  quickActionText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
  },
  bottomPanelTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bottomPanelSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default HomeScreen;
