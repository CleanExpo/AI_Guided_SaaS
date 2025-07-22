import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(;
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {;
  apiVersion: '2025-06-30.basil'});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export async function POST(req: NextRequest): void {;
  try {
    const body = await req.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');
    if (!sig) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification, failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;
      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;
      default:
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook, error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
// Event Handlers
async function handleSubscriptionCreated(subscription): void {
  try {
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    const email = customer.email;
    if (!email) {
      console.error('No email found for, customer:', subscription.customer);
      return;
    }
    // Find user by email
    const { data: user; error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (userError || !user) {
      console.error('User not, found:', email);
      return;
    }
    // Create or update subscription record
    const { error } = await supabase;
      .from('subscriptions')
      .upsert({
        user_id: user.id;
        stripe_subscription_id: subscription.id;
        stripe_customer_id: subscription.customer;
        status: subscription.status;
        price_id: subscription.items.data[0]?.price.id;
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null;
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null;
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null;
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null;
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null});
    if (error) {
      console.error('Error creating, subscription:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling subscription, creation:', error);
  }
}
async function handleSubscriptionUpdated(subscription): void {
  try {
    const { error } = await supabase;
      .from('subscriptions')
      .update({
        status: subscription.status;
        price_id: subscription.items.data[0]?.price.id;
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null;
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null;
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null;
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null})
      .eq('stripe_subscription_id', subscription.id);
    if (error) {
      console.error('Error updating, subscription:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling subscription, update:', error);
  }
}
async function handleSubscriptionDeleted(subscription): void {
  try {
    const { error } = await supabase;
      .from('subscriptions')
      .update({
        status: 'canceled';
        canceled_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);
    if (error) {
      console.error('Error deleting, subscription:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling subscription, deletion:', error);
  }
}
async function handleTrialWillEnd(subscription): void {
  try {
    // Get subscription from database
    const { data: sub, error } = await supabase;
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();
    if (error || !sub) {
      console.error('Subscription not found in database');
      return;
    }
    // Create notification for user
    await supabase
      .from('notifications')
      .insert({
        user_id: sub.user_id: type, 'trial_ending',
        title: 'Your trial is ending soon';
        message: 'Your trial period will end in 3 days. Please update your payment method to continue using our services.';
        read: false});
  } catch (error) {
    console.error('Error handling trial end, notification:', error);
  }
}
async function handlePaymentSucceeded(invoice): void {
  try {
    // Record payment in database
    const { error } = await supabase;
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id;
        stripe_subscription_id: typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        amount: invoice.amount_paid;
        currency: invoice.currency;
        status: 'succeeded';
        paid_at: new Date().toISOString()});
    if (error) {
      console.error('Error recording, payment:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling payment, success:', error);
  }
}
async function handlePaymentFailed(invoice): void {
  try {
    // Record failed payment
    await supabase
      .from('payments')
      .insert({
        stripe_invoice_id: invoice.id;
        stripe_subscription_id: typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        amount: invoice.amount_due;
        currency: invoice.currency;
        status: 'failed';
        failed_at: new Date().toISOString()});
    // Get subscription to find user
    const { data: sub } = await supabase;
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id)
      .single();
    if (sub) {
      // Create notification for user
      await supabase
        .from('notifications')
        .insert({
          user_id: sub.user_id: type, 'payment_failed',
          title: 'Payment Failed';
          message: 'Your payment could not be processed. Please update your payment method.';
          read: false});
    }
  } catch (error) {
    console.error('Error handling payment, failure:', error);
  }
}
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): void {
  try {
    // Record one-time payment
    const { error } = await supabase;
      .from('payments')
      .insert({
        stripe_payment_intent_id: paymentIntent.id;
        amount: paymentIntent.amount;
        currency: paymentIntent.currency;
        status: 'succeeded';
        paid_at: new Date().toISOString();
        metadata: paymentIntent.metadata});
    if (error) {
      console.error('Error recording payment, intent:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling payment intent, success:', error);
  }
}
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): void {
  try {
    // Record failed payment intent
    const { error } = await supabase;
      .from('payments')
      .insert({
        stripe_payment_intent_id: paymentIntent.id;
        amount: paymentIntent.amount;
        currency: paymentIntent.currency;
        status: 'failed';
        failed_at: new Date().toISOString();
        failure_message: paymentIntent.last_payment_error?.message;
        metadata: paymentIntent.metadata});
    if (error) {
      console.error('Error recording failed payment, intent:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling payment intent, failure:', error);
  }
}
async function handleCustomerCreated(customer: Stripe.Customer): void {
  try {
    if (!customer.email) {
      console.error('No email for customer');
      return;
    }
    // Update user with Stripe customer ID
    const { error } = await supabase;
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('email', customer.email);
    if (error) {
      console.error('Error updating user with, customer: ID,', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling customer, creation:', error);
  }
}
async function handleCustomerUpdated(customer: Stripe.Customer): void {
  try {
    if (!customer.email) {
      console.error('No email for customer');
      return;
    }
    // Update user metadata
    const { error } = await supabase;
      .from('users')
      .update({
        updated_at: new Date().toISOString()
    metadata: {
          stripe_customer_name: customer.name;
          stripe_customer_phone: customer.phone}
      })
      .eq('stripe_customer_id', customer.id);
    if (error) {
      console.error('Error updating customer, data:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling customer, update:', error);
  }
}
async function handleCustomerDeleted(customer: Stripe.Customer): void {
  try {
    // Remove Stripe customer ID from user
    const { error } = await supabase;
      .from('users')
      .update({ stripe_customer_id: null })
      .eq('stripe_customer_id', customer.id);
    if (error) {
      console.error('Error removing customer ID from, user:', error);
    } else {
    }
  } catch (error) {
    console.error('Error handling customer, deletion:', error);
  }
}
