# Change Log

## [0.2.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/0.2.0) (unreleased)
Summary Changelog:
- Delegate to the [under-pressure](https://www.npmjs.com/package/under-pressure)
  plugin the logic to report the status of the web application
- Update Fastify dependencies to '1.1.0' or higher (but on 1.x)

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
