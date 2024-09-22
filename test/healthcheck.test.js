/*
 * Copyright 2018-2024 the original author or authors.
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

const { monitorEventLoopDelay } = require('node:perf_hooks')
const process = require('node:process')

const test = require('tap').test
const sget = require('simple-get').concat
const Fastify = require('fastify')
const healthcheckPlugin = require('..')

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

const jsonMimeType = 'application/json; charset=utf-8'
const successResponse = { statusCode: 200, status: 'ok' }
const failureResponse = { statusCode: 500, status: 'ko' }

test('healthcheck with all defaults: does not return an error, but a good response (200) and some content', async (t) => {
  // t.plan(3)
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin) // configure this plugin with its default options
  await fastify.listen({ port: 0 })

  // process.nextTick(() => sleep(500)) // not really needed, but could be useful to have
  const response = await fastify.inject({
    method: 'GET',
    timeout: 2000,
    url: '/health'
  })
  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], jsonMimeType)
  t.same(JSON.parse(response.body), successResponse)
  t.end()
})

test('healthcheck on a custom route: does not return an error, but a good response (200) and some content', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    healthcheckUrl: '/custom-health'
  }) // configure this plugin with some custom options
  await fastify.listen({ port: 0 })

  {
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/custom-health'
    })
    t.equal(response.statusCode, 200)
    t.equal(response.headers['content-type'], jsonMimeType)
    t.same(JSON.parse(response.body), successResponse)
  }

  {
    // ensure default url is not exposed
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/health'
    })
    t.equal(response.statusCode, 404)
    t.equal(response.headers['content-type'], jsonMimeType)
    t.same(JSON.parse(response.body), { message: 'Route GET:/health not found', error: 'Not Found', statusCode: 404 })
  }

  t.end()
})

test('healthcheck on a disabled route (default or custom): return a not found error (404) and some content', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    healthcheckUrl: '/custom-health',
    healthcheckUrlDisable: true
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  {
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/custom-health'
    })
    t.equal(response.statusCode, 404)
    t.equal(response.headers['content-type'], jsonMimeType)
    t.equal(JSON.parse(response.body).statusCode, 404)
    t.equal(JSON.parse(response.body).error, 'Not Found')
    t.equal(JSON.parse(response.body).message, 'Route GET:/custom-health not found')
  }

  {
    // ensure default url is not exposed
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/health'
    })
    t.equal(response.statusCode, 404)
    t.equal(response.headers['content-type'], jsonMimeType)
    t.equal(JSON.parse(response.body).statusCode, 404)
    t.equal(JSON.parse(response.body).error, 'Not Found')
    t.equal(JSON.parse(response.body).message, 'Route GET:/health not found')
  }

  t.end()
})

test('healthcheck with always failure flag: always return an error, (500) and some content', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    // 'healthcheckUrl': '/custom-health',
    healthcheckUrlAlwaysFail: true
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  const response = await fastify.inject({
    method: 'GET',
    timeout: 2000,
    url: '/health'
  })
  t.equal(response.statusCode, 500)
  t.equal(response.headers['content-type'], jsonMimeType)
  t.same(JSON.parse(response.body), failureResponse)

  t.end()
})

test('healthcheck with healthcheck option enabled to return even process uptime: ensure a good response (200) will be returned', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    exposeUptime: true
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  const response = await fastify.inject({
    method: 'GET',
    timeout: 2000,
    url: '/health'
  })
  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], jsonMimeType)
  const payload = JSON.parse(response.body)
  t.equal(payload.statusCode, 200)
  t.equal(payload.status, 'ok')
  t.ok(payload.uptime > 0.0)
  t.end()
})

test('healthcheck with all healthcheck specific options undefined: does not return an error, but a good response (200) and under-pressure defaults', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    healthcheckUrl: undefined,
    healthcheckUrlDisable: undefined,
    healthcheckUrlAlwaysFail: undefined,
    exposeUptime: undefined,
    underPressureOptions: { } // no under-pressure specific options set here
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  const response = await fastify.inject({
    method: 'GET',
    timeout: 2000,
    url: '/health'
  })
  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], jsonMimeType)
  const payload = JSON.parse(response.body)
  t.equal(payload.statusCode, 200)
  t.equal(payload.status, 'ok')
  t.notOk(payload.uptime) // not present in this reply payload
  t.same(payload, successResponse)
  t.end()
})

test('healthcheck with only some under-pressure options defined: does not return an error, but a good response (200) and some content', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    underPressureOptions: {
      // exposeStatusRoute: true, // no effect here
      maxEventLoopDelay: 1000,
      maxHeapUsedBytes: 100000000,
      maxRssBytes: 100000000,
      // message: 'Under pressure!', // custom message
      retryAfter: 50
    } // set some under-pressure specific options set here
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  t.ok(!fastify.memoryUsage) // ensure is not exposed
  // process.nextTick(() => sleep(500))
  const response = await fastify.inject({
    method: 'GET',
    timeout: 2000,
    url: '/health'
  })
  t.equal(response.statusCode, 200)
  t.equal(response.headers['content-type'], jsonMimeType)
  t.same(JSON.parse(response.body), successResponse)

  t.end()
})

test('healthcheck with some under-pressure options defined for a custom response on healthcheck: does not return an error, but a good response (200) and some content', async (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  await fastify.register(healthcheckPlugin, {
    underPressureOptions: {
      // set a custom healthcheck route, for example async
      healthCheck: async () => {
        t.pass('healthcheck called')
        return {
          some: 'value',
          anotherValue: 'another',
          status: 'override healthcheck response'
        }
      },
      // set the schema for the custom healthcheck route, optional but reccomended
      exposeStatusRoute: {
        routeResponseSchemaOpts: {
          some: { type: 'string' },
          anotherValue: { type: 'string' }
        }
      }
    } // set some under-pressure specific options set here
  }) // configure this plugin with some custom options

  await fastify.listen({ port: 0 })

  {
    // test usual plugin healthcheck route
    process.nextTick(() => sleep(500))
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/health'
    })
    t.equal(response.statusCode, 200)
    t.equal(response.headers['content-type'], jsonMimeType)
    const payload = JSON.parse(response.body)
    t.notOk(payload.uptime) // not present in this reply payload
    t.same(JSON.parse(response.body), successResponse)
  }

  {
    // test under-pressure healthcheck route
    process.nextTick(() => sleep(500))
    const response = await fastify.inject({
      method: 'GET',
      timeout: 2000,
      url: '/status'
    })
    t.equal(response.statusCode, 200)
    t.equal(response.headers['content-type'], jsonMimeType)
    const payload = JSON.parse(response.body)
    t.notOk(payload.uptime) // not present in this reply payload
    t.same(payload, {
      some: 'value',
      anotherValue: 'another',
      status: 'override healthcheck response'
    })
  }

  t.end()
})

test('healthcheck with only some under-pressure options defined to always fail: return an error (503) and some content', (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
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

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!fastify.memoryUsage) // ensure is not exposed

    // process.nextTick(() => sleep(500)) // does not work anymore here
    process.nextTick(() => block(monitorEventLoopDelay ? 1500 : 500))

    // can't use fastify inject here ...
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 503)
      t.equal(response.headers['content-type'], jsonMimeType)
      t.equal(response.headers['retry-after'], '50')
      const payload = JSON.parse(body)
      t.notOk(payload.uptime) // not present in this reply payload
      t.same(payload, {
        code: 'FST_UNDER_PRESSURE',
        error: 'Service Unavailable',
        // message: 'Service Unavailable', // default message
        message: 'Under pressure!',
        statusCode: 503
      })
      t.end()
    })
  })
})
