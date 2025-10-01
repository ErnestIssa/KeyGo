import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CarRequest } from '../types';

const RequestsNearbyScreen: React.FC = () => {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockRequests: CarRequest[] = [
      {
        id: '1',
        ownerId: 'owner1',
        title: 'Move car from Central Station',
        description: 'Need to move my car from Central Station to Arlanda Airport. Car is parked in P1.',
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
        estimatedDuration: 45,
      },
      {
        id: '2',
        ownerId: 'owner2',
        title: 'Relocate vehicle to garage',
        description: 'Car needs to be moved from street parking to garage. Keys will be provided.',
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
        estimatedDuration: 15,
      },
      {
        id: '3',
        ownerId: 'owner3',
        title: 'Car relocation needed',
        description: 'Moving car from apartment to storage facility. Short distance.',
        pickupLocation: {
          address: 'Södermalm, Stockholm',
          coordinates: { latitude: 59.3150, longitude: 18.0738 },
        },
        dropoffLocation: {
          address: 'Storage Facility, Södermalm',
          coordinates: { latitude: 59.3120, longitude: 18.0700 },
        },
        proposedPayment: 150,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDuration: 20,
      },
    ];
    
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRequestPress = (request: CarRequest) => {
    Alert.alert(
      'Request Details',
      `${request.title}\n\nFrom: ${request.pickupLocation.address}\nTo: ${request.dropoffLocation.address}\nPayment: ${request.proposedPayment} SEK\nDuration: ${request.estimatedDuration} min`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => console.log('Accept request') },
      ]
    );
  };

  const renderRequestItem = ({ item }: { item: CarRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestPayment}>{item.proposedPayment} SEK</Text>
      </View>
      
      <Text style={styles.requestDescription}>{item.description}</Text>
      
      <View style={styles.requestDetails}>
        <View style={styles.locationItem}>
          <Icon name="location" size={16} color={Colors.primary} />
          <Text style={styles.locationText}>{item.pickupLocation.address}</Text>
        </View>
        
        <View style={styles.locationItem}>
          <Icon name="flag" size={16} color={Colors.secondary} />
          <Text style={styles.locationText}>{item.dropoffLocation.address}</Text>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        <View style={styles.timeInfo}>
          <Icon name="time" size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{item.estimatedDuration} min</Text>
        </View>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading nearby requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests Nearby</Text>
        <Text style={styles.headerSubtitle}>
          {requests.length} requests within 5km
        </Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  listContainer: {
    padding: Spacing.md,
  },
  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  requestTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  requestPayment: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
  },
  requestDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  requestDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});

export default RequestsNearbyScreen;
