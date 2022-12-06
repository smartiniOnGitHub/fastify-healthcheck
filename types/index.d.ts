/// <reference types="node" />

import { UnderPressureOptions } from '@fastify/under-pressure'
import { FastifyPluginCallback } from 'fastify'

export interface FastifyHealthcheckOptions {
  healthcheckUrl?: string
  healthcheckUrlDisable?: boolean
  healthcheckUrlAlwaysFail?: boolean
  exposeUptime?: boolean
  underPressureOptions?: UnderPressureOptions
}

declare const fastifyHealthcheck: FastifyPluginCallback<FastifyHealthcheckOptions>
export default fastifyHealthcheck
