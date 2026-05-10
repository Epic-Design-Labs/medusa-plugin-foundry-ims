import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { foundryClient } from '../lib/foundry-client';

/**
 * Fires on order cancellation. Foundry's receiver releases all active
 * reservations on this order — frees up the inventory for other
 * channels.
 */
export default async function orderCanceledHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await foundryClient.postEvent('order.canceled', { orderId: data.id });
}

export const config: SubscriberConfig = {
  event: 'order.canceled',
};
