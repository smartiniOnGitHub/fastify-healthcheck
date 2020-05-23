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

const payloadOK = { statusCode: 200, status: 'ok' }
const payloadKO = { statusCode: 500, status: 'ko' }

function fastifyHealthcheck (fastify, options, next) {
  const {
    healthcheckUrl = '/health',
    healthcheckUrlDisable = false,
    healthcheckUrlAlwaysFail = false,
    exposeUptime = false,
    underPressureOptions = { }
  } = options

  ensureIsString(healthcheckUrl, 'healthcheckUrl')
  ensureIsBoolean(healthcheckUrlDisable, 'healthcheckUrlDisable')
  ensureIsBoolean(healthcheckUrlAlwaysFail, 'healthcheckUrlAlwaysFail')
  ensureIsBoolean(exposeUptime, 'exposeUptime')
  ensureIsObject(underPressureOptions, 'underPressureOptions')

  // execute plugin code

  // register under-pressure plugin
  // note that it will trigger automatic failure responses
  // in all routes defined here when current values are higher
  // that threshold values set
  fastify.register(require('under-pressure'), underPressureOptions)

  let healthcheckHandler = normalHandler
  if (exposeUptime === true) {
    healthcheckHandler = normalHandlerWithUptime
  }
  if (healthcheckUrlAlwaysFail !== null && healthcheckUrlAlwaysFail === true) {
    healthcheckHandler = failHandler
  }

  if (healthcheckUrlDisable === null || healthcheckUrlDisable === false) {
    fastify.route({
      method: 'GET',
      url: healthcheckUrl,
      handler: healthcheckHandler
    })
  }

  next()
}

function failHandler (req, reply) {
  reply.code(500).send(payloadKO)
}

function normalHandler (req, reply) {
  reply.code(200).send(payloadOK)
}

function normalHandlerWithUptime (req, reply) {
  payloadOK.uptime = process.uptime()
  reply.code(200).send(payloadOK)
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

// not using fastify-plugin, to fully encapsulate under-pressure plugin
module.exports = fastifyHealthcheck
