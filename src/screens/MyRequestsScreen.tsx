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

const MyRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  useEffect(() => {
    // Mock data for demonstration
    const mockRequests: CarRequest[] = [
      {
        id: '1',
        ownerId: 'user1',
        driverId: 'driver1',
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
        status: 'in_progress',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(),
        estimatedDuration: 45,
      },
      {
        id: '2',
        ownerId: 'user1',
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
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(),
        estimatedDuration: 15,
      },
      {
        id: '3',
        ownerId: 'user1',
        driverId: 'driver2',
        title: 'Car relocation completed',
        description: 'Moving car from apartment to storage facility',
        pickupLocation: {
          address: 'Södermalm, Stockholm',
          coordinates: { latitude: 59.3150, longitude: 18.0738 },
        },
        dropoffLocation: {
          address: 'Storage Facility, Södermalm',
          coordinates: { latitude: 59.3120, longitude: 18.0700 },
        },
        proposedPayment: 150,
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(),
        estimatedDuration: 20,
        actualDuration: 18,
      },
    ];
    setRequests(mockRequests);
  }, []);

  const filteredRequests = requests.filter(request => {
    switch (selectedFilter) {
      case 'pending':
        return request.status === 'pending';
      case 'active':
        return request.status === 'accepted' || request.status === 'in_progress';
      case 'completed':
        return request.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'accepted':
      case 'in_progress':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for driver';
      case 'accepted':
        return 'Driver assigned';
      case 'in_progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleRequestPress = (request: CarRequest) => {
    Alert.alert(
      'Request Details',
      `${request.title}\n\nStatus: ${getStatusText(request.status)}\nFrom: ${request.pickupLocation.address}\nTo: ${request.dropoffLocation.address}\nPayment: ${request.proposedPayment} SEK`,
      [{ text: 'OK' }]
    );
  };

  const renderRequestItem = ({ item }: { item: CarRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.requestHeader}>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
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
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>{item.proposedPayment} SEK</Text>
          <Text style={styles.paymentLabel}>Payment</Text>
        </View>
        
        <View style={styles.timeInfo}>
          <Icon name="time" size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>
            {item.actualDuration ? `${item.actualDuration} min` : `${item.estimatedDuration} min`}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <Text style={styles.headerSubtitle}>
          {filteredRequests.length} of {requests.length} requests
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterButtons.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredRequests}
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
  filterContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Colors.white,
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
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
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
  paymentInfo: {
    alignItems: 'flex-start',
  },
  paymentAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
  },
  paymentLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
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
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
  },
  trackButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  trackButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
  },
});

export default MyRequestsScreen;
