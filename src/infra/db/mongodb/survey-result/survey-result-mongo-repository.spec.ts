import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { mockAccountModel } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const firstAnswer = 'any_answer'
const secondAnswer = 'other_answer'
const thirdAnswer = 'another_answer'

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
      },
      {
        answer: thirdAnswer
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

      await sut.save({
        surveyId,
        accountId,
        answer: firstAnswer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      })

      expect(surveyResult).toBeTruthy()
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

      await sut.save({
        surveyId,
        accountId,
        answer: secondAnswer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId)
        })
        .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const sut = makeSut()

      const [surveyId, accountId] = await Promise.all([
        makeSurvey(),
        makeAccount()
      ])

      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: firstAnswer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: firstAnswer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: secondAnswer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: secondAnswer,
          date: new Date()
        }
      ])

      const surveyResult = await sut.loadBySurveyId(surveyId)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})
