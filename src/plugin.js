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

/**
 * Plugin:
 * this module exports the plugin as a function.
 * @module plugin
 */

const payloadOK = { statusCode: 200, status: 'ok' }
const payloadKO = { statusCode: 500, status: 'ko' }

/**
 * Plugin implementation.
 *
 * @param {!object} fastify Fastify instance
 * @param {!object} options plugin configuration options
 * <ul>
 *     <li>healthcheckUrl (string, default `/health`) for the route of the health check,</li>
 *     <li>healthcheckUrlDisable (boolean, default false) flag to disable health check route,</li>
 *     <li>healthcheckUrlAlwaysFail (boolean, default false) flag to always return failure from health check route (mainly for testing purposes),</li>
 *     <li>exposeUptime (boolean, default false) flag to show even process uptime in health check results,</li>
 *     <li>underPressureOptions (object, default empty) for options to send directly to under-pressure,</li>
 *     <li>schemaOptions (object, default empty) for options to use for route schema,</li>
 *     <li>configOptions (object, default empty) for options to use for route config,</li>
 * </ul>
 * @param {!function} done callback, to call as last step
 *
 * @namespace
 */
function fastifyHealthcheck (fastify, options, done) {
  const {
    healthcheckUrl = '/health',
    healthcheckUrlDisable = false,
    healthcheckUrlAlwaysFail = false,
    exposeUptime = false,
    underPressureOptions = { },
    schemaOptions,
    configOptions
  } = options

  ensureIsString(healthcheckUrl, 'healthcheckUrl')
  ensureIsBoolean(healthcheckUrlDisable, 'healthcheckUrlDisable')
  ensureIsBoolean(healthcheckUrlAlwaysFail, 'healthcheckUrlAlwaysFail')
  ensureIsBoolean(exposeUptime, 'exposeUptime')
  ensureIsObject(underPressureOptions, 'underPressureOptions')
  if (schemaOptions) {
    ensureIsObject(schemaOptions, 'schemaOptions')
  }
  if (configOptions) {
    ensureIsObject(configOptions, 'configOptions')
  }

  // execute plugin code

  // register under-pressure plugin
  // note that it will trigger automatic failure responses
  // in all routes defined here when current values are higher
  // that threshold values set
  fastify.register(require('@fastify/under-pressure'), underPressureOptions)

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
      handler: healthcheckHandler,
      schema: schemaOptions,
      config: configOptions
    })
  }

  done()
}

/**
 * Handler that generates a failure response.
 *
 * @param {!req} req the request
 * @param {!reply} reply the response
 *
 * @private
 */
function failHandler (req, reply) {
  reply.code(500).send(payloadKO)
}

/**
 * Handler that generates a success response.
 *
 * @param {!req} req the request
 * @param {!reply} reply the response
 *
 * @private
 */
function normalHandler (req, reply) {
  reply.code(200).send(payloadOK)
}

/**
 * Handler that generates a success response, and show even process uptime.
 *
 * @param {!req} req the request
 * @param {!reply} reply the response
 *
 * @private
 */
function normalHandlerWithUptime (req, reply) {
  reply.code(200).send({ ...payloadOK, uptime: process.uptime() })
}

// utility functions

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
