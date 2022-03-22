import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation
} from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

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
