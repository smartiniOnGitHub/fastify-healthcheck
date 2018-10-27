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

const fp = require('fastify-plugin')

function fastifyHealthchecks (fastify, options, next) {
  const {
    url = '/health',
    healthcheckUrlDisable = false,
    healthcheckUrlAlwaysFail = false
    // TODO: add other options, like healthcheckUrlOutputType, healthcheckStandaloneDisable, etc ... wip
  } = options
  // console.log(`DEBUG - plugin options: ${JSON.stringify(options)}`)

  if (typeof url !== 'string') {
    throw new TypeError(`The option url must be a string, instead got a '${typeof url}'`)
  }

  // execute plugin code
  if (healthcheckUrlDisable === null || healthcheckUrlDisable === false) {
    fastify.route({
      method: 'GET',
      url: url,
      handler: _healthcheckHandler
    })
  }

  // TODO: add other features ... wip

  function _healthcheckHandler (req, reply) {
    // return a simple health check message and an HTTP success code
    if (healthcheckUrlAlwaysFail === false) {
      reply.type('application/json').send({ statusCode: 200, status: 'UP' })
    } else {
      // unless plugin option to always fail is raised
      reply.code(500).type('application/json').send({ statusCode: 500, status: 'DOWN' })
    }
    // TODO: handle even 'status' : 'DOWN' with HTTP return code error, if related plugin option is set ...
  }

  next()
}

module.exports = fp(fastifyHealthchecks, {
  fastify: '>=0.43.0',
  name: 'fastify-healthcheck'
})
