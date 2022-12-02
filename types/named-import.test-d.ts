import fastify from 'fastify'
import fastifyHealthcheck, { FastifyHealthcheckOptions } from '..'

const app = fastify()

app.register(fastifyHealthcheck)
