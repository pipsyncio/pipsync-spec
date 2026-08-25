# OpenAPI snapshot provenance

| Field | Value |
| --- | --- |
| Source | `https://pipsync.io/api/v1/openapi.json` |
| Retrieved (UTC) | `2026-08-25T12:26:02Z` |
| Source SHA-256 | `95de0e0d99d4b657c9308ca4b12004079aba15b5f8f32809d201c2efcfc8be05` |
| Sanitized SHA-256 | `16b2af2cc0b357fe006f70bc7b40d95cb2b27f8730da1e2402b426e8c77be888` |

## Deterministic transformation

The published `openapi/openapi.json` was produced from the source above with three transformations:

1. retain only the eight public paths asserted by `scripts/validate.mjs`
2. retain only the eight public component schemas asserted by the same test
3. express source `nullable: true` string fields as OpenAPI 3.1 / JSON Schema type unions (`["string", "null"]`)

The source API's `info.license` value remains `Proprietary`; the repository's
Apache-2.0 license applies separately to repository content and developer tooling.
No API path, operation, parameter, response, authentication requirement, media
type, data-model property, example, or enum was added. Formatting changed from
compact to two-space-indented JSON.

The validation suite intentionally works offline. Updating the snapshot requires a maintainer to retrieve the source, review the diff, reapply the allowlists, update these digests and the changelog, and run `npm test`.
