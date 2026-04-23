# T1 Bridge Architecture And Checkout Contracts

## Locked Decisions

- Runtime: the bridge runs on the same host and same domain as WordPress and WooCommerce, loaded inside WordPress context as a small plugin, mu-plugin, or PHP module bootstrapping `wp-load.php`.
- Frontend location: the React SPA stays under `/react/` and calls same-domain REST routes under `/wp-json/bulwar/v1`.
- REST namespace: `bulwar/v1`.
- Authoritative order path for MVP: direct Woo order creation from the bridge using WordPress-side Woo APIs or server-side Woo REST order creation.
- Explicit fallback path: Woo Store API draft-order checkout is a fallback only if the live gateway audit in T2 proves that direct Woo order creation cannot satisfy gateway constraints.
- Payment scope for MVP: manual or cash payment only. Online payment, payment intents, and gateway redirects are explicitly out of scope.
- Frontend payment intent enum for MVP: `manual_cash` only. Any other value is rejected.
- Trust boundary: the browser is untrusted for totals, delivery fees, slot validity, and product configuration integrity. The bridge recomputes all authoritative values.

## Shared Contract Rules

- Transport: JSON over HTTPS with `POST` requests.
- Encoding: UTF-8.
- Amounts: integer minor units only, under fields ending in `_minor`.
- Currency: ISO 4217 string, default `PLN`.
- Timestamps: ISO 8601 UTC strings.
- Tokens: opaque strings minted only by the bridge. Clients must not inspect or build them.
- Idempotency: `POST /checkout/orders` accepts `idempotency_key` and must treat a repeated successful submission as the same logical order request, not a new order.
- Response envelope: all three endpoints return the same top-level shape.

```json
{
  "success": true,
  "data": {},
  "meta": {
    "request_id": "8d5b7a8b-8f6f-4e75-8d4a-9c9870b6e9bb",
    "timestamp": "2026-03-24T12:00:00Z"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "QUOTE_EXPIRED",
    "message": "Delivery quote expired. Recalculate delivery cost.",
    "retryable": true,
    "field": "quote_token",
    "details": {}
  },
  "meta": {
    "request_id": "8d5b7a8b-8f6f-4e75-8d4a-9c9870b6e9bb",
    "timestamp": "2026-03-24T12:00:00Z"
  }
}
```

## Canonical Cart Line Contract

All checkout endpoints that need cart context use the same cart line contract.

```json
{
  "client_line_id": "simple:53",
  "line_type": "simple",
  "product_id": 53,
  "quantity": 2
}
```

```json
{
  "client_line_id": "special:menu-for-2:01HSPQ...",
  "line_type": "special_menu_for_2",
  "product_id": 53,
  "quantity": 1,
  "configuration": {
    "kind": "menu_for_2",
    "schema_version": 1,
    "persons": [
      {
        "person_index": 1,
        "soup_option_id": "soup-14",
        "soup_source_product_id": 14,
        "main_option_id": "main-27",
        "main_source_product_id": 27
      },
      {
        "person_index": 2,
        "soup_option_id": "soup-15",
        "soup_source_product_id": 15,
        "main_option_id": "main-28",
        "main_source_product_id": 28
      }
    ]
  }
}
```

Rules:

- `client_line_id` is required on every line so the bridge can report line-specific validation failures.
- `product_id` must always be the canonical Woo product ID, including the shell product for special items.
- `quantity` must be a positive integer.
- `configuration` is required only for non-simple line types.
- Client-submitted prices are intentionally excluded from the frozen contract. The bridge resolves price server-side.

## Token Lifecycle

### Delivery Quote Token

- Minted by `POST /wp-json/bulwar/v1/checkout/delivery-quote`.
- Opaque, signed, and bridge-owned.
- Binds: canonical destination, canonical cart fingerprint, computed delivery fee, currency, delivery diagnostics, and expiry.
- TTL: 15 minutes.
- Required for:
  - delivery slot lookup
  - final delivery order submission
- Not required for pickup.
- Invalidated when:
  - expired
  - cart fingerprint no longer matches
  - destination no longer matches
  - a successful order consumes it

### Slot Token

- Minted per returned slot by `POST /wp-json/bulwar/v1/checkout/slots`.
- Opaque, signed, and bridge-owned.
- Binds: fulfillment type, slot start and end timestamps, slot rule version, and for delivery also the accepted quote fingerprint.
- TTL: 10 minutes, capped by the underlying quote expiry for delivery slots.
- Required for final order submission for both pickup and delivery.
- Slot tokens are advisory, not reservations. Capacity is revalidated again at order creation.
- Invalidated when:
  - expired
  - slot no longer exists or capacity is exhausted
  - delivery quote dependency is expired or mismatched
  - a successful order consumes it

