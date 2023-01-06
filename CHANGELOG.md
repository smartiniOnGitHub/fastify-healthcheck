# Change Log

## [4.4.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.4.0) (2023-01-06)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/4.3.0...4.4.0)
Summary Changelog:
- Updated requirements to Fastify '^4.11.0' and all other dependencies to latest
- Adds schema options for health endpoint

## [4.3.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.3.0) (2022-12-12)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/4.2.0...4.3.0)
Summary Changelog:
- Updated requirements to Fastify '^4.10.2' and under-pressure '^8.2.0'; 
  updated all other dependencies to latest
- Compatibility with TypeScript 4.9 and NodeNext / ESNext

## [4.2.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.2.0) (2022-09-01)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/4.1.0...4.2.0)
Summary Changelog:
- Updated requirements to Fastify '^4.5.3' and under-pressure '^8.1.0'
- Compatibility with TypeScript 4.8
- Improve plugin source docs, with JSDoc
- Simplified/updated plugin tests

## [4.1.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.1.0) (2022-07-19)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/4.0.0...4.1.0)
Summary Changelog:
- Updated requirements to Fastify '^4.0.1'
- Ensure all is good as before

## [4.0.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.0.0) (2022-06-13)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/3.2.0...4.0.0)
Summary Changelog:
- Updated requirements to Fastify '^4.0.0'; update code with related changes
- Updated all dependencies to latest (for Node.js 14 LTS)
- Update dependencies from 'under-pressure' to the new (scoped) 
  package '@fastify/under-pressure'
- Update and simplified example and test code
- Update example Docker files to use Node.js slim image as base 
  to reduce image size and all is good
- Update documentation from sources with JSDoc

## [3.2.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/3.2.0) (2022-06-13)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/3.1.0...3.2.0)
Summary Changelog:
- Updated requirements to Fastify '3.11.0' or higher (but still 3.x)
- Updated all dependencies to latest (for Node.js 10 LTS)
- Update Copyright year
- Update Tap configuration and small simplifications in tests
- Generate documentation from sources with JSDoc

## [3.1.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/3.1.0) (2021-02-09)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-favicon/compare/3.0.0...3.1.0)
Summary Changelog:
- Updated requirements to Under-pressure '^5.6.0'
- Update all dependencies to latest, and removed 'standardx' (as dev dependency)
- Fix some (now) failing tests
- Fix exposure of uptime after requested the first time
- Ensure compatibility with Under-pressure option to specify a custom route for healthcheck/status

## [3.0.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/3.0.0) (2020-07-24)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-favicon/compare/2.3.1...3.0.0)
Summary Changelog:
- Updated requirements to Fastify '^3.0.0' (as dev dependency)
- Updated all dependencies to latest
- Update TypeScript types

## [2.3.1](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/2.3.1) (2020-06-01)
Summary Changelog:
- Fix TypeScript types

## [2.3.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/2.3.0) (2020-05-26)
Summary Changelog:
- Add TypeScript types
- Update requirements to Fastify '^2.14.1' (as dev dependency)
- Update dependency on 'under-pressure' 4.x in this release (latest for Fastify 2.x)
- Update other dev dependencies

## [2.2.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/2.2.0) (2020-05-24)
Summary Changelog:
- Add a new plugin flag 'exposeUptime' (by default false, so disabled) 
  to add even Node.js process uptime in the reply, when enabled
- Updated requirements to Fastify '^2.8.0' (as dev dependency)
- Keep dependency on 'under-pressure' 3.x in this release
- Updated other dev dependencies

## [2.1.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/2.1.0) (2019-05-08)
Summary Changelog:
- Updated requirements to Fastify '^2.1.0'
- Updated to latest 'under-pressure', which drops support for Node.js 6
- Updated all dependencies

## [2.0.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/2.0.0) (2019-02-26)
Summary Changelog:
- Updated requirements to Fastify 2.x
- Updated all dependencies
- Note that this release number is aligned with 'under-pressure' 2.x, so for Fastify v2

## [1.0.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/1.0.0) (2019-02-03)
Summary Changelog:
- Updated all dependencies
- Updated Tap tests
- Note that this release number means that the plugin is stable, 
  and aligned with 'under-pressure' 1.x, and Fastify v1

## [0.3.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/0.3.0) (2019-01-26)
Summary Changelog:
- Update `under-pressure` to '1.x' and update all dev dependencies to latest release
- Note that the minor release change here is to let consumers of this package 
  to have more evidence of underlying library release changes

## [0.2.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/0.2.0) (2018-11-27)
Summary Changelog:
- Delegate to the [under-pressure](https://www.npmjs.com/package/under-pressure)
  plugin the logic to report the status of the web application
- To fully encapsulate `under-pressure` features, removed the dependency
  on [fastify-plugin](https://github.com/fastify/fastify-plugin);
  for more info look [here](https://github.com/fastify/fastify/blob/master/docs/Plugins.md#handle-the-scope), 
  [here](https://github.com/fastify/fastify/blob/master/docs/Plugins-Guide.md#how-to-handle-encapsulation-and-distribution)
- Update Fastify dependencies to '1.1.0' or higher (but on 1.x),
  but without `fastify-plugin` to check it now (see related changes)
- Add another example (`example-under-pressure-fail`) with `under-pressure`
  configured to always return a `Service Unavailable` error (HTTP 503),
  and related `Dockerfile-fail.example` to simplify its usage (as a sample)
- Update `healthcheck` standalone script to return 0 for success,
  or the HTTP error code in case of failure (or 1 in case of other failure)

## [0.1.1](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/0.1.1) (2018-11-13)
Summary Changelog:
- Maintenance release to fix Fastify dependencies to '1.x', 
  to avoid breaking changes because Fastify '2.x' will be released soon
- Updated dependencies to latest Fastify plugin (1.2.1) 
  and Fastify 1.x (1.13.0)

## [0.1.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/0.1.0) (2018-10-31)
Summary Changelog:
- First release, with basic features: 
  expose an healthcheck route,
  add a script to check the health status by calling that route via HTTP GET
- Ability to override some features, with plugin options
- Add a sample webapp using it
- Add a sample Dockerfile with the HEALTHCHECK directive
- Add sample Docker commands to show and simplify its usage
- Add some documentation

----
