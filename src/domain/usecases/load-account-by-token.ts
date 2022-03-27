import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  load: (acceessToken: string, role?: string) => Promise<AccountModel>
}
