/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/indent */
import { Collection, ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  private readonly accountCollection: Collection =
    MongoHelper.getCollection('accounts')

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.accountCollection.insertOne(accountData)

    return MongoHelper.map(accountData)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const account = await this.accountCollection.findOne({ email })
    return MongoHelper.map(account)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    await this.accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    )
  }
}
