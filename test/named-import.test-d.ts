import fastify from 'fastify'
// import fastifyHealthcheck, { FastifyHealthcheckOptions } from '../types'
import fastifyHealthcheck from '../types'

const app = fastify()

app.register(fastifyHealthcheck)
