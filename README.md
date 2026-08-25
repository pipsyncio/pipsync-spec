# pipsync-spec

Versioned public contracts for PipSync integrations.

This repository contains:

- a sanitized OpenAPI 3.1 snapshot of the documented public REST API
- standalone JSON Schemas for a signal interchange object and a webhook envelope
- synthetic valid and invalid fixtures
- local and CI validation that requires no API key, customer data, or network service

> [!IMPORTANT]
> The OpenAPI document is authoritative for the live REST paths it contains. The standalone schemas are community interchange contracts for SDKs, examples, mocks, and conformance tools. They do not declare additional live PipSync endpoints.

## Validate locally

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm test
```

`npm test` validates the OpenAPI structure, resolves local component references, checks the public path/schema allowlists, compiles both JSON Schemas, and proves that every synthetic fixture has its expected valid or invalid outcome.

## Repository layout

```text
openapi/openapi.json                 Sanitized REST API contract
schemas/signal.schema.json           Signal interchange schema
schemas/webhook-envelope.schema.json Webhook envelope schema
fixtures/                            Synthetic positive and negative examples
scripts/validate.mjs                 Deterministic contract test runner
```

## OpenAPI scope

The snapshot is derived from [`https://pipsync.io/api/v1/openapi.json`](https://pipsync.io/api/v1/openapi.json). It retains only the explicitly published customer API paths and the component schemas referenced by that surface. Non-customer operational resources from the source export are excluded by an allowlist. The OpenAPI document preserves the source API's `Proprietary` `info.license` declaration. The repository's Apache-2.0 license applies separately to repository content and developer tooling; it does not grant hosted-API access or change the service's subscription, authentication, or terms. [`SOURCE.md`](SOURCE.md) records the input and output digests and the complete transformation policy.

The contract currently documents:

- an unauthenticated health probe
- authenticated profile, signals, trades, usage, and report resources
- bearer API-key authentication and RFC 7807-style error responses
- JSON, CSV, and PDF representations where each operation declares them

No undocumented write, webhook-ingress, broker-execution, streaming, sandbox, or MCP endpoint is implied here.

## Webhook safety

`webhook-envelope.schema.json` validates message shape only. Authentication is a transport concern and must be completed before trusted persistence or side effects. A receiver should:

1. read and preserve the exact raw request body
2. verify the sender using the algorithm and headers defined by that transport
3. derive or read a durable event identity from authenticated content
4. atomically claim the idempotency key before executing work
5. return duplicate-safe responses without repeating side effects
6. retain immutable receipt history for retries or authorized replay

Fixtures intentionally contain no signatures or credentials. Do not infer a signing algorithm or header name from this repository.

## Compatibility

Contract releases follow [Semantic Versioning and the deprecation policy](VERSIONING.md). Changes are recorded in [`CHANGELOG.md`](CHANGELOG.md). Consumers should pin a released major version or commit instead of loading `main` at runtime.

## Contributing and security

The shared [`pipsyncio/.github`](https://github.com/pipsyncio/.github) contribution and security policies apply. Never contribute real signals, customer/account identifiers, authorization headers, webhook secrets, production logs, private URLs, or broker credentials. Report vulnerabilities privately through GitHub Security Advisories.

## Continue with PipSync

Use this repository when you need a pinned, reviewable contract. For hosted API
authentication, scopes, rate limits, and integration guidance, continue with the
[PipSync API reference](https://pipsync.io/en/api-docs?utm_source=github&utm_medium=repository&utm_campaign=developer-tools&utm_content=pipsync-spec).

## License

Repository content and tooling: Apache-2.0, see [`LICENSE`](LICENSE). The hosted
API remains proprietary and subject to its own access rules and terms, as retained
in the OpenAPI `info.license` field.

Trading involves risk. These contracts are developer tooling, not financial advice or a guarantee of execution or returns.
