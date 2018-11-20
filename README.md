# fastify-healthcheck

  [![NPM Version](https://img.shields.io/npm/v/fastify-healthcheck.svg?style=flat)](https://npmjs.org/package/fastify-healthcheck/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-healthcheck.svg?style=flat)](https://npmjs.org/package/fastify-healthcheck/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/fastify-healthcheck/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/fastify-healthcheck/?branch=master)

Fastify Plugin to serve responses that report about the web application,
if it's still running and alive (health checks).

This is very useful with Containers like `Docker`
and orchestrators like `Kubernetes`.

With this plugin, Fastify could expose an healthcheck route configured
for `/health` GET requests, and even a script that can be executed to get
content via HTTP GET from that running web application.


## Usage

The plugin can be used without specifying options, so good default values
will be used, but if needed can be specified:
- `healthcheckUrl`, to set a different uri for the healthcheck route
- `healthcheckUrlDisable`, to not publish the healthcheck route
- `healthcheckUrlAlwaysFail`, to always return failure responses (useful to test failure responses)

Under the hood, the healthcheck status is determined by the 
[under-pressure](https://www.npmjs.com/package/under-pressure) plugin, 
used here as a dependency; so it's possible to specify all its
configuration options here.

To set only 'under-pressure' specific options, set all 'healthcheck' options with null value (so nothing will be overridden by them).


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
// `curl http://127.0.0.1:3000/health` => returning an HTTP response 200 (OK)
// and a JSON response like: {"statusCode":200,"status":"UP"}
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
- `docker:build`, to build the image
- `docker:run`, to start the container from generated image, in detached mode
- `docker:healthcheck-manual`, to run the healthcheck script in the container but manually
- `docker:status`, to get the health status of the container
- and others like: `docker:inspect` (interactive), `docker:log` (<CTRL>C to close), `docker:process`, etc ...
- `docker:stop`, to stop running container
- `docker:clean`, to remove generated image


## Requirements

Fastify ^1.1.0 .


## Note

The plugin map a default endpoint on the URI `/health` to be
called via GET, but it's possible to change it with the setting 'url'
in plugin options.

The plugin exposes even another script that tries to get some content
(via HTTP GET) from the current web application where it's running.
In a container environment this could be useful to let containers runtime
do the healthcheck without the need to use other tools
like 'curl' or 'wget' that must be available in the container.

Both approaches could be useful in most common cases, like
Kubernetes HTTP GET, or Kubernetes EXEC or Docker HEALTHCHECK,
or others similar.

Note that the healthcheck script gets the URL to call from the command-line,
but if not specified it will use a default value of 
[http://localhost:3000/health](http://localhost:3000/health).


## License

Licensed under [Apache-2.0](./LICENSE).

----
