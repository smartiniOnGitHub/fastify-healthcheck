/// <reference types="node" />

import underPressure from 'under-pressure'
import { FastifyPluginCallback } from 'fastify'

export interface FastifyHealthcheckOptions {
  healthcheckUrl?: string
  healthcheckUrlDisable?: boolean
  healthcheckUrlAlwaysFail?: boolean
  exposeUptime?: boolean
  underPressureOptions?: underPressure.UnderPressureOptions
}

declare const fastifyHealthcheck: FastifyPluginCallback<FastifyHealthcheckOptions>
export default fastifyHealthcheck
