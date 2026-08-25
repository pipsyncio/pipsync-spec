# Changelog

All notable contract changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and releases follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-25

### Added

- Sanitized OpenAPI 3.1 snapshot containing only allowlisted public customer resources and their referenced models.
- Versioned signal and webhook-envelope JSON Schemas using JSON Schema Draft 2020-12.
- Synthetic valid and invalid fixture sets for both standalone schemas.
- Deterministic local validation and a credential-free GitHub Actions workflow.
- Semantic Versioning and deprecation policy.

### Fixed

- Preserved the hosted API's upstream `Proprietary` `info.license` declaration
  while documenting the repository-content license separately.
- Locked the sanitized OpenAPI surface by HTTP method as well as path and schema.
- Pinned stable major-version schema identifiers while retaining the v1 format
  acceptance surface and arbitrary RFC 3339 fractional-second precision.

[Unreleased]: https://github.com/pipsyncio/pipsync-spec/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pipsyncio/pipsync-spec/releases/tag/v1.0.0
