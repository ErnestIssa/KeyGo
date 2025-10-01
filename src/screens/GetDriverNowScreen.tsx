import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

const GetDriverNowScreen: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [proposedPayment, setProposedPayment] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateRequest = () => {
    if (!pickupLocation || !dropoffLocation || !proposedPayment) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Request Created',
      'Your car relocation request has been posted and drivers will be notified.',
      [{ text: 'OK' }]
    );
  };

  const quickActions = [
    { title: 'Airport Transfer', icon: 'airplane', color: Colors.primary },
    { title: 'Garage Storage', icon: 'home', color: Colors.secondary },
    { title: 'Service Center', icon: 'construct', color: Colors.warning },
    { title: 'Emergency Move', icon: 'warning', color: Colors.error },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Get Driver Now</Text>
        <Text style={styles.headerSubtitle}>
          Post a request and find a driver to relocate your car
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color={Colors.white} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Request Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Create New Request</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Pickup Location *</Text>
          <View style={styles.inputContainer}>
            <Icon name="location" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Where is your car currently parked?"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Drop-off Location *</Text>
          <View style={styles.inputContainer}>
            <Icon name="flag" size={20} color={Colors.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Where should the car be delivered?"
              value={dropoffLocation}
              onChangeText={setDropoffLocation}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Proposed Payment (SEK) *</Text>
          <View style={styles.inputContainer}>
            <Icon name="card" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Amount you're willing to pay"
              value={proposedPayment}
              onChangeText={setProposedPayment}
              keyboardType="numeric"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Additional Details</Text>
          <View style={styles.inputContainer}>
            <Icon name="document-text" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any special instructions for the driver?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
          <Icon name="add-circle" size={24} color={Colors.white} />
          <Text style={styles.createButtonText}>Create Request</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Requests */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <View style={styles.recentCard}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Central Station → Arlanda</Text>
            <Text style={styles.recentStatus}>Pending</Text>
          </View>
          <Text style={styles.recentPayment}>500 SEK</Text>
          <Text style={styles.recentTime}>Posted 2 hours ago</Text>
        </View>
      </View>
    </ScrollView>
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
  quickActionsSection: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  formSection: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  createButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  createButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  recentSection: {
    padding: Spacing.md,
  },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  recentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  recentStatus: {
    fontSize: Typography.fontSize.sm,
    color: Colors.warning,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  recentPayment: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  recentTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default GetDriverNowScreen;
