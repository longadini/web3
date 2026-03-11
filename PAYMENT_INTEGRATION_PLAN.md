# Payment Gateway Integration Plan (Stripe/PayPal)

This document outlines the high-level plan for integrating a transactional gateway (e.g., Stripe) into the Web3 Nexus platform.

## 1. Prerequisites
- **Stripe/PayPal Account:** Create a developer account and obtain API keys.
- **Environment Variables:** Define the following in `.env.example`:
  - `STRIPE_SECRET_KEY` (Server-side)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Client-side)

## 2. Integration Steps

### A. Server-Side (API Routes)
- Create an API route (`app/api/create-payment-intent/route.ts`) to handle payment intent creation.
- Use the `stripe` SDK to create a payment intent.
- **Integration with Wallet:** The payment intent should be linked to the user's wallet address (passed from the client) to ensure the purchase is associated with the correct on-chain identity.

### B. Client-Side (React Component)
- Create a `PaymentButton` component.
- When clicked, it calls the API route to get the `clientSecret`.
- Use the Stripe Elements SDK to handle the payment form and confirm the payment.

### C. Webhooks
- Implement a webhook endpoint (`app/api/webhook/route.ts`) to listen for payment success events from Stripe/PayPal.
- On success, update the user's inventory or status in the Firebase database.

## 3. Security Considerations
- **Never** expose `STRIPE_SECRET_KEY` on the client.
- Always validate the user's wallet address on the server before creating a payment intent.
- Use webhooks to verify payment completion, not just the client-side response.
