import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

const RequestDetailsScreen: React.FC = () => {
  const handleAcceptRequest = () => {
    Alert.alert('Request Accepted', 'You have successfully accepted this request!');
  };

  const handleContactOwner = () => {
    Alert.alert('Contact Owner', 'Opening chat with the car owner...');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Available</Text>
        </View>
        <Text style={styles.title}>Move car from Central Station</Text>
        <Text style={styles.description}>
          Need to move my car from Central Station to Arlanda Airport. Car is parked in P1.
        </Text>
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentAmount}>500 SEK</Text>
          <Text style={styles.paymentLabel}>Proposed Payment</Text>
        </View>
      </View>

      {/* Location Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Icon name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationTitle}>Pickup Location</Text>
          </View>
          <Text style={styles.locationAddress}>Central Station, Stockholm</Text>
          <Text style={styles.locationDetails}>P1 Parking, Level 2, Space 45</Text>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Icon name="flag" size={20} color={Colors.secondary} />
            <Text style={styles.locationTitle}>Drop-off Location</Text>
          </View>
          <Text style={styles.locationAddress}>Arlanda Airport</Text>
          <Text style={styles.locationDetails}>Terminal 5, Short-term parking</Text>
        </View>
      </View>

      {/* Trip Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Information</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Icon name="time" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>45 min</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="car" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Vehicle</Text>
            <Text style={styles.infoValue}>Volvo XC60</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="calendar" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Posted</Text>
            <Text style={styles.infoValue}>2 hours ago</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Icon name="person" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoLabel}>Owner</Text>
            <Text style={styles.infoValue}>John D.</Text>
          </View>
        </View>
      </View>

      {/* Special Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Instructions</Text>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsText}>
            • Keys will be provided at the pickup location{'\n'}
            • Car is unlocked and ready to go{'\n'}
            • Please be careful with the leather seats{'\n'}
            • Call if you have any questions
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
          <Icon name="chatbubble" size={20} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
          <Icon name="checkmark-circle" size={20} color={Colors.white} />
          <Text style={styles.acceptButtonText}>Accept Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.secondary,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  paymentContainer: {
    alignItems: 'center',
  },
  paymentAmount: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
  },
  paymentLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  locationCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  locationAddress: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  locationDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    width: '47%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  instructionsCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  instructionsText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  contactButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.secondary,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  acceptButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
});

export default RequestDetailsScreen;
