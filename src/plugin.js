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
    healthcheckUrl = '/health',
    healthcheckUrlDisable = false,
    healthcheckUrlAlwaysFail = false,
    underPressureOptions = { }
  } = options

  ensureIsString(healthcheckUrl, 'healthcheckUrl')
  ensureIsBoolean(healthcheckUrlDisable, 'healthcheckUrlDisable')
  ensureIsBoolean(healthcheckUrlAlwaysFail, 'healthcheckUrlAlwaysFail')
  ensureIsObject(underPressureOptions, 'underPressureOptions')

  // execute plugin code

  // handle the special case to always return a (fixed) failure message
  if (healthcheckUrlAlwaysFail !== null && healthcheckUrlAlwaysFail === true) {
    if (healthcheckUrlDisable === null || healthcheckUrlDisable === false) {
      fastify.route({
        method: 'GET',
        url: healthcheckUrl,
        handler: (req, reply) => {
          reply.code(500).send({ statusCode: 500, status: 'ko' })
        }
      })
    }
  } else {
    // normal plugin operations
    // map plugin options with those of under-pressure, overriding them
    if (healthcheckUrlDisable === null || healthcheckUrlDisable === false) {
      underPressureOptions.exposeStatusRoute = true
      if (healthcheckUrl !== null) {
        // overwrite the route to expose with the value specified
        underPressureOptions.exposeStatusRoute = healthcheckUrl
      }
    }

    // register plugin dependencies
    fastify.register(underPressurePlugin, underPressureOptions)
  }

  next()
}

function ensureIsString (arg, name) {
  if (arg !== null && typeof arg !== 'string') {
    throw new TypeError(`The argument '${name}' must be a string, instead got a '${typeof arg}'`)
  }
}

function ensureIsBoolean (arg, name) {
  if (arg !== null && typeof arg !== 'boolean') {
    throw new TypeError(`The argument '${name}' must be a boolean, instead got a '${typeof arg}'`)
  }
}

function ensureIsObject (arg, name) {
  if (arg !== null && typeof arg !== 'object') {
    throw new TypeError(`The argument '${name}' must be a object, instead got a '${typeof arg}'`)
  }
}

module.exports = fp(fastifyHealthchecks, {
  fastify: '^1.1.0',
  name: 'fastify-healthcheck'
})
