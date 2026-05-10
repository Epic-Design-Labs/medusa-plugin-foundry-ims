import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { foundryClient } from '../lib/foundry-client';

/**
 * Fires on payment + fulfillment status changes. Foundry's receiver
 * re-fetches the order, recomputes status, and transitions any active
 * reservations (commit on shipped/completed, release on refunded).
 */
export default async function orderUpdatedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await foundryClient.postEvent('order.updated', { orderId: data.id });
}

export const config: SubscriberConfig = {
  event: 'order.updated',
};
