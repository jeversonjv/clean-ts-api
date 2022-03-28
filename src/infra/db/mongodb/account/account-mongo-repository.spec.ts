import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('Add', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('LoadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })

      const account = await sut.loadByEmail('any_mail@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_mail@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('LoadByToken', () => {
    test('Should return an account on loadByToken success without role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_mail@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('UpdateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      })

      const accountBeforeUpdate = await accountCollection.findOne({
        _id: insertedId
      })
      expect(accountBeforeUpdate?.accessToken).toBeFalsy()

      await sut.updateAccessToken(insertedId as unknown as string, 'any_token')

      const accountAfterUpdate = await accountCollection.findOne({
        _id: insertedId
      })

      expect(accountAfterUpdate?.accessToken).toBe('any_token')
    })
  })
})
