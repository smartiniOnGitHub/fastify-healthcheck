/*
 * Copyright 2018 the original author or authors.
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

const test = require('tap').test
const sget = require('simple-get').concat
const Fastify = require('fastify')
const healthcheckPlugin = require('../')

function sleep (msec) {
  const start = Date.now()
  while (Date.now() - start < msec) { }
}

// TODO: add a test with healthcheck specific options all null, to really see default behavior ... wip

test('healthcheck with all defaults does not return an error, but a good response (200) and some content', (t) => {
  t.plan(5)
  const fastify = Fastify()
  fastify.register(healthcheckPlugin) // configure this plugin with its default options

  fastify.listen(0, (err, address) => {
    fastify.server.unref()
    t.error(err)

    process.nextTick(() => sleep(500)) // not really, but could be useful to have
    sget({
      method: 'GET',
      timeout: 2000,
      url: `${address}/health`
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(body), { statusCode: 200, status: 'ok' })

      fastify.close()
    })
  })
})

test('healthcheck on a custom route does not return an error, but a good response (200) and some content', (t) => {
  t.plan(11)
  const fastify = Fastify()
  fastify.register(healthcheckPlugin, {
    'healthcheckUrl': '/custom-health'
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    fastify.server.unref()
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

      fastify.close()
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
      t.strictEqual(JSON.parse(body).message, 'Not Found')

      fastify.close()
    })
  })
})

test('healthcheck on a disabled route (default or custom), return a not found error (404) and some content', (t) => {
  t.plan(13)
  const fastify = Fastify()
  fastify.register(healthcheckPlugin, {
    'healthcheckUrl': '/custom-health',
    healthcheckUrlDisable: true
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    fastify.server.unref()
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
      t.strictEqual(JSON.parse(body).message, 'Not Found')

      fastify.close()
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
      t.strictEqual(JSON.parse(body).message, 'Not Found')

      fastify.close()
    })
  })
})

test('healthcheck with always failure flag, always return an error, (500) and some content', (t) => {
  t.plan(5)
  const fastify = Fastify()
  fastify.register(healthcheckPlugin, {
    // 'healthcheckUrl': '/custom-health',
    healthcheckUrlAlwaysFail: true
  }) // configure this plugin with some custom options

  fastify.listen(0, (err, address) => {
    fastify.server.unref()
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

      fastify.close()
    })
  })
})

// TODO: set some under-pressure option (even to see always fail, but for it) and ensure all is good ... wip
