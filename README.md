# fastify-healthcheck

Fastify Plugin to serve responses that report about the web application,
if it's still running and alive (health checks).

This is very useful with Containers like `Docker`
and orchestrators like `Kubernetes`.

With this plugin, Fastify could expose an healthcheck route configured
for `/health` GET requests, and even a script that can be executed to get
content via HTTP GET from that running web application.


## Usage

```js
const fastify = require('fastify')()

// example without specifying options, returning a default healthcheck route mapped to '/health' that only reply to GET request
fastify.register(require('fastify-healthcheck'))
// or
// example with custom healthcheck url and standalone server to execute
// TODO: ...
//

fastify.listen(3000)

// TODO: To test, for example (in another terminal session) do: ...
```

In the [example](./example/) folder there are some simple server scripts that uses the plugin (inline but it's the same using it from npm registry).


## Requirements

Fastify 0.43.0 or later.


## Note

By default the plugin map a default endpoint on the URI `/health` to be called via GET, otherwise it's possible to change via the setting 'url' in plugin options.

The plugin exposes even another script that tries to get some content (via HTTP GET) from the current web application where it's running.

Both approaches could be useful in most common cases, like Kubernetes HTTP GET, or Kubernetes EXEC or Docker HEALTHCHECK, or many others similar.



## License

Licensed under [Apache-2.0](./LICENSE).

----
