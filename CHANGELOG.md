# Change Log

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
