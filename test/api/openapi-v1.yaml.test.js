const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const { getProperlyCasedRealPath } = require('../support/built-site-helpers');
const SwaggerParser = require('@apidevtools/swagger-parser');

let api;

beforeAll(async () => {
  api = await SwaggerParser.validate('api/v1/openapi.yaml');
})

test('the v1 API specification is an OpenAPI specification', async () => {
  // The validate method throws if the spec is invalid, and any version
  // greater than 3 is OpenAPI.
  expect(api.openapi).toMatch(/^3/);
});

test('every API path exists and returns json', async () => {
  const basePaths = api.servers.map(({url}) => url.replace('https://faq.coronavirus.gov/', ''));

  await Promise.all(...basePaths.map(basePath => {
    return Object.entries(api.paths).map(async ([endpoint]) => {
      const filename = `_site/${basePath}${endpoint}`;
      const expectedFilename = await getProperlyCasedRealPath(filename);
      const responseBody = await readFile(filename, 'utf8');

      // Will throw if is invalid JSON
      JSON.parse(responseBody);

      expect(filename).toBe(expectedFilename);
    })
  }));
});
