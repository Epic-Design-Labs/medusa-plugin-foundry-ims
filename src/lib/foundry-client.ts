import { resolveConfig } from './config';

/**
 * Thin client that POSTs Medusa events to Foundry's webhook receiver.
 *
 * URL: ${apiUrl}/api/v1/channels/${channelId}/webhook/medusa
 * Auth: Authorization: Bearer ${apiKey} (Foundry's standard fims_* key)
 * Body: { topic, payload }
 *
 * Errors are logged but never thrown — a Foundry-side blip must not
 * break the merchant's order checkout. Phase 3 adds a retry queue
 * with exponential backoff so transient failures don't drop events.
 */
class FoundryClient {
  async postEvent(topic: string, payload: Record<string, unknown>): Promise<void> {
    const config = resolveConfig();
    if (!config) return;

    const url = `${config.apiUrl}/api/v1/channels/${config.channelId}/webhook/medusa`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ topic, payload }),
      });

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error(
          `[medusa-plugin-foundry-ims] post failed for ${topic}: ${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[medusa-plugin-foundry-ims] post error for ${topic}:`, err);
    }
  }
}

export const foundryClient = new FoundryClient();
