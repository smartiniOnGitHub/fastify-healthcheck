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
    url = '/health'
    // TODO: add others ...
  } = options
  // console.log(`DEBUG - plugin options: ${JSON.stringify(options)}`) // TODO: temp ...
  console.log(`DEBUG - plugin options: url = '${url}'`) // TODO: temp ...

  // TODO: implement ...

  next()
}

module.exports = fp(fastifyHealthchecks, {
  fastify: '>=0.43.0',
  name: 'fastify-healthcheck'
})
