import fastify from 'fastify'
import healthcheckPlugin, { FastifyHealthcheckOptions } from '..'
import { expectAssignable } from 'tsd'

const app = fastify()
const options: FastifyHealthcheckOptions = {
  healthcheckUrl: '/health',
  healthcheckUrlDisable: false,
  healthcheckUrlAlwaysFail: false,
  exposeUptime: false,
  underPressureOptions: { }
}
app.register(healthcheckPlugin, options)

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(`Server listening on '${address}' ...`)
})

expectAssignable<FastifyHealthcheckOptions>({})
expectAssignable<FastifyHealthcheckOptions>({
  healthcheckUrl: '/health',
  healthcheckUrlDisable: true,
  healthcheckUrlAlwaysFail: true,
  exposeUptime: true,
  schemaOptions: {
    operationId: 'getHealth',
    description: 'Serve responses for health checks',
    response: {
      default: {
        description: 'Default Response',
        type: 'object',
        properties: {
          statusCode: {
            type: 'number'
          },
          status: {
            type: 'string'
          },
          uptime: {
            type: 'number',
            optional: true
          }
        }
      }
    }
  }
})
