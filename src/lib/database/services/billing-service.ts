import { supabase } from '../client';
import { logger } from '@/lib/logger';
import { PaymentData, Subscription, SubscriptionData } from '../types';

export class BillingService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  static async recordPayment(paymentData: PaymentData): Promise<void> {
    if (!this.checkDatabase()) {
      logger.info('Mock record payment:', paymentData);
      return;
    }

    try {
      const { error } = await supabase!
        .from('payments')
        .insert({
          user_id: paymentData.user_id,
          stripe_payment_intent_id: paymentData.stripe_payment_intent_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          description: paymentData.description,
          metadata: paymentData.metadata,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Error recording payment:', error);
      }
    } catch (error) {
      logger.error('Database error recording payment:', error);
    }
  }

  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    if (!this.checkDatabase()) {
      return {
        id: 'mock-subscription',
        user_id: userId,
        stripe_subscription_id: 'mock-stripe-sub',
        stripe_customer_id: 'mock-stripe-customer',
        tier: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase!
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        logger.error('Error fetching user subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async updateSubscription(subscriptionData: SubscriptionData): Promise<void> {
    if (!this.checkDatabase()) {
      logger.info('Mock update subscription:', subscriptionData);
      return;
    }

    try {
      const { error } = await supabase!
        .from('subscriptions')
        .upsert(
          {
            ...subscriptionData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'stripe_subscription_id' }
        );

      if (error) {
        logger.error('Error updating subscription:', error);
      }
    } catch (error) {
      logger.error('Database error updating subscription:', error);
    }
  }
}