import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const requriedFieldsValidation: Validation[] = []

  for (const field of ['question', 'answers']) {
    requriedFieldsValidation.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite([...requriedFieldsValidation])
}
