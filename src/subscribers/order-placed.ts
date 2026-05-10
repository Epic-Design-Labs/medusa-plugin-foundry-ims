import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { foundryClient } from '../lib/foundry-client';

/**
 * Fires when a customer places an order. We forward a thin envelope
 * `{ topic: 'order.placed', payload: { orderId } }` to Foundry —
 * Foundry's receiver re-fetches the full order via its existing
 * MedusaAdapter so the data flow stays consistent with the cron-poll
 * path.
 */
export default async function orderPlacedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await foundryClient.postEvent('order.placed', { orderId: data.id });
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
