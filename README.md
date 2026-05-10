# @foundry-ims/medusa-plugin-foundry-ims

Real-time integration between [Medusa](https://medusajs.com) and [Foundry IMS](https://foundryims.com). Pushes order, inventory, and fulfillment events from your Medusa store to Foundry the moment they happen — replaces polling with native Medusa event subscribers.

## What this plugin does

Subscribes to Medusa events and forwards them to your Foundry workspace:

| Medusa event | What Foundry does |
|---|---|
| `order.placed` | Imports the order, creates inventory reservations |
| `order.updated` | Updates order status, transitions reservations on shipment/refund |
| `order.canceled` | Releases all active reservations |
| `fulfillment.shipment_created` | Records the tracking number against the order |

The plugin sends a thin event envelope (`{ topic, payload: { orderId } }`); Foundry refetches the full order from your Medusa admin API for the rest. Your Foundry API key is the auth — no separate webhook secret to manage.

## Requirements

- Medusa **v2.3.0+** (plugin support landed in 2.3.0)
- Node 20+
- A Foundry IMS account at [foundryims.com](https://foundryims.com) with:
  - A `MEDUSA` channel created (Sales Channels → Add Channel → Medusa)
  - An API key (Settings → API Keys → Create)

## Install

```bash
npm install @foundry-ims/medusa-plugin-foundry-ims
# or
yarn add @foundry-ims/medusa-plugin-foundry-ims
```

In your `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...your existing config...
  plugins: [
    {
      resolve: "@foundry-ims/medusa-plugin-foundry-ims",
      options: {},
    },
  ],
})
```

## Configure

The plugin reads three environment variables:

| Var | Required | Default | Where to get it |
|---|---|---|---|
| `FOUNDRY_API_KEY` | yes | — | Foundry → Settings → API Keys → Create. Starts with `fims_`. |
| `FOUNDRY_CHANNEL_ID` | yes | — | Foundry → Sales Channels → Medusa → URL contains the channel UUID. |
| `FOUNDRY_API_URL` | no | `https://api.foundryims.com` | Override only for self-hosted or staging Foundry instances. |

Add to your Medusa server's `.env`:

```bash
FOUNDRY_API_KEY=fims_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FOUNDRY_CHANNEL_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Restart your Medusa server. Place a test order — Foundry should receive it within ~1 second.

## Verifying the connection

After a test order:

```bash
curl -H "Authorization: Bearer $FOUNDRY_API_KEY" \
  "$FOUNDRY_API_URL/api/v1/orders?limit=5"
```

You should see your order in the response. If not, check your Medusa logs for `[@foundry-ims/medusa-plugin-foundry-ims]` warnings — usually a missing env var.

## Troubleshooting

**Plugin warns "FOUNDRY_API_KEY and FOUNDRY_CHANNEL_ID must be set..." on startup.**
The plugin couldn't find one or both required env vars. Double-check your `.env` and that you've restarted Medusa.

**Orders aren't appearing in Foundry.**
1. Confirm the API key is valid (curl test above).
2. Confirm the channel ID matches the one shown in Foundry's URL.
3. Check Medusa server logs for `[@foundry-ims/medusa-plugin-foundry-ims] post failed: ...`.
4. Confirm `orderSyncEnabled` is on for the Foundry channel (Foundry → Sales Channels → Medusa → Settings).

**The plugin works but Foundry shows the wrong status / out-of-date inventory.**
Foundry refetches via the Medusa admin API on every event. Make sure the `adminApiToken` configured on the Foundry channel is still valid (Settings → Foundry → Sales Channels → Medusa → Edit credentials).

## What this plugin does NOT do

- It does not push *outbound* changes (Foundry → Medusa). That direction is handled by Foundry's existing Medusa adapter.
- It does not provide an admin UI inside Medusa (yet — coming in v0.2.0).
- It does not have built-in retry logic for failed posts (yet — coming in v0.3.0). For now, Foundry's 5-minute order-sync cron is the safety net.

## Roadmap

- **v0.2.0** — Admin widget inside Medusa Settings: configure API key + channel ID without env vars.
- **v0.3.0** — Retry queue for failed event posts. Health-check endpoint. Inventory + product subscribers.

## Support

- [Foundry docs](https://foundryims.com/docs)
- [GitHub issues](https://github.com/Epic-Design-Labs/medusa-plugin-foundry-ims/issues)
- [Foundry support email](mailto:support@foundryims.com)

## License

MIT
