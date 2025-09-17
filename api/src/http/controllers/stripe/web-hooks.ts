import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { stripeWebHooksRequest } from '@idiomax/http-schemas/stripe-web-hooks'

export async function GetProducts(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/stripe/web-hooks',
            {
                schema: {
                    tags: ['Subscriptions'],
                    summary: 'Obter dados dos eventos do Stripe',
                    security: [{ bearerAuth: [] }],
                    body: stripeWebHooksRequest,
                    response: {
                        200: { type: 'null' }
                    }
                },
            },
            async (request, reply) => {
                // let event = request.body;
                // // Replace this endpoint secret with your endpoint's unique secret
                // // If you are testing with the CLI, find the secret by running 'stripe listen'
                // // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
                // // at https://dashboard.stripe.com/webhooks
                // const endpointSecret = 'whsec_12345';
                // // Only verify the event if you have an endpoint secret defined.
                // // Otherwise use the basic event deserialized with JSON.parse
                // if (endpointSecret) {
                //     // Get the signature sent by Stripe
                //     const signature = request.headers['stripe-signature'];
                //     try {
                //         event = stripe.webhooks.constructEvent(
                //             request.body,
                //             signature,
                //             endpointSecret
                //         );
                //     } catch (err) {
                //         console.log(`⚠️  Webhook signature verification failed.`, err.message);
                //         return response.sendStatus(400);
                //     }
                // }
                // let subscription;
                // let status;
                // // Handle the event
                // switch (event.type) {
                //     case 'customer.subscription.trial_will_end':
                //         subscription = event.data.object;
                //         status = subscription.status;
                //         console.log(`Subscription status is ${status}.`);
                //         // Then define and call a method to handle the subscription trial ending.
                //         // handleSubscriptionTrialEnding(subscription);
                //         break;
                //     case 'customer.subscription.deleted':
                //         subscription = event.data.object;
                //         status = subscription.status;
                //         console.log(`Subscription status is ${status}.`);
                //         // Then define and call a method to handle the subscription deleted.
                //         // handleSubscriptionDeleted(subscriptionDeleted);
                //         break;
                //     case 'customer.subscription.created':
                //         subscription = event.data.object;
                //         status = subscription.status;
                //         console.log(`Subscription status is ${status}.`);
                //         // Then define and call a method to handle the subscription created.
                //         // handleSubscriptionCreated(subscription);
                //         break;
                //     case 'customer.subscription.updated':
                //         subscription = event.data.object;
                //         status = subscription.status;
                //         console.log(`Subscription status is ${status}.`);
                //         // Then define and call a method to handle the subscription update.
                //         // handleSubscriptionUpdated(subscription);
                //         break;
                //     case 'entitlements.active_entitlement_summary.updated':
                //         subscription = event.data.object;
                //         console.log(`Active entitlement summary updated for ${subscription}.`);
                //         // Then define and call a method to handle active entitlement summary updated
                //         // handleEntitlementUpdated(subscription);
                //         break;
                //     default:
                //         // Unexpected event type
                //         console.log(`Unhandled event type ${event.type}.`);
                // }
                // // Return a 200 response to acknowledge receipt of the event
                reply.status(200).send();
            })
}
