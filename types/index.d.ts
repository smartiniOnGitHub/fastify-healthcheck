import * as fastify from 'fastify'
import * as http from 'http'

export interface FastifyHealthcheckOptions {
  healthcheckUrl?: string
  healthcheckUrlDisable?: boolean
  healthcheckUrlAlwaysFail?: boolean
  exposeUptime?: boolean
  underPressureOptions?: Record<string, any>
}

export const fastifyHealthcheck: fastify.Plugin<
http.Server,
http.IncomingMessage,
http.ServerResponse,
FastifyHealthcheckOptions
>

export default fastifyHealthcheck