### Replay And Reservation Rules

- Neither token guarantees reservation of capacity or price beyond its own validation window.
- A successful order consumes the quote and slot tokens used for that order.
- Reusing consumed tokens must return `TOKEN_ALREADY_USED`.

## Error-Code Taxonomy

| HTTP | Code | Meaning | Retryable |
| --- | --- | --- | --- |
| 400 | `INVALID_JSON` | Body is not valid JSON. | false |
| 400 | `VALIDATION_ERROR` | Required fields are missing or malformed. | false |
| 400 | `UNSUPPORTED_PAYMENT_METHOD` | Payment intent is outside MVP scope. | false |
| 400 | `UNKNOWN_PRODUCT` | Product ID does not map to a canonical Woo product. | false |
| 400 | `INVALID_PRODUCT_CONFIGURATION` | Special-product configuration is malformed or not allowed. | false |
| 400 | `QUOTE_REQUIRED` | Delivery flow attempted without a quote token. | false |
| 400 | `SLOT_REQUIRED` | Order submit attempted without a slot token. | false |
| 401 | `TOKEN_INVALID` | Quote or slot token signature or payload is invalid. | false |
| 409 | `TOKEN_ALREADY_USED` | Token pair was already consumed by a successful order. | false |
| 409 | `QUOTE_MISMATCH` | Quote token does not match current cart or destination. | true |
| 409 | `QUOTE_EXPIRED` | Quote token expired. | true |
| 409 | `OUT_OF_DELIVERY_ZONE` | Address is outside the supported delivery area. | false |
| 409 | `DELIVERY_QUOTE_UNAVAILABLE` | Delivery quote cannot be computed now. | true |
| 409 | `SLOT_EXPIRED` | Slot token expired. | true |
| 409 | `SLOT_UNAVAILABLE` | Slot no longer exists or capacity is exhausted. | true |
| 409 | `FULFILLMENT_RULE_VIOLATION` | Lead time, blackout date, or pool rule blocks the request. | true |
| 409 | `ORDER_ALREADY_EXISTS` | Same idempotency key already produced an order. | false |
| 429 | `RATE_LIMITED` | Client exceeded bridge rate limits. | true |
| 500 | `ORDER_CREATE_FAILED` | Bridge failed to persist the Woo order. | true |
| 503 | `DEPENDENCY_UNAVAILABLE` | WordPress, Woo, Maps, or config dependency is temporarily unavailable. | true |

Rules:

- `VALIDATION_ERROR` should include `field` where possible.
- `QUOTE_MISMATCH` is preferred over silently recalculating a new quote during order creation.
- The bridge must never downgrade an invalid delivery order into pickup.

## Endpoint Contracts

### 1. POST `/wp-json/bulwar/v1/checkout/delivery-quote`

Purpose:

- Canonicalize the destination.
- Recompute cart subtotal from Woo product data.
- Compute delivery eligibility and fee.
- Mint a delivery quote token.

Request:

```json
{
  "destination": {
    "address_line_1": "ul. Główna 12",
    "city": "Poznań",
    "postcode": "61-001",
    "country_code": "PL",
    "place_id": "ChIJ...optional"
  },
  "cart_lines": [
    {
      "client_line_id": "simple:27",
      "line_type": "simple",
      "product_id": 27,
      "quantity": 2
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "destination": {
      "address_line_1": "ul. Główna 12",
      "city": "Poznań",
      "postcode": "61-001",
      "country_code": "PL",
      "formatted_address": "ul. Główna 12, 61-001 Poznań, PL"
    },
    "cart_subtotal_minor": 10800,
    "delivery_fee_minor": 2500,
    "currency": "PLN",
    "distance_km": 8.4,
    "is_free_delivery": false,
    "quote_token": "bq_eyJhbGciOi...",
    "expires_at": "2026-03-24T12:15:00Z",
    "diagnostics": {
      "pricing_rule": "distance_plus_base_fee"
    }
  },
  "meta": {
    "request_id": "3d93c4d1-9150-4f6a-9169-1ba1f0a7d31f",
    "timestamp": "2026-03-24T12:00:00Z"
  }
}
```

Failure cases:

- `VALIDATION_ERROR`
- `UNKNOWN_PRODUCT`
- `INVALID_PRODUCT_CONFIGURATION`
- `OUT_OF_DELIVERY_ZONE`
- `DELIVERY_QUOTE_UNAVAILABLE`
- `DEPENDENCY_UNAVAILABLE`

### 2. POST `/wp-json/bulwar/v1/checkout/slots`

