/// <reference types="node" />

import underPressure from 'under-pressure'
import { FastifyPlugin } from 'fastify'

export interface FastifyHealthcheckOptions {
  healthcheckUrl?: string
  healthcheckUrlDisable?: boolean
  healthcheckUrlAlwaysFail?: boolean
  exposeUptime?: boolean
  underPressureOptions?: underPressure.UnderPressureOptions
}

declare const fastifyHealthcheck: FastifyPlugin<FastifyHealthcheckOptions>
export default fastifyHealthcheck
