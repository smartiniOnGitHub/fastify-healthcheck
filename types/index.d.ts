import { FastifyMiddleware } from 'fastify'

export interface HealthcheckPluginOptions {
  healthcheckUrl?: string
  healthcheckUrlDisable?: boolean
  healthcheckUrlAlwaysFail?: boolean
  exposeUptime?: boolean
  underPressureOptions?: Record<string, any>
}

declare const healthcheckPlugin: FastifyMiddleware<HealthcheckPluginOptions>;
export default healthcheckPlugin;
