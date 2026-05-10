/**
 * Plugin config resolver. Phase 1 reads from env vars only — Phase 2
 * adds an admin-widget-backed config module that takes precedence.
 *
 * Required: FOUNDRY_API_KEY + FOUNDRY_CHANNEL_ID
 * Optional: FOUNDRY_API_URL (defaults to https://api.foundryims.com)
 *
 * If required vars are missing, the plugin becomes a no-op and logs a
 * one-time warning at startup. We never throw — a missing config must
 * not break the merchant's order flow.
 */

export interface FoundryConfig {
  apiUrl: string;
  apiKey: string;
  channelId: string;
}

let warnedMissing = false;

export function resolveConfig(): FoundryConfig | null {
  const apiUrl = (process.env.FOUNDRY_API_URL || 'https://api.foundryims.com').replace(/\/$/, '');
  const apiKey = process.env.FOUNDRY_API_KEY;
  const channelId = process.env.FOUNDRY_CHANNEL_ID;

  if (!apiKey || !channelId) {
    if (!warnedMissing) {
      // eslint-disable-next-line no-console
      console.warn(
        '[medusa-plugin-foundry-ims] FOUNDRY_API_KEY and FOUNDRY_CHANNEL_ID must be set ' +
          'to push events to Foundry. Plugin will no-op until configured.',
      );
      warnedMissing = true;
    }
    return null;
  }

  return { apiUrl, apiKey, channelId };
}
