import healthcheckPlugin, { FastifyHealthcheckOptions } from '..'
import { expectAssignable } from 'tsd'
import fastify from 'fastify'

const app = fastify()
app.register(healthcheckPlugin, {
  healthcheckUrl: '/health',
  healthcheckUrlDisable: false,
  healthcheckUrlAlwaysFail: false,
  exposeUptime: false,
  underPressureOptions: { }
})

expectAssignable < FastifyHealthcheckOptions >({})
expectAssignable < FastifyHealthcheckOptions >({
  healthcheckUrl: '/health',
  healthcheckUrlDisable: true,
  healthcheckUrlAlwaysFail: true,
  exposeUptime: true
})