Purpose:

- Return server-authoritative dates and slots.
- Keep delivery and pickup pools separate.
- Mint per-slot selection tokens.

Request for delivery:

```json
{
  "fulfillment_type": "delivery",
  "quote_token": "bq_eyJhbGciOi...",
  "window_start": "2026-03-25",
  "days": 7
}
```

Request for pickup:

```json
{
  "fulfillment_type": "pickup",
  "window_start": "2026-03-25",
  "days": 7
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "fulfillment_type": "delivery",
    "available_dates": [
      {
        "date": "2026-03-25",
        "slots": [
          {
            "label": "10:00-10:15",
            "start_at": "2026-03-25T09:00:00Z",
            "end_at": "2026-03-25T09:15:00Z",
            "remaining_capacity": 1,
            "slot_token": "bs_eyJhbGciOi...",
            "expires_at": "2026-03-24T12:10:00Z"
          }
        ]
      }
    ]
  },
  "meta": {
    "request_id": "f9cae45c-8aa8-44c9-9467-11b6cf91f3a1",
    "timestamp": "2026-03-24T12:00:00Z"
  }
}
```

Failure cases:

- `VALIDATION_ERROR`
- `QUOTE_REQUIRED`
- `TOKEN_INVALID`
- `QUOTE_EXPIRED`
- `QUOTE_MISMATCH`
- `FULFILLMENT_RULE_VIOLATION`
- `DEPENDENCY_UNAVAILABLE`

### 3. POST `/wp-json/bulwar/v1/checkout/orders`

Purpose:

- Revalidate the full order.
- Recompute product totals and delivery fee.
- Recheck slot availability.
- Create the Woo order directly.

Request:

```json
{
  "idempotency_key": "f74d7f79-f68d-4658-89c7-638849e1ff1d",
  "payment_method": "manual_cash",
  "customer": {
    "first_name": "Jan",
    "last_name": "Kowalski",
    "phone": "+48500100100",
    "email": "jan@example.com"
  },
  "fulfillment": {
    "type": "delivery",
    "quote_token": "bq_eyJhbGciOi...",
    "slot_token": "bs_eyJhbGciOi...",
    "address": {
      "address_line_1": "ul. Główna 12",
      "city": "Poznań",
      "postcode": "61-001",
      "country_code": "PL"
    },
    "customer_note": "Proszę dzwonić do furtki."
  },
  "cart_lines": [
    {
      "client_line_id": "simple:27",
      "line_type": "simple",
      "product_id": 27,
      "quantity": 2
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "order_id": 1824,
    "order_number": "1824",
    "status": "pending",
    "payment_method": "manual_cash",
    "currency": "PLN",
    "totals": {
      "items_subtotal_minor": 10800,
      "delivery_fee_minor": 2500,
      "grand_total_minor": 13300
    },
    "fulfillment": {
      "type": "delivery",
      "slot_start_at": "2026-03-25T09:00:00Z",
      "slot_end_at": "2026-03-25T09:15:00Z"
    }
  },
  "meta": {
    "request_id": "dd1c52b4-f473-4d1f-bce8-a35f34c486af",
    "timestamp": "2026-03-24T12:00:00Z"
  }
}
```

Failure cases:

- `VALIDATION_ERROR`
- `UNSUPPORTED_PAYMENT_METHOD`
- `UNKNOWN_PRODUCT`
- `INVALID_PRODUCT_CONFIGURATION`
- `QUOTE_REQUIRED`
- `QUOTE_EXPIRED`
- `QUOTE_MISMATCH`
- `SLOT_REQUIRED`
- `SLOT_EXPIRED`
- `SLOT_UNAVAILABLE`
- `TOKEN_ALREADY_USED`
- `ORDER_ALREADY_EXISTS`
- `ORDER_CREATE_FAILED`
- `DEPENDENCY_UNAVAILABLE`

## Implementation Boundary Notes

- This document freezes contracts and architecture only. It does not authorize frontend integration work or PHP runtime implementation.
- The bridge must map `manual_cash` onto the actual Woo payment method code configured on the live site during implementation.
- Delivery quote and slot tokens must be implemented so the React client can treat them as opaque state.
- Slot responses must remain frontend-stable even if the backing source moves from server-owned JSON to CPT-managed data later.

## Residual Open Questions

- T2 must confirm which Woo payment method code will represent `manual_cash` on the live site, for example `cod` or another manual method.
- T2 must confirm whether any live gateway or plugin constraint invalidates the chosen direct-order MVP path.
- T3 must finalize the schedule source model and concrete slot-generation schema, but without changing the request and response contracts frozen here.