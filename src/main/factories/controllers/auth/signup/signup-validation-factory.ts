import {
  RequiredFieldValidation,
  ValidationComposite,
  CompareFieldsValidation,
  EmailValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const requriedFieldsValidation: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    requriedFieldsValidation.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite([
    ...requriedFieldsValidation,
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
