/* eslint-disable @typescript-eslint/indent */
import { Collection } from 'mongodb'
import {
  AddSurveyRepository,
  AddSurveyModel
} from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  private readonly surveyCollection: Collection =
    MongoHelper.getCollection('surveys')

  async add(data: AddSurveyModel): Promise<void> {
    await this.surveyCollection.insertOne(data)
  }
}
