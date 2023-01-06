/// <reference types="node" />

import { UnderPressureOptions } from '@fastify/under-pressure'
// import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyRequest } from 'fastify'
import { FastifyPluginCallback } from 'fastify'

// note that this plugin does not use FastifyPlugin, but it's good the same here for types

type FastifyHealthcheckPlugin = FastifyPluginCallback<NonNullable<fastifyHealthcheck.FastifyHealthcheckOptions>>

declare namespace fastifyHealthcheck {
  export interface FastifyHealthcheckOptions {
  /**
   * Override the uri for the healthcheck route (default: '/health').
   */
    healthcheckUrl?: string

    /**
     * Disable the healthcheck route (default: false).
     */
    healthcheckUrlDisable?: boolean

    /**
     * Override to always return failure responses, useful to test failure responses (default: false).
     */
    healthcheckUrlAlwaysFail?: boolean

    /**
     * Override to return Node.js process uptime (default: false).
     */
    exposeUptime?: boolean

    /**
     * Override options for under-pressure (default: {}).
     */
    underPressureOptions?: UnderPressureOptions

    /**
     * Fastify schema for the healthcheck route (default: undefined).
     */
    schemaOptions?: unknown
  }

  export const fastifyHealthcheck: FastifyHealthcheckPlugin
  export { fastifyHealthcheck as default }
}

declare function fastifyHealthcheck(
  ...params: Parameters<FastifyHealthcheckPlugin>
): ReturnType<FastifyHealthcheckPlugin>

export = fastifyHealthcheck
