# Versioning and deprecation policy

This repository follows [Semantic Versioning 2.0.0](https://semver.org/). Repository release versions describe the contract artifacts in this repository; they do not identify deployment versions of the hosted service.

## Version rules

- **Patch:** editorial fixes or schema corrections that do not change the set of accepted or produced instances.
- **Minor:** backward-compatible additions, such as a new optional field, response representation, operation, or event metadata field.
- **Major:** removal or rename of a public field or operation, a newly required field, a narrowed enum/range/format, a changed authentication requirement, or another change that can break a conforming consumer.

OpenAPI `info.version` is kept aligned with repository releases. Standalone schema `$id` values contain the contract major (`v1`, `v2`, and so on), allowing incompatible majors to coexist.

## Deprecation lifecycle

When a public operation, field, representation, or schema behavior is deprecated:

1. mark it as deprecated in the machine-readable contract where the format supports that marker
2. document the replacement and migration path in the changelog
3. announce the earliest planned removal release and date
4. keep it usable for a target minimum of 180 days before removal
5. remove it only in a new major contract release

The notice period may be shortened only for a confirmed security vulnerability, legal requirement, upstream provider shutdown, or behavior that can cause unsafe side effects. Any exception must be explained in the changelog with the safest available migration path.

Deprecation is not removal. Consumers should treat deprecation warnings as migration signals, while maintainers must continue validating the deprecated shape until its documented removal.

## Source snapshots

An OpenAPI snapshot update must:

- start from the published source identified in the README
- retain only the explicit public path and schema allowlists
- resolve every local component reference
- avoid adding a capability that is absent from the source contract
- update fixtures and changelog when behavior changes
- pass `npm test` without credentials or access to the hosted service
