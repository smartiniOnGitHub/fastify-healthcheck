/*
 * Copyright 2018-2023 the original author or authors.
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

// const { promisify } = require('node:util')
const { monitorEventLoopDelay } = require('node:perf_hooks')

const test = require('tap').test
const sget = require('simple-get').concat

const Fastify = require('fastify')

// const wait = promisify(setTimeout)

function block (msec) {
  const start = Date.now()
  /* eslint-disable no-empty */
  while (Date.now() - start < msec) { }
}

// test the following features even directly with original under-pressure plugin
const underPressure = require('@fastify/under-pressure')

test('Should return 503 on maxHeapUsedBytes', (t) => {
  // t.plan(5)

  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(underPressure, {
    maxHeapUsedBytes: 1
  })

  fastify.get('/', (req, reply) => {
    reply.send({ hello: 'world' })
  })

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)

    process.nextTick(() => block(monitorEventLoopDelay ? 1500 : 500))

    // can't use fastify inject here ...
    sget({
      method: 'GET',
      url: address
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 503)
      t.equal(response.headers['retry-after'], '10')
      t.same(JSON.parse(body), {
        code: 'FST_UNDER_PRESSURE',
        error: 'Service Unavailable',
        message: 'Service Unavailable',
        statusCode: 503
      })
      t.end()
    })
  })
})
