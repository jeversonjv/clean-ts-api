import {
  AddSurveyRepository,
  AddSurveyModel
} from '@/data/usecases/add-survey/db-add-survey-protocols'
import {
  LoadSurveysRepository,
  SurveyModel
} from '@/data/usecases/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.map((survey) => MongoHelper.map(survey))
  }
}
