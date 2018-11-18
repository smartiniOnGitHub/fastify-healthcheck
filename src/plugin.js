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
const underPressurePlugin = require('under-pressure')

function fastifyHealthchecks (fastify, options, next) {
  const {
    url = '/health',
    healthcheckUrlDisable = false,
    healthcheckUrlAlwaysFail = false,
    underPressureOptions = {
      // TODO: check if add single options ... no, keep only default empty object here and forward all given ... wip
    }
  } = options
  // console.log(`DEBUG - plugin options: ${JSON.stringify(options)}`)

  if (typeof url !== 'string') {
    throw new TypeError(`The option url must be a string, instead got a '${typeof url}'`)
  }

  // register plugin dependencies
  // TODO: check if it's the right way to do it ... yes it is, otherwise I should add 'under-pressure' plugin in dependencies for plugin export, and register outside of here
  fastify.register(underPressurePlugin, underPressureOptions)

  // execute plugin code
  if (healthcheckUrlDisable === null || healthcheckUrlDisable === false) {
    fastify.route({
      method: 'GET',
      url: url,
      handler: _healthcheckHandler
    })
  }

  function _healthcheckHandler (req, reply) {
    // return a simple health check message and an HTTP success code
    if (healthcheckUrlAlwaysFail === false) {
      reply.send({ statusCode: 200, status: 'UP' })
    } else {
      // unless plugin option to always fail is raised
      reply.code(500).send({ statusCode: 500, status: 'DOWN' })
    }
  }

  next()
}

module.exports = fp(fastifyHealthchecks, {
  fastify: '1.x',
  name: 'fastify-healthcheck',
  dependencies: ['under-pressure']
})
