import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeBodyRequest = (): any => ({
  question: 'any_question',
  answers: [
    {
      image: 'http://any_image.com',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ]
})

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Jeverson',
    email: 'jeversontp@gmail.com',
    password: 'any_password',
    role
  })

  const id = res.insertedId
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne(
    { _id: id },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    await Promise.all([
      surveyCollection.deleteMany({}),
      accountCollection.deleteMany({})
    ])
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeBodyRequest())
        .expect(403)
    })

    test('Should return 204 on add survey with valid token', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', await makeAccessToken('admin'))
        .send(makeFakeBodyRequest())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', await makeAccessToken())
        .send(makeFakeBodyRequest())
        .expect(204)
    })
  })
})
