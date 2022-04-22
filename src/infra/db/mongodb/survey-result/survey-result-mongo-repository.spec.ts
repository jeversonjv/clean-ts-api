import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { mockAccountModel } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const firstAnswer = 'any_answer'
const secondAnswer = 'other_answer'

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<string> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: firstAnswer
      },
      {
        answer: secondAnswer
      }
    ],
    date: new Date()
  })

  return res.insertedId.toString()
}

const makeAccount = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountModel())

  return res.insertedId.toString()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    accountCollection = MongoHelper.getCollection('accounts')
    await Promise.all([
      surveyCollection.deleteMany({}),
      surveyResultCollection.deleteMany({}),
      accountCollection.deleteMany({})
    ])
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()

      const [surveyId, accountId] = await Promise.all([
        makeSurvey(),
        makeAccount()
      ])

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: firstAnswer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].answer).toBe(firstAnswer)
      expect(surveyResult.answers[0].count).toBe(1)
    })

    test('Should update survey result if its not new', async () => {
      const sut = makeSut()

      const [surveyId, accountId] = await Promise.all([
        makeSurvey(),
        makeAccount()
      ])

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: firstAnswer,
        date: new Date()
      })

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: secondAnswer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].answer).toBe(secondAnswer)
      expect(surveyResult.answers[0].count).toBe(1)
    })
  })
})
