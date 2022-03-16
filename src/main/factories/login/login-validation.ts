import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requriedFieldsValidation: Validation[] = []

  for (const field of ['email', 'password']) {
    requriedFieldsValidation.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite([
    ...requriedFieldsValidation,
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
