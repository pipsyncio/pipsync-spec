import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, relativePath), "utf8"));
}

function resolveJsonPointer(document, reference) {
  assert.match(reference, /^#\//, `Only local JSON pointers are allowed: ${reference}`);
  return reference
    .slice(2)
    .split("/")
    .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, segment) => value?.[segment], document);
}

function collectReferences(value, references = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, references);
  } else if (value && typeof value === "object") {
    if (typeof value.$ref === "string") references.push(value.$ref);
    for (const item of Object.values(value)) collectReferences(item, references);
  }
  return references;
}

async function validateOpenApi() {
  const document = await readJson("openapi/openapi.json");
  const manifest = await readJson("package.json");
  const allowedOperations = {
    "/account/usage": ["get"],
    "/health": ["get"],
    "/me": ["get"],
    "/reports": ["get"],
    "/reports/schedules": ["get", "post"],
    "/reports/trades": ["get"],
    "/signals": ["get"],
    "/trades": ["get"]
  };
  const allowedPaths = Object.keys(allowedOperations);
  const allowedSchemas = [
    "AccountUsage",
    "AccountUsageLimit",
    "ReportCatalogEntry",
    "ReportScheduleEntry",
    "Signal",
    "Trade",
    "TradeReportMeta",
    "TradeReportRow"
  ];

  assert.equal(document.openapi, "3.1.0");
  assert.equal(document.info.version, manifest.version);
  assert.deepEqual(document.info.license, { name: "Proprietary" });
  assert.deepEqual(Object.keys(document.paths).sort(), allowedPaths);
  for (const [apiPath, methods] of Object.entries(allowedOperations)) {
    assert.deepEqual(
      Object.keys(document.paths[apiPath]).sort(),
      methods.toSorted(),
      `Unexpected OpenAPI operation or path-item field on ${apiPath}`
    );
  }
  assert.deepEqual(Object.keys(document.components.schemas).sort(), allowedSchemas.sort());
  assert.deepEqual(document.servers, [
    { url: "https://app.pipsync.io/api/v1", description: "Production" }
  ]);

  for (const reference of collectReferences(document)) {
    assert.notEqual(resolveJsonPointer(document, reference), undefined, `Unresolved reference: ${reference}`);
  }

  return `${allowedPaths.length} REST paths and ${allowedSchemas.length} component schemas`;
}

async function validateFixtureSet(ajv, schemaPath, fixtureRoot, expectedId) {
  const schema = await readJson(schemaPath);
  assert.equal(schema.$id, expectedId, `${schemaPath}: unexpected stable schema identifier`);
  const validate = ajv.compile(schema);
  let validCount = 0;
  let invalidCount = 0;

  for (const expected of ["valid", "invalid"]) {
    const directory = path.join(repositoryRoot, fixtureRoot, expected);
    const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
    assert.ok(files.length > 0, `No ${expected} fixtures found in ${fixtureRoot}`);

    for (const file of files) {
      const instance = JSON.parse(await readFile(path.join(directory, file), "utf8"));
      const result = validate(instance);
      if (expected === "valid") {
        assert.equal(result, true, `${fixtureRoot}/${expected}/${file}: ${ajv.errorsText(validate.errors)}`);
        validCount += 1;
      } else {
        assert.equal(result, false, `${fixtureRoot}/${expected}/${file} unexpectedly passed`);
        invalidCount += 1;
      }
    }
  }

  return `${validCount} valid and ${invalidCount} invalid fixtures`;
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const openApiResult = await validateOpenApi();
const signalResult = await validateFixtureSet(
  ajv,
  "schemas/signal.schema.json",
  "fixtures/signals",
  "https://schemas.pipsync.io/v1/signal.schema.json"
);
const webhookResult = await validateFixtureSet(
  ajv,
  "schemas/webhook-envelope.schema.json",
  "fixtures/webhooks",
  "https://schemas.pipsync.io/v1/webhook-envelope.schema.json"
);

console.log(`OpenAPI: ${openApiResult}`);
console.log(`Signal schema: ${signalResult}`);
console.log(`Webhook envelope: ${webhookResult}`);
console.log("Contract validation passed without live credentials.");
