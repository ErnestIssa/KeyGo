import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

const PaymentScreen: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'swish'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentAmount = 500; // This would come from navigation params
  const platformFee = Math.round(paymentAmount * 0.05); // 5% platform fee
  const totalAmount = paymentAmount + platformFee;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed and is now held in escrow until the trip is completed.',
        [{ text: 'OK' }]
      );
    }, 3000);
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      icon: 'card',
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'swish',
      name: 'Swish',
      icon: 'phone-portrait',
      description: 'Pay with your mobile phone',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSubtitle}>Secure payment for car relocation</Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service Fee</Text>
          <Text style={styles.summaryValue}>{paymentAmount} SEK</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Fee (5%)</Text>
          <Text style={styles.summaryValue}>{platformFee} SEK</Text>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{totalAmount} SEK</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodCard,
              selectedPaymentMethod === method.id && styles.paymentMethodCardSelected,
            ]}
            onPress={() => setSelectedPaymentMethod(method.id as 'stripe' | 'swish')}
          >
            <View style={styles.paymentMethodLeft}>
              <View style={styles.paymentMethodIcon}>
                <Icon name={method.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <Text style={styles.paymentMethodDescription}>{method.description}</Text>
              </View>
            </View>
            
            <View style={[
              styles.radioButton,
              selectedPaymentMethod === method.id && styles.radioButtonSelected,
            ]}>
              {selectedPaymentMethod === method.id && (
                <Icon name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Escrow Information */}
      <View style={styles.escrowCard}>
        <View style={styles.escrowHeader}>
          <Icon name="shield-checkmark" size={24} color={Colors.success} />
          <Text style={styles.escrowTitle}>Secure Escrow Payment</Text>
        </View>
        <Text style={styles.escrowDescription}>
          Your payment is held securely until the car relocation is completed. 
          The driver will only receive payment after you confirm the service was successful.
        </Text>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.termsCard}>
        <Text style={styles.termsTitle}>Terms & Conditions</Text>
        <Text style={styles.termsText}>
          • Payment will be released to the driver upon successful completion{'\n'}
          • You can request a refund if the service is not completed as agreed{'\n'}
          • Platform fee is non-refundable{'\n'}
          • By proceeding, you agree to our Terms of Service
        </Text>
      </View>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity
          style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Icon name="lock-closed" size={20} color={Colors.white} />
          <Text style={styles.paymentButtonText}>
            {isProcessing ? 'Processing Payment...' : `Pay ${totalAmount} SEK`}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.securityText}>
          <Icon name="shield" size={14} color={Colors.textTertiary} /> 
          {' '}Secured by Stripe & Swish
        </Text>
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
  summaryCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.secondary,
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
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  paymentMethodCardSelected: {
    borderColor: Colors.primary,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  paymentMethodDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  escrowCard: {
    backgroundColor: Colors.success + '10',
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  escrowTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  escrowDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  termsCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  termsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  termsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  paymentButtonContainer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  paymentButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  paymentButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.white,
  },
  securityText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PaymentScreen;
