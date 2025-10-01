import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

const AccountScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Profile',
      items: [
        { title: 'Personal Information', icon: 'person', onPress: () => console.log('Personal Info') },
        { title: 'Verification Status', icon: 'checkmark-circle', onPress: () => console.log('Verification') },
        { title: 'Payment Methods', icon: 'card', onPress: () => console.log('Payment Methods') },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Notifications', icon: 'notifications', type: 'switch', value: notificationsEnabled, onPress: setNotificationsEnabled },
        { title: 'Location Tracking', icon: 'location', type: 'switch', value: locationTrackingEnabled, onPress: setLocationTrackingEnabled },
        { title: 'Privacy Settings', icon: 'shield', onPress: () => console.log('Privacy') },
        { title: 'Language', icon: 'language', onPress: () => console.log('Language') },
      ],
    },
    {
      title: 'Support',
      items: [
        { title: 'Help Center', icon: 'help-circle', onPress: () => console.log('Help') },
        { title: 'Contact Support', icon: 'chatbubble', onPress: () => console.log('Contact') },
        { title: 'Report a Problem', icon: 'warning', onPress: () => console.log('Report') },
        { title: 'Terms of Service', icon: 'document-text', onPress: () => console.log('Terms') },
        { title: 'Privacy Policy', icon: 'lock-closed', onPress: () => console.log('Privacy Policy') },
      ],
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.menuItem}
      onPress={() => item.type === 'switch' ? null : item.onPress()}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Icon name={item.icon} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: Colors.gray[300], true: Colors.primary }}
          thumbColor={item.value ? Colors.white : Colors.gray[500]}
        />
      ) : (
        <Icon name="chevron-forward" size={20} color={Colors.textTertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color={Colors.white} />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="camera" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
        
        <View style={styles.verificationBadge}>
          <Icon name="checkmark-circle" size={16} color={Colors.success} />
          <Text style={styles.verificationText}>Verified User</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Completed Trips</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Active Requests</Text>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={section.title} style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{section.title}</Text>
          <View style={styles.menuItemsContainer}>
            {section.items.map((item, itemIndex) => (
              <View key={item.title}>
                {renderMenuItem(item)}
                {itemIndex < section.items.length - 1 && <View style={styles.menuItemDivider} />}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={20} color={Colors.error} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>KeyGo v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  verificationText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.success,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  menuSectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  menuItemsContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemTitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 60, // Align with text after icon
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  logoutButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  versionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
  },
});

export default AccountScreen;
