import { mockAccountModel } from '@/domain/test'
import {
  AddAccount,
  AddAccountParams
} from '@/domain/usecases/account/add-account'

import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

import {
  Authentication,
  AuthenticationParams
} from '@/domain/usecases/account/authentication'

import { AccountModel } from '@/domain/models/account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string | null> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(acceessToken: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new LoadAccountByTokenStub()
}
