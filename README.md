# fastify-healthcheck

  [![NPM Version](https://img.shields.io/npm/v/fastify-healthcheck.svg?style=flat)](https://npmjs.org/package/fastify-healthcheck/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-healthcheck.svg?style=flat)](https://npmjs.org/package/fastify-healthcheck/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/fastify-healthcheck/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/fastify-healthcheck/?branch=master)
  [![dependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-healthcheck/status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-healthcheck)
  [![devDependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-healthcheck/dev-status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-healthcheck?type=dev)

Fastify Plugin to serve responses that report about the web application,
if it's still running and alive (health checks).

This is very useful with Containers like `Docker`
and orchestrators like `Kubernetes`.

With this plugin, Fastify by default expose an healthcheck route configured
for `/health` GET requests, and even a script that can be executed to get
content via HTTP GET from that running web application.


## Usage

The plugin can be used without specifying options, so good default values
will be used, but if needed can be specified:
- `healthcheckUrl`, to set a different uri for the healthcheck route
- `healthcheckUrlDisable`, to not publish the healthcheck route
- `healthcheckUrlAlwaysFail`, to always return failure responses (useful to test failure responses)
- `exposeUptime`, to return even Node.js process uptime (by default disabled)

Under the hood, the healthcheck status is determined by the 
[under-pressure](https://www.npmjs.com/package/under-pressure) plugin, 
used here as a dependency; so it's possible to specify all its
configuration options here.

To use all default values for `healthcheck` options, do not set its options
(or set with undefined values); in that way no `under-pressure` specific
options will be overridden by them.


Sample usage:

```js
const fastify = require('fastify')()

// example without specifying options, returning a default healthcheck
// route mapped to '/health' that only reply to a GET request
fastify.register(require('fastify-healthcheck'))
// or
// example with custom healthcheck url and response to always fail
// fastify.register(require('fastify-healthcheck'), { healthcheckUrl: '/custom-health', healthcheckUrlAlwaysFail: true })
//

fastify.listen(3000)

// To test, for example (in another terminal session) do:
// `npm start`, or
// `curl http://127.0.0.1:3000/health` => returning an HTTP response 200 (OK)
// and a JSON response like: {"statusCode":200,"status":"ok"}
// or run the healthcheck script, for example with:
// `node src/healthcheck http://localhost:3000/health`
// and get the same HTTP response seen before
```

In the [example](./example/) folder there is a simple server scripts that
uses the plugin (inline but it's the same using it from npm registry).

The file `Dockerfile.example` is a sample container definition for
the example webapp (using the plugin) to show Docker HEALTHCHECK directive
both using 'curl' (but commented) and calling the healthcheck script
available by the plugin.
For convenience, all Docker commands have been defined in `package.json`,
to run many of them in a simple way (with `npm run custom-command`),
like in the following sequence:
- `docker:build`, to build the image, where the entry point is the example
- `docker:build:fail`, to build the image, but as entry point the example
  that is triggering the `Service Unavailable` error (HTTP 503) in the
  healthcheck route
- `docker:run`, to start the container from generated image, 
  in detached mode
- `docker:healthcheck-manual`, to run the healthcheck script in the
  container but manually
- `docker:status`, to get the health status of the container
- and others like: `docker:inspect` (interactive), `docker:log`
  (<CTRL>C to close), `docker:process`, etc ...
- `docker:stop`, to stop running container
- `docker:clean`, to remove generated image


## Requirements

Fastify ^2.1.0 , Node.js 8.16.x or later.
Note that plugin releases 2.x are for Fastify 2.x, etc.


## Note

To fully encapsulate `under-pressure` features inside the scope 
of this plugin, the plugin is not exposed by [fastify-plugin](https://github.com/fastify/fastify-plugin);
for more info look [here](https://github.com/fastify/fastify/blob/master/docs/Plugins.md#handle-the-scope), [here](https://github.com/fastify/fastify/blob/master/docs/Plugins-Guide.md#how-to-handle-encapsulation-and-distribution).

The plugin map a default endpoint on the URI `/health` to be
called via GET, but it's possible to change it with the setting 'url'
in plugin options.

The plugin exposes even another script that tries to get some content
(via HTTP GET) from the current web application where it's running.
In a container environment this could be useful to let containers runtime
do the healthcheck without the need to use other tools
like `curl` or `wget` that must be available in the container.

Both approaches could be useful in most common cases, like
Kubernetes HTTP GET, or Kubernetes EXEC or Docker HEALTHCHECK,
or others similar.

Note that the healthcheck script gets the URL to call from the command-line,
but if not specified it will use a default value of 
[http://localhost:3000/health](http://localhost:3000/health).

To execute the healthcheck script from another Node.js project/package, 
you need to run something like: 
`node node_modules/fastify-healthcheck/src/healthcheck http://localhost:8000/health`,
with the webapp exposed to the port `8000` in this case.


## License

Licensed under [Apache-2.0](./LICENSE).

----
