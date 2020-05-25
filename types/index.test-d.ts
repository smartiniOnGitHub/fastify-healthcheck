import healthcheckPlugin, { HealthcheckPluginOptions } from '..'
import { expectAssignable } from 'tsd'
const fastify = require('fastify')

const app = fastify()
app.register(healthcheckPlugin)

expectAssignable < HealthcheckPluginOptions > ({})
expectAssignable < HealthcheckPluginOptions > ({
  healthcheckUrl: '/health',
  healthcheckUrlDisable: false,
  healthcheckUrlAlwaysFail: false,
  exposeUptime: false,
  underPressureOptions: { }
})
