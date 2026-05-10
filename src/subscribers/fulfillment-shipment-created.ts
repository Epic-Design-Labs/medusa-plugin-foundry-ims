import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { foundryClient } from '../lib/foundry-client';

/**
 * Fires when a fulfillment gets a tracking number — Medusa-side
 * shipment creation. Foundry's receiver upserts the corresponding
 * Shipment row so tracking is visible in Foundry's admin without
 * waiting for the next polling cycle.
 *
 * Payload includes order_id; Foundry re-fetches the full order and
 * walks its shipments[] array.
 */
export default async function fulfillmentShipmentCreatedHandler({
  event: { data },
}: SubscriberArgs<{ id: string; order_id: string }>) {
  await foundryClient.postEvent('fulfillment.shipment_created', {
    orderId: data.order_id,
    fulfillmentId: data.id,
  });
}

export const config: SubscriberConfig = {
  event: 'fulfillment.shipment_created',
};
