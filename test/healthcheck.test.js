/*
 * Copyright 2018-2021 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')

const test = require('tap').test
const sget = require('simple-get').concat
const Fastify = require('fastify')
const healthcheckPlugin = require('../')

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function block (msec) {
  const start = Date.now()
  /* eslint-disable no-empty */
  while (Date.now() - start < msec) { }
}

test('healthcheck with all defaults: does not return an error, but a good response (200) and some content', (t) => {
  t.plan(5)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin) // configure this plugin with its default options

  fastify.listen(0, (err, address) => {
    t.error(err)

    process.nextTick(() => sleep(500)) // not really needed, but could be useful to have
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(body), { statusCode: 200, status: 'ok' })
    })
  })
})

test('healthcheck on a custom route: does not return an error, but a good response (200) and some content', (t) => {
  t.plan(11)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    healthcheckUrl: '/custom-health'
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)

    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/custom-health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(body), { statusCode: 200, status: 'ok' })
    })

    // ensure default url is not exposed
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 404)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.strictEqual(JSON.parse(body).statusCode, 404)
      t.strictEqual(JSON.parse(body).error, 'Not Found')
      t.strictEqual(JSON.parse(body).message, 'Route GET:/health not found')
    })
  })
})

test('healthcheck on a disabled route (default or custom): return a not found error (404) and some content', (t) => {
  t.plan(13)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    healthcheckUrl: '/custom-health',
    healthcheckUrlDisable: true
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)

    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/custom-health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 404)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.strictEqual(JSON.parse(body).statusCode, 404)
      t.strictEqual(JSON.parse(body).error, 'Not Found')
      t.strictEqual(JSON.parse(body).message, 'Route GET:/custom-health not found')
    })

    // ensure default url is not exposed
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 404)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.strictEqual(JSON.parse(body).statusCode, 404)
      t.strictEqual(JSON.parse(body).error, 'Not Found')
      t.strictEqual(JSON.parse(body).message, 'Route GET:/health not found')
    })
  })
})

test('healthcheck with always failure flag: always return an error, (500) and some content', (t) => {
  t.plan(5)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    // 'healthcheckUrl': '/custom-health',
    healthcheckUrlAlwaysFail: true
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)

    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 500)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(body), { statusCode: 500, status: 'ko' })
    })
  })
})

test('healthcheck with all healthcheck specific options undefined: does not return an error, but a good response (200) and under-pressure defaults', (t) => {
  t.plan(8)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    healthcheckUrl: undefined,
    healthcheckUrlDisable: undefined,
    healthcheckUrlAlwaysFail: undefined,
    exposeUptime: undefined,
    underPressureOptions: { } // no under-pressure specific options set here
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)

    process.nextTick(() => sleep(500))
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      const payload = JSON.parse(body)
      t.strictEqual(payload.statusCode, 200)
      t.strictEqual(payload.status, 'ok')
      t.notOk(payload.uptime) // not present in this reply payload
      t.deepEqual(payload, { statusCode: 200, status: 'ok' })
    })
  })
})

test('healthcheck with only some under-pressure options defined: does not return an error, but a good response (200) and some content', (t) => {
  t.plan(6)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    underPressureOptions: {
      // exposeStatusRoute: true, // no effect here
      maxEventLoopDelay: 1000,
      maxHeapUsedBytes: 100000000,
      maxRssBytes: 100000000,
      // message: 'Under pressure!', // custom message
      retryAfter: 50
    } // set some under-pressure specific options set here
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)
    t.ok(!fastify.memoryUsage) // ensure is not exposed

    process.nextTick(() => sleep(500))
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(body), { statusCode: 200, status: 'ok' })
    })
  })
})

test('healthcheck with only some under-pressure options defined to always fail: return an error (503) and some content', (t) => {
  t.plan(7)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    underPressureOptions: {
      // exposeStatusRoute: true, // no effect here
      maxEventLoopDelay: 100,
      maxHeapUsedBytes: 1,
      // maxRssBytes: 2,
      message: 'Under pressure!', // sample custom message
      retryAfter: 50
    } // set some under-pressure specific options set here
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)
    t.ok(!fastify.memoryUsage) // ensure is not exposed

    // process.nextTick(() => sleep(500)) // does not work anymore here
    process.nextTick(() => block(monitorEventLoopDelay ? 1500 : 500))

    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 503)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.strictEqual(response.headers['retry-after'], '50')
      t.deepEqual(JSON.parse(body), {
        code: 'FST_UNDER_PRESSURE',
        error: 'Service Unavailable',
        // message: 'Service Unavailable', // default message
        message: 'Under pressure!',
        statusCode: 503
      })
    })
  })
})

test('healthcheck with healthcheck option enabled to return even process uptime: ensure a good response (200) will be returned', (t) => {
  t.plan(7)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(healthcheckPlugin, {
    exposeUptime: true
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    t.error(err)

    process.nextTick(() => sleep(500))
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      const payload = JSON.parse(body)
      t.strictEqual(payload.statusCode, 200)
      t.strictEqual(payload.status, 'ok')
      t.ok(payload.uptime > 0.0)
    })
  })
})
