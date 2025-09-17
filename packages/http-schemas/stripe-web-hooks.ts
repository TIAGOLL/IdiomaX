import z from "zod";
import type Stripe from 'stripe';

export type stripeWebHooksRequest = Stripe.Event