import { badRequest, serverError, unauthorized, notFound } from './components'
import { loginPath } from './paths'
import { errorSchema, accountSchema, loginParamsSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean TS API',
    description:
      'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://www.isc.org/licenses/'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Auth'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorized,
    notFound
  }
}
