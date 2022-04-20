import components from './components'
import paths from './paths'
import schemas from './schemas'

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
    },
    {
      name: 'Enquete'
    }
  ],
  paths,
  schemas,
  components
}
